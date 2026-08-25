import { Check, X } from "lucide-react";

type Props = {
  status?: string;
  onUpdateStatus?: (newStatus: string) => void;
  disabled?: boolean;
};

export default function OrderActions({
  status,
  onUpdateStatus,
  disabled,
}: Props) {
  // NOTE: matched against the `status` table's actual values
  // (พิมพ์เสร็จสิ้น / รอการดำเนินงาน / ยกเลิกการพิมพ์ / กำลังพิมพ์).
  // "กำลังดำเนินการ" never matched any real row before this fix.
  if (status === "รอการดำเนินงาน") {
    return (
      <div className="flex gap-3 mt-6">
        <button
          onClick={() => onUpdateStatus?.("กำลังพิมพ์")}
          disabled={disabled}
          className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg border border-emerald-200 text-emerald-600 text-sm font-medium hover:bg-emerald-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Check size={16} />
          รับออเดอร์
        </button>
        <button
          onClick={() => onUpdateStatus?.("ยกเลิกการพิมพ์")}
          disabled={disabled}
          className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg border border-rose-200 text-rose-500 text-sm font-medium hover:bg-rose-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <X size={16} />
          ปฏิเสธ
        </button>
      </div>
    );
  }

  if (status === "กำลังพิมพ์") {
    return (
      <button
        onClick={() => onUpdateStatus?.("ยกเลิกการพิมพ์")}
        disabled={disabled}
        className="w-full flex items-center justify-center gap-1.5 mt-6 px-4 py-2.5 rounded-lg border border-rose-200 text-rose-500 text-sm font-medium hover:bg-rose-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <X size={16} />
        ปฏิเสธ
      </button>
    );
  }

  if (status === "พิมพ์เสร็จสิ้น") {
    // terminal state — not an action, just a status indicator
    return (
      <div className="w-full flex items-center justify-center gap-1.5 mt-6 px-4 py-2.5 rounded-lg border border-emerald-200 text-emerald-500 text-sm font-medium">
        <Check size={16} />
        เสร็จสิ้น
      </div>
    );
  }

  if (status === "ยกเลิกการพิมพ์") {
    return (
      <div className="w-full flex items-center justify-center gap-1.5 mt-6 px-4 py-2.5 rounded-lg border border-rose-200 text-rose-500 text-sm font-medium">
        <X size={16} />
        ยกเลิกแล้ว
      </div>
    );
  }

  return null;
}