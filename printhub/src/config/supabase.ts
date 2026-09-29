import { createClient } from "@supabase/supabase-js";

// แก้ไขตัว z เป็นตัว r (bhypxtuergawvnluktvn)
const supabaseUrl = "https://bhypxtuezgawvnluktvn.supabase.co";

const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJoeXB4dHVlemdhd3ZubHVrdHZuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NDU0MDY3MiwiZXhwIjoyMTAwMTE2NjcyfQ.MvSgNcDyRJwgHGL7c0Ew0OmwbNCgsxozpIdERfAV1Ps"; 

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false,
  },
});

export default supabase;