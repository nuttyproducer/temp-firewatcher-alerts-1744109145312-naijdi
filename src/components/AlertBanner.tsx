
import React, { useState, useEffect } from 'react';
import { AlertCircle, X, Bell } from 'lucide-react';
import { cn } from '@/lib/utils';

type AlertLevel = 'low' | 'medium' | 'high' | 'critical';

interface AlertBannerProps {
  message: string;
  level: AlertLevel;
  showBanner?: boolean;
  onClose?: () => void;
}

const AlertBanner = ({ 
  message, 
  level = 'medium', 
  showBanner = true,
  onClose 
}: AlertBannerProps) => {
  const [isVisible, setIsVisible] = useState(showBanner);

  useEffect(() => {
    setIsVisible(showBanner);
  }, [showBanner]);

  const handleClose = () => {
    setIsVisible(false);
    if (onClose) onClose();
  };

  const alertColors = {
    low: 'bg-alert-low/90 text-white',
    medium: 'bg-alert-medium/90 text-white',
    high: 'bg-alert-high/90 text-white',
    critical: 'bg-alert-critical/90 text-white animate-pulse-alert'
  };

  if (!isVisible) return null;

  return (
    <div className={cn(
      'alert-banner show z-50 backdrop-blur-sm',
      alertColors[level]
    )}>
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {level === 'critical' ? (
            <Bell className="h-5 w-5 animate-pulse-alert" />
          ) : (
            <AlertCircle className="h-5 w-5" />
          )}
          <span>{message}</span>
        </div>
        <button 
          onClick={handleClose}
          className="p-1 rounded-full hover:bg-white/20 transition-colors"
          aria-label="Close alert"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default AlertBanner;
