
import React from 'react';
import { AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MapLegendProps {
  className?: string;
}

export const MapLegend = ({ className }: MapLegendProps) => {
  return (
    <div className={cn("absolute top-4 left-4 glass-card p-3 z-[1000] bg-white bg-opacity-90 rounded shadow-md", className)}>
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
  );
};

interface OfflineIndicatorProps {
  offlineMode: boolean;
}

export const OfflineIndicator = ({ offlineMode }: OfflineIndicatorProps) => {
  if (!offlineMode) return null;
  
  return (
    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 glass-card bg-alert-medium px-4 py-2 text-white rounded-full z-[1000] flex items-center shadow-md">
      <AlertCircle className="w-4 h-4 mr-2" />
      <span className="text-sm">Offline Mode - Using Saved Data</span>
    </div>
  );
};

interface EvacuationAlertProps {
  showAlert: boolean;
  setShowAlert: (show: boolean) => void;
}

export const EvacuationAlert = ({ showAlert, setShowAlert }: EvacuationAlertProps) => {
  if (!showAlert) return null;
  
  return (
    <div className="absolute bottom-4 left-4 right-4 glass-card bg-alert-high/90 text-white p-4 rounded-lg animate-slide-up z-[1000] shadow-lg">
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
        <span className="sr-only">Close</span>
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
};
