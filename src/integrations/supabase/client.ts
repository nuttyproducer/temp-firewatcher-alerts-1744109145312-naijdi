// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://ulvhistbfxdbgqfreolp.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVsdmhpc3RiZnhkYmdxZnJlb2xwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQxMDM4MTgsImV4cCI6MjA1OTY3OTgxOH0.CEPQjOh8IQPkecBvlLqqxJXfmGxB6ooXS5G_uUZIEi8";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);