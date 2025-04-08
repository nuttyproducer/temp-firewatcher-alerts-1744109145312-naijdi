
import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { FireData } from '../FireCard';
import { FirmsData } from '@/services/firmsService';

// Create fire markers based on fire data
export const createFireMarkers = (fires: FireData[]) => {
  return fires.map(fire => {
    // For demo purposes, generate random coordinates near California
    // In a real app, these would come from the fire data API
    const lat = 36.7783 + (Math.random() - 0.5) * 4;
    const lng = -119.4179 + (Math.random() - 0.5) * 4;
    
    // Determine marker color based on severity
    let markerColor = '#ffff00'; // default
    switch(fire.severity) {
      case 'critical':
        markerColor = '#ff0000';
        break;
      case 'high':
        markerColor = '#ff6600';
        break;
      case 'medium':
        markerColor = '#ffcc00';
        break;
      case 'low':
        markerColor = '#ffff00';
        break;
    }
    
    const customIcon = new L.DivIcon({
      className: 'custom-fire-marker',
      html: `<div style="background-color:${markerColor}; width:15px; height:15px; border-radius:50%; opacity:0.7; border:1px solid white"></div>`,
      iconSize: [15, 15],
    });
    
    return (
      <Marker 
        key={fire.id}
        position={[lat, lng] as [number, number]}
        icon={customIcon}
      >
        <Popup>
          <div className="p-2">
            <h3 className="font-medium">{fire.name}</h3>
            <p className="text-sm">Status: {fire.status}</p>
            <p className="text-sm">Location: {fire.location}</p>
            <p className="text-sm">Size: {fire.size}</p>
            <p className="text-sm">Containment: {fire.containment}%</p>
          </div>
        </Popup>
      </Marker>
    );
  });
};

// Create NASA FIRMS markers
export const createFirmsMarkers = (firmsData: FirmsData[]) => {
  return firmsData.map((fire, index) => {
    // Determine marker color based on brightness (higher = more intense)
    const brightness = fire.brightness || 300;
    const intensity = Math.min((brightness - 300) / 100, 1); // Normalize between 0-1
    
    // Color gradient from yellow to red based on intensity
    const r = Math.min(255, 255);
    const g = Math.max(0, 255 - (intensity * 255));
    const b = 0;
    
    const markerColor = `rgb(${r}, ${g}, ${b})`;
    const markerSize = 10 + (intensity * 10); // Size between 10-20px
    
    const customIcon = new L.DivIcon({
      className: 'custom-firms-marker',
      html: `<div style="background-color:${markerColor}; width:${markerSize}px; height:${markerSize}px; border-radius:50%; opacity:0.8; border:1px solid white"></div>`,
      iconSize: [markerSize, markerSize],
    });
    
    return (
      <Marker 
        key={`firms-${index}`}
        position={[fire.lat, fire.lon] as [number, number]}
        icon={customIcon}
      >
        <Popup>
          <div className="p-2">
            <h3 className="font-medium">NASA FIRMS Detection</h3>
            <p className="text-sm">Brightness: {fire.brightness} K</p>
            <p className="text-sm">Confidence: {fire.confidence}%</p>
            <p className="text-sm">Date: {fire.date}</p>
            <p className="text-sm">Scan: {fire.scan} km</p>
            <p className="text-sm">Track: {fire.track} km</p>
            {fire.satellite && <p className="text-sm">Satellite: {fire.satellite}</p>}
          </div>
        </Popup>
      </Marker>
    );
  });
};

// Create route polyline based on route data
export const createRouteLine = (routeGeometry: any, warnings: any[] = []) => {
  if (!routeGeometry) return null;
  
  // Parse the route geometry (either GeoJSON or encoded polyline)
  let coordinates: [number, number][] = [];
  
  if (typeof routeGeometry === 'string') {
    // Assuming encoded polyline - would need to decode
    console.error('Encoded polyline format not supported yet');
    return null;
  } else if (routeGeometry.type === 'LineString') {
    coordinates = routeGeometry.coordinates;
  } else if (routeGeometry.coordinates) {
    coordinates = routeGeometry.coordinates;
  }
  
  if (coordinates.length === 0) return null;
  
  // Convert the coordinates to Leaflet format [lat, lng]
  const points = coordinates.map(coord => [coord[1], coord[0]]);
  
  // Determine route color based on warnings
  let routeColor = '#3388ff'; // Default blue
  let routeWeight = 5;
  
  if (warnings && warnings.length > 0) {
    const highestSeverity = warnings.reduce((highest, warning) => {
      const severityMap = {
        'critical': 4,
        'high': 3,
        'medium': 2,
        'low': 1
      };
      
      const currentSeverity = severityMap[warning.severity] || 0;
      const highestSeverity = severityMap[highest] || 0;
      
      return currentSeverity > highestSeverity ? warning.severity : highest;
    }, 'low');
    
    // Set route color based on severity
    switch (highestSeverity) {
      case 'critical':
        routeColor = '#ff0000'; // Red
        break;
      case 'high':
        routeColor = '#ff6600'; // Orange
        break;
      case 'medium':
        routeColor = '#ffcc00'; // Yellow
        break;
      case 'low':
        routeColor = '#3388ff'; // Blue (default)
        break;
    }
  }
  
  // Create the polyline
  return {
    positions: points,
    options: {
      color: routeColor,
      weight: routeWeight,
      opacity: 0.7,
      lineJoin: 'round'
    }
  };
};
