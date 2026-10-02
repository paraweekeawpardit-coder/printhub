"use client";

import React from "react";
import { Plus } from "lucide-react";

export interface OptionItem {
  id: string;
  group_type: string;
  option_name?: string;
  detail?: string;       // รองรับคอลัมน์ detail จาก service_detail
  unit_price?: number;
  price?: number | null; // รองรับคอลัมน์ price จาก service_detail
  category?: string;
}

export interface ServiceType {
  id: string;
  type_name?: string;
  type?: string;          // รองรับคอลัมน์ type จาก service_type
  is_custom_size_allowed?: boolean;
  options?: OptionItem[];
  service_detail?: OptionItem[]; // รองรับชื่อตารางลูก service_detail
}

interface ServiceMenuGridProps {
  services: ServiceType[];
  onSelectService: (service: ServiceType) => void;
}

export default function ServiceMenuGrid({
  services,
  onSelectService,
}: ServiceMenuGridProps) {
  return (
    <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-xs">
      <h2 className="text-sm sm:text-base font-bold text-slate-900 mb-0.5">
        เลือกบริการงานพิมพ์ที่ต้องการ
      </h2>
      <p className="text-xs text-slate-400 mb-4">
        แตะเลือกบริการเพื่อกำหนดสเปก อัปไฟล์ และเพิ่มลงตะกร้า
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {services.map((service) => {
          const serviceName = service.type_name || service.type || "บริการงานพิมพ์";
          const optionCount = service.options?.length ?? service.service_detail?.length ?? 0;

          return (
            <div
              key={service.id}
              onClick={() => onSelectService(service)}
              className="p-4 rounded-2xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50/30 transition cursor-pointer flex items-center justify-between group"
            >
              <div>
                <h3 className="font-bold text-slate-800 text-sm group-hover:text-blue-600 transition">
                  {serviceName}
                </h3>
              </div>
              <div className="w-8 h-8 rounded-full bg-slate-100 group-hover:bg-blue-600 group-hover:text-white flex items-center justify-center transition">
                <Plus className="w-4 h-4" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}