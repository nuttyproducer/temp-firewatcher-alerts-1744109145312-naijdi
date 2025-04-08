
import { toast } from '@/lib/toast';
import { supabase } from '@/integrations/supabase/client';

// FIRMS data interface
export interface FirmsData {
  lat: number;
  lon: number;
  brightness: number;
  scan: number;
  track: number;
  confidence: number;
  date: string;
  satellite?: string;
}

// Fetch NASA FIRMS data
export const fetchFirmsData = async (offlineMode: boolean): Promise<FirmsData[]> => {
  if (offlineMode) {
    toast.info("Using offline data for fire locations");
    return getMockFirmsData();
  }
  
  try {
    // Fetch the NASA FIRMS API key from Supabase
    const { data: secretData, error: secretError } = await supabase
      .functions.invoke('get-nasa-key', {});
    
    if (secretError || !secretData) {
      console.error('Error fetching NASA API key:', secretError);
      toast.error("Could not authenticate with NASA FIRMS API");
      return getMockFirmsData();
    }
    
    const apiKey = secretData.apiKey;
    toast.info("Fetching latest wildfire data from NASA FIRMS");
    
    // Get data for the last 24 hours (1 day)
    const days = 1;
    
    // Use MODIS data source
    const source = 'MODIS_C6_1';
    
    // Use California bounding box (approximate)
    const boundingBox = '-124.5,32.5,-114.0,42.0';
    
    const url = `https://firms.modaps.eosdis.nasa.gov/api/area/csv/${apiKey}/${source}/${boundingBox}/${days}`;
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch FIRMS data: ${response.status} ${response.statusText}`);
    }
    
    const csvText = await response.text();
    const parsedData = parseCSV(csvText);
    
    toast.success(`Loaded ${parsedData.length} wildfire hotspots`);
    return parsedData;
  } catch (error) {
    console.error('Error fetching FIRMS data:', error);
    toast.error("Failed to fetch wildfire data, using offline data");
    return getMockFirmsData();
  }
};

// Parse CSV data from NASA FIRMS API
const parseCSV = (csv: string): FirmsData[] => {
  const lines = csv.split('\n');
  // Get header line to map column indices
  const header = lines[0].split(',');
  
  const latIndex = header.indexOf('latitude');
  const lonIndex = header.indexOf('longitude');
  const brightnessIndex = header.indexOf('brightness');
  const scanIndex = header.indexOf('scan');
  const trackIndex = header.indexOf('track');
  const confidenceIndex = header.indexOf('confidence');
  const acqDateIndex = header.indexOf('acq_date');
  const satelliteIndex = header.indexOf('satellite');
  
  // Skip header row
  const dataLines = lines.slice(1);
  
  return dataLines
    .filter(line => line.trim() !== '') // Skip empty lines
    .map(line => {
      const columns = line.split(',');
      
      return {
        lat: parseFloat(columns[latIndex]),
        lon: parseFloat(columns[lonIndex]),
        brightness: parseFloat(columns[brightnessIndex]),
        scan: parseFloat(columns[scanIndex]),
        track: parseFloat(columns[trackIndex]),
        confidence: parseInt(columns[confidenceIndex]),
        date: columns[acqDateIndex],
        satellite: satelliteIndex >= 0 ? columns[satelliteIndex] : undefined
      };
    });
};

// Get mock FIRMS data for demo purposes (fallback)
export const getMockFirmsData = (): FirmsData[] => {
  return [
    { lat: 37.3, lon: -119.2, brightness: 345, scan: 1.5, track: 1.3, confidence: 95, date: "2025-04-07" },
    { lat: 36.8, lon: -118.9, brightness: 312, scan: 1.2, track: 1.0, confidence: 87, date: "2025-04-07" },
    { lat: 38.1, lon: -119.7, brightness: 390, scan: 1.8, track: 1.5, confidence: 99, date: "2025-04-08" }
  ];
};
