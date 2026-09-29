import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://bhypxtuezgawvnluktvn.supabase.co";

// ⚠️ ให้ก๊อปปี้คีย์จากแถว "anon public" ใน Supabase Dashboard มาแปะลงในเครื่องหมายคำพูดนี้ตรงๆ
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.ey..."; 

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false,
  },
});

export default supabase;