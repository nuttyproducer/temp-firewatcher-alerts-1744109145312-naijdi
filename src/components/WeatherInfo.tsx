
import React from 'react';
import { cn } from '@/lib/utils';
import { Wind, Thermometer, Droplets, Clock, Sun, ArrowUp } from 'lucide-react';

export interface WeatherData {
  temperature: number;
  humidity: number;
  windSpeed: number;
  windDirection: string;
  windGust?: number;
  condition: string;
  updatedAt: string;
}

interface WeatherInfoProps {
  weather: WeatherData;
  className?: string;
}

const WeatherInfo = ({ weather, className }: WeatherInfoProps) => {
  // Helper function to determine text color based on fire danger
  const getDangerColor = (value: number, type: 'temperature' | 'humidity' | 'wind') => {
    if (type === 'temperature') {
      if (value > 95) return 'text-alert-critical';
      if (value > 85) return 'text-alert-high';
      if (value > 75) return 'text-alert-medium';
      return 'text-current';
    }
    
    if (type === 'humidity') {
      if (value < 20) return 'text-alert-critical';
      if (value < 30) return 'text-alert-high';
      if (value < 40) return 'text-alert-medium';
      return 'text-current';
    }
    
    if (type === 'wind') {
      if (value > 30) return 'text-alert-critical';
      if (value > 20) return 'text-alert-high';
      if (value > 15) return 'text-alert-medium';
      return 'text-current';
    }
    
    return 'text-current';
  };
  
  return (
    <div className={cn('glass-card p-4', className)}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium">Current Weather</h3>
        <div className="flex items-center text-xs text-muted-foreground">
          <Clock className="h-3 w-3 mr-1" />
          <span>Updated {weather.updatedAt}</span>
        </div>
      </div>
      
      <div className="flex items-center justify-around mb-6">
        <div className="text-center">
          <Sun className="h-10 w-10 mx-auto mb-2 text-amber-500" />
          <p className="text-sm text-muted-foreground">{weather.condition}</p>
        </div>
        
        <div className="text-center">
          <p className={cn(
            "text-3xl font-semibold", 
            getDangerColor(weather.temperature, 'temperature')
          )}>
            {weather.temperature}°F
          </p>
          <p className="text-sm text-muted-foreground">Temperature</p>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-4">
        <div className="flex flex-col items-center">
          <div className="flex items-center">
            <Wind className="h-5 w-5 mr-1 text-info-primary" />
            <span className={cn(
              "text-lg font-medium", 
              getDangerColor(weather.windSpeed, 'wind')
            )}>
              {weather.windSpeed}
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">Wind (mph)</p>
        </div>
        
        <div className="flex flex-col items-center">
          <div className="flex items-center">
            <ArrowUp 
              className="h-5 w-5 mr-1 text-info-primary" 
              style={{ transform: `rotate(${weather.windDirection === 'N' ? 0 : 
                weather.windDirection === 'NE' ? 45 : 
                weather.windDirection === 'E' ? 90 : 
                weather.windDirection === 'SE' ? 135 : 
                weather.windDirection === 'S' ? 180 : 
                weather.windDirection === 'SW' ? 225 : 
                weather.windDirection === 'W' ? 270 : 
                weather.windDirection === 'NW' ? 315 : 0}deg)` 
              }}
            />
            <span className="text-lg font-medium">{weather.windDirection}</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">Direction</p>
        </div>
        
        <div className="flex flex-col items-center">
          <div className="flex items-center">
            <Droplets className="h-5 w-5 mr-1 text-info-primary" />
            <span className={cn(
              "text-lg font-medium", 
              getDangerColor(weather.humidity, 'humidity')
            )}>
              {weather.humidity}%
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">Humidity</p>
        </div>
      </div>
      
      {weather.windGust && (
        <div className="mt-4 text-center p-2 bg-alert-medium/10 rounded-lg">
          <p className="text-sm">
            <span className="font-medium text-alert-medium">Wind gusts up to {weather.windGust} mph</span> - 
            Increases fire spread potential
          </p>
        </div>
      )}
    </div>
  );
};

export default WeatherInfo;
