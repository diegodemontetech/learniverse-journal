// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const supabaseUrl = "https://deoliorssqnxshpdecik.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRlb2xpb3Jzc3FueHNocGRlY2lrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzMxODczNzYsImV4cCI6MjA0ODc2MzM3Nn0.pCDhDJheMsLNBRn7ee6GqN0xHau_YmLmVTUlGDzqPfI";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(supabaseUrl, supabaseKey);