import { Check, X, Printer } from "lucide-react";

export type OrderStatus =
  | "รอการดำเนินงาน"
  | "กำลังพิมพ์"
  | "พิมพ์เสร็จสิ้น"
  | "ยกเลิกการพิมพ์";

type Props = {
  status?: OrderStatus | string;
  isVerified?: boolean | null; // 👈 เพิ่มพร็อพรับค่าการตรวจสลิป
  onUpdateStatus?: (newStatus: OrderStatus) => void;
  disabled?: boolean;
};

export default function OrderActions({
  status,
  isVerified,
  onUpdateStatus,
  disabled,
}: Props) {
  if (status === "รอการดำเนินงาน") {
    // การรับออเดอร์ทำผ่านการกด "ยืนยันสลิปถูกต้อง" ในหน้าตรวจสลิป
    // ปุ่ม "รับออเดอร์" เหลือไว้เฉพาะออเดอร์เก่าที่สลิป verified แล้วแต่ยังค้างรอดำเนินงาน
    const showLegacyAccept = isVerified === true;

    return (
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => onUpdateStatus?.("ยกเลิกการพิมพ์")}
          disabled={disabled}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-600 text-xs font-bold transition-all disabled:opacity-50"
        >
          <X size={14} />
          ปฏิเสธ
        </button>
        {showLegacyAccept && (
          <button
            type="button"
            onClick={() => onUpdateStatus?.("กำลังพิมพ์")}
            disabled={disabled}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-emerald-600 text-white text-xs font-bold transition-all shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Check size={14} />
            รับออเดอร์
          </button>
        )}
      </div>
    );
  }

  if (status === "กำลังพิมพ์") {
    return (
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => onUpdateStatus?.("พิมพ์เสร็จสิ้น")}
          disabled={disabled}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-sm shadow-blue-200 disabled:opacity-50"
        >
          <Printer size={14} />
          พิมพ์เสร็จสิ้น
        </button>
      </div>
    );
  }

  if (status === "พิมพ์เสร็จสิ้น") {
    return (
      <div className="w-full text-center py-2.5 text-xs font-bold text-blue-600 bg-blue-50 rounded-xl">
        ✓ ดำเนินการเสร็จสิ้น
      </div>
    );
  }

  if (status === "ยกเลิกการพิมพ์") {
    return (
      <div className="w-full text-center py-2.5 text-xs font-bold text-slate-400 bg-slate-50 rounded-xl">
        ยกเลิกออเดอร์แล้ว
      </div>
    );
  }

  return null;
}