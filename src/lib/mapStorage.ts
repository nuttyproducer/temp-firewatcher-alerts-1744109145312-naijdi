
// This file handles the local storage of map data for offline use

type StoredMapData = {
  fires: any[];
  routes: any[];
  mapTiles: any[];
  lastUpdated: string;
};

// Save map data to local storage
export const saveMapDataOffline = (data: Partial<StoredMapData>) => {
  try {
    const currentData = getMapDataOffline();
    const newData = {
      ...currentData,
      ...data,
      lastUpdated: new Date().toISOString()
    };
    
    localStorage.setItem('firewatch_map_data', JSON.stringify(newData));
    return true;
  } catch (error) {
    console.error('Error saving map data offline:', error);
    return false;
  }
};

// Get map data from local storage
export const getMapDataOffline = (): StoredMapData => {
  try {
    const data = localStorage.getItem('firewatch_map_data');
    if (data) {
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error retrieving offline map data:', error);
  }
  
  // Return default empty data structure if nothing is found
  return {
    fires: [],
    routes: [],
    mapTiles: [],
    lastUpdated: ''
  };
};

// Check if offline data is available
export const hasOfflineMapData = (): boolean => {
  try {
    const data = localStorage.getItem('firewatch_map_data');
    return !!data;
  } catch (error) {
    return false;
  }
};

// Clear all offline map data
export const clearOfflineMapData = (): boolean => {
  try {
    localStorage.removeItem('firewatch_map_data');
    return true;
  } catch (error) {
    console.error('Error clearing offline map data:', error);
    return false;
  }
};

// Helper to estimate the size of stored data
export const getOfflineDataSize = (): string => {
  try {
    const data = localStorage.getItem('firewatch_map_data');
    if (!data) return '0 KB';
    
    // Calculate size in KB
    const bytes = new Blob([data]).size;
    const kb = Math.round(bytes / 1024);
    
    if (kb < 1024) {
      return `${kb} KB`;
    } else {
      return `${(kb / 1024).toFixed(1)} MB`;
    }
  } catch (error) {
    return 'Unknown';
  }
};
