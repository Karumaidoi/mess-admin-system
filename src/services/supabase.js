import { createClient } from '@supabase/supabase-js';

export const supabaseUrl = 'https://oesgkkxyzriaxlhtckgy.supabase.co';

const supabaseKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9lc2dra3h5enJpYXhsaHRja2d5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDU4NDE1MDAsImV4cCI6MjAyMTQxNzUwMH0.4JLxaVHhU9eCn_16vwH4FE3iExhwjEl6sLO53zW9lDU';

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
