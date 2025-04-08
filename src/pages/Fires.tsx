import React, { useState } from 'react';
import { Search, Filter, MapPin, Flame } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { toast } from "@/lib/toast";
import Navigation from '@/components/Navigation';
import FireCard, { FireData } from '@/components/FireCard';
import AlertBanner from '@/components/AlertBanner';
import FireChatDialog from '@/components/FireChatDialog';

// Mock data for demonstration
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
    windSpeed: '18 mph',
    verifiedCount: 12,
    upvotes: 32,
    downvotes: 2,
    comments: 8
  },
  {
    id: '2',
    name: 'Cedar Valley Fire',
    location: 'Westfield County, CA',
    status: 'partially-contained',
    severity: 'high',
    size: '850 acres',
    containment: 45,
    updatedAt: '23 min ago',
    verifiedCount: 5,
    upvotes: 18,
    downvotes: 1,
    comments: 3
  },
  {
    id: '3',
    name: 'Rockland Hills Fire',
    location: 'Northern Butte County, CA',
    status: 'partially-contained',
    severity: 'medium',
    size: '350 acres',
    containment: 65,
    updatedAt: '1 hour ago',
    verifiedCount: 8,
    upvotes: 12,
    downvotes: 0,
    comments: 4
  },
  {
    id: '4',
    name: 'Eagle Creek Fire',
    location: 'Mountain View, CA',
    status: 'contained',
    severity: 'low',
    size: '120 acres',
    containment: 95,
    updatedAt: '2 hours ago',
    verifiedCount: 3,
    upvotes: 7,
    downvotes: 0,
    comments: 1
  }
];

const Fires = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSeverity, setFilterSeverity] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [fires, setFires] = useState<FireData[]>(mockFires);
  const [selectedFireId, setSelectedFireId] = useState<string | null>(null);
  const [showChatDialog, setShowChatDialog] = useState(false);
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  const handleFilterToggle = (severity: string) => {
    if (filterSeverity.includes(severity)) {
      setFilterSeverity(filterSeverity.filter(s => s !== severity));
    } else {
      setFilterSeverity([...filterSeverity, severity]);
    }
  };

  const handleVerify = (fireId: string) => {
    setFires(prevFires => 
      prevFires.map(fire => 
        fire.id === fireId 
          ? { ...fire, verifiedCount: (fire.verifiedCount || 0) + 1 } 
          : fire
      )
    );
    toast("Thank you for verifying this report");
  };

  const handleUpvote = (fireId: string) => {
    setFires(prevFires => 
      prevFires.map(fire => 
        fire.id === fireId 
          ? { ...fire, upvotes: (fire.upvotes || 0) + 1 } 
          : fire
      )
    );
    toast("Upvoted for accuracy");
  };

  const handleDownvote = (fireId: string) => {
    setFires(prevFires => 
      prevFires.map(fire => 
        fire.id === fireId 
          ? { ...fire, downvotes: (fire.downvotes || 0) + 1 } 
          : fire
      )
    );
    toast("Downvoted for inaccuracy");
  };

  const handleChatOpen = (fireId: string) => {
    setSelectedFireId(fireId);
    setShowChatDialog(true);
  };

  const handleChatClose = () => {
    setShowChatDialog(false);
    setSelectedFireId(null);
  };

  const selectedFire = selectedFireId 
    ? fires.find(fire => fire.id === selectedFireId) 
    : null;
  
  const filteredFires = fires.filter(fire => {
    // Apply search filter
    const matchesSearch = 
      fire.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fire.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Apply severity filter
    const matchesSeverity = 
      filterSeverity.length === 0 || 
      filterSeverity.includes(fire.severity);
    
    return matchesSearch && matchesSeverity;
  });
  
  return (
    <div className="app-container">
      <AlertBanner 
        message="New fire reported near Oakridge Community"
        level="medium"
      />
      
      <div className="page-container pb-24">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Active Wildfires</h1>
          <button
            className="p-2 rounded-full bg-secondary"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="h-5 w-5" />
          </button>
        </div>
        
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <input
              type="text"
              placeholder="Search by name or location"
              className="w-full pl-10 pr-4 py-2 border border-input rounded-lg"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
        </div>
        
        {showFilters && (
          <div className="mb-6 p-4 glass-card animate-fade-in">
            <h3 className="font-medium mb-3">Filter by Severity</h3>
            <div className="flex flex-wrap gap-2">
              {['critical', 'high', 'medium', 'low'].map(severity => (
                <button
                  key={severity}
                  className={`px-3 py-1 rounded-full text-sm border ${
                    filterSeverity.includes(severity) 
                      ? `bg-alert-${severity} text-white border-alert-${severity}` 
                      : 'bg-secondary border-secondary'
                  }`}
                  onClick={() => handleFilterToggle(severity)}
                >
                  {severity.charAt(0).toUpperCase() + severity.slice(1)}
                </button>
              ))}
            </div>
          </div>
        )}
        
        {filteredFires.length > 0 ? (
          <div>
            {filteredFires.map(fire => (
              <FireCard 
                key={fire.id} 
                fire={fire} 
                onClick={(fire) => console.log('Clicked fire:', fire)}
                onVerify={handleVerify}
                onUpvote={handleUpvote}
                onDownvote={handleDownvote}
                onChatOpen={handleChatOpen}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <Flame className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-2">No fires match your filters</h3>
            <p className="text-muted-foreground">
              Try adjusting your search or filters
            </p>
          </div>
        )}
      </div>
      
      {showChatDialog && selectedFire && (
        <FireChatDialog 
          fire={selectedFire} 
          isOpen={showChatDialog} 
          onClose={handleChatClose} 
        />
      )}
      
      <Navigation />
    </div>
  );
};

export default Fires;
