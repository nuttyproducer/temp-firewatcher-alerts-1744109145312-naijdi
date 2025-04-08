
import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Polyline, useMap, Marker as LeafletMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { cn } from '@/lib/utils';
import { FireData } from './FireCard';
import { toast } from '@/lib/toast';
import L from 'leaflet';

// Import custom components
import { MapControls, MapSetView } from './map/MapControls';
import { MapLegend, OfflineIndicator, EvacuationAlert } from './map/MapLegend';
import { MapActions } from './map/MapActions';
import { createFireMarkers, createFirmsMarkers, createRouteLine } from './map/MarkerUtils';
import { fetchFirmsData, FirmsData } from '@/services/firmsService';
import Navigation from './map/Navigation';
import { RouteResult } from '@/services/routeService';

// Fix for default marker icons in Leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

interface OpenStreetMapProps {
  className?: string;
  fires?: FireData[];
  showEvacuationAlert?: boolean;
  onMapReady?: () => void;
  offlineMode?: boolean;
}

// UserLocationMarker component to show and track user's location
const UserLocationMarker = ({ onLocationChange }: { onLocationChange: (pos: {lat: number, lng: number}) => void }) => {
  const [position, setPosition] = useState<[number, number] | null>(null);
  const map = useMap();
  
  useEffect(() => {
    map.locate({ setView: false, watch: true, maxZoom: 16 });

    function onLocationFound(e: L.LocationEvent) {
      setPosition([e.latlng.lat, e.latlng.lng]);
      onLocationChange({ lat: e.latlng.lat, lng: e.latlng.lng });
    }

    map.on('locationfound', onLocationFound);

    return () => {
      map.off('locationfound', onLocationFound);
    };
  }, [map, onLocationChange]);

  if (position === null) return null;

  // Create a marker for user location
  const userIcon = new L.DivIcon({
    className: 'custom-user-marker',
    html: `<div style="background-color:#4285F4; width:15px; height:15px; border-radius:50%; border:2px solid white"></div>`,
    iconSize: [15, 15],
  });

  return (
    <LeafletMarker position={position} icon={userIcon}>
      <Popup>You are here</Popup>
    </LeafletMarker>
  );
};

const OpenStreetMap = ({
  className,
  fires = [],
  showEvacuationAlert = true,
  onMapReady,
  offlineMode = false
}: OpenStreetMapProps) => {
  const [showAlert, setShowAlert] = useState(showEvacuationAlert);
  const [firmsData, setFirmsData] = useState<FirmsData[]>([]);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [downloadingOfflineMaps, setDownloadingOfflineMaps] = useState(false);
  const [mapLayer, setMapLayer] = useState('standard'); // standard, satellite
  const [userLocation, setUserLocation] = useState<{ lat: number, lng: number } | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [currentRoute, setCurrentRoute] = useState<RouteResult | null>(null);
  const [showNavigation, setShowNavigation] = useState(false);
  
  // Fetch FIRMS data on component mount
  useEffect(() => {
    const loadFirmsData = async () => {
      setIsLoadingData(true);
      try {
        const data = await fetchFirmsData(offlineMode);
        setFirmsData(data);
      } catch (error) {
        console.error('Error loading FIRMS data:', error);
        toast.error("Failed to load wildfire data");
      } finally {
        setIsLoadingData(false);
      }
    };
    
    loadFirmsData();
    
    if (onMapReady) {
      setTimeout(onMapReady, 1000);
    }
  }, [offlineMode, onMapReady]);

  // Handle user location changes
  const handleUserLocationChange = (position: { lat: number, lng: number }) => {
    setUserLocation(position);
  };
  
  // Handle route calculation results
  const handleRouteCalculated = (route: RouteResult | null) => {
    setCurrentRoute(route);
  };
  
  // Get route path data for the polyline
  const getRoutePath = () => {
    if (!currentRoute || !currentRoute.geometry) return null;
    return createRouteLine(currentRoute.geometry, currentRoute.warnings);
  };
  
  const routePath = getRoutePath();

  return (
    <div className={cn('map-container relative w-full h-full', className)}>
      <MapContainer 
        center={[36.7783, -119.4179] as [number, number]} 
        zoom={6}
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
        whenReady={() => setMapLoaded(true)}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Add custom controls */}
        <MapSetView setView={true} />
        
        {/* Add fire markers */}
        {createFireMarkers(fires)}
        
        {/* Add NASA FIRMS markers with loading state */}
        {!isLoadingData && createFirmsMarkers(firmsData)}
        
        {/* User location marker */}
        <UserLocationMarker onLocationChange={handleUserLocationChange} />
        
        {/* Route polyline if available */}
        {routePath && (
          <Polyline 
            positions={routePath.positions} 
            pathOptions={routePath.options} 
          />
        )}
        
        {/* Map controls inside the map */}
        <MapControls mapLayer={mapLayer} setMapLayer={setMapLayer} />
      </MapContainer>
      
      {/* Loading indicator */}
      {isLoadingData && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white bg-opacity-80 p-3 rounded-lg shadow-md z-[1000] flex items-center">
          <svg className="animate-spin h-5 w-5 mr-2 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>Loading wildfire data...</span>
        </div>
      )}
      
      {/* Navigation toggle button */}
      <div className="absolute top-4 left-4 z-[1000]">
        <button
          className="px-4 py-2 bg-white bg-opacity-90 rounded-lg shadow-md flex items-center"
          onClick={() => setShowNavigation(!showNavigation)}
        >
          {showNavigation ? 'Hide Navigation' : 'Show Navigation'}
        </button>
      </div>
      
      {/* Navigation panel */}
      {showNavigation && (
        <div className="absolute top-16 left-4 z-[1000]">
          <Navigation 
            userLocation={userLocation} 
            firmsData={firmsData} 
            onRouteCalculated={handleRouteCalculated} 
          />
        </div>
      )}
      
      {/* Map legend */}
      <MapLegend />
      
      {/* Offline mode indicator */}
      <OfflineIndicator offlineMode={offlineMode} />
      
      {/* Action buttons */}
      <MapActions 
        downloadingOfflineMaps={downloadingOfflineMaps}
        setDownloadingOfflineMaps={setDownloadingOfflineMaps}
      />
      
      {/* Emergency alert */}
      <EvacuationAlert showAlert={showAlert} setShowAlert={setShowAlert} />
    </div>
  );
};

export default OpenStreetMap;
