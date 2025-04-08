
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { AlertCircle, Compass, Download, Flame, Layers, Navigation, ZoomIn, ZoomOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { FireData } from './FireCard';
import { toast } from '@/lib/toast';

// Mapbox token needs to be a public token (pk.)
// The token provided was a secret token (sk.) which doesn't work for client-side applications
let MAPBOX_TOKEN = 'pk.eyJ1IjoiYmVuc29sYXIiLCJhIjoiY2w4Y3Myb2FhMTNuZzN3bjM1cmUxeG9xbiJ9.VxaudQf8d1oE53PSeeIDDQ';

interface MapProps {
  className?: string;
  fires?: FireData[];
  showEvacuationAlert?: boolean;
  onMapReady?: () => void;
  offlineMode?: boolean;
}

const Map = ({ 
  className, 
  fires = [], 
  showEvacuationAlert = true,
  onMapReady,
  offlineMode = false
}: MapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [showAlert, setShowAlert] = useState(showEvacuationAlert);
  const [showTokenInput, setShowTokenInput] = useState(!MAPBOX_TOKEN);
  const [token, setToken] = useState('');
  const [downloadingOfflineMaps, setDownloadingOfflineMaps] = useState(false);
  
  // Initialize map with the token
  const initializeMap = (accessToken: string) => {
    if (!mapContainer.current) return;
    
    try {
      mapboxgl.accessToken = accessToken;
      
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/outdoors-v12', // Outdoors style is good for evacuation routes
        center: [-119.4179, 36.7783], // California center
        zoom: 6,
        pitch: 0,
      });

      // Add navigation controls
      map.current.addControl(
        new mapboxgl.NavigationControl({
          visualizePitch: true,
        }),
        'top-right'
      );

      // Add geolocate control
      map.current.addControl(
        new mapboxgl.GeolocateControl({
          positionOptions: {
            enableHighAccuracy: true
          },
          trackUserLocation: true,
          showUserHeading: true
        }),
        'top-right'
      );

      // Listen for map load
      map.current.on('load', () => {
        setMapLoaded(true);
        
        // Add fire data source
        if (map.current) {
          map.current.addSource('fires', {
            type: 'geojson',
            data: {
              type: 'FeatureCollection',
              features: []
            }
          });

          // Add fire layer
          map.current.addLayer({
            id: 'fire-points',
            type: 'circle',
            source: 'fires',
            paint: {
              'circle-radius': [
                'interpolate', ['linear'], ['get', 'containment'],
                0, 15,
                100, 5
              ],
              'circle-color': [
                'match', ['get', 'severity'],
                'critical', '#ff0000',
                'high', '#ff6600',
                'medium', '#ffcc00',
                'low', '#ffff00',
                '#ff0000' // default color
              ],
              'circle-opacity': 0.7,
              'circle-stroke-width': 1,
              'circle-stroke-color': '#ffffff'
            },
            filter: ['==', '$type', 'Point']
          });

          // Add fire heat layer for intensity visualization
          map.current.addLayer({
            id: 'fire-heat',
            type: 'heatmap',
            source: 'fires',
            paint: {
              'heatmap-weight': [
                'interpolate', ['linear'], ['get', 'containment'],
                0, 1,
                100, 0
              ],
              'heatmap-intensity': 1.5,
              'heatmap-color': [
                'interpolate', ['linear'], ['heatmap-density'],
                0, 'rgba(0,0,0,0)',
                0.2, 'rgba(255,255,0,0.6)',
                0.4, 'rgba(255,165,0,0.7)',
                0.6, 'rgba(255,69,0,0.8)',
                0.8, 'rgba(255,0,0,0.9)',
                1, 'rgba(139,0,0,1)'
              ],
              'heatmap-radius': 30,
              'heatmap-opacity': 0.7
            }
          });

          // Populate fire data
          updateFireData(fires);
        }

        if (onMapReady) onMapReady();
      });

      // Add scale control
      map.current.addControl(new mapboxgl.ScaleControl(), 'bottom-left');

      return true;
    } catch (error) {
      console.error('Error initializing map:', error);
      toast.error("Failed to initialize map");
      return false;
    }
  };

  // Update fire data on the map
  const updateFireData = (fireData: FireData[]) => {
    if (!map.current || !mapLoaded) return;

    // Convert fire data to GeoJSON
    const features = fireData.map(fire => {
      // For demo purposes, generate random coordinates near California
      // In a real app, these would come from the fire data API
      const lat = 36.7783 + (Math.random() - 0.5) * 4;
      const lng = -119.4179 + (Math.random() - 0.5) * 4;

      return {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [lng, lat]
        },
        properties: {
          id: fire.id,
          name: fire.name,
          severity: fire.severity,
          containment: fire.containment,
          size: fire.size,
          location: fire.location,
          status: fire.status
        }
      };
    });

    // Update the 'fires' source with new data
    (map.current.getSource('fires') as mapboxgl.GeoJSONSource).setData({
      type: 'FeatureCollection',
      features: features as any
    });
  };

  // Handle token submission
  const handleTokenSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      toast.error("Please enter a Mapbox token");
      return;
    }

    MAPBOX_TOKEN = token;
    const success = initializeMap(token);
    if (success) {
      setShowTokenInput(false);
      toast.success("Map initialized successfully");
    }
  };

  // Generate evacuation route
  const generateEvacuationRoute = () => {
    if (!map.current || !mapLoaded) return;
    
    toast.success("Calculating safest evacuation route...");
    
    // Simulate route generation with a delay
    setTimeout(() => {
      // In a real implementation, this would call a Mapbox Directions API
      // to generate a route avoiding fire areas
      
      // For now, we'll just show a simple line for demo purposes
      if (map.current) {
        // Check if route layer already exists and remove it
        if (map.current.getLayer('evacuation-route')) {
          map.current.removeLayer('evacuation-route');
        }
        
        if (map.current.getSource('route')) {
          map.current.removeSource('route');
        }
        
        // Add a source for the evacuation route
        map.current.addSource('route', {
          type: 'geojson',
          data: {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'LineString',
              // Example route - in a real app, this would be generated dynamically
              coordinates: [
                [-119.4179, 36.7783],
                [-119.3, 36.8],
                [-118.9, 36.85],
                [-118.5, 37.0]
              ]
            }
          }
        });
        
        // Add a layer showing the evacuation route
        map.current.addLayer({
          id: 'evacuation-route',
          type: 'line',
          source: 'route',
          layout: {
            'line-join': 'round',
            'line-cap': 'round'
          },
          paint: {
            'line-color': '#3887be',
            'line-width': 5,
            'line-dasharray': [0, 2]
          }
        });
        
        // Animate the evacuation route
        let start = 0;
        function animateDashArray(timestamp: number) {
          if (!map.current) return;
          
          // Update the dasharray
          start = (start + 1) % 512;
          map.current.setPaintProperty('evacuation-route', 'line-dasharray', [0, 2, start % 512, 2]);
          
          requestAnimationFrame(animateDashArray);
        }
        
        requestAnimationFrame(animateDashArray);
        
        // Ensure the route is visible
        map.current.fitBounds([
          [-119.4179, 36.7783],
          [-118.5, 37.0]
        ], { padding: 50 });
        
        toast.success("Safe evacuation route generated", {
          description: "Follow the blue path to safety"
        });
      }
    }, 2000);
  };

  // Download maps for offline use
  const downloadOfflineMaps = () => {
    setDownloadingOfflineMaps(true);
    toast.success("Downloading map data for offline use...");
    
    // In a real app, this would use the Mapbox Offline API
    // For demo purposes, we'll just simulate a download
    setTimeout(() => {
      setDownloadingOfflineMaps(false);
      toast.success("Map data downloaded successfully", {
        description: "You can now use the map without an internet connection"
      });
    }, 3000);
  };

  // Effect to initialize map when component mounts
  useEffect(() => {
    if (MAPBOX_TOKEN) {
      initializeMap(MAPBOX_TOKEN);
    }
    
    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, []);

  // Effect to update fire data when it changes
  useEffect(() => {
    if (fires.length > 0) {
      updateFireData(fires);
    }
  }, [fires, mapLoaded]);

  return (
    <div className={cn('map-container relative w-full h-full', className)}>
      {/* Mapbox token input form */}
      {showTokenInput && (
        <div className="absolute inset-0 bg-background/90 z-50 flex items-center justify-center p-4">
          <div className="glass-card p-6 max-w-md w-full">
            <h3 className="text-lg font-medium mb-4">Enter Mapbox Access Token</h3>
            <p className="text-sm text-muted-foreground mb-4">
              To use the interactive map, please enter your Mapbox public access token.
              You can get one for free at <a href="https://www.mapbox.com/" target="_blank" rel="noopener noreferrer" className="text-primary underline">mapbox.com</a>
            </p>
            <form onSubmit={handleTokenSubmit}>
              <input
                type="text"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="pk.eyJ1Ijoie3VzZXJuYW1lfSIsImEiOiJ..."
                className="w-full px-4 py-2 border border-input rounded-lg mb-4"
              />
              <button
                type="submit"
                className="w-full bg-primary text-primary-foreground py-2 rounded-lg"
              >
                Initialize Map
              </button>
            </form>
          </div>
        </div>
      )}
      
      {/* Map container */}
      <div ref={mapContainer} className="absolute inset-0 bg-gray-200 dark:bg-gray-800" />
      
      {/* Overlay controls */}
      <div className="absolute top-4 right-4 flex flex-col space-y-2 z-10">
        <button 
          className="w-10 h-10 rounded-full glass-card flex items-center justify-center"
          onClick={() => map.current?.zoomIn()}
        >
          <ZoomIn className="w-5 h-5" />
        </button>
        <button 
          className="w-10 h-10 rounded-full glass-card flex items-center justify-center"
          onClick={() => map.current?.zoomOut()}
        >
          <ZoomOut className="w-5 h-5" />
        </button>
        <button 
          className="w-10 h-10 rounded-full glass-card flex items-center justify-center"
          onClick={() => {
            // Toggle between map styles
            if (map.current) {
              const currentStyle = map.current.getStyle().name;
              if (currentStyle.includes('Satellite')) {
                map.current.setStyle('mapbox://styles/mapbox/outdoors-v12');
              } else {
                map.current.setStyle('mapbox://styles/mapbox/satellite-streets-v12');
              }
            }
          }}
        >
          <Layers className="w-5 h-5" />
        </button>
      </div>
      
      {/* Action buttons */}
      <div className="absolute bottom-20 right-4 flex flex-col space-y-2 z-10">
        <button
          className="px-4 py-2 rounded-full glass-card bg-safe-primary text-white flex items-center justify-center"
          onClick={generateEvacuationRoute}
        >
          <Navigation className="w-4 h-4 mr-2" />
          <span>Evacuation Route</span>
        </button>
        
        <button
          className={`px-4 py-2 rounded-full glass-card ${downloadingOfflineMaps ? 'bg-muted' : 'bg-primary'} text-white flex items-center justify-center`}
          onClick={downloadOfflineMaps}
          disabled={downloadingOfflineMaps}
        >
          <Download className="w-4 h-4 mr-2" />
          <span>{downloadingOfflineMaps ? 'Downloading...' : 'Save Offline Maps'}</span>
        </button>
      </div>
      
      {/* Legend */}
      <div className="absolute top-4 left-4 glass-card p-3 z-10">
        <h4 className="text-sm font-medium mb-2">Fire Intensity</h4>
        <div className="space-y-1">
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full bg-red-600 mr-2"></div>
            <span className="text-xs">Critical</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full bg-orange-500 mr-2"></div>
            <span className="text-xs">High</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full bg-amber-400 mr-2"></div>
            <span className="text-xs">Medium</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full bg-yellow-300 mr-2"></div>
            <span className="text-xs">Low</span>
          </div>
        </div>
      </div>
      
      {/* Offline mode indicator */}
      {offlineMode && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 glass-card bg-alert-medium px-4 py-2 text-white rounded-full z-10 flex items-center">
          <AlertCircle className="w-4 h-4 mr-2" />
          <span className="text-sm">Offline Mode - Using Saved Data</span>
        </div>
      )}
      
      {/* Emergency alert */}
      {showAlert && (
        <div className="absolute bottom-4 left-4 right-4 glass-card bg-alert-high/90 text-white p-4 rounded-lg animate-slide-up z-10">
          <div className="flex items-start">
            <AlertCircle className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium">Evacuation Warning</p>
              <p className="text-sm mt-1">Mandatory evacuation order for Pine Ridge area. Tap the Evacuation Route button for safe directions.</p>
            </div>
          </div>
          <button 
            className="absolute top-2 right-2 p-1 text-white/80 hover:text-white"
            onClick={() => setShowAlert(false)}
          >
            <Compass className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default Map;
