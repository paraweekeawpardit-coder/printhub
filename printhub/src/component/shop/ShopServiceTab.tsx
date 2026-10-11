"use client";

import { useMemo, useRef, useState } from "react";
import {
  Plus,
  Trash2,
  Lock,
  Tag,
  Edit2,
  Check,
  X,
  Printer,
  AlertCircle,
} from "lucide-react";

export type ServiceDetailRow = {
  id?: string;
  category?: string;
  detail: string;
  group_type: string;
  price: string;
  is_required?: boolean; // ลูกค้าต้องเลือกกลุ่มนี้หรือไม่ (ค่าเริ่มต้น false)
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
  onSave: () => Promise<boolean>;
  saving: boolean;
};

type GroupedRows = {
  name: string;
  rows: { row: ServiceDetailRow; idx: number }[];
};

const SERVICE_TEMPLATES: Record<
  string,
  { group_type: string; detail: string; price: string }[]
> = {
  "เอกสาร": [
    { group_type: "ขนาด", detail: "A3", price: "5" },
    { group_type: "ขนาด", detail: "A4", price: "1.5" },
    { group_type: "ขนาด", detail: "A5", price: "1" },
    { group_type: "ขนาด", detail: "A6", price: "0.75" },
    { group_type: "ระบบสี", detail: "ขาว-ดำ", price: "0.5" },
    { group_type: "ระบบสี", detail: "สี", price: "3" },
    { group_type: "การเข้าเล่มและตกแต่ง", detail: "เย็บมุม", price: "5" },
    { group_type: "การเข้าเล่มและตกแต่ง", detail: "สันกาว", price: "35" },
    { group_type: "การเข้าเล่มและตกแต่ง", detail: "กระดูกงู", price: "30" },
    { group_type: "การเข้าเล่มและตกแต่ง", detail: "สันเกลียว", price: "40" },
  ],
  "แผ่นสติกเกอร์": [
    { group_type: "วัสดุ", detail: "สติกเกอร์พีพี", price: "40" },
    { group_type: "วัสดุ", detail: "สติกเกอร์กระดาษ", price: "25" },
    { group_type: "วัสดุ", detail: "สติกเกอร์โฮโลแกรม", price: "65" },
    { group_type: "วัสดุ", detail: "สติกเกอร์พีพีใส", price: "45" },
    { group_type: "ขนาด", detail: "3x3 ซม.", price: "10" },
    { group_type: "ขนาด", detail: "5x5 ซม.", price: "15" },
    { group_type: "ขนาด", detail: "7x7 ซม.", price: "20" },
    { group_type: "ขนาด", detail: "10x10 ซม.", price: "30" },
  ],
  "ป้ายไวนิล": [
    { group_type: "ขนาด", detail: "60x160 ซม.", price: "150" },
    { group_type: "ขนาด", detail: "160x60 ซม.", price: "150" },
    { group_type: "การเข้าเล่มและตกแต่ง", detail: "พับขอบ", price: "20" },
    { group_type: "การเข้าเล่มและตกแต่ง", detail: "เจาะตาไก่", price: "30" },
  ],
  "นามบัตร": [
    { group_type: "ขนาด", detail: "9x5.5 ซม.", price: "120" },
    { group_type: "ขนาด", detail: "9x5 ซม.", price: "120" },
    { group_type: "ขนาด", detail: "8.5x5.5 ซม.", price: "120" },
    { group_type: "การพิมพ์", detail: "หน้าเดียว", price: "0" },
    { group_type: "การพิมพ์", detail: "หน้า-หลัง", price: "50" },
    { group_type: "วัสดุ", detail: "อาร์ตการ์ดมัน 300 แกรม", price: "0" },
    { group_type: "วัสดุ", detail: "อาร์ตการ์ดมัน 350 แกรม", price: "15" },
    { group_type: "วัสดุ", detail: "อาร์ตการ์ดมัน 400 แกรม", price: "30" },
    { group_type: "วัสดุ", detail: "อาร์ตการ์ดด้าน 300 แกรม", price: "0" },
    { group_type: "วัสดุ", detail: "อาร์ตการ์ดด้าน 350 แกรม", price: "15" },
    { group_type: "วัสดุ", detail: "อาร์ตการ์ดด้าน 400 แกรม", price: "30" },
    { group_type: "การเข้าเล่มและตกแต่ง", detail: "เคลือบมัน (หน้าเดียว)", price: "25" },
    { group_type: "การเข้าเล่มและตกแต่ง", detail: "เคลือบมัน (สองด้าน)", price: "45" },
    { group_type: "การเข้าเล่มและตกแต่ง", detail: "เคลือบด้าน (หน้าเดียว)", price: "30" },
    { group_type: "การเข้าเล่มและตกแต่ง", detail: "เคลือบด้าน (สองด้าน)", price: "50" },
  ],
  "โปสเตอร์": [
    { group_type: "ขนาด", detail: "A3", price: "60" },
    { group_type: "ขนาด", detail: "A4", price: "30" },
    { group_type: "ขนาด", detail: "A5", price: "20" },
    { group_type: "ขนาด", detail: "A6", price: "15" },
    { group_type: "ระบบสี", detail: "ขาว-ดำ", price: "0" },
    { group_type: "ระบบสี", detail: "สี", price: "10" },
    { group_type: "วัสดุ", detail: "อาร์ตการ์ดมัน 300 แกรม", price: "0" },
    { group_type: "วัสดุ", detail: "อาร์ตการ์ดมัน 350 แกรม", price: "10" },
    { group_type: "วัสดุ", detail: "อาร์ตการ์ดมัน 400 แกรม", price: "20" },
    { group_type: "วัสดุ", detail: "อาร์ตการ์ดด้าน 300 แกรม", price: "0" },
    { group_type: "วัสดุ", detail: "อาร์ตการ์ดด้าน 350 แกรม", price: "10" },
    { group_type: "วัสดุ", detail: "อาร์ตการ์ดด้าน 400 แกรม", price: "20" },
  ],
};

// 🌟 สร้าง Array รายชื่อประเภทบริการสำเร็จรูป
const SERVICE_TYPE_TEMPLATES = Object.keys(SERVICE_TEMPLATES);

const OTHER_OPTION = "__other__";

const groupItems = (
  items: ServiceDetailRow[],
  includeEmpty = false
): GroupedRows[] => {
  if (!items || items.length === 0) return [];

  const groups: GroupedRows[] = [];

  items.forEach((row, idx) => {
    if (!includeEmpty && !row.detail && !row.price && !row.group_type) return;

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

type ServiceErrors = {
  type?: string;
  noItems?: string;
  groupName: Record<number, string>;
  row: Record<number, { detail?: string; price?: string }>;
  count: number;
};

const emptyErrors: ServiceErrors = { groupName: {}, row: {}, count: 0 };

const validateService = (group: ServiceTypeGroup): ServiceErrors => {
  const errors: ServiceErrors = { groupName: {}, row: {}, count: 0 };

  if (!group.type.trim()) {
    errors.type = "กรุณาเลือกหรือกรอกประเภทบริการ";
    errors.count++;
  }

  if (group.items.length === 0) {
    errors.noItems = "กรุณาเพิ่มตัวเลือกอย่างน้อย 1 รายการ";
    errors.count++;
  }

  for (const grp of groupItems(group.items, true)) {
    if (!grp.name.trim()) {
      errors.groupName[grp.rows[0].idx] = "กรุณากรอกชื่อกลุ่มตัวเลือก เช่น ขนาดกระดาษ";
      errors.count++;
    }

    const seen = new Set<string>();
    for (const { row, idx } of grp.rows) {
      const rowErr: { detail?: string; price?: string } = {};

      const detail = row.detail.trim();
      if (!detail) rowErr.detail = "กรุณากรอกรายละเอียด เช่น A4 ขาวดำ";
      else if (seen.has(detail)) rowErr.detail = "รายการนี้ซ้ำในกลุ่มเดียวกัน";
      else seen.add(detail);

      const priceStr = String(row.price ?? "").trim();
      if (!priceStr) rowErr.price = "กรุณากรอกราคา";
      else if (!Number.isFinite(Number(priceStr)) || Number(priceStr) < 0)
        rowErr.price = "ราคาต้องเป็นตัวเลขตั้งแต่ 0 ขึ้นไป";

      if (rowErr.detail || rowErr.price) {
        errors.row[idx] = rowErr;
        errors.count += (rowErr.detail ? 1 : 0) + (rowErr.price ? 1 : 0);
      }
    }
  }

  return errors;
};

const validateAll = (services: ServiceTypeGroup[]): ServiceErrors[] => {
  const seenTypes = new Set<string>();
  return services.map((s) => {
    const errors = validateService(s);
    const type = s.type.trim();
    if (type) {
      if (seenTypes.has(type) && !errors.type) {
        errors.type = "ประเภทบริการนี้ถูกเพิ่มไว้แล้ว";
        errors.count++;
      }
      seenTypes.add(type);
    }
    return errors;
  });
};

const hasFieldErrors = (e: ServiceErrors) =>
  !!e.type ||
  Object.keys(e.groupName).length > 0 ||
  Object.keys(e.row).length > 0;

const shiftIndexMap = (prev: Record<number, boolean>, removed: number) => {
  const next: Record<number, boolean> = {};
  Object.entries(prev).forEach(([k, v]) => {
    const n = Number(k);
    if (n < removed) next[n] = v;
    else if (n > removed) next[n - 1] = v;
  });
  return next;
};

const FieldError = ({ message }: { message?: string }) =>
  message ? (
    <p
      data-field-error
      className="mt-1 flex items-center gap-1 text-xs font-medium text-rose-500"
    >
      <AlertCircle size={12} className="shrink-0" />
      {message}
    </p>
  ) : null;

export default function ShopServicesTab({
  isVerified,
  services,
  setServices,
  onSave,
  saving,
}: Props) {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [customTypeIndexes, setCustomTypeIndexes] = useState<Record<number, boolean>>({});

  const [attemptedSave, setAttemptedSave] = useState<boolean>(false);
  const [errorScope, setErrorScope] = useState<Record<number, boolean>>({});
  const editRef = useRef<HTMLDivElement>(null);

  // สำเนาของ services ตอนเริ่มแก้ไข ใช้ย้อนค่ากลับเมื่อกด "ยกเลิก"
  // (services เก็บอยู่ที่ parent และถูกแก้ตรง ๆ ระหว่างแก้ไข จึงต้องเก็บของเดิมไว้เอง)
  const snapshotRef = useRef<ServiceTypeGroup[] | null>(null);

  const allErrors = useMemo(() => validateAll(services), [services]);
  const totalErrors = allErrors.reduce((sum, e) => sum + e.count, 0);

  const focusFirstInvalid = (serviceIndex?: number) => {
    setTimeout(() => {
      const scope =
        serviceIndex !== undefined
          ? `[data-service="${serviceIndex}"] `
          : "";
      const el =
        editRef.current?.querySelector<HTMLElement>(`${scope}[aria-invalid="true"]`) ??
        editRef.current?.querySelector<HTMLElement>(`${scope}[data-field-error]`);
      el?.focus?.();
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 50);
  };

  const addServiceType = () => {
    setServices((prev) => [
      ...prev,
      { type: "", items: [{ detail: "", group_type: "", price: "", is_required: false }] },
    ]);
  };

  const removeServiceType = (index: number) => {
    setServices((prev) => prev.filter((_, i) => i !== index));
    setCustomTypeIndexes((prev) => shiftIndexMap(prev, index));
    setErrorScope((prev) => shiftIndexMap(prev, index));
  };

  const updateServiceType = (index: number, selectedValue: string) => {
    // เปลี่ยนประเภทบริการ = เริ่มรายละเอียดใหม่ ไม่เก็บค่าของประเภทเดิมไว้
    setErrorScope((prev) => ({ ...prev, [index]: false }));

    if (selectedValue === OTHER_OPTION) {
      setCustomTypeIndexes((prev) => ({ ...prev, [index]: true }));
      setServices((prev) =>
        prev.map((g, i) =>
          i === index
            ? {
                ...g,
                type: "",
                items: [{ detail: "", group_type: "", price: "", is_required: false }],
              }
            : g
        )
      );
    } else if (SERVICE_TEMPLATES[selectedValue]) {
      setCustomTypeIndexes((prev) => ({ ...prev, [index]: false }));
      const templateItems = SERVICE_TEMPLATES[selectedValue].map((item) => ({
        detail: item.detail,
        group_type: item.group_type,
        price: item.price,
        is_required: false,
      }));
      setServices((prev) =>
        prev.map((g, i) =>
          i === index ? { ...g, type: selectedValue, items: templateItems } : g
        )
      );
    } else {
      setServices((prev) =>
        prev.map((g, i) => (i === index ? { ...g, type: selectedValue } : g))
      );
    }
  };

  const renameGroup = (
    groupIndex: number,
    grpRows: { row: ServiceDetailRow; idx: number }[],
    newName: string
  ) => {
    const targetIndices = new Set(grpRows.map((item) => item.idx));

    setServices((prev) =>
      prev.map((g, i) => {
        if (i !== groupIndex) return g;
        return {
          ...g,
          items: g.items.map((r, rIdx) =>
            targetIndices.has(rIdx) ? { ...r, group_type: newName } : r
          ),
        };
      })
    );
  };

  // ตั้งค่า "จำเป็น" ให้ทุกแถวในกลุ่มเดียวกัน (ค่าเก็บต่อแถวใน service_detail แต่กำหนดเป็นระดับกลุ่ม)
  const setGroupRequired = (
    groupIndex: number,
    grpRows: { row: ServiceDetailRow; idx: number }[],
    value: boolean
  ) => {
    const targetIndices = new Set(grpRows.map((item) => item.idx));

    setServices((prev) =>
      prev.map((g, i) => {
        if (i !== groupIndex) return g;
        return {
          ...g,
          items: g.items.map((r, rIdx) =>
            targetIndices.has(rIdx) ? { ...r, is_required: value } : r
          ),
        };
      })
    );
  };

  const addRowToGroup = (groupIndex: number, grp: GroupedRows) => {
    const err = allErrors[groupIndex] ?? emptyErrors;
    const groupHasError =
      !!err.groupName[grp.rows[0].idx] || grp.rows.some((r) => !!err.row[r.idx]);

    if (groupHasError) {
      setErrorScope((prev) => ({ ...prev, [groupIndex]: true }));
      focusFirstInvalid(groupIndex);
      return;
    }

    setServices((prev) =>
      prev.map((g, i) =>
        i === groupIndex
          ? {
              ...g,
              items: [
                ...g.items,
                {
                  detail: "",
                  group_type: grp.name,
                  price: "",
                  // แถวใหม่ในกลุ่มเดิมใช้ค่าเดียวกับกลุ่ม
                  is_required: grp.rows.some((r) => !!r.row.is_required),
                },
              ],
            }
          : g
      )
    );
  };

  const addNewGroup = (groupIndex: number) => {
    const err = allErrors[groupIndex] ?? emptyErrors;

    if (hasFieldErrors(err)) {
      setErrorScope((prev) => ({ ...prev, [groupIndex]: true }));
      focusFirstInvalid(groupIndex);
      return;
    }

    setServices((prev) =>
      prev.map((g, i) =>
        i === groupIndex
          ? { ...g, items: [...g.items, { detail: "", group_type: "", price: "", is_required: false }] }
          : g
      )
    );
  };

  const removeGroup = (
    groupIndex: number,
    grpRows: { row: ServiceDetailRow; idx: number }[]
  ) => {
    const targetIndices = new Set(grpRows.map((item) => item.idx));

    setServices((prev) =>
      prev.map((g, i) => {
        if (i !== groupIndex) return g;
        return {
          ...g,
          items: g.items.filter((_, rIdx) => !targetIndices.has(rIdx)),
        };
      })
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

  const resetValidation = () => {
    setAttemptedSave(false);
    setErrorScope({});
  };

  const handleSave = async () => {
    if (totalErrors > 0) {
      setAttemptedSave(true);
      focusFirstInvalid();
      return;
    }
    const ok = await onSave();
    if (ok) {
      snapshotRef.current = null; // บันทึกสำเร็จ ไม่ต้องย้อนค่าแล้ว
      setIsEditing(false);
      resetValidation();
    }
  };

  const handleStartEdit = () => {
    snapshotRef.current = JSON.parse(JSON.stringify(services));
    setCustomTypeIndexes({});
    resetValidation();
    setIsEditing(true);
  };

  const handleCancel = () => {
    // ย้อน services กลับเป็นค่าก่อนเริ่มแก้ไข (ทิ้งสิ่งที่เพิ่ม/แก้ระหว่างนั้นทั้งหมด)
    if (snapshotRef.current) {
      setServices(snapshotRef.current);
      snapshotRef.current = null;
    }
    setCustomTypeIndexes({});
    setIsEditing(false);
    resetValidation();
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
              onClick={handleStartEdit}
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
                    key={group.id || `service-${gIdx}`}
                    className="rounded-xl border border-slate-200 overflow-hidden bg-white"
                  >
                    <div className="flex items-center gap-2 bg-slate-50 px-4 py-3 border-b border-slate-200">
                      <Printer size={16} className="text-[#2F6FED]" />
                      <span className="text-sm font-bold text-[#0F2942]">
                        {group.type || "ไม่ระบุประเภทบริการ"}
                      </span>
                    </div>

                    <div className="p-4 space-y-4">
                      {groupedRows.length === 0 ? (
                        <div className="py-3 text-center text-xs text-slate-400">
                          ไม่มีตัวเลือกย่อยในบริการนี้
                        </div>
                      ) : (
                        groupedRows.map((grp, grpIdx) => (
                          <div
                            key={`view-group-${grpIdx}`}
                            className="rounded-lg border border-slate-100 bg-slate-50/50 p-3 space-y-2"
                          >
                            {grp.name ? (
                              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600">
                                <Tag size={12} className="text-slate-400" />
                                <span>{grp.name}</span>
                                {grp.rows.some((r) => !!r.row.is_required) ? (
                                  <span className="rounded-md border border-rose-200 bg-rose-50 px-1.5 py-0.5 text-[10px] font-bold text-rose-600">
                                    จำเป็น
                                  </span>
                                ) : (
                                  <span className="rounded-md border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] font-medium text-slate-400">
                                    ไม่บังคับ
                                  </span>
                                )}
                              </div>
                            ) : null}

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {grp.rows.map(({ row, idx }) => (
                                <div
                                  key={row.id || `row-${idx}`}
                                  className="flex items-center justify-between rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
                                >
                                  <span className="text-slate-700">{row.detail || "-"}</span>
                                  <span className="font-semibold text-[#0F2942]">
                                    {row.price ? `${row.price} บาท` : "0 บาท"}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        ) : (
          /* Edit Mode */
          <div ref={editRef} className="space-y-6">
            {services.map((group, gIdx) => {
              const groupedRows = groupItems(group.items, true);
              const isPreset = SERVICE_TYPE_TEMPLATES.includes(group.type);
              const isCustomMode = customTypeIndexes[gIdx] || (!isPreset && group.type !== "");
              const selectValue =
                group.type === "" ? "" : isPreset ? group.type : OTHER_OPTION;

              const err = allErrors[gIdx] ?? emptyErrors;
              const showErr = attemptedSave || !!errorScope[gIdx];
              const typeErr = showErr ? err.type : undefined;

              return (
                <div
                  key={group.id || `edit-service-${gIdx}`}
                  data-service={gIdx}
                  className={`rounded-xl border overflow-hidden ${
                    showErr && err.count > 0 ? "border-rose-200" : "border-slate-200"
                  }`}
                >
                  <div className="flex flex-col gap-2 bg-slate-50 px-4 py-3 border-b border-slate-200 sm:flex-row sm:items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <select
                          value={selectValue}
                          onChange={(e) => updateServiceType(gIdx, e.target.value)}
                          aria-invalid={!!typeErr}
                          className={`flex-1 rounded-lg border bg-white px-2.5 py-1.5 text-sm font-semibold text-slate-900 outline-none ${
                            typeErr
                              ? "border-rose-400 focus:border-rose-500"
                              : "border-slate-200 focus:border-[#2F6FED]"
                          }`}
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

                        {isCustomMode && (
                          <input
                            value={group.type}
                            onChange={(e) =>
                              setServices((prev) =>
                                prev.map((g, i) => (i === gIdx ? { ...g, type: e.target.value } : g))
                              )
                            }
                            placeholder="พิมพ์ระบุประเภทบริการเอง..."
                            autoFocus
                            aria-invalid={!!typeErr}
                            className={`flex-1 rounded-lg border bg-white px-2.5 py-1.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none ${
                              typeErr
                                ? "border-rose-400 focus:border-rose-500"
                                : "border-slate-200 focus:border-[#2F6FED]"
                            }`}
                          />
                        )}
                      </div>
                      <FieldError message={typeErr} />
                    </div>

                    <button
                      type="button"
                      onClick={() => removeServiceType(gIdx)}
                      className="self-end text-slate-300 hover:text-rose-500 transition-colors sm:mt-2 sm:self-start"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div className="p-4 space-y-3">
                    {groupedRows.map((grp, grpIdx) => {
                      const nameErr = showErr ? err.groupName[grp.rows[0].idx] : undefined;

                      return (
                        <div
                          key={`edit-group-${grpIdx}`}
                          className={`rounded-lg border bg-slate-50/40 overflow-hidden ${
                            nameErr ? "border-rose-300" : "border-slate-200"
                          }`}
                        >
                          <div className="bg-white px-3 py-2 border-b border-slate-100">
                            <div className="flex items-center gap-2">
                              <Tag size={13} className="text-slate-300 shrink-0" />
                              <input
                                value={grp.name}
                                onChange={(e) => renameGroup(gIdx, grp.rows, e.target.value)}
                                placeholder="ชื่อกลุ่ม เช่น ขนาดกระดาษ"
                                aria-invalid={!!nameErr}
                                className={`flex-1 bg-transparent text-xs font-semibold outline-none ${
                                  nameErr
                                    ? "text-rose-600 placeholder:text-rose-300"
                                    : "text-slate-700 placeholder:text-slate-300"
                                }`}
                              />
                              <label className="flex shrink-0 cursor-pointer select-none items-center gap-1.5 text-[11px] font-medium text-slate-500">
                                <input
                                  type="checkbox"
                                  checked={grp.rows.some((r) => !!r.row.is_required)}
                                  onChange={(ev) =>
                                    setGroupRequired(gIdx, grp.rows, ev.target.checked)
                                  }
                                  className="h-3.5 w-3.5 accent-[#2F6FED]"
                                />
                                จำเป็นต้องเลือก
                              </label>
                              <button
                                type="button"
                                onClick={() => removeGroup(gIdx, grp.rows)}
                                className="text-slate-300 hover:text-rose-500 transition-colors"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                            <FieldError message={nameErr} />
                          </div>

                          <div className="divide-y divide-slate-100">
                            {grp.rows.map(({ row, idx }) => {
                              const rowErr = showErr ? err.row[idx] : undefined;

                              return (
                                <div key={row.id || `item-${idx}`} className="px-3 py-2">
                                  <div className="flex items-center gap-2">
                                    <input
                                      value={row.detail}
                                      onChange={(e) => updateRow(gIdx, idx, "detail", e.target.value)}
                                      placeholder="เช่น A4 ขาวดำ"
                                      aria-invalid={!!rowErr?.detail}
                                      className={`flex-1 rounded-md border bg-white px-2.5 py-1.5 text-sm text-slate-900 outline-none ${
                                        rowErr?.detail
                                          ? "border-rose-400 focus:border-rose-500"
                                          : "border-slate-200 focus:border-[#2F6FED]"
                                      }`}
                                    />
                                    <div
                                      className={`flex w-28 shrink-0 items-center gap-1 rounded-md border bg-white px-2.5 py-1.5 ${
                                        rowErr?.price ? "border-rose-400" : "border-slate-200"
                                      }`}
                                    >
                                      <input
                                        value={row.price}
                                        onChange={(e) => updateRow(gIdx, idx, "price", e.target.value)}
                                        placeholder="0"
                                        inputMode="decimal"
                                        aria-invalid={!!rowErr?.price}
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
                                  <FieldError message={rowErr?.detail} />
                                  <FieldError message={rowErr?.price} />
                                </div>
                              );
                            })}
                          </div>

                          <button
                            type="button"
                            onClick={() => addRowToGroup(gIdx, grp)}
                            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-[#2F6FED] hover:underline"
                          >
                            <Plus size={12} /> เพิ่มตัวเลือกในกลุ่มนี้
                          </button>
                        </div>
                      );
                    })}

                    {showErr && <FieldError message={err.noItems} />}

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

            {attemptedSave && totalErrors > 0 && (
              <div
                role="alert"
                className="flex items-start gap-2 rounded-lg border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-sm text-rose-600"
              >
                <AlertCircle size={16} className="mt-0.5 shrink-0" />
                <span>
                  กรุณากรอกข้อมูลให้ครบถ้วนก่อนบันทึก (เหลือ {totalErrors} จุดที่ต้องแก้ไข)
                </span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
              <button
                type="button"
                onClick={handleCancel}
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