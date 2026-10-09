"use client";

import { useCallback, useState } from "react";
import dynamic from "next/dynamic";
import { MapPin, Loader2, X } from "lucide-react";

// Leaflet ใช้ window → ต้องปิด SSR
const LocationPicker = dynamic(() => import("./Shoploactionpicker"), {
  ssr: false,
  loading: () => (
    <div
      style={{ height: 380 }}
      className="flex items-center justify-center bg-slate-50 text-sm text-slate-400"
    >
      กำลังโหลดแผนที่...
    </div>
  ),
});

type Coords = { lat: number; lng: number };

type Props = {
  /** พิกัดเดิมของร้าน (null = ยังไม่เคยปักหมุด) */
  initialLocation: Coords | null;
  saving: boolean;
  onConfirm: (loc: Coords) => void;
  onCancel: () => void;
};

export default function ShopLocationConfirmModal({
  initialLocation,
  saving,
  onConfirm,
  onCancel,
}: Props) {
  // ask  = ถามว่าบริเวณนี้ใช่ที่อยู่ร้านไหม (หมุดอยู่ที่พิกัดเดิม)
  // pick = ให้ปักหมุดใหม่ (ลาก / แตะ / ค้นหา)
  const [stage, setStage] = useState<"ask" | "pick">(
    initialLocation ? "ask" : "pick"
  );
  const [selected, setSelected] = useState<Coords | null>(initialLocation);

  // ผู้ใช้ลาก/แตะ/ค้นหา = กำลังปักหมุดใหม่ → สลับเป็นโหมด pick อัตโนมัติ
  const handleChange = useCallback((pos: Coords) => {
    setSelected(pos);
    setStage("pick");
  }, []);

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-slate-900/50 p-4">
      <div className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-6 py-4">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#EAF1FF] text-[#2F6FED]">
              <MapPin size={18} />
            </div>
            <div>
              <p className="text-sm font-bold text-[#0F2942]">
                {stage === "ask"
                  ? "บริเวณนี้คือที่อยู่ร้านของคุณใช่หรือไม่?"
                  : "ปักหมุดตำแหน่งร้านของคุณ"}
              </p>
              <p className="mt-0.5 text-xs text-slate-400">
                {stage === "ask"
                  ? "คุณเพิ่งแก้ไขที่อยู่ ตรวจสอบว่าหมุดอยู่ตรงกับร้านของคุณ"
                  : "ลากหมุด แตะบนแผนที่ หรือค้นหาสถานที่ แล้วกดยืนยัน"}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onCancel}
            disabled={saving}
            aria-label="ปิด"
            className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-50 hover:text-slate-600 disabled:opacity-50"
          >
            <X size={18} />
          </button>
        </div>

        <LocationPicker
          initialPosition={initialLocation}
          onChange={handleChange}
          height={380}
        />

        <div className="flex justify-end gap-3 border-t border-slate-100 px-6 py-4">
          {stage === "ask" ? (
            <>
              <button
                type="button"
                onClick={() => setStage("pick")}
                disabled={saving}
                className="rounded-xl border border-slate-200 px-6 py-2.5 text-sm font-semibold text-slate-600 transition-colors hover:border-slate-300 disabled:opacity-50"
              >
                ไม่ใช่ ปักหมุดใหม่
              </button>
              <button
                type="button"
                onClick={() => selected && onConfirm(selected)}
                disabled={saving || !selected}
                className="flex items-center gap-2 rounded-xl bg-[#0F2942] px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#16385c] disabled:opacity-50"
              >
                {saving && <Loader2 size={15} className="animate-spin" />}
                {saving ? "กำลังบันทึก..." : "ใช่ ใช้ตำแหน่งนี้"}
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={onCancel}
                disabled={saving}
                className="rounded-xl border border-slate-200 px-6 py-2.5 text-sm font-semibold text-slate-500 transition-colors hover:border-slate-300 disabled:opacity-50"
              >
                ยกเลิก
              </button>
              <button
                type="button"
                onClick={() => selected && onConfirm(selected)}
                disabled={saving || !selected}
                className="flex items-center gap-2 rounded-xl bg-[#0F2942] px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#16385c] disabled:opacity-50"
              >
                {saving && <Loader2 size={15} className="animate-spin" />}
                {saving ? "กำลังบันทึก..." : "ยืนยันตำแหน่งนี้และบันทึก"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}