import { createClient } from '@supabase/supabase-js';

export const SUPABASE_URL = 'https://irdyvfopwqkfmwrqmgho.supabase.co';
export const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlyZHl2Zm9wd3FrZm13cnFtZ2hvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTEzMzQ2MDYsImV4cCI6MjEwNjkxMDYwNn0.8j_JxM9ozECLpBtI6gOcq7cl4la2DPahJntDelqcLTE';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
