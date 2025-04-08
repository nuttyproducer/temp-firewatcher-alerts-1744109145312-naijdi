import { toast } from './toast';
import L from 'leaflet';

type Coordinates = [number, number];
type FireZone = {
  center: Coordinates;
  radius: number; // in kilometers
};

// Generate a safe evacuation route
export const generateEvacuationRoute = async (
  map,
  startPoint: Coordinates,
  safeDestination: Coordinates,
  fireZones: FireZone[],
  routeOptions?: {
    alternatives?: boolean;
    profile?: 'driving' | 'walking' | 'cycling';
  }
): Promise<boolean> => {
  try {
    if (!map) {
      throw new Error('Map is not initialized');
    }
    
    // In a real implementation, this would call the OpenRouteService API
    // with waypoints calculated to avoid fire zones
    
    // For demo purposes, we'll simulate a route generation
    toast.success("Calculating evacuation route...");
    
    // Remove existing route layers if they exist
    if (map.getLayer && map.getLayer('evacuation-route')) {
      map.removeLayer('evacuation-route');
    }
    
    // Generate a fake route that avoids fire zones
    const routeCoordinates = generateSafeRoutePath(
      startPoint,
      safeDestination,
      fireZones
    );
    
    // Create a Leaflet polyline for the route
    const routeLine = L.polyline(routeCoordinates, {
      color: '#3887be',
      weight: 5,
      opacity: 0.7
    }).addTo(map);
    
    // Fit bounds to show the entire route
    map.fitBounds(routeLine.getBounds(), {
      padding: [50, 50]
    });
    
    toast.success("Safe evacuation route generated", {
      description: "Follow the blue path to safety"
    });
    
    return true;
  } catch (error) {
    console.error('Error generating evacuation route:', error);
    toast.error("Failed to generate evacuation route");
    return false;
  }
};

// Helper to generate a synthetic route path avoiding fire zones
// In a real app, this would be replaced with actual route calculations
const generateSafeRoutePath = (
  start: Coordinates,
  end: Coordinates,
  fireZones: FireZone[]
): Coordinates[] => {
  // Simple direct path first
  const directPath: Coordinates[] = [start];
  
  // Create a sequence of waypoints between start and end
  const numPoints = 6;
  for (let i = 1; i < numPoints; i++) {
    const ratio = i / numPoints;
    
    // Interpolate between start and end
    let point: Coordinates = [
      start[0] + (end[0] - start[0]) * ratio,
      start[1] + (end[1] - start[1]) * ratio
    ];
    
    // Add slight variation to avoid a straight line
    point = [
      point[0] + (Math.random() - 0.5) * 0.05,
      point[1] + (Math.random() - 0.5) * 0.05
    ];
    
    // Check if point is inside any fire zone and adjust if needed
    const adjustedPoint = avoidFireZones(point, fireZones);
    directPath.push(adjustedPoint);
  }
  
  directPath.push(end);
  return directPath;
};

// Simple helper to check if a point is in any fire zone and adjust it
const avoidFireZones = (point: Coordinates, fireZones: FireZone[]): Coordinates => {
  for (const zone of fireZones) {
    // Calculate distance from point to fire center
    const distance = calculateDistance(point, zone.center);
    
    // If the point is within the fire zone radius, adjust it
    if (distance < zone.radius) {
      // Calculate direction vector from fire center to point
      const directionX = point[0] - zone.center[0];
      const directionY = point[1] - zone.center[1];
      
      // Normalize the direction vector
      const length = Math.sqrt(directionX * directionX + directionY * directionY);
      const normalizedX = directionX / length;
      const normalizedY = directionY / length;
      
      // Move the point just outside the fire zone
      const safeDistance = zone.radius * 1.2; // 20% margin for safety
      return [
        zone.center[0] + normalizedX * safeDistance,
        zone.center[1] + normalizedY * safeDistance
      ];
    }
  }
  
  return point;
};

// Calculate distance between two points (haversine formula)
const calculateDistance = (point1: Coordinates, point2: Coordinates): number => {
  const toRadians = (degrees: number) => degrees * Math.PI / 180;
  
  const lat1 = toRadians(point1[1]);
  const lon1 = toRadians(point1[0]);
  const lat2 = toRadians(point2[1]);
  const lon2 = toRadians(point2[0]);
  
  const dLat = lat2 - lat1;
  const dLon = lon2 - lon1;
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  
  // Earth radius in kilometers
  const R = 6371;
  
  return R * c;
};

// Animate the route line to make it more visible and attention-grabbing
const animateRouteLine = (map) => {
  let step = 0;
  
  function animate() {
    step = (step + 1) % 512;
    map.setPaintProperty('evacuation-route', 'line-dasharray', [0, 2, step % 512, 2]);
    requestAnimationFrame(animate);
  }
  
  requestAnimationFrame(animate);
};

// Generate voice guidance instructions for a route
// In a real app this would parse actual route steps
export const generateVoiceGuidance = (
  startPoint: Coordinates,
  endPoint: Coordinates,
  steps: any[]
): string[] => {
  // For demo purposes, return some fake instructions
  return [
    "Head east for 1 mile to reach the evacuation route",
    "Turn right onto Highway 80",
    "Continue for 5 miles, staying away from the fire zone on your left",
    "Turn north at the Westfield exit",
    "The emergency shelter is 2 miles ahead on your right"
  ];
};

// Add a new function to fetch NASA FIRMS data
export const fetchNASAFirmsData = async (options: {
  source?: 'MODIS' | 'VIIRS',
  days?: number,
  area?: [number, number, number, number] // [minLon, minLat, maxLon, maxLat]
}) => {
  try {
    // In a real implementation, this would call the NASA FIRMS API
    // For demo purposes, we'll return mock data
    const mockData = [
      { latitude: 37.3, longitude: -119.2, brightness: 345, scan: 1.5, track: 1.3, confidence: 95, date: "2025-04-07" },
      { latitude: 36.8, longitude: -118.9, brightness: 312, scan: 1.2, track: 1.0, confidence: 87, date: "2025-04-07" },
      { latitude: 38.1, longitude: -119.7, brightness: 390, scan: 1.8, track: 1.5, confidence: 99, date: "2025-04-08" }
    ];
    
    return mockData;
  } catch (error) {
    console.error('Error fetching NASA FIRMS data:', error);
    throw error;
  }
};
