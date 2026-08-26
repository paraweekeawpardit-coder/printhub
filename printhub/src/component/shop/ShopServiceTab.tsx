"use client";

import { Plus, Trash2, Lock, Tag } from "lucide-react";

export type ServiceDetailRow = {
  id?: string;
  detail: string;
  group_name: string;
  price: string;
};

export type ServiceTypeGroup = {
  id?: string;
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

// รวมรายการที่มีชื่อ group_name เดียวกันไว้ด้วยกัน โดยยังเก็บ index เดิม
// ของ item ใน array ไว้ เพื่อให้ update/remove แถวได้ถูกตำแหน่ง
const groupItems = (items: ServiceDetailRow[]): GroupedRows[] => {
  const groups: GroupedRows[] = [];
  items.forEach((row, idx) => {
    const name = row.group_name || "";
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
  const addServiceType = () => {
    setServices((prev) => [
      ...prev,
      { type: "", items: [{ detail: "", group_name: "", price: "" }] },
    ]);
  };

  const removeServiceType = (index: number) => {
    setServices((prev) => prev.filter((_, i) => i !== index));
  };

  const updateServiceType = (index: number, type: string) => {
    setServices((prev) => prev.map((g, i) => (i === index ? { ...g, type } : g)));
  };

  // แก้ชื่อกลุ่ม -> อัปเดต group_name ของทุกแถวที่อยู่กลุ่มเดิมพร้อมกัน
  const renameGroup = (groupIndex: number, oldName: string, newName: string) => {
    setServices((prev) =>
      prev.map((g, i) =>
        i === groupIndex
          ? {
              ...g,
              items: g.items.map((r) =>
                r.group_name === oldName ? { ...r, group_name: newName } : r
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
          ? { ...g, items: [...g.items, { detail: "", group_name: groupName, price: "" }] }
          : g
      )
    );
  };

  const addNewGroup = (groupIndex: number) => {
    setServices((prev) =>
      prev.map((g, i) =>
        i === groupIndex
          ? { ...g, items: [...g.items, { detail: "", group_name: "", price: "" }] }
          : g
      )
    );
  };

  const removeGroup = (groupIndex: number, groupName: string) => {
    setServices((prev) =>
      prev.map((g, i) =>
        i === groupIndex
          ? { ...g, items: g.items.filter((r) => r.group_name !== groupName) }
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

  return (
    <div className="relative">
      <div
        className={`space-y-6 rounded-2xl border border-gray-200 bg-white p-6 ${
          !isVerified ? "pointer-events-none blur-[2px] select-none" : ""
        }`}
      >
        {services.map((group, gIdx) => {
          const groupedRows = groupItems(group.items);
          return (
            <div
              key={group.id || gIdx}
              className="rounded-xl border border-gray-200 overflow-hidden"
            >
              <div className="flex items-center gap-2 bg-gray-50 px-4 py-3 border-b border-gray-200">
                <input
                  value={group.type}
                  onChange={(e) => updateServiceType(gIdx, e.target.value)}
                  placeholder="ชื่อประเภทบริการ เช่น พิมพ์เอกสาร, เข้าเล่ม"
                  className="flex-1 bg-transparent text-sm font-semibold text-gray-900 placeholder:text-gray-300 outline-none"
                />
                <button
                  type="button"
                  onClick={() => removeServiceType(gIdx)}
                  className="text-gray-300 hover:text-rose-500 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              <div className="p-4 space-y-3">
                {groupedRows.map((grp) => (
                  <div
                    key={grp.name || `group-${grp.rows[0]?.idx}`}
                    className="rounded-lg border border-gray-200 bg-gray-50/40 overflow-hidden"
                  >
                    {/* หัวข้อกลุ่ม เช่น ขนาดกระดาษ / สี / การพิมพ์ */}
                    <div className="flex items-center gap-2 bg-white px-3 py-2 border-b border-gray-100">
                      <Tag size={13} className="text-gray-300 shrink-0" />
                      <input
                        value={grp.name}
                        onChange={(e) => renameGroup(gIdx, grp.name, e.target.value)}
                        placeholder="ชื่อกลุ่ม เช่น ขนาดกระดาษ"
                        className="flex-1 bg-transparent text-xs font-semibold text-gray-700 placeholder:text-gray-300 placeholder:font-normal outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => removeGroup(gIdx, grp.name)}
                        className="text-gray-300 hover:text-rose-500 transition-colors"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>

                    {/* ตัวเลือกภายในกลุ่มนี้ */}
                    <div className="divide-y divide-gray-100">
                      {grp.rows.map(({ row, idx }) => (
                        <div key={row.id || idx} className="flex items-center gap-2 px-3 py-2">
                          <input
                            value={row.detail}
                            onChange={(e) => updateRow(gIdx, idx, "detail", e.target.value)}
                            placeholder="เช่น A4"
                            className="flex-1 rounded-md border border-gray-200 bg-white px-2.5 py-1.5 text-sm text-gray-900 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500/15"
                          />
                          <div className="flex w-24 shrink-0 items-center gap-1 rounded-md border border-gray-200 bg-white px-2.5 py-1.5">
                            <input
                              value={row.price}
                              onChange={(e) => updateRow(gIdx, idx, "price", e.target.value)}
                              placeholder="0"
                              className="w-full bg-transparent text-right text-sm font-semibold text-gray-900 outline-none"
                            />
                            <span className="text-xs text-gray-400">บาท</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeRow(gIdx, idx)}
                            className="shrink-0 p-1 text-gray-300 hover:text-rose-500 transition-colors"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={() => addRowToGroup(gIdx, grp.name)}
                      className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-blue-500 hover:underline"
                    >
                      <Plus size={12} /> เพิ่มตัวเลือกในกลุ่มนี้
                    </button>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() => addNewGroup(gIdx)}
                  className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-gray-300 py-2.5 text-xs font-semibold text-gray-500 transition-colors hover:border-blue-400 hover:text-blue-500"
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
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-gray-300 py-3 text-sm font-semibold text-gray-700 transition-colors hover:border-gray-900"
        >
          <Plus size={16} /> เพิ่มประเภทบริการ
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
          <p className="text-center px-6 text-sm font-semibold text-gray-900">
            คุณจะสามารถแก้ไขบริการพิมพ์ได้ เมื่อผ่านการยืนยันตัวตนจากผู้ดูแลระบบแล้ว
          </p>
        </div>
      )}
    </div>
  );
}