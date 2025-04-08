
import React from 'react';
import { Download, Navigation } from 'lucide-react';
import { toast } from '@/lib/toast';

interface MapActionsProps {
  downloadingOfflineMaps: boolean;
  setDownloadingOfflineMaps: (downloading: boolean) => void;
}

export const MapActions = ({ downloadingOfflineMaps, setDownloadingOfflineMaps }: MapActionsProps) => {
  // Generate evacuation route
  const generateEvacuationRoute = () => {
    toast.success("Calculating safest evacuation route...");
    
    // In a real implementation, this would call a routing API like OpenRouteService
    // For demo purposes, we'll just show a toast
    setTimeout(() => {
      toast.success("Safe evacuation route generated", {
        description: "Follow the blue path to safety"
      });
    }, 2000);
  };

  // Download maps for offline use
  const downloadOfflineMaps = () => {
    setDownloadingOfflineMaps(true);
    toast.success("Downloading map data for offline use...");
    
    // In a real app, this would use a library like localforage to store map tiles
    // For demo purposes, we'll just simulate a download
    setTimeout(() => {
      setDownloadingOfflineMaps(false);
      toast.success("Map data downloaded successfully", {
        description: "You can now use the map without an internet connection"
      });
    }, 3000);
  };

  return (
    <div className="absolute bottom-20 right-4 flex flex-col space-y-2 z-[1000]">
      <button
        className="px-4 py-2 rounded-full glass-card bg-safe-primary text-white flex items-center justify-center shadow-md"
        onClick={generateEvacuationRoute}
      >
        <Navigation className="w-4 h-4 mr-2" />
        <span>Evacuation Route</span>
      </button>
      
      <button
        className={`px-4 py-2 rounded-full glass-card ${downloadingOfflineMaps ? 'bg-muted' : 'bg-primary'} text-white flex items-center justify-center shadow-md`}
        onClick={downloadOfflineMaps}
        disabled={downloadingOfflineMaps}
      >
        <Download className="w-4 h-4 mr-2" />
        <span>{downloadingOfflineMaps ? 'Downloading...' : 'Save Offline Maps'}</span>
      </button>
    </div>
  );
};
