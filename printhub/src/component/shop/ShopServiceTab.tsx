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
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-6"
          >
            {/* Header: ชื่อประเภทบริการหลัก */}
            <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <input
                value={service.type}
                onChange={(e) => updateServiceType(tIdx, e.target.value)}
                placeholder="ชื่อบริการหลัก (เช่น พิมพ์เอกสาร, เข้าเล่ม)"
                className="text-base font-bold text-[#0F2942] outline-none placeholder:text-slate-300 w-full"
              />
              <button
                type="button"
                onClick={() => removeServiceType(tIdx)}
                className="text-slate-400 hover:text-rose-500 transition-colors p-1"
              >
                <Trash2 size={18} />
              </button>
            </div>

            {/* List ของ Option Groups (เช่น ขนาดกระดาษ, สี, การพิมพ์) */}
            <div className="space-y-4">
              {service.groups.map((group, gIdx) => (
                <div
                  key={gIdx}
                  className="rounded-xl border border-slate-200 bg-slate-50/60 p-4 space-y-3"
                >
                  <div className="flex items-center justify-between gap-2 border-b border-slate-200 pb-2">
                    <input
                      value={group.group_name}
                      onChange={(e) => updateGroupName(tIdx, gIdx, e.target.value)}
                      placeholder="หัวข้อกลุ่มตัวเลือก (เช่น ขนาดกระดาษ, สี, การพิมพ์)"
                      className="font-bold text-sm text-[#0F2942] bg-transparent outline-none w-full placeholder:text-slate-400"
                    />
                    <button
                      type="button"
                      onClick={() => removeOptionGroup(tIdx, gIdx)}
                      className="text-slate-400 hover:text-rose-500 transition-colors"
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
                          className="flex-1 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm text-[#0F2942] outline-none focus:border-[#2F6FED]"
                        />
                        <div className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 w-32">
                          <input
                            value={item.price}
                            onChange={(e) =>
                              updateRow(tIdx, gIdx, iIdx, "price", e.target.value)
                            }
                            placeholder="0"
                            className="w-full text-right text-sm font-semibold text-[#0F2942] outline-none"
                          />
                          <span className="text-xs text-slate-400">บาท</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeRow(tIdx, gIdx, iIdx)}
                          className="p-1.5 text-slate-400 hover:text-rose-500 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => addRow(tIdx, gIdx)}
                    className="flex items-center gap-1 text-xs font-semibold text-[#2F6FED] hover:underline pt-1"
                  >
                    <Plus size={14} /> เพิ่มรายการในกลุ่มนี้
                  </button>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => addOptionGroup(tIdx)}
              className="w-full py-2.5 border border-dashed border-slate-300 rounded-xl text-xs font-semibold text-slate-600 hover:border-[#0F2942] hover:text-[#0F2942] transition-colors flex items-center justify-center gap-1"
            >
              <Plus size={14} /> เพิ่มกลุ่มรายละเอียดข้อมูล (เช่น ขนาดกระดาษ, สี)
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={addServiceType}
          className="flex items-center justify-center gap-2 w-full py-3 border border-slate-300 rounded-xl text-sm font-bold text-[#0F2942] hover:bg-slate-50 transition-colors"
        >
          <Plus size={16} /> เพิ่มประเภทบริการหลัก
        </button>

        <div className="flex justify-end pt-4 border-t border-slate-100">
          <button
            onClick={onSave}
            disabled={saving}
            className="rounded-xl bg-[#0F2942] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#16385c] transition-colors disabled:opacity-50"
          >
            {saving ? "กำลังบันทึก..." : "บันทึกบริการพิมพ์"}
          </button>
        </div>
      </div>

      {!isVerified && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-2xl bg-white/70 backdrop-blur-xs">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
            <Lock size={20} />
          </div>
          <p className="text-sm font-bold text-[#0F2942] text-center px-6">
            คุณจะสามารถแก้ไขบริการพิมพ์ได้ เมื่อผ่านการยืนยันตัวตนจากผู้ดูแลระบบแล้ว
          </p>
        </div>
      )}
    </div>
  );
}