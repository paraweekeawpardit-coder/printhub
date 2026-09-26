"use client";

import Image from "next/image";
import FadeIn from "./fade-in";
import laning from "@/public/laning.png";

export default function Banner() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#F5F8FF] to-white px-8 pb-24 pt-20">
      {/* soft background depth — replaces flat white */}
      <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 top-40 h-80 w-80 rounded-full bg-navy/5 blur-3xl" />

      <div className="relative mx-auto grid max-w-6xl items-center gap-16 lg:grid-cols-2">
        <FadeIn>
          <span className="mb-5 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
            บริการปริ้นออนไลน์ อันดับ 1
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
            <button className="rounded-full bg-navy px-7 py-3 text-sm font-medium text-white transition hover:bg-black">
              ค้นหาร้านปริ้นใกล้ฉัน
            </button>
            <button className="rounded-full border border-gray-200 bg-white px-7 py-3 text-sm font-medium text-navy transition hover:border-gray-300 hover:bg-gray-50">
              เริ่มสั่งพิมพ์งาน
            </button>
          </div>
        </FadeIn>

        <FadeIn delay={0.15}>
          <div className="relative overflow-hidden rounded-3xl shadow-xl shadow-navy/10">
            <Image
              src={laning}
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