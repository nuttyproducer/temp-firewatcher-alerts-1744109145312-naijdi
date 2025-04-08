
import React, { useEffect, useState } from 'react';
import { Flame, AlertTriangle, MapPin } from 'lucide-react';

const SplashScreen = ({ onComplete }: { onComplete: () => void }) => {
  const [fadeOut, setFadeOut] = useState(false);
  
  useEffect(() => {
    // Show splash screen for 2.5 seconds before fading out
    const timer = setTimeout(() => {
      setFadeOut(true);
    }, 2000);
    
    // Complete the transition after the fade animation
    const completeTimer = setTimeout(() => {
      onComplete();
    }, 2500);
    
    return () => {
      clearTimeout(timer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);
  
  return (
    <div 
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-b from-fire-800 to-fire-600 transition-opacity duration-500 ${
        fadeOut ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <div className="animate-pulse-alert mb-6 flex items-center">
        <Flame className="h-16 w-16 text-fire-300" strokeWidth={1.5} />
        <AlertTriangle className="h-16 w-16 -ml-3 text-alert-high" strokeWidth={1.5} />
      </div>
      
      <h1 className="text-4xl font-bold text-white mb-2">FireWatcher</h1>
      <p className="text-fire-200 text-lg mb-8">Real-time wildfire alerts</p>
      
      <div className="flex flex-col items-center">
        <div className="w-64 h-2 bg-white/20 rounded-full mb-2 overflow-hidden">
          <div className="h-full bg-white animate-[pulse_2s_cubic-bezier(0.4,0,0.6,1)_infinite] rounded-full" />
        </div>
        <div className="text-fire-200 text-sm flex items-center mt-1">
          <MapPin className="w-4 h-4 mr-1" />
          <span>Locating nearby fires...</span>
        </div>
      </div>

      <div className="absolute bottom-8 text-white/60 text-xs">
        Stay safe. Stay informed.
      </div>
    </div>
  );
};

export default SplashScreen;
