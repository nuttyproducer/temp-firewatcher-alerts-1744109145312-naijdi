
import React, { useState } from 'react';
import { Search, CornerDownLeft, AlertTriangle, X } from 'lucide-react';
import { toast } from '@/lib/toast';
import { geocodeAddress, generateRoute, RouteResult } from '@/services/routeService';
import { FirmsData } from '@/services/firmsService';

interface NavigationProps {
  userLocation: { lat: number, lng: number } | null;
  firmsData: FirmsData[];
  onRouteCalculated: (route: RouteResult | null) => void;
}

export const Navigation = ({ userLocation, firmsData, onRouteCalculated }: NavigationProps) => {
  const [destination, setDestination] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [routeResult, setRouteResult] = useState<RouteResult | null>(null);
  
  const handleCalculateRoute = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!destination) {
      toast.warning("Please enter a destination");
      return;
    }
    
    if (!userLocation) {
      toast.warning("Your location is not available. Please enable location services.");
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Convert destination address to coordinates
      const destinationCoords = await geocodeAddress(destination);
      
      if (!destinationCoords) {
        toast.error("Could not find the destination address");
        setIsLoading(false);
        return;
      }
      
      // Convert FIRMS data to fire zones for route avoidance
      const fireZones = firmsData.map(fire => ({
        center: { lat: fire.lat, lng: fire.lon },
        radius: calculateFireRadius(fire) // Calculate radius based on fire intensity
      }));
      
      // Generate route
      const route = await generateRoute(
        userLocation,
        destinationCoords,
        fireZones
      );
      
      if (route) {
        setRouteResult(route);
        onRouteCalculated(route);
        
        // Show warning if route has warnings
        if (route.warnings && route.warnings.length > 0) {
          const criticalWarnings = route.warnings.filter(w => w.severity === 'critical');
          if (criticalWarnings.length > 0) {
            toast.error("WARNING: Route passes through fire danger zones", {
              description: "Consider finding shelter or an alternative route"
            });
          } else {
            toast.warning("Route passes near fire activity", {
              description: "Proceed with caution and monitor conditions"
            });
          }
        }
      } else {
        onRouteCalculated(null);
      }
    } catch (error) {
      console.error('Error calculating route:', error);
      toast.error("Failed to calculate route");
    } finally {
      setIsLoading(false);
    }
  };
  
  const clearRoute = () => {
    setRouteResult(null);
    onRouteCalculated(null);
    toast.info("Route cleared");
  };
  
  // Helper to calculate fire radius based on intensity
  const calculateFireRadius = (fire: FirmsData): number => {
    // Base radius on brightness and confidence
    const baseRadius = 0.5; // 0.5 km minimum
    const intensityFactor = (fire.brightness - 300) / 100; // Normalize
    const confidenceFactor = fire.confidence / 100;
    
    return baseRadius + (intensityFactor * confidenceFactor);
  };
  
  // Format distance for display
  const formatDistance = (meters: number): string => {
    if (meters >= 1000) {
      return `${(meters / 1000).toFixed(1)} km`;
    }
    return `${Math.round(meters)} m`;
  };
  
  // Format duration for display
  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes} min`;
  };
  
  return (
    <div className="navigation-panel glass-card bg-white bg-opacity-90 p-4 rounded-lg shadow-md w-full max-w-sm">
      <h3 className="text-lg font-medium mb-2">Navigation</h3>
      
      <form onSubmit={handleCalculateRoute} className="mb-3">
        <div className="flex mb-2">
          <div className="flex-grow relative">
            <Search className="absolute left-2 top-3 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="Enter destination address"
              className="w-full px-8 py-2 border border-gray-300 rounded-md pr-3 pl-8"
              disabled={isLoading}
            />
          </div>
          <button
            type="submit"
            className={`ml-2 px-3 py-2 rounded-md ${isLoading ? 'bg-muted' : 'bg-primary'} text-white`}
            disabled={isLoading}
          >
            {isLoading ? 
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Loading
              </span> 
              : 
              <CornerDownLeft className="h-5 w-5" />
            }
          </button>
        </div>
      </form>
      
      {routeResult && (
        <div className="route-details bg-card p-3 rounded-md text-sm">
          <div className="flex justify-between items-center mb-2">
            <h4 className="font-medium">Route Details</h4>
            <button onClick={clearRoute} className="text-muted-foreground hover:text-foreground">
              <X className="h-4 w-4" />
            </button>
          </div>
          
          <div className="grid grid-cols-2 gap-2 mb-2">
            <div>
              <p className="text-muted-foreground text-xs">Distance</p>
              <p className="font-medium">{formatDistance(routeResult.distance)}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Est. Time</p>
              <p className="font-medium">{formatDuration(routeResult.duration)}</p>
            </div>
          </div>
          
          <div className="mb-2">
            <p className="text-muted-foreground text-xs">From</p>
            <p className="text-sm truncate">Current Location</p>
          </div>
          
          <div>
            <p className="text-muted-foreground text-xs">To</p>
            <p className="text-sm truncate">{destination}</p>
          </div>
          
          {routeResult.warnings && routeResult.warnings.length > 0 && (
            <div className="mt-2 p-2 bg-alert-low/20 rounded-md border border-alert-low flex items-start">
              <AlertTriangle className="h-4 w-4 text-alert-high mr-2 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-medium text-alert-high">Warning</p>
                <p className="text-xs">
                  {routeResult.warnings[0].message}
                  {routeResult.warnings.length > 1 && ` (+${routeResult.warnings.length - 1} more warnings)`}
                </p>
              </div>
            </div>
          )}
          
          {routeResult.instructions && routeResult.instructions.length > 0 && (
            <div className="mt-2">
              <p className="font-medium text-xs mb-1">Directions:</p>
              <div className="max-h-32 overflow-y-auto text-xs">
                {routeResult.instructions.slice(0, 3).map((instruction, index) => (
                  <div key={index} className="py-1 border-b border-gray-100 last:border-0">
                    {instruction.text} ({formatDistance(instruction.distance)})
                  </div>
                ))}
                {routeResult.instructions.length > 3 && (
                  <p className="text-xs text-muted-foreground mt-1">
                    + {routeResult.instructions.length - 3} more steps
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Navigation;
