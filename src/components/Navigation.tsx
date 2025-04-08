
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Flame, MapPin, Home, AlertTriangle, Settings, UserCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

const Navigation = () => {
  const location = useLocation();
  
  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/fires', label: 'Fires', icon: Flame },
    { path: '/report', label: 'Report', icon: AlertTriangle },
    { path: '/shelter', label: 'Shelters', icon: MapPin },
    { path: '/profile', label: 'Profile', icon: UserCircle },
  ];

  return (
    <div className="bottom-navigation py-2">
      <div className="container mx-auto">
        <nav className="flex justify-around items-center">
          {navItems.map((item) => (
            <Link 
              key={item.path} 
              to={item.path} 
              className={cn(
                'nav-item',
                location.pathname === item.path ? 'active' : ''
              )}
            >
              <item.icon className="h-6 w-6 mb-1" />
              <span className="text-xs">{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default Navigation;
