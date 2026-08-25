import Image from "next/image";
import { Check, X, Printer, Clock } from "lucide-react";
import { useState } from "react";
import axios from "axios";

type Order = {
  id: string;
  customer_id: string;
  shop_id: string;
  description: string | null;
  order_date: string;
  total_price: number;
  customer?: {
    first_name: string;
    last_name: string;
  };
  work_status?: {
    updated_at: string;
    status: {
      state: string;
    };
  }[];
};

type Props = {
  order: Order;
  onClick?: () => void;
  onUpdateStatus?: (orderId: string, newStatus: string) => void;
};

export default function OrderCard({ order, onClick, onUpdateStatus }: Props) {
  const sortedStatus = order.work_status
    ? [...order.work_status].sort(
        (a, b) =>
          new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
      )
    : [];

  const [currentState, setCurrentState] = useState(
    sortedStatus[0]?.status?.state
  );

  async function updateState(newStatus: string) {
    try {
      const res = await axios.post("http://localhost:5000/shop/updateStatus", {
        order_id: order.id,
        status_name: newStatus,
      });

      if (res.data) {
        setCurrentState(newStatus);
        onUpdateStatus?.(order.id, newStatus);
        console.log("update success");
      }
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div
      onClick={onClick}
      className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow cursor-pointer flex flex-col justify-between"
    >
      <div>
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-[#0F2942]">
              Order #{order.id.slice(0, 8)}
            </h3>
            <p className="text-slate-400 text-xs mt-0.5">
              {new Date(order.order_date).toLocaleDateString("th-TH")}
            </p>
          </div>

          <Image
            src="/avatar.png"
            alt=""
            width={38}
            height={38}
            className="rounded-full border border-slate-200 object-cover"
          />
        </div>

        <div className="space-y-4 mt-5">
          <div className="flex gap-3 items-center">
            <Image
              src="/paper.png"
              alt=""
              width={52}
              height={52}
              className="rounded-lg border border-slate-100 object-cover"
            />

            <div className="flex-1 min-w-0">
              <p className="font-medium text-[#0F2942] text-sm truncate">
                {order.customer
                  ? `${order.customer.first_name} ${order.customer.last_name}`
                  : "ลูกค้า"}
              </p>
              <p className="text-xs text-slate-400 truncate">
                {order.description || "ไม่มีรายละเอียดเพิ่มเติม"}
              </p>
            </div>

            <span className="text-xs text-slate-400 whitespace-nowrap">
              {order.total_price} บาท
            </span>
          </div>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-slate-100 flex justify-between items-center gap-2">
        <span
          className={`text-xs font-medium px-2.5 py-1 rounded-full whitespace-nowrap shrink-0 ${
            currentState === "รอการดำเนินงาน"
              ? "bg-amber-50 text-amber-600 border border-amber-200"
              : currentState === "กำลังพิมพ์"
              ? "bg-blue-50 text-blue-600 border border-blue-200"
              : currentState === "พิมพ์เสร็จสิ้น"
              ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
              : currentState === "ยกเลิกการพิมพ์"
              ? "bg-rose-50 text-rose-600 border border-rose-200"
              : "bg-slate-50 text-slate-500 border border-slate-200"
          }`}
        >
          {currentState || "ไม่ทราบสถานะ"}
        </span>

        {currentState === "รอการดำเนินงาน" && (
          <div
            className="flex gap-2 shrink-0"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => updateState("ยกเลิกการพิมพ์")}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-rose-200 text-rose-500 text-xs font-medium hover:bg-rose-50 transition-colors whitespace-nowrap"
              title="ยกเลิกการพิมพ์"
            >
              <X size={14} />
              ปฏิเสธ
            </button>
            <button
              onClick={() => updateState("กำลังพิมพ์")}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-emerald-200 text-emerald-500 text-xs font-medium hover:bg-emerald-50 transition-colors whitespace-nowrap"
              title="เริ่มพิมพ์"
            >
              <Check size={14} />
              ยืนยัน
            </button>
          </div>
        )}

        {currentState === "กำลังพิมพ์" && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              updateState("พิมพ์เสร็จสิ้น");
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-blue-200 text-blue-600 text-xs font-medium hover:bg-blue-50 transition-colors whitespace-nowrap shrink-0"
          >
            <Printer size={14} />
            พิมพ์เสร็จสิ้น
          </button>
        )}

        {currentState === "พิมพ์เสร็จสิ้น" && (
          <div className="flex items-center gap-1 text-emerald-500 text-xs font-medium shrink-0">
            <Check size={14} />
            เสร็จสิ้น
          </div>
        )}

        {currentState === "ยกเลิกการพิมพ์" && (
          <div className="flex items-center gap-1 text-rose-500 text-xs font-medium shrink-0">
            <X size={14} />
            ยกเลิกแล้ว
          </div>
        )}
      </div>
    </div>
  );
}