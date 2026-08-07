"use client";

import StepCard from "./stepcrad";
import FadeIn from "./fade-in";
import { Search, FileText, Store } from "lucide-react";

export default function Steps() {
  const steps = [
    {
      icon: <Search size={26} strokeWidth={1.8} />,
      title: "ค้นหาร้านปริ้นใกล้ฉัน",
      desc: "เลือกร้าน เช็คราคา และรีวิวก่อนตัดสินใจ",
    },
    {
      icon: <FileText size={26} strokeWidth={1.8} />,
      title: "แนบไฟล์ & ชำระเงิน",
      desc: "อัปโหลด PDF หรือรูปภาพได้ง่ายๆ ในไม่กี่คลิก",
    },
    {
      icon: <Store size={26} strokeWidth={1.8} />,
      title: "รับงานที่หน้าร้าน",
      desc: "เลือกเวลานัดรับได้ทันที ไม่ต้องรอคิว",
    },
  ];

  return (
    <section className="bg-[#FAFAFA] py-28">
      <FadeIn>
        <h2 className="mx-auto max-w-2xl px-8 text-center text-3xl font-semibold tracking-tight text-navy">
          สั่งพิมพ์งานง่ายๆ ใน 3 ขั้นตอน
        </h2>
      </FadeIn>

      <div className="mx-auto mt-16 grid max-w-5xl gap-6 px-8 md:grid-cols-3">
        {steps.map((s, i) => (
          <FadeIn key={s.title} delay={i * 0.12}>
            <StepCard {...s} />
          </FadeIn>
        ))}
      </div>
    </section>
  );
}