"use client";

import { Plus, Trash2, Lock } from "lucide-react";

export type ServiceDetailRow = {
  id?: string;
  detail: string;
  price: string;
};

export type OptionGroup = {
  group_name: string;
  items: ServiceDetailRow[];
};

export type ServiceTypeGroup = {
  id?: string;
  type: string;
  groups: OptionGroup[];
};

type Props = {
  isVerified: boolean;
  services: ServiceTypeGroup[];
  setServices: React.Dispatch<React.SetStateAction<ServiceTypeGroup[]>>;
  onSave: () => void;
  saving: boolean;
};

export default function ShopServicesTab({
  isVerified,
  services,
  setServices,
  onSave,
  saving,
}: Props) {
  // เพิ่มประเภทบริการหลัก เช่น "เอกสาร"
  const addServiceType = () => {
    setServices((prev) => [
      ...prev,
      {
        type: "",
        groups: [
          {
            group_name: "ตัวเลือกทั่วไป",
            items: [{ detail: "", price: "" }],
          },
        ],
      },
    ]);
  };

  const removeServiceType = (index: number) => {
    setServices((prev) => prev.filter((_, i) => i !== index));
  };

  const updateServiceType = (index: number, type: string) => {
    setServices((prev) =>
      prev.map((g, i) => (i === index ? { ...g, type } : g))
    );
  };

  // เพิ่ม Group ตัวเลือกย่อย เช่น "ขนาดกระดาษ"
  const addOptionGroup = (typeIndex: number) => {
    setServices((prev) =>
      prev.map((s, idx) => {
        if (idx !== typeIndex) return s;
        return {
          ...s,
          groups: [
            ...s.groups,
            { group_name: "", items: [{ detail: "", price: "" }] },
          ],
        };
      })
    );
  };

  const removeOptionGroup = (typeIdx: number, groupIdx: number) => {
    setServices((prev) =>
      prev.map((s, tI) => {
        if (tI !== typeIdx) return s;
        return {
          ...s,
          groups: s.groups.filter((_, gI) => gI !== groupIdx),
        };
      })
    );
  };

  const updateGroupName = (typeIdx: number, groupIdx: number, name: string) => {
    setServices((prev) =>
      prev.map((s, tI) => {
        if (tI !== typeIdx) return s;
        return {
          ...s,
          groups: s.groups.map((g, gI) =>
            gI === groupIdx ? { ...g, group_name: name } : g
          ),
        };
      })
    );
  };

  // เพิ่มตัวเลือกย่อยใน Group
  const addRow = (typeIndex: number, groupIndex: number) => {
    setServices((prev) =>
      prev.map((s, tIdx) => {
        if (tIdx !== typeIndex) return s;
        return {
          ...s,
          groups: s.groups.map((g, gIdx) => {
            if (gIdx !== groupIndex) return g;
            return {
              ...g,
              items: [...g.items, { detail: "", price: "" }],
            };
          }),
        };
      })
    );
  };

  const removeRow = (typeIdx: number, groupIdx: number, itemIdx: number) => {
    setServices((prev) =>
      prev.map((s, tI) => {
        if (tI !== typeIdx) return s;
        return {
          ...s,
          groups: s.groups.map((g, gI) => {
            if (gI !== groupIdx) return g;
            return {
              ...g,
              items: g.items.filter((_, rI) => rI !== itemIdx),
            };
          }),
        };
      })
    );
  };

  const updateRow = (
    typeIdx: number,
    groupIdx: number,
    itemIdx: number,
    field: keyof ServiceDetailRow,
    value: string
  ) => {
    setServices((prev) =>
      prev.map((s, tI) => {
        if (tI !== typeIdx) return s;
        return {
          ...s,
          groups: s.groups.map((g, gI) => {
            if (gI !== groupIdx) return g;
            return {
              ...g,
              items: g.items.map((item, rI) =>
                rI === itemIdx ? { ...item, [field]: value } : item
              ),
            };
          }),
        };
      })
    );
  };

  return (
    <div className="relative">
      <div
        className={`space-y-6 ${
          !isVerified ? "pointer-events-none blur-[2px] select-none" : ""
        }`}
      >
        {services.map((service, tIdx) => (
          <div
            key={service.id || tIdx}
            className="space-y-6 rounded-2xl border border-gray-200 bg-white p-6"
          >
            {/* Header: ชื่อประเภทบริการหลัก */}
            <div className="flex items-center justify-between gap-3 border-b border-gray-100 pb-4">
              <input
                value={service.type}
                onChange={(e) => updateServiceType(tIdx, e.target.value)}
                placeholder="ชื่อบริการหลัก (เช่น พิมพ์เอกสาร, เข้าเล่ม)"
                className="w-full text-base font-semibold text-gray-900 outline-none placeholder:text-gray-300"
              />
              <button
                type="button"
                onClick={() => removeServiceType(tIdx)}
                className="p-1 text-gray-300 transition-colors hover:text-red-500"
              >
                <Trash2 size={18} />
              </button>
            </div>

            {/* List ของ Option Groups (เช่น ขนาดกระดาษ, สี, การพิมพ์) */}
            <div className="space-y-4">
              {service.groups.map((group, gIdx) => (
                <div
                  key={gIdx}
                  className="space-y-3 rounded-xl border border-gray-100 bg-gray-50/60 p-4"
                >
                  <div className="flex items-center justify-between gap-2 border-b border-gray-200 pb-2">
                    <input
                      value={group.group_name}
                      onChange={(e) => updateGroupName(tIdx, gIdx, e.target.value)}
                      placeholder="หัวข้อกลุ่มตัวเลือก (เช่น ขนาดกระดาษ, สี, การพิมพ์)"
                      className="w-full bg-transparent text-sm font-semibold text-gray-900 outline-none placeholder:text-gray-400"
                    />
                    <button
                      type="button"
                      onClick={() => removeOptionGroup(tIdx, gIdx)}
                      className="text-gray-300 transition-colors hover:text-red-500"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  {/* ตัวเลือกราคาภายในกลุ่ม */}
                  <div className="space-y-2">
                    {group.items.map((item, iIdx) => (
                      <div key={item.id || iIdx} className="flex items-center gap-2">
                        <input
                          value={item.detail}
                          onChange={(e) =>
                            updateRow(tIdx, gIdx, iIdx, "detail", e.target.value)
                          }
                          placeholder="รายละเอียด (เช่น A4, ขาวดำ, หน้าเดียว)"
                          className="flex-1 rounded-lg border border-gray-200 bg-white px-3.5 py-2 text-sm text-gray-900 outline-none transition-colors focus:border-blue-400 focus:ring-2 focus:ring-blue-500/15"
                        />
                        <div className="flex w-32 items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-2 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-500/15">
                          <input
                            value={item.price}
                            onChange={(e) =>
                              updateRow(tIdx, gIdx, iIdx, "price", e.target.value)
                            }
                            placeholder="0"
                            className="w-full text-right text-sm font-semibold text-gray-900 outline-none"
                          />
                          <span className="text-xs text-gray-400">บาท</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeRow(tIdx, gIdx, iIdx)}
                          className="p-1.5 text-gray-300 transition-colors hover:text-red-500"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => addRow(tIdx, gIdx)}
                    className="flex items-center gap-1 pt-1 text-xs font-medium text-blue-500 hover:underline"
                  >
                    <Plus size={14} /> เพิ่มรายการในกลุ่มนี้
                  </button>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => addOptionGroup(tIdx)}
              className="flex w-full items-center justify-center gap-1 rounded-xl border border-dashed border-gray-300 py-2.5 text-xs font-medium text-gray-500 transition-colors hover:border-gray-400 hover:text-gray-700"
            >
              <Plus size={14} /> เพิ่มกลุ่มรายละเอียดข้อมูล (เช่น ขนาดกระดาษ, สี)
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={addServiceType}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-300 py-3 text-sm font-semibold text-gray-900 transition-colors hover:bg-gray-50"
        >
          <Plus size={16} /> เพิ่มประเภทบริการหลัก
        </button>

        <div className="flex justify-end border-t border-gray-100 pt-4">
          <button
            onClick={onSave}
            disabled={saving}
            className="rounded-lg bg-blue-500 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-600 disabled:opacity-50"
          >
            {saving ? "กำลังบันทึก..." : "บันทึกบริการพิมพ์"}
          </button>
        </div>
      </div>

      {!isVerified && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-2xl bg-white/70 backdrop-blur-xs">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-400">
            <Lock size={20} />
          </div>
          <p className="px-6 text-center text-sm font-semibold text-gray-900">
            คุณจะสามารถแก้ไขบริการพิมพ์ได้ เมื่อผ่านการยืนยันตัวตนจากผู้ดูแลระบบแล้ว
          </p>
        </div>
      )}
    </div>
  );
}