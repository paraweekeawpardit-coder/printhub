"use client";

import { useState } from "react";
import { Plus, Trash2, Lock, Tag, Edit2, Check, X, Printer } from "lucide-react";

export type ServiceDetailRow = {
  id?: number | string;
  detail: string;
  group_type: string;
  price: string;
};

export type ServiceTypeGroup = {
  id?: number | string;
  type: string;
  items: ServiceDetailRow[];
};

type Props = {
  isVerified: boolean;
  services: ServiceTypeGroup[];
  setServices: React.Dispatch<React.SetStateAction<ServiceTypeGroup[]>>;
  onSave: () => void;
  saving: boolean;
};

type GroupedRows = {
  name: string;
  rows: { row: ServiceDetailRow; idx: number }[];
};

// ==========================================
// เทมเพลตประเภทบริการที่เว็บมีให้เลือก
// ==========================================
// รายการนี้เป็นแค่ตัวช่วยกรอกข้อมูลให้ร้านค้าเลือกจาก dropdown
// (ยังไม่มีตารางในฐานข้อมูลรองรับ "เทมเพลต" จริงๆ) ถ้าไม่มีตัวไหนตรง
// ร้านค้าเลือก "อื่นๆ (กำหนดเอง)" แล้วพิมพ์เองได้เหมือนเดิม
const SERVICE_TYPE_TEMPLATES = [
  "พิมพ์เอกสาร / รายงาน",
  "งานเข้าเล่ม",
  "พิมพ์โปสเตอร์",
  "นามบัตร",
  "สติกเกอร์",
  "พิมพ์ภาพถ่าย",
  "ป้ายไวนิล",
  "งานเสื้อ / ของพรีเมียม",
];

const OTHER_OPTION = "__other__";

const groupItems = (items: ServiceDetailRow[]): GroupedRows[] => {
  const groups: GroupedRows[] = [];
  items.forEach((row, idx) => {
    const name = row.group_type || "";
    let group = groups.find((g) => g.name === name);
    if (!group) {
      group = { name, rows: [] };
      groups.push(group);
    }
    group.rows.push({ row, idx });
  });
  return groups;
};

export default function ShopServicesTab({
  isVerified,
  services,
  setServices,
  onSave,
  saving,
}: Props) {
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const addServiceType = () => {
    setServices((prev) => [
      ...prev,
      { type: "", items: [{ detail: "", group_type: "", price: "" }] },
    ]);
  };

  const removeServiceType = (index: number) => {
    setServices((prev) => prev.filter((_, i) => i !== index));
  };

  const updateServiceType = (index: number, type: string) => {
    setServices((prev) => prev.map((g, i) => (i === index ? { ...g, type } : g)));
  };

  const renameGroup = (groupIndex: number, oldName: string, newName: string) => {
    setServices((prev) =>
      prev.map((g, i) =>
        i === groupIndex
          ? {
              ...g,
              items: g.items.map((r) =>
                r.group_type === oldName ? { ...r, group_type: newName } : r
              ),
            }
          : g
      )
    );
  };

  const addRowToGroup = (groupIndex: number, groupName: string) => {
    setServices((prev) =>
      prev.map((g, i) =>
        i === groupIndex
          ? { ...g, items: [...g.items, { detail: "", group_type: groupName, price: "" }] }
          : g
      )
    );
  };

  const addNewGroup = (groupIndex: number) => {
    setServices((prev) =>
      prev.map((g, i) =>
        i === groupIndex
          ? { ...g, items: [...g.items, { detail: "", group_type: "", price: "" }] }
          : g
      )
    );
  };

  const removeGroup = (groupIndex: number, groupName: string) => {
    setServices((prev) =>
      prev.map((g, i) =>
        i === groupIndex
          ? { ...g, items: g.items.filter((r) => r.group_type !== groupName) }
          : g
      )
    );
  };

  const removeRow = (groupIndex: number, rowIdx: number) => {
    setServices((prev) =>
      prev.map((g, i) =>
        i === groupIndex ? { ...g, items: g.items.filter((_, rI) => rI !== rowIdx) } : g
      )
    );
  };

  const updateRow = (
    groupIndex: number,
    rowIdx: number,
    field: "detail" | "price",
    value: string
  ) => {
    setServices((prev) =>
      prev.map((g, i) =>
        i === groupIndex
          ? {
              ...g,
              items: g.items.map((r, rI) => (rI === rowIdx ? { ...r, [field]: value } : r)),
            }
          : g
      )
    );
  };

  const handleSave = async () => {
    await onSave();
    setIsEditing(false);
  };

  return (
    <div className="relative">
      <div
        className={`space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs ${
          !isVerified ? "pointer-events-none blur-[2px] select-none" : ""
        }`}
      >
        {/* Header Section */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-base font-bold text-[#0F2942]">บริการพิมพ์และราคา</h2>
            <p className="text-xs text-slate-500">
              กำหนดประเภทการพิมพ์ ขนาดกระดาษ ตัวเลือกเสริม และราคาสำหรับผู้ใช้งาน
            </p>
          </div>
          {isVerified && !isEditing && (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <Edit2 size={13} />
              แก้ไขบริการ
            </button>
          )}
        </div>

        {/* View Mode */}
        {!isEditing ? (
          <div className="space-y-6">
            {services.length === 0 ? (
              <div className="py-8 text-center text-sm text-slate-400">
                ยังไม่มีข้อมูลบริการพิมพ์
              </div>
            ) : (
              services.map((group, gIdx) => {
                const groupedRows = groupItems(group.items);
                return (
                  <div
                    key={group.id || gIdx}
                    className="rounded-xl border border-slate-200 overflow-hidden bg-white"
                  >
                    <div className="flex items-center gap-2 bg-slate-50 px-4 py-3 border-b border-slate-200">
                      <Printer size={16} className="text-[#2F6FED]" />
                      <span className="text-sm font-bold text-[#0F2942]">
                        {group.type || "ไม่ระบุประเภทบริการ"}
                      </span>
                    </div>

                    <div className="p-4 space-y-4">
                      {groupedRows.map((grp) => (
                        <div
                          key={grp.name || `group-${grp.rows[0]?.idx}`}
                          className="rounded-lg border border-slate-100 bg-slate-50/50 p-3 space-y-2"
                        >
                          {grp.name && (
                            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600">
                              <Tag size={12} className="text-slate-400" />
                              <span>{grp.name}</span>
                            </div>
                          )}

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {grp.rows.map(({ row, idx }) => (
                              <div
                                key={row.id || idx}
                                className="flex items-center justify-between rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
                              >
                                <span className="text-slate-700">{row.detail || "-"}</span>
                                <span className="font-semibold text-[#0F2942]">
                                  {row.price ? `${row.price} บาท` : "-"}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        ) : (
          /* Edit Mode */
          <div className="space-y-6">
            {services.map((group, gIdx) => {
              const groupedRows = groupItems(group.items);
              const isPreset = SERVICE_TYPE_TEMPLATES.includes(group.type);
              const selectValue =
                group.type === "" ? "" : isPreset ? group.type : OTHER_OPTION;

              return (
                <div
                  key={group.id || gIdx}
                  className="rounded-xl border border-slate-200 overflow-hidden"
                >
                  <div className="flex flex-col gap-2 bg-slate-50 px-4 py-3 border-b border-slate-200 sm:flex-row sm:items-center">
                    <div className="flex flex-1 items-center gap-2">
                      <select
                        value={selectValue}
                        onChange={(e) => {
                          const value = e.target.value;
                          updateServiceType(
                            gIdx,
                            value === OTHER_OPTION ? "" : value
                          );
                        }}
                        className="flex-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-sm font-semibold text-slate-900 outline-none focus:border-[#2F6FED]"
                      >
                        <option value="" disabled>
                          เลือกประเภทบริการ
                        </option>
                        {SERVICE_TYPE_TEMPLATES.map((t) => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        ))}
                        <option value={OTHER_OPTION}>อื่นๆ (กำหนดเอง)</option>
                      </select>

                      {selectValue === OTHER_OPTION && (
                        <input
                          value={group.type}
                          onChange={(e) => updateServiceType(gIdx, e.target.value)}
                          placeholder="ระบุประเภทบริการเอง"
                          autoFocus
                          className="flex-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-sm text-slate-900 placeholder:text-slate-300 outline-none focus:border-[#2F6FED]"
                        />
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => removeServiceType(gIdx)}
                      className="self-end text-slate-300 hover:text-rose-500 transition-colors sm:self-auto"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div className="p-4 space-y-3">
                    {groupedRows.map((grp) => (
                      <div
                        key={grp.name || `group-${grp.rows[0]?.idx}`}
                        className="rounded-lg border border-slate-200 bg-slate-50/40 overflow-hidden"
                      >
                        <div className="flex items-center gap-2 bg-white px-3 py-2 border-b border-slate-100">
                          <Tag size={13} className="text-slate-300 shrink-0" />
                          <input
                            value={grp.name}
                            onChange={(e) => renameGroup(gIdx, grp.name, e.target.value)}
                            placeholder="ชื่อกลุ่ม เช่น ขนาดกระดาษ"
                            className="flex-1 bg-transparent text-xs font-semibold text-slate-700 placeholder:text-slate-300 outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => removeGroup(gIdx, grp.name)}
                            className="text-slate-300 hover:text-rose-500 transition-colors"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>

                        <div className="divide-y divide-slate-100">
                          {grp.rows.map(({ row, idx }) => (
                            <div key={row.id || idx} className="flex items-center gap-2 px-3 py-2">
                              <input
                                value={row.detail}
                                onChange={(e) => updateRow(gIdx, idx, "detail", e.target.value)}
                                placeholder="เช่น A4"
                                className="flex-1 rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-sm text-slate-900 outline-none focus:border-[#2F6FED]"
                              />
                              <div className="flex w-28 shrink-0 items-center gap-1 rounded-md border border-slate-200 bg-white px-2.5 py-1.5">
                                <input
                                  value={row.price}
                                  onChange={(e) => updateRow(gIdx, idx, "price", e.target.value)}
                                  placeholder="0"
                                  className="w-full bg-transparent text-right text-sm font-semibold text-slate-900 outline-none"
                                />
                                <span className="text-xs text-slate-400">บาท</span>
                              </div>
                              <button
                                type="button"
                                onClick={() => removeRow(gIdx, idx)}
                                className="shrink-0 p-1 text-slate-300 hover:text-rose-500 transition-colors"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          ))}
                        </div>

                        <button
                          type="button"
                          onClick={() => addRowToGroup(gIdx, grp.name)}
                          className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-[#2F6FED] hover:underline"
                        >
                          <Plus size={12} /> เพิ่มตัวเลือกในกลุ่มนี้
                        </button>
                      </div>
                    ))}

                    <button
                      type="button"
                      onClick={() => addNewGroup(gIdx)}
                      className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-slate-300 py-2.5 text-xs font-semibold text-slate-500 hover:border-[#2F6FED] hover:text-[#2F6FED] transition-colors"
                    >
                      <Plus size={14} /> เพิ่มกลุ่มตัวเลือกใหม่
                    </button>
                  </div>
                </div>
              );
            })}

            <button
              type="button"
              onClick={addServiceType}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 py-3 text-sm font-semibold text-slate-700 hover:border-slate-900 transition-colors"
            >
              <Plus size={16} /> เพิ่มประเภทบริการ
            </button>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
              >
                <X size={15} /> ยกเลิก
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-1.5 rounded-lg bg-[#2F6FED] px-5 py-2 text-sm font-medium text-white hover:bg-blue-600 disabled:opacity-50 transition-colors"
              >
                <Check size={15} />
                {saving ? "กำลังบันทึก..." : "บันทึกบริการพิมพ์"}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Lock Overlay */}
      {!isVerified && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-2xl bg-white/70 backdrop-blur-xs">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
            <Lock size={20} />
          </div>
          <p className="text-center px-6 text-sm font-semibold text-slate-900">
            คุณจะสามารถแก้ไขบริการพิมพ์ได้ เมื่อผ่านการยืนยันตัวตนจากผู้ดูแลระบบแล้ว
          </p>
        </div>
      )}
    </div>
  );
}