
import React, { useState } from 'react';
import { Search, MapPin } from 'lucide-react';
import Navigation from '@/components/Navigation';
import ShelterInfo, { ShelterData } from '@/components/ShelterInfo';

// Mock data for demonstration
const mockShelters: ShelterData[] = [
  {
    id: '1',
    name: 'Millerville Community Center',
    address: '123 Main St',
    city: 'Millerville, CA',
    type: 'emergency',
    phone: '(555) 123-4567',
    capacity: 200,
    occupancy: 75,
    openTime: '7:00 AM',
    closeTime: null, // 24/7
    services: ['Food', 'Medical', 'Pet Friendly', 'Showers']
  },
  {
    id: '2',
    name: 'Westfield High School',
    address: '456 Oak Ave',
    city: 'Westfield, CA',
    type: 'temporary',
    phone: '(555) 987-6543',
    capacity: 350,
    occupancy: 320,
    openTime: '8:00 AM',
    closeTime: '8:00 PM',
    services: ['Food', 'Cots', 'Charging Stations']
  },
  {
    id: '3',
    name: 'North County Relief Center',
    address: '789 Pine Rd',
    city: 'Pine Ridge, CA',
    type: 'longterm',
    phone: '(555) 456-7890',
    capacity: 150,
    occupancy: 45,
    openTime: '6:00 AM',
    closeTime: '10:00 PM',
    services: ['Food', 'Medical', 'Mental Health', 'Cots', 'Showers', 'Laundry']
  }
];

const Shelter = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  const filteredShelters = mockShelters.filter(shelter => 
    shelter.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    shelter.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
    shelter.city.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <div className="app-container">
      <div className="page-container pb-24">
        <h1 className="text-2xl font-semibold mb-6">Emergency Shelters</h1>
        
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <input
              type="text"
              placeholder="Search shelters by name or location"
              className="w-full pl-10 pr-4 py-2 border border-input rounded-lg"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
        </div>
        
        {filteredShelters.length > 0 ? (
          <div>
            {filteredShelters.map(shelter => (
              <ShelterInfo 
                key={shelter.id} 
                shelter={shelter} 
                onClick={(shelter) => console.log('Clicked shelter:', shelter)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <MapPin className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-2">No shelters found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search or check back later
            </p>
          </div>
        )}
      </div>
      
      <Navigation />
    </div>
  );
};

export default Shelter;
