import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 🌟 เพิ่มบล็อก env ตรงนี้
  env: {
    NEXT_PUBLIC_SUPABASE_URL: "https://bhypxtuezgawvnluktvn.supabase.co",
    NEXT_PUBLIC_SUPABASE_ANON_KEY:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJoeXB4dHVlemdhd3ZubHVrdHZuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAxNTMwNzUsImV4cCI6MjA1NTcyOTA3NX0.ZubHvrdHZuk1yQ_8Hk-Qe7V18i0e11YcI0PcqhW-W_A",
  },
};

export default nextConfig;