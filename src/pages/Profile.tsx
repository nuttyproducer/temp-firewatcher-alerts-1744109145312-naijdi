import React, { useState } from 'react';
import Navigation from '@/components/Navigation';
import { User, Bell, Home, Map, Shield, LogOut, ChevronRight, AlertTriangle, Phone } from 'lucide-react';
import { cn } from '@/lib/utils';

const Profile = () => {
  const [notifications, setNotifications] = useState({
    emergencyAlerts: true,
    fireUpdates: true,
    weatherAlerts: true,
    communityReports: false,
    evacuationNotices: true
  });
  
  const handleNotificationToggle = (key: keyof typeof notifications) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };
  
  return (
    <div className="app-container">
      <div className="page-container pb-24">
        <div className="flex items-center mb-8">
          <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center mr-4">
            <User className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold">User Profile</h1>
            <p className="text-muted-foreground">Manage your settings and preferences</p>
          </div>
        </div>
        
        <div className="glass-card mb-6">
          <div className="border-b border-border p-4">
            <h2 className="font-medium text-lg mb-1">Location Settings</h2>
            <p className="text-sm text-muted-foreground">Manage your saved locations</p>
          </div>
          
          <div className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Home className="h-5 w-5 mr-3 text-primary" />
                <div>
                  <p className="font-medium">Home</p>
                  <p className="text-sm text-muted-foreground">123 Pine St, Millerville</p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Map className="h-5 w-5 mr-3 text-primary" />
                <div>
                  <p className="font-medium">Work</p>
                  <p className="text-sm text-muted-foreground">456 Oak Ave, Westfield</p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </div>
            
            <button className="w-full p-3 bg-secondary rounded-lg text-sm font-medium">
              Add New Location
            </button>
          </div>
        </div>
        
        <div className="glass-card mb-6">
          <div className="border-b border-border p-4">
            <h2 className="font-medium text-lg mb-1">Notification Preferences</h2>
            <p className="text-sm text-muted-foreground">Control what alerts you receive</p>
          </div>
          
          <div className="p-4 space-y-4">
            {Object.entries(notifications).map(([key, enabled]) => (
              <div key={key} className="flex items-center justify-between">
                <div className="flex items-center">
                  <Bell className="h-5 w-5 mr-3 text-primary" />
                  <p>{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</p>
                </div>
                <button 
                  className={cn(
                    "relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                    enabled ? "bg-primary" : "bg-input"
                  )}
                  onClick={() => handleNotificationToggle(key as keyof typeof notifications)}
                >
                  <span 
                    className={cn(
                      "pointer-events-none block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform",
                      enabled ? "translate-x-5" : "translate-x-0"
                    )}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>
        
        <div className="glass-card mb-6">
          <div className="border-b border-border p-4">
            <h2 className="font-medium text-lg mb-1">Emergency Contacts</h2>
            <p className="text-sm text-muted-foreground">Important numbers in case of emergency</p>
          </div>
          
          <div className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <AlertTriangle className="h-5 w-5 mr-3 text-alert-high" />
                <div>
                  <p className="font-medium">Emergency Services</p>
                  <p className="text-sm text-muted-foreground">911</p>
                </div>
              </div>
              <button className="p-2 rounded-full bg-secondary">
                <Phone className="h-4 w-4" />
              </button>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Shield className="h-5 w-5 mr-3 text-info-primary" />
                <div>
                  <p className="font-medium">Local Fire Department</p>
                  <p className="text-sm text-muted-foreground">(555) 123-4567</p>
                </div>
              </div>
              <button className="p-2 rounded-full bg-secondary">
                <Phone className="h-4 w-4" />
              </button>
            </div>
            
            <button className="w-full p-3 bg-secondary rounded-lg text-sm font-medium">
              Add Personal Emergency Contact
            </button>
          </div>
        </div>
        
        <button className="w-full p-4 rounded-lg border border-destructive text-destructive flex items-center justify-center">
          <LogOut className="h-5 w-5 mr-2" />
          <span>Sign Out</span>
        </button>
      </div>
      
      <Navigation />
    </div>
  );
};

export default Profile;
