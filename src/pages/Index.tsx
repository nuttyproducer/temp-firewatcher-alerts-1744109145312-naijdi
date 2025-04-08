
import React, { useState } from 'react';
import OpenStreetMap from '@/components/OpenStreetMap';
import AlertBanner from '@/components/AlertBanner';
import WeatherInfo from '@/components/WeatherInfo';
import FireCard from '@/components/FireCard';
import Navigation from '@/components/Navigation';
import { FireData } from '@/components/FireCard';
import { WeatherData } from '@/components/WeatherInfo';
import { AlertCircle, ChevronDown, ChevronUp, Bell, BellOff, Wifi, WifiOff } from 'lucide-react';
import { toast } from '@/lib/toast';

// Mock data for demonstration
const mockWeather: WeatherData = {
  temperature: 87,
  humidity: 22,
  windSpeed: 18,
  windDirection: 'NE',
  windGust: 25,
  condition: 'Sunny',
  updatedAt: '10 min ago'
};

const mockFires: FireData[] = [
  {
    id: '1',
    name: 'Pine Ridge Fire',
    location: 'Millerville, CA',
    status: 'uncontained',
    severity: 'critical',
    size: '2,500 acres',
    containment: 15,
    updatedAt: '5 min ago',
    windDirection: 'NE',
    windSpeed: '18 mph'
  },
  {
    id: '2',
    name: 'Cedar Valley Fire',
    location: 'Westfield County, CA',
    status: 'partially-contained',
    severity: 'high',
    size: '850 acres',
    containment: 45,
    updatedAt: '23 min ago'
  },
  {
    id: '3',
    name: 'Rockland Hills Fire',
    location: 'Northern Butte County, CA',
    status: 'partially-contained',
    severity: 'medium',
    size: '350 acres',
    containment: 65,
    updatedAt: '1 hour ago'
  },
  {
    id: '4',
    name: 'Eagle Creek Fire',
    location: 'Mountain View, CA',
    status: 'contained',
    severity: 'low',
    size: '120 acres',
    containment: 95,
    updatedAt: '2 hours ago'
  }
];

const Index = () => {
  const [showAlertBanner, setShowAlertBanner] = useState(true);
  const [expandInfo, setExpandInfo] = useState(true);
  const [alertsMuted, setAlertsMuted] = useState(false);
  const [offlineMode, setOfflineMode] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);
  
  const toggleOfflineMode = () => {
    setOfflineMode(!offlineMode);
    if (!offlineMode) {
      toast.success("Offline mode enabled", {
        description: "Using locally saved map and fire data"
      });
    } else {
      toast.success("Online mode enabled", {
        description: "Connected to live data sources"
      });
    }
  };
  
  const handleMapReady = () => {
    setMapLoaded(true);
    toast.success("Map loaded successfully");
  };
  
  return (
    <div className="app-container">
      {showAlertBanner && (
        <AlertBanner 
          message="Evacuation Warning: Pine Ridge area residents should prepare to evacuate."
          level="high"
          onClose={() => setShowAlertBanner(false)}
        />
      )}
      
      <div className="relative h-[60vh] sm:h-[60vh] w-full">
        <OpenStreetMap 
          fires={mockFires}
          showEvacuationAlert={true}
          onMapReady={handleMapReady}
          offlineMode={offlineMode}
        />
        
        {/* Map overlay controls */}
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10 flex space-x-2">
          <button 
            className="w-10 h-10 rounded-full glass-card flex items-center justify-center"
            onClick={() => setAlertsMuted(!alertsMuted)}
            title={alertsMuted ? "Unmute Alerts" : "Mute Alerts"}
          >
            {alertsMuted ? (
              <BellOff className="w-5 h-5 text-muted-foreground" />
            ) : (
              <Bell className="w-5 h-5 text-primary" />
            )}
          </button>
          
          <button 
            className="w-10 h-10 rounded-full glass-card flex items-center justify-center"
            onClick={toggleOfflineMode}
            title={offlineMode ? "Go Online" : "Go Offline"}
          >
            {offlineMode ? (
              <WifiOff className="w-5 h-5 text-muted-foreground" />
            ) : (
              <Wifi className="w-5 h-5 text-primary" />
            )}
          </button>
        </div>
      </div>
      
      <div className="page-container pb-24">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Wildfire Information</h2>
          <button 
            className="flex items-center text-sm text-muted-foreground"
            onClick={() => setExpandInfo(!expandInfo)}
          >
            {expandInfo ? (
              <>
                <span>Hide</span>
                <ChevronUp className="ml-1 h-4 w-4" />
              </>
            ) : (
              <>
                <span>Show</span>
                <ChevronDown className="ml-1 h-4 w-4" />
              </>
            )}
          </button>
        </div>
        
        {expandInfo && (
          <div className="animate-fade-in">
            <WeatherInfo 
              weather={mockWeather} 
              className="mb-4"
            />
            
            <h3 className="font-medium text-lg mb-3 mt-6">Nearby Fires</h3>
            {mockFires.map(fire => (
              <FireCard 
                key={fire.id} 
                fire={fire} 
                onClick={(fire) => console.log('Clicked fire:', fire)}
                onVerify={(id) => toast.success(`Verified fire report #${id}`)}
                onUpvote={(id) => toast.success(`Upvoted fire report #${id}`)}
                onDownvote={(id) => toast.error(`Downvoted fire report #${id}`)}
                onChatOpen={(id) => console.log('Open chat for fire:', id)}
              />
            ))}
          </div>
        )}
      </div>
      
      <Navigation />
    </div>
  );
};

export default Index;
