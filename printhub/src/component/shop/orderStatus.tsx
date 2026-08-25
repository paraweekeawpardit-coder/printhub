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
    <div className="flex flex-wrap gap-3">
      {TABS.map((tab) => {
        const isActive = active === tab;

        return (
          <button
            key={tab}
            onClick={() => onChange(tab)}
            className={`rounded-full border px-5 py-2 text-sm font-medium transition ${
              isActive
                ? "border-sky-300 bg-sky-100 text-sky-700"
                : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
            }`}
          >
            {tab}
          </button>
        );
      })}
    </div>
  );
}