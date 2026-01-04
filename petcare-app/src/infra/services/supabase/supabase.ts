import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zbqqpclvfnyqfhbfyyem.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpicXFwY2x2Zm55cWZoYmZ5eWVtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYwMDg3NzksImV4cCI6MjA4MTU4NDc3OX0.z0jeEJr0N9ugaKm7_s_r3y10c3poU3J_F02lvgg-Zco';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);