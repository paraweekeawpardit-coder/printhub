import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  process.env.SUPABASE_URL ||
  "https://bhypxtuezgawvnluktvn.supabase.co";

// 🟢 ใส่ Key จริงของคุณลงไปในฟันหนูสำรองข้างล่างนี้ เพื่อป้องกันกรณีอ่านค่าจาก .env ไม่ติด
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJoeXB4dHVlemdhd3ZubHVrdHZuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NDU0MDY3MiwiZXhwIjoyMTAwMTE2NjcyfQ.MvSgNcDyRJwgHGL7c0Ew0OmwbNCgsxozpIdERfAV1Ps"; // 👈 นำ Anon Key ทั้งหมดจากไฟล์ .env มาวางในนี้

export const supabase = createClient(supabaseUrl, supabaseAnonKey);