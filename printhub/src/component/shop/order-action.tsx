import { useState } from "react";
import { Check, X } from "lucide-react";
import axios from "axios";

type Props = {
  status?: string;
  orderId?: string; // ✅ เพิ่ม orderId
  onStatusChange?: () => void; // ✅ เพิ่ม onStatusChange
  onUpdateStatus?: (newStatus: string) => void;
  disabled?: boolean;
};

export default function OrderActions({
  status,
  orderId,
  onStatusChange,
  onUpdateStatus,
  disabled,
}: Props) {
  const [loading, setLoading] = useState(false);

  // ฟังก์ชันยิง API อัปเดตสถานะ เมื่อกดปุ่ม
  const handleUpdateStatus = async (newStatus: string) => {
    if (onUpdateStatus) {
      onUpdateStatus(newStatus);
      return;
    }

    if (!orderId) return;

    try {
      setLoading(true);
      const shopId = localStorage.getItem("shop_id") || localStorage.getItem("id") || "";
      const token = localStorage.getItem("token") || "";

      await axios.put(
        `http://localhost:5000/shop/updateOrderStatus`,
        {
          order_id: orderId,
          status: newStatus,
        },
        {
          headers: {
            shop_id: shopId,
            "shop-id": shopId,
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        }
      );

      // เรียก callback เพื่อโหลดข้อมูลหน้าการ์ดใหม่ทันที
      if (onStatusChange) {
        onStatusChange();
      }
    } catch (error) {
      console.error("Update status error:", error);
      alert("เกิดข้อผิดพลาดในการอัปเดตสถานะ");
    } finally {
      setLoading(false);
    }
  };

  const isBtnDisabled = disabled || loading;

  if (status === "รอการดำเนินงาน" || status === "รอดำเนินการ" || status === "Pending") {
    return (
      <div className="flex gap-3 mt-6">
        <button
          onClick={() => handleUpdateStatus("กำลังพิมพ์")}
          disabled={isBtnDisabled}
          className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg border border-emerald-200 text-emerald-600 text-sm font-medium hover:bg-emerald-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          <Check size={16} />
          รับออเดอร์
        </button>
        <button
          onClick={() => handleUpdateStatus("ยกเลิกการพิมพ์")}
          disabled={isBtnDisabled}
          className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg border border-rose-200 text-rose-500 text-sm font-medium hover:bg-rose-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          <X size={16} />
          ปฏิเสธ
        </button>
      </div>
    );
  }

  if (status === "กำลังพิมพ์" || status === "In Progress") {
    return (
      <div className="flex gap-3 mt-6">
        <button
          onClick={() => handleUpdateStatus("พิมพ์เสร็จสิ้น")}
          disabled={isBtnDisabled}
          className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg border border-emerald-200 text-emerald-600 text-sm font-medium hover:bg-emerald-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          <Check size={16} />
          พิมพ์เสร็จสิ้น
        </button>
        <button
          onClick={() => handleUpdateStatus("ยกเลิกการพิมพ์")}
          disabled={isBtnDisabled}
          className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg border border-rose-200 text-rose-500 text-sm font-medium hover:bg-rose-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          <X size={16} />
          ยกเลิก
        </button>
      </div>
    );
  }

  if (status === "พิมพ์เสร็จสิ้น" || status === "Completed") {
    return (
      <div className="w-full flex items-center justify-center gap-1.5 mt-6 px-4 py-2.5 rounded-lg border border-emerald-200 text-emerald-500 text-sm font-medium">
        <Check size={16} />
        เสร็จสิ้น
      </div>
    );
  }

  if (status === "ยกเลิกการพิมพ์" || status === "ยกเลิก" || status === "Cancelled") {
    return (
      <div className="w-full flex items-center justify-center gap-1.5 mt-6 px-4 py-2.5 rounded-lg border border-rose-200 text-rose-500 text-sm font-medium">
        <X size={16} />
        ยกเลิกแล้ว
      </div>
    );
  }

  return null;
}