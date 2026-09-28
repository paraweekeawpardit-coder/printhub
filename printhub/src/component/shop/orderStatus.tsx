"use client";

export type OrderStatusFilter =
  | "ทั้งหมด"
  | "รอการดำเนินงาน"
  | "กำลังพิมพ์"
  | "พิมพ์เสร็จสิ้น"
  | "ยกเลิกการพิมพ์";

const TABS: OrderStatusFilter[] = [
  "ทั้งหมด",
  "รอการดำเนินงาน",
  "กำลังพิมพ์",
  "พิมพ์เสร็จสิ้น",
  "ยกเลิกการพิมพ์",
];

interface OrderStatusTabsProps {
  active: OrderStatusFilter;
  onChange: (value: OrderStatusFilter) => void;
}

export default function OrderStatusTabs({
  active,
  onChange,
}: OrderStatusTabsProps) {
  return (
    <div className="flex flex-wrap gap-2 p-1.5 bg-slate-200/50 backdrop-blur-md rounded-2xl w-fit">
      {TABS.map((tab) => {
        const isActive = active === tab;

        return (
          <button
            key={tab}
            onClick={() => onChange(tab)}
            className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all duration-200 ${
              isActive
                ? "bg-white text-slate-900 shadow-sm shadow-slate-200"
                : "text-slate-500 hover:text-slate-900 hover:bg-white/50"
            }`}
          >
            {tab}
          </button>
        );
      })}
    </div>
  );
}