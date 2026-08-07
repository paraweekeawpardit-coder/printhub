"use client";

import { Printer, Sparkles, FileText, Image as ImageIcon, FileImage } from "lucide-react";
import { motion } from "framer-motion";

export default function LoginPanel() {
  const badges = [
    { icon: <Sparkles size={18} strokeWidth={1.8} />, label: "AI", pos: "left-10 top-14" },
    { icon: <FileText size={18} strokeWidth={1.8} />, label: "PDF", pos: "right-8 top-16" },
    { icon: <FileImage size={18} strokeWidth={1.8} />, label: "JPG", pos: "left-8 bottom-24" },
    { icon: <ImageIcon size={18} strokeWidth={1.8} />, label: "PSD", pos: "right-10 bottom-20" },
  ];

  return (
    <section className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-navy px-12 py-10 text-white lg:flex">
      {/* Logo */}
      <div className="flex items-center gap-2.5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10">
          <Printer size={16} strokeWidth={2} />
        </div>
        <span className="text-lg font-semibold tracking-tight">PrintHub</span>
      </div>

      {/* Center visual */}
      <div className="relative mx-auto flex h-64 w-64 items-center justify-center">
        <div className="absolute inset-0 rounded-full border border-white/10" />
        <div className="absolute inset-6 rounded-full border border-white/10" />

        {badges.map((b, i) => (
          <motion.div
            key={b.label}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1, y: [0, -6, 0] }}
            transition={{
              opacity: { duration: 0.5, delay: i * 0.1 },
              scale: { duration: 0.5, delay: i * 0.1 },
              y: { duration: 3 + i * 0.4, repeat: Infinity, ease: "easeInOut" },
            }}
            className={`absolute ${b.pos} flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium backdrop-blur-sm`}
          >
            {b.icon}
            {b.label}
          </motion.div>
        ))}

        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm">
          <Printer size={36} strokeWidth={1.5} />
        </div>
      </div>

      {/* Text */}
      <div>
        <h1 className="text-3xl font-semibold leading-tight tracking-tight">
          สั่งพิมพ์งานออนไลน์
          <br />
          ครบจบในที่เดียว
        </h1>
        <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/60">
          ค้นหาร้านปริ้นใกล้คุณ เช็คราคา อัปโหลดไฟล์ แล้วนัดเวลารับงานได้ทันที
        </p>
      </div>
    </section>
  );
}