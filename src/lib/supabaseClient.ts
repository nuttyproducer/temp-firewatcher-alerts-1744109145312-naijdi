
// Import the official Supabase client from our integration
import { supabase } from '@/integrations/supabase/client';

// Define report interface
export interface Report {
  id?: string;
  user_id?: string;
  title: string;
  description: string;
  location: string;
  latitude?: number;
  longitude?: number;
  severity: string;
  status: string;
  created_at?: string;
  [key: string]: any;
}

// Mock implementation for saveUserReport until tables are created
export const saveUserReport = async (report: Report) => {
  try {
    // For demo purposes, we'll just log the report and return mock data
    console.log('Report data:', report);
    
    // In a real implementation with Supabase tables configured:
    /*
    const { data, error } = await supabase
      .from('reports')
      .insert([report])
      .select();
      
    if (error) throw error;
    return { success: true, data };
    */
    
    // Mock response
    return { 
      success: true, 
      data: { 
        ...report, 
        id: `report-${Date.now()}`, 
        created_at: new Date().toISOString() 
      } 
    };
  } catch (error) {
    console.error('Error saving report:', error);
    return { success: false, error };
  }
};

// Mock implementation for getUserReports
export const getUserReports = async () => {
  try {
    // For demo purposes, we'll return mock data
    // In a real implementation:
    /*
    const { data, error } = await supabase
      .from('reports')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    return { data, error: null };
    */
    
    // Mock data
    return { 
      data: [
        {
          id: 'mock-1',
          title: 'Smoke visible from Highway 101',
          description: 'Heavy smoke visible from highway, appears to be coming from the east hills.',
          location: 'Near Pine Ridge Road exit on Highway 101',
          severity: 'high',
          status: 'reported',
          created_at: new Date().toISOString()
        }
      ], 
      error: null 
    };
  } catch (error) {
    console.error('Error fetching reports:', error);
    return { data: [], error };
  }
};

// Mock implementation for getSavedEvacuationZones
export const getSavedEvacuationZones = async () => {
  try {
    // Mock data
    return { 
      data: [
        {
          id: 'zone-1',
          name: 'Pine Ridge Evacuation Zone',
          coordinates: [
            [37.7749, -122.4194],
            [37.7649, -122.4294],
            [37.7549, -122.4094],
          ],
          status: 'active',
          severity: 'high',
          created_at: new Date().toISOString()
        }
      ], 
      error: null 
    };
  } catch (error) {
    console.error('Error fetching evacuation zones:', error);
    return { data: [], error };
  }
};

// Mock implementation for getUserSavedRoutes
export const getUserSavedRoutes = async () => {
  try {
    // Mock data
    return { 
      data: [
        {
          id: 'route-1',
          name: 'Home to Evacuation Center',
          start_coordinates: [37.7749, -122.4194],
          end_coordinates: [37.7649, -122.4294],
          route_geojson: {},
          created_at: new Date().toISOString()
        }
      ], 
      error: null 
    };
  } catch (error) {
    console.error('Error fetching saved routes:', error);
    return { data: [], error };
  }
};

// Mock implementations for user authentication
export const createUserAccount = async (email: string, password: string) => {
  try {
    // For demo purposes
    return { 
      user: { id: 'mock-user-id', email }, 
      error: null 
    };
  } catch (error) {
    console.error('Error creating user account:', error);
    return { user: null, error };
  }
};

export const signInUser = async (email: string, password: string) => {
  try {
    // For demo purposes
    return { 
      user: { id: 'mock-user-id', email }, 
      error: null 
    };
  } catch (error) {
    console.error('Error signing in user:', error);
    return { user: null, error };
  }
};
