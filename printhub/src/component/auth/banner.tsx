"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import FadeIn from "./fade-in";

export default function Banner() {
  const router = useRouter();

  const handleGoToCustomer = () => {
    try {
      // เช็ก Token ใน localStorage
      const token =
        localStorage.getItem("token") ||
        localStorage.getItem("customerToken") ||
        localStorage.getItem("access_token");

      if (token) {
        console.log("[Banner] Token found. Navigating to /customer");
        router.push("/customer");
      } else {
        console.log("[Banner] No token found. Redirecting to auth/login");
        // สั่ง navigate ไปที่ /auth/login หรือ /auth ตามโครงสร้าง app/auth/
        router.push("/auth");
      }
    } catch (error) {
      console.error("[Banner] Navigation error:", error);
    }
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#F5F8FF] to-white px-8 pb-24 pt-20">
      {/* soft background depth */}
      <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 top-40 h-80 w-80 rounded-full bg-navy/5 blur-3xl" />

      <div className="relative mx-auto grid max-w-6xl items-center gap-16 lg:grid-cols-2">
        <FadeIn>
          <span className="mb-5 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
            ระบบสั่งพิมพ์งานออนไลน์ สะดวก สะดวกรวดเร็ว
          </span>

          <h1 className="text-4xl font-semibold leading-[1.15] tracking-tight text-navy lg:text-5xl">
            สั่งพิมพ์งานออนไลน์
            <br />
            ครบจบในที่เดียว
          </h1>

          <p className="mt-6 max-w-md text-base leading-relaxed text-gray-500">
            ค้นหาร้านปริ้นใกล้คุณ เช็คราคา อัปโหลดไฟล์
            แล้วนัดเวลารับงานได้ทันที ไม่ต้องยืนรอคิวหน้าร้านอีกต่อไป
          </p>

          <div className="mt-9 flex flex-wrap gap-3">
            <button
              onClick={handleGoToCustomer}
              className="rounded-full bg-navy px-8 py-3.5 text-sm font-medium text-white transition hover:bg-black shadow-lg shadow-navy/20"
            >
              ค้นหาร้านปริ้นใกล้ฉัน
            </button>
          </div>
        </FadeIn>

        <FadeIn delay={0.15}>
          <div className="relative overflow-hidden rounded-3xl shadow-xl shadow-navy/10">
            <Image
              src="/laning.png"
              alt="PrintHub Hero"
              width={650}
              height={450}
              className="h-auto w-full object-cover"
              priority
            />
          </div>
        </FadeIn>
      </div>
    </section>
  );
}