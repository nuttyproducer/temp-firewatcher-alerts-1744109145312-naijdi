
import { toast } from '@/lib/toast';
import { supabase } from '@/integrations/supabase/client';

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface RoutePoint {
  name: string;
  coordinates: Coordinates;
}

export interface RouteResult {
  distance: number; // in meters
  duration: number; // in seconds
  geometry: string; // encoded polyline
  instructions?: RouteInstruction[];
  waypoints: RoutePoint[];
  boundingBox?: [[number, number], [number, number]]; // [[min_lon, min_lat], [max_lon, max_lat]]
  warnings?: RouteWarning[];
}

export interface RouteInstruction {
  text: string;
  distance: number;
  duration: number;
  type: string;
}

export interface RouteWarning {
  type: string;
  message: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

// Generate a route given start and end points, avoiding fire zones if possible
export const generateRoute = async (
  start: Coordinates,
  end: Coordinates,
  fireZones: Array<{center: Coordinates, radius: number}>
): Promise<RouteResult | null> => {
  try {
    // Fetch API key from Supabase secrets
    const { data: secretData, error: secretError } = await supabase
      .functions.invoke('get-openroute-key', {});
    
    if (secretError || !secretData) {
      console.error('Error fetching OpenRouteService API key:', secretError);
      toast.error("Could not authenticate with OpenRouteService API");
      return null;
    }
    
    const apiKey = secretData.apiKey;
    
    // OpenRouteService API endpoint
    const url = 'https://api.openrouteservice.org/v2/directions/driving-car';
    
    // Format coordinates as [longitude, latitude] pairs
    const coordinates = [
      [start.lng, start.lat],
      [end.lng, end.lat]
    ];
    
    // Add avoid areas as polygons where fires are detected
    const avoidPolygons = fireZones.map(zone => {
      return generateCirclePolygon(zone.center, zone.radius);
    });
    
    // Request options
    const options = {
      method: 'POST',
      headers: {
        'Authorization': apiKey,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        coordinates: coordinates,
        instructions: true,
        avoid_polygons: {
          type: "MultiPolygon",
          coordinates: avoidPolygons
        },
        preference: "fastest",
        units: "m",
        language: "en",
        geometry: true,
        format: "geojson"
      })
    };
    
    toast.info("Calculating safest route...");
    
    const response = await fetch(url, options);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`OpenRouteService API error: ${response.status} ${response.statusText} - ${errorText}`);
    }
    
    const data = await response.json();
    
    if (!data.features || data.features.length === 0) {
      toast.error("No route found");
      return null;
    }
    
    const route = data.features[0];
    const geometry = route.geometry;
    const properties = route.properties;
    
    // Extract route summary
    const result: RouteResult = {
      distance: properties.summary.distance, // meters
      duration: properties.summary.duration, // seconds
      geometry: geometry,
      waypoints: [
        { name: "Start", coordinates: { lat: start.lat, lng: start.lng } },
        { name: "Destination", coordinates: { lat: end.lat, lng: end.lng } }
      ],
      boundingBox: properties.bbox ? [
        [properties.bbox[0], properties.bbox[1]],
        [properties.bbox[2], properties.bbox[3]]
      ] : undefined
    };
    
    // Extract step-by-step instructions if available
    if (properties.segments && properties.segments.length > 0) {
      result.instructions = properties.segments[0].steps.map(step => ({
        text: step.instruction,
        distance: step.distance,
        duration: step.duration,
        type: step.type
      }));
    }
    
    // Check if route passes through fire zones to add warnings
    const warnings: RouteWarning[] = [];
    const routeCoordinates = decodeGeoJSON(geometry);
    
    for (const fireZone of fireZones) {
      // Check if any point of the route is within the fire zone
      for (const point of routeCoordinates) {
        const distance = calculateDistance(
          { lat: point[1], lng: point[0] },
          fireZone.center
        );
        
        if (distance <= fireZone.radius * 1.5) {
          warnings.push({
            type: 'fire_zone',
            message: `Route passes within ${Math.round(distance * 1000)}m of a fire zone`,
            severity: distance < fireZone.radius ? 'critical' : 'high'
          });
          break;
        }
      }
    }
    
    if (warnings.length > 0) {
      result.warnings = warnings;
    }
    
    toast.success("Route calculated successfully");
    return result;
  } catch (error) {
    console.error('Error generating route:', error);
    toast.error("Failed to generate route");
    return null;
  }
};

// Helper to generate a circle polygon (for avoiding fire areas)
function generateCirclePolygon(center: Coordinates, radiusKm: number, points: number = 32): number[][][] {
  const coordinates: number[][] = [];
  
  for (let i = 0; i < points; i++) {
    const angle = (i / points) * 2 * Math.PI;
    const dx = radiusKm * Math.cos(angle);
    const dy = radiusKm * Math.sin(angle);
    
    // Convert dx/dy to longitude/latitude offset
    const latOffset = dy / 111.32; // 1 degree = 111.32 km
    const lngOffset = dx / (111.32 * Math.cos(center.lat * (Math.PI / 180)));
    
    coordinates.push([
      center.lng + lngOffset,
      center.lat + latOffset
    ]);
  }
  
  // Close the polygon
  coordinates.push(coordinates[0]);
  
  return [coordinates];
}

// Calculate distance between two coordinates in kilometers (Haversine formula)
function calculateDistance(point1: Coordinates, point2: Coordinates): number {
  const R = 6371; // Earth radius in kilometers
  const dLat = deg2rad(point2.lat - point1.lat);
  const dLng = deg2rad(point2.lng - point1.lng);
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(point1.lat)) * Math.cos(deg2rad(point2.lat)) * 
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function deg2rad(deg: number): number {
  return deg * (Math.PI / 180);
}

// Decode GeoJSON coordinates
function decodeGeoJSON(geometry: any): number[][] {
  if (geometry.type === 'LineString') {
    return geometry.coordinates;
  } else if (geometry.coordinates) {
    return geometry.coordinates;
  }
  return [];
}

// Convert address to coordinates using OpenRouteService geocoding
export const geocodeAddress = async (address: string): Promise<Coordinates | null> => {
  try {
    // Fetch API key from Supabase secrets
    const { data: secretData, error: secretError } = await supabase
      .functions.invoke('get-openroute-key', {});
    
    if (secretError || !secretData) {
      console.error('Error fetching OpenRouteService API key:', secretError);
      toast.error("Could not authenticate with OpenRouteService API");
      return null;
    }
    
    const apiKey = secretData.apiKey;
    
    // URL encode the address
    const encodedAddress = encodeURIComponent(address);
    
    // Geocoding API endpoint
    const url = `https://api.openrouteservice.org/geocode/search?text=${encodedAddress}&boundary.country=US&layers=address&size=1`;
    
    const response = await fetch(url, {
      headers: {
        'Authorization': apiKey
      }
    });
    
    if (!response.ok) {
      throw new Error(`Geocoding API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (!data.features || data.features.length === 0) {
      toast.warning("Address not found");
      return null;
    }
    
    const feature = data.features[0];
    const [lng, lat] = feature.geometry.coordinates;
    
    return { lat, lng };
  } catch (error) {
    console.error('Error geocoding address:', error);
    toast.error("Failed to geocode address");
    return null;
  }
};
