
import React from 'react';
import { useMap } from 'react-leaflet';
import { ZoomIn, ZoomOut, Layers } from 'lucide-react';
import { toast } from '@/lib/toast';

interface MapControlsProps {
  mapLayer: string;
  setMapLayer: (layer: string) => void;
}

export const MapControls = ({ mapLayer, setMapLayer }: MapControlsProps) => {
  const map = useMap();

  const handleZoomIn = () => {
    map.zoomIn();
  };

  const handleZoomOut = () => {
    map.zoomOut();
  };

  const toggleMapLayer = () => {
    // Toggle between map layers
    setMapLayer(mapLayer === 'standard' ? 'satellite' : 'standard');
    // In a real implementation, this would change the tile layer
    toast.info(`Switched to ${mapLayer === 'standard' ? 'satellite' : 'standard'} view`);
  };

  return (
    <div className="absolute top-4 right-4 flex flex-col space-y-2 z-[1000]">
      <button 
        className="w-10 h-10 rounded-full glass-card flex items-center justify-center bg-white bg-opacity-80 shadow-md"
        onClick={handleZoomIn}
      >
        <ZoomIn className="w-5 h-5" />
      </button>
      <button 
        className="w-10 h-10 rounded-full glass-card flex items-center justify-center bg-white bg-opacity-80 shadow-md"
        onClick={handleZoomOut}
      >
        <ZoomOut className="w-5 h-5" />
      </button>
      <button 
        className="w-10 h-10 rounded-full glass-card flex items-center justify-center bg-white bg-opacity-80 shadow-md"
        onClick={toggleMapLayer}
      >
        <Layers className="w-5 h-5" />
      </button>
    </div>
  );
};

// MapSetView component sets initial view
export const MapSetView = ({ setView }: { setView: boolean }) => {
  const map = useMap();
  
  React.useEffect(() => {
    if (setView) {
      map.setView([36.7783, -119.4179], 6);
    }
  }, [map, setView]);
  
  return null;
};
