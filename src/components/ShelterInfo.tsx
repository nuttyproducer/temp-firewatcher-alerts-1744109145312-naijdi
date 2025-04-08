
import React from 'react';
import { MapPin, Phone, Users, Clock, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ShelterData {
  id: string;
  name: string;
  address: string;
  city: string;
  type: 'emergency' | 'temporary' | 'longterm';
  phone: string;
  capacity: number;
  occupancy: number;
  openTime: string;
  closeTime: string | null; // null means 24/7
  services: string[];
}

interface ShelterInfoProps {
  shelter: ShelterData;
  className?: string;
  onClick?: (shelter: ShelterData) => void;
}

const ShelterInfo = ({ shelter, className, onClick }: ShelterInfoProps) => {
  const handleClick = () => {
    if (onClick) onClick(shelter);
  };

  const getOccupancyColor = () => {
    const percentage = (shelter.occupancy / shelter.capacity) * 100;
    if (percentage < 50) return 'text-safe-primary';
    if (percentage < 80) return 'text-alert-medium';
    return 'text-alert-critical';
  };

  const getShelterTypeLabel = () => {
    switch (shelter.type) {
      case 'emergency': return 'Emergency Shelter';
      case 'temporary': return 'Temporary Shelter';
      case 'longterm': return 'Long-term Shelter';
      default: return 'Shelter';
    }
  };

  return (
    <div 
      className={cn(
        'glass-card p-4 mb-4 animate-fade-in',
        className
      )}
      onClick={handleClick}
    >
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-medium text-lg">{shelter.name}</h3>
          <div className="flex items-center text-muted-foreground text-sm">
            <MapPin className="h-3 w-3 mr-1" />
            <span>{shelter.address}, {shelter.city}</span>
          </div>
        </div>
        <span className="px-2 py-1 rounded text-xs bg-secondary text-secondary-foreground">
          {getShelterTypeLabel()}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-3">
        <div className="flex items-center space-x-2">
          <Phone className="h-4 w-4 text-info-primary" />
          <a href={`tel:${shelter.phone}`} className="text-sm hover:underline">
            {shelter.phone}
          </a>
        </div>
        
        <div className="flex items-center space-x-2">
          <Users className="h-4 w-4" />
          <span className={cn("text-sm", getOccupancyColor())}>
            {shelter.occupancy}/{shelter.capacity} available
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">
            {shelter.closeTime === null ? 'Open 24/7' : `${shelter.openTime} - ${shelter.closeTime}`}
          </span>
        </div>
      </div>

      {shelter.services.length > 0 && (
        <div className="mt-3">
          <div className="flex items-center mb-2">
            <Info className="h-4 w-4 mr-1 text-muted-foreground" />
            <span className="text-sm font-medium">Available Services</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {shelter.services.map((service, index) => (
              <span 
                key={index} 
                className="px-2 py-1 bg-secondary text-xs rounded-full"
              >
                {service}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ShelterInfo;
