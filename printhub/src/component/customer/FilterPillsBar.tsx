"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  FileText,
  Sticker,
  Flag,
  CreditCard,
  Image as ImageIcon,
  SlidersHorizontal,
  X,
  Check,
  RotateCcw,
  Info,
} from "lucide-react";

// ประเภทงานพิมพ์หลัก
const CATEGORIES = [
  { name: "เอกสาร", subtitle: "ชีท, รายงาน, หนังสือ", icon: FileText },
  { name: "แผ่นสติกเกอร์", subtitle: "ไดคัท, สติกเกอร์สินค้า", icon: Sticker },
  { name: "ป้ายไวนิล", subtitle: "ป้ายหน้าร้าน, แบนเนอร์", icon: Flag },
  { name: "นามบัตร", subtitle: "บัตรสมาชิก, การ์ดแนะนำตัว", icon: CreditCard },
  { name: "โปสเตอร์", subtitle: "ภาพพิมพ์, ใบปิดประชาสัมพันธ์", icon: ImageIcon },
];

// รายการตัวเลือกสเปกย่อย
const GROUPED_OPTIONS: Record<string, { group: string; items: string[] }[]> = {
  เอกสาร: [
    { group: "ขนาด", items: ["A3", "A4", "A5", "A6"] },
    { group: "ระบบสี", items: ["ขาว-ดำ", "สี"] },
    { group: "การเข้าเล่มและตกแต่ง", items: ["เย็บมุม", "สันกาว", "กระดูกงู", "สันเกลียว"] },
  ],
  แผ่นสติกเกอร์: [
    { group: "ประเภทสติกเกอร์", items: ["สติกเกอร์กระดาษ", "สติกเกอร์ PVC กันน้ำ", "สติกเกอร์ใส", "สติกเกอร์คราฟท์"] },
    { group: "รูปแบบตัด", items: ["ไดคัท 100%", "คิสคัท (Kiss-cut)", "แผ่นใหญ่"] },
  ],
  ป้ายไวนิล: [
    { group: "ความหนา", items: ["360 แกรม", "440 แกรม", "510 แกรม"] },
    { group: "การพับขอบ/เจาะรู", items: ["ตอกตาไก่", "พับขอบอย่างเดียว", "ร้อยท่อบน-ล่าง"] },
  ],
  นามบัตร: [
    { group: "กระดาษ", items: ["อาร์ตการ์ด 260g", "อาร์ตการ์ด 300g", "กระดาษคราฟท์", "กระดาษพิเศษ"] },
    { group: "การเคลือบ", items: ["ไม่เคลือบ", "เคลือบเงา", "เคลือบด้าน", "Soft Touch"] },
  ],
  โปสเตอร์: [
    { group: "ขนาด", items: ["A3", "A2", "A1", "A0"] },
    { group: "วัสดุ", items: ["กระดาษอาร์ต 160g", "Photo Paper", "PP Paper"] },
  ],
};

export default function FilterPillsBar() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // State หลัก
  const [selectedCategory, setSelectedCategory] = useState<string>("เอกสาร");
  const [selectedFinishing, setSelectedFinishing] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");

  // State สำหรับ Pop-up Modal
  const [isFinishingModalOpen, setIsFinishingModalOpen] = useState(false);
  const [modalCategory, setModalCategory] = useState<string>("เอกสาร");
  const [tempFinishing, setTempFinishing] = useState<string[]>([]);
  const [tempMinPrice, setTempMinPrice] = useState<string>("");
  const [tempMaxPrice, setTempMaxPrice] = useState<string>("");
  const [priceError, setPriceError] = useState<string>("");

  // Sync จาก URL SearchParams เมื่อโหลดหน้า
  useEffect(() => {
    const catParam = searchParams.get("category");
    const finishingParam = searchParams.get("finishing_service");
    const minP = searchParams.get("min_price");
    const maxP = searchParams.get("max_price");

    if (catParam) {
      setSelectedCategory(catParam);
      setModalCategory(catParam);
    }
    if (finishingParam) {
      setSelectedFinishing(finishingParam.split(",").filter(Boolean));
    } else {
      setSelectedFinishing([]);
    }
    setMinPrice(minP || "");
    setMaxPrice(maxP || "");
  }, [searchParams]);

  // ฟังก์ชันอัปเดต URL Parameters
  const updateQueryParams = (newCategory: string, newFinishing: string[], minP?: string, maxP?: string) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (newCategory) params.set("category", newCategory);
    else params.delete("category");

    if (newFinishing.length > 0) params.set("finishing_service", newFinishing.join(","));
    else params.delete("finishing_service");

    if (minP && parseFloat(minP) > 0) params.set("min_price", minP);
    else params.delete("min_price");

    if (maxP && parseFloat(maxP) > 0) params.set("max_price", maxP);
    else params.delete("max_price");

    router.push(`?${params.toString()}`);
  };

  // เปิด Modal
  const handleOpenModal = () => {
    setModalCategory(selectedCategory);
    setTempFinishing([...selectedFinishing]);
    setTempMinPrice(minPrice);
    setTempMaxPrice(maxPrice);
    setPriceError("");
    setIsFinishingModalOpen(true);
  };

  // เปลี่ยน Category ใน Modal
  const handleCategoryChange = (catName: string) => {
    setModalCategory(catName);
    setTempFinishing([]);
  };

  // เลือก/ยกเลิก สเปกย่อย
  const toggleOption = (item: string) => {
    setTempFinishing((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  // ยืนยันการเลือกใน Modal
  const handleConfirmModal = () => {
    const minVal = tempMinPrice ? parseFloat(tempMinPrice) : null;
    const maxVal = tempMaxPrice ? parseFloat(tempMaxPrice) : null;

    if (minVal !== null && minVal <= 0) {
      setPriceError("ราคาต่ำสุดต้องมากกว่า 0 บาท");
      return;
    }
    if (maxVal !== null && maxVal <= 0) {
      setPriceError("ราคาสูงสุดต้องมากกว่า 0 บาท");
      return;
    }
    if (minVal !== null && maxVal !== null && minVal > maxVal) {
      setPriceError("ราคาต่ำสุดต้องไม่มากกว่าราคาสูงสุด");
      return;
    }

    setPriceError("");
    setSelectedCategory(modalCategory);
    setSelectedFinishing(tempFinishing);
    setMinPrice(tempMinPrice);
    setMaxPrice(tempMaxPrice);

    updateQueryParams(modalCategory, tempFinishing, tempMinPrice, tempMaxPrice);
    setIsFinishingModalOpen(false);
  };

  // ล้างตัวกรองทั้งหมด
  const handleClearAll = () => {
    setSelectedCategory("เอกสาร");
    setSelectedFinishing([]);
    setMinPrice("");
    setMaxPrice("");
    router.push("?");
  };

  return (
    <div className="w-full bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4 overflow-x-auto">
        {/* แถบสรุปตัวเลือกหลักที่เลือกไว้ */}
        <div className="flex items-center gap-2 flex-nowrap">
          <button
            type="button"
            onClick={handleOpenModal}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold transition cursor-pointer border border-blue-200/60 shrink-0"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>กรองสเปกงานพิมพ์</span>
            {(selectedFinishing.length > 0 || minPrice || maxPrice) && (
              <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] flex items-center justify-center font-extrabold ml-0.5">
                {selectedFinishing.length + (minPrice || maxPrice ? 1 : 0)}
              </span>
            )}
          </button>

          <div className="h-5 w-[1px] bg-slate-200 mx-1 shrink-0" />

          {/* แสดง Tag หมวดหมู่ */}
          <span className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 text-xs font-medium shrink-0">
            ประเภท: <strong className="text-slate-900">{selectedCategory}</strong>
          </span>

          {/* แสดง Tag สเปกที่เลือก */}
          {selectedFinishing.map((item) => (
            <span
              key={item}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 text-xs font-medium border border-blue-100 shrink-0"
            >
              {item}
            </span>
          ))}

          {/* แสดง Tag ช่วงราคา */}
          {(minPrice || maxPrice) && (
            <span className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-medium border border-emerald-100 shrink-0">
              ฿{minPrice || "0"} - ฿{maxPrice || "ไม่จำกัด"}
            </span>
          )}

          {/* ปุ่มล้างตัวกรองทั้งหมด */}
          {(selectedFinishing.length > 0 || minPrice || maxPrice) && (
            <button
              type="button"
              onClick={handleClearAll}
              className="text-xs text-rose-500 hover:text-rose-600 hover:underline font-medium ml-2 cursor-pointer shrink-0"
            >
              ล้างทั้งหมด
            </button>
          )}
        </div>
      </div>

      {/* POP-UP MODAL */}
      {isFinishingModalOpen && (
        <div
          /* กดพื้นที่ฉากหลังตรงไหนก็ปิดได้ทันที */
          onClick={() => setIsFinishingModalOpen(false)}
          /* เพิ่ม z-[100] และ pt-24 ดันลงมาจาก Navbar ด้านบน */
          className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-5 pt-24 sm:pt-28 pb-6 bg-slate-900/60 backdrop-blur-xs cursor-pointer"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[80vh] relative animate-in fade-in zoom-in-95 duration-150 cursor-default"
          >
            {/* Header Pop-up */}
            <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-slate-50 via-white to-blue-50/30 shrink-0">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-xl bg-blue-50 text-blue-600">
                    <SlidersHorizontal className="w-4 h-4" />
                  </span>
                  <h3 className="font-extrabold text-sm sm:text-base text-slate-900 tracking-tight">
                    กำหนดสเปกและช่วงราคารวม
                  </h3>
                </div>
                <p className="text-[11px] text-slate-400 pl-8">
                  เลือกประเภทงานพิมพ์ ระบุสเปกย่อย และกำหนดงบประมาณราคาที่ต้องการ
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsFinishingModalOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition cursor-pointer shrink-0"
                title="ปิดหน้าต่าง"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* ส่วนที่ 1: เลือกประเภทงานพิมพ์หลัก */}
            <div className="px-5 py-3 bg-white border-b border-slate-100 shrink-0">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-blue-100 text-blue-600 text-[10px] flex items-center justify-center font-extrabold">1</span>
                  เลือกประเภทงานพิมพ์หลัก
                </span>
                <span className="text-[10px] text-amber-600 font-medium">
                  * เปลี่ยนประเภทแล้วสเปกย่อยจะถูกรีเซ็ต
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {CATEGORIES.map((cat) => {
                  const isActive = modalCategory === cat.name;
                  const IconComponent = cat.icon;
                  return (
                    <button
                      key={cat.name}
                      type="button"
                      onClick={() => handleCategoryChange(cat.name)}
                      className={`flex flex-col items-start p-2 rounded-2xl border transition-all text-left cursor-pointer relative ${
                        isActive
                          ? "bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/25 ring-2 ring-blue-600/30"
                          : "bg-slate-50/70 border-slate-200/80 text-slate-700 hover:bg-slate-100 hover:border-slate-300"
                      }`}
                    >
                      <div className="flex items-center justify-between w-full mb-1">
                        <div className={`p-1 rounded-lg ${isActive ? "bg-white/20" : "bg-blue-50 text-blue-600"}`}>
                          <IconComponent className="w-3.5 h-3.5" />
                        </div>
                        {isActive && <Check className="w-3.5 h-3.5 stroke-[3] text-white" />}
                      </div>
                      <span className={`text-xs font-bold ${isActive ? "text-white" : "text-slate-800"}`}>
                        {cat.name}
                      </span>
                      <span className={`text-[10px] line-clamp-1 mt-0.5 ${isActive ? "text-blue-100" : "text-slate-400"}`}>
                        {cat.subtitle}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ส่วนที่ 2: สเปกย่อย & ช่วงราคา */}
            <div className="p-5 overflow-y-auto space-y-3.5 flex-1 bg-[#F8FAFC]">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-blue-100 text-blue-600 text-[10px] flex items-center justify-center font-extrabold">2</span>
                  เลือกสเปกย่อยของ: <strong className="text-blue-600 font-extrabold">{modalCategory}</strong>
                </span>

                {tempFinishing.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setTempFinishing([])}
                    className="text-xs text-rose-500 hover:text-rose-600 font-medium flex items-center gap-1 hover:underline cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" />
                    ล้างค่าสเปก
                  </button>
                )}
              </div>

              {GROUPED_OPTIONS[modalCategory]?.map((grp, gIdx) => (
                <div key={gIdx} className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-2.5">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
                    <span className="text-xs font-bold text-slate-800 flex items-center gap-2">
                      <span className="w-1.5 h-3 bg-blue-600 rounded-full" />
                      {grp.group}
                    </span>
                    <span className="text-[10px] text-slate-400 font-normal">
                      (เลือกได้หลายข้อ หรือเว้นว่างได้)
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-0.5">
                    {grp.items.map((item) => {
                      const isSelected = tempFinishing.includes(item);
                      return (
                        <button
                          key={item}
                          type="button"
                          onClick={() => toggleOption(item)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-xl font-semibold transition-all cursor-pointer border ${
                            isSelected
                              ? "bg-blue-600 text-white border-blue-600 shadow-xs ring-1 ring-blue-600/20"
                              : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-blue-50/50 hover:border-blue-300"
                          }`}
                        >
                          {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                          <span>{item}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}

              {/* ช่วงราคารวม */}
              <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
                <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <span className="w-4 h-4 rounded-full bg-blue-100 text-blue-600 text-[10px] flex items-center justify-center font-extrabold">3</span>
                    งบประมาณราคารวมต่อชิ้น (บาท)
                  </span>
                  {(tempMinPrice || tempMaxPrice) && (
                    <button
                      type="button"
                      onClick={() => {
                        setTempMinPrice("");
                        setTempMaxPrice("");
                        setPriceError("");
                      }}
                      className="text-xs text-rose-500 hover:underline cursor-pointer"
                    >
                      ล้างช่วงราคา
                    </button>
                  )}
                </div>

                <div className="flex items-start gap-1.5 text-[11px] text-slate-500 bg-blue-50/60 p-2 rounded-xl border border-blue-100">
                  <Info className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                  <span>
                    ราคารวมต่อชิ้นงานที่ต้องการ (คำนวณรวมค่าพิมพ์ สเปก และการเข้าเล่ม)
                  </span>
                </div>

                <div className="flex items-center gap-2 pt-1 max-w-sm">
                  <div className="flex-1 relative">
                    <span className="absolute left-2.5 top-2 text-xs text-slate-400">฿</span>
                    <input
                      type="number"
                      min="1"
                      placeholder="ราคาต่ำสุด"
                      value={tempMinPrice ?? ""}
                      onChange={(e) => {
                        setTempMinPrice(e.target.value);
                        setPriceError("");
                      }}
                      className={`w-full pl-6 pr-2.5 py-1.5 bg-slate-50 border rounded-xl text-xs outline-none transition ${
                        priceError ? "border-red-500 bg-red-50/30" : "border-slate-200 focus:border-blue-600 focus:bg-white"
                      }`}
                    />
                  </div>
                  <span className="text-slate-400 font-bold">-</span>
                  <div className="flex-1 relative">
                    <span className="absolute left-2.5 top-2 text-xs text-slate-400">฿</span>
                    <input
                      type="number"
                      min="1"
                      placeholder="ราคาสูงสุด"
                      value={tempMaxPrice ?? ""}
                      onChange={(e) => {
                        setTempMaxPrice(e.target.value);
                        setPriceError("");
                      }}
                      className={`w-full pl-6 pr-2.5 py-1.5 bg-slate-50 border rounded-xl text-xs outline-none transition ${
                        priceError ? "border-red-500 bg-red-50/30" : "border-slate-200 focus:border-blue-600 focus:bg-white"
                      }`}
                    />
                  </div>
                </div>

                {priceError && (
                  <p className="text-red-500 text-[11px] font-semibold mt-1 animate-in fade-in duration-150">
                    ⚠️ {priceError}
                  </p>
                )}
              </div>
            </div>

            {/* Footer Pop-up */}
            <div className="px-5 py-3 border-t border-slate-100 bg-white flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-2 text-xs text-slate-500 truncate max-w-md w-full sm:w-auto">
                <span className="font-bold text-slate-700 shrink-0">เงื่อนไข:</span>
                <span className="text-blue-600 truncate font-semibold">
                  {tempFinishing.length > 0 ? tempFinishing.join(", ") : "ไม่ระบุสเปก"}
                  {(tempMinPrice || tempMaxPrice) &&
                    ` • ฿${tempMinPrice || "0"} - ฿${tempMaxPrice || "ไม่จำกัด"}`}
                </span>
              </div>

              <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end">
                <button
                  type="button"
                  onClick={handleConfirmModal}
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-md shadow-blue-500/25 active:scale-95 cursor-pointer"
                >
                  นำเงื่อนไขไปใช้ ({tempFinishing.length + (tempMinPrice || tempMaxPrice ? 1 : 0)})
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
