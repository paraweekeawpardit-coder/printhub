"use client";

import React, { useState } from "react";
import { 
  X, 
  Check, 
  RotateCcw, 
  SlidersHorizontal, 
  Info,
  FileText, 
  Smile, 
  Flag, 
  Contact, 
  Image as ImageIcon,
  MapPin,
  Star
} from "lucide-react";

interface FilterPillsBarProps {
  selectedCategory: string;
  isNearest: boolean;
  onToggleNearest: () => void;
  isOpenOnly: boolean;
  onToggleOpenOnly: () => void;
  isTopRated: boolean;
  onToggleTopRated: () => void;
  minPrice?: number | string;
  maxPrice?: number | string;
  onApplyPrice: (min?: number, max?: number) => void;
  selectedFinishing: string[];
  onSelectFinishing: (finishing: string[]) => void;
  onSelectCategory?: (category: string) => void;
  onResetAll: () => void;
}

const CATEGORIES = [
  { name: "เอกสาร", icon: FileText, subtitle: "ชีท, รายงาน, หนังสือ" },
  { name: "แผ่นสติกเกอร์", icon: Smile, subtitle: "ไดคัท, สติกเกอร์สินค้า" },
  { name: "ป้ายไวนิล", icon: Flag, subtitle: "ป้ายหน้าร้าน, แบนเนอร์" },
  { name: "นามบัตร", icon: Contact, subtitle: "บัตรสมาชิก, การ์ดแนะนำตัว" },
  { name: "โปสเตอร์", icon: ImageIcon, subtitle: "ภาพพิมพ์, ใบปิดประชาสัมพันธ์" },
];

const GROUPED_OPTIONS: Record<string, { group: string; items: string[] }[]> = {
  เอกสาร: [
    { group: "ขนาดกระดาษ", items: ["A3", "A4", "A5", "A6"] },
    { group: "รูปแบบสีการพิมพ์", items: ["พิมพ์ขาว-ดำ", "พิมพ์สี"] },
    { group: "รูปแบบการเข้าเล่ม/ตกแต่ง", items: ["เย็บมุม", "สันกาว", "กระดูกงู", "สันเกลียว"] },
  ],
  แผ่นสติกเกอร์: [
    { group: "ประเภทเนื้อสติกเกอร์", items: ["เนื้อ PP", "เนื้อกระดาษ", "โฮโลแกรม", "PP ใส"] },
    { group: "ขนาดไดคัทดวง (ซม.)", items: ["3x3 ซม.", "4x4 ซม.", "5x5 ซม.", "6x6 ซม.", "8x8 ซม.", "10x10 ซม."] },
  ],
  ป้ายไวนิล: [
    { group: "ขนาดยอดนิยม (พิมพ์หน้าเดียว)", items: ["60x160 ซม.", "160x60 ซม."] },
    { group: "การแปรรูปและเก็บขอบ", items: ["พับขอบ", "เจาะตาไก่"] },
  ],
  นามบัตร: [
    { group: "ขนาดมาตรฐาน", items: ["9x5.5 ซม.", "9x5 ซม.", "8.5x5.5 ซม."] },
    { group: "ด้านที่พิมพ์", items: ["พิมพ์ด้านหน้า", "พิมพ์หน้า-หลัง"] },
    { group: "ความหนาและชนิดกระดาษ", items: ["อาร์ตการ์ดมัน 400 แกรม", "อาร์ตการ์ดมัน 350 แกรม", "อาร์ตการ์ดมัน 300 แกรม", "อาร์ตการ์ดด้าน 400 แกรม", "อาร์ตการ์ดด้าน 350 แกรม", "อาร์ตการ์ดด้าน 300 แกรม"] },
    { group: "การเคลือบฟิล์มป้องกัน", items: ["เคลือบมัน ด้านหน้า", "เคลือบมัน สองด้าน", "เคลือบด้าน ด้านหน้า", "เคลือบด้าน สองด้าน"] },
  ],
  โปสเตอร์: [
    { group: "ขนาดโปสเตอร์", items: ["A3", "A4", "A5", "A6"] },
    { group: "รูปแบบสีการพิมพ์", items: ["พิมพ์ขาว-ดำ", "พิมพ์สี"] },
    { group: "ความหนาและชนิดกระดาษ", items: ["อาร์ตการ์ดมัน 400 แกรม", "อาร์ตการ์ดมัน 350 แกรม", "อาร์ตการ์ดมัน 300 แกรม", "อาร์ตการ์ดด้าน 400 แกรม", "อาร์ตการ์ดด้าน 350 แกรม", "อาร์ตการ์ดด้าน 300 แกรม"] },
  ],
};

export default function FilterPillsBar({
  selectedCategory,
  isNearest,
  onToggleNearest,
  isOpenOnly,
  onToggleOpenOnly,
  isTopRated,
  onToggleTopRated,
  minPrice,
  maxPrice,
  onApplyPrice,
  selectedFinishing,
  onSelectFinishing,
  onSelectCategory,
  onResetAll,
}: FilterPillsBarProps) {
  const [isFinishingModalOpen, setIsFinishingModalOpen] = useState(false);
  const [tempMinPrice, setTempMinPrice] = useState<number | string | undefined>(minPrice);
  const [tempMaxPrice, setTempMaxPrice] = useState<number | string | undefined>(maxPrice);

  const hasSpecificCategory = Boolean(selectedCategory && selectedCategory !== "ทั้งหมด");
  const [modalCategory, setModalCategory] = useState<string>(
    hasSpecificCategory ? selectedCategory : "เอกสาร"
  );

  const selectedOptionsList = Array.isArray(selectedFinishing) ? selectedFinishing : [];

  const hasPriceFilter = Boolean(
    (minPrice !== undefined && minPrice !== "" && minPrice !== null) ||
    (maxPrice !== undefined && maxPrice !== "" && maxPrice !== null)
  );
  const filterCount = selectedOptionsList.length + (hasPriceFilter ? 1 : 0);
  const hasActiveSpecs = filterCount > 0;

  const handleOpenModal = () => {
    if (hasSpecificCategory) {
      setModalCategory(selectedCategory);
    }
    setTempMinPrice(minPrice);
    setTempMaxPrice(maxPrice);
    setIsFinishingModalOpen(true);
  };

  const handleCategoryChange = (newCat: string) => {
    if (modalCategory !== newCat) {
      setModalCategory(newCat);
      onSelectFinishing([]);
    }
  };

  const toggleOption = (item: string) => {
    if (selectedOptionsList.includes(item)) {
      onSelectFinishing(selectedOptionsList.filter((x) => x !== item));
    } else {
      onSelectFinishing([...selectedOptionsList, item]);
    }
  };

  const handleConfirmModal = () => {
    const min = tempMinPrice !== "" && tempMinPrice !== undefined ? Number(tempMinPrice) : undefined;
    const max = tempMaxPrice !== "" && tempMaxPrice !== undefined ? Number(tempMaxPrice) : undefined;

    if (onSelectCategory) {
      onSelectCategory(modalCategory);
    }

    onApplyPrice(min, max);
    setIsFinishingModalOpen(false);
  };

  return (
    <>
      {/* แถบตัวกรอง Pills Bar ด้านนอก */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1.5 text-xs font-medium relative z-30">
        <button
          type="button"
          onClick={onToggleNearest}
          className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 border shrink-0 cursor-pointer ${
            isNearest
              ? "bg-blue-50 text-blue-600 border-blue-500 shadow-2xs font-semibold"
              : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
          }`}
        >
          <MapPin className="w-3.5 h-3.5 text-blue-600" />
          <span>ระยะทางใกล้ที่สุด</span>
        </button>

        <button
          type="button"
          onClick={onToggleOpenOnly}
          className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 border shrink-0 cursor-pointer ${
            isOpenOnly
              ? "bg-emerald-50 text-emerald-700 border-emerald-500 shadow-2xs font-semibold"
              : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
          }`}
        >
          <span className={`w-2 h-2 rounded-full ${isOpenOnly ? "bg-emerald-500" : "bg-slate-300"}`} />
          <span>เปิดให้บริการ</span>
        </button>

        <button
          type="button"
          onClick={onToggleTopRated}
          className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 border shrink-0 cursor-pointer ${
            isTopRated
              ? "bg-amber-50 text-amber-600 border-amber-500 shadow-2xs font-semibold"
              : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
          }`}
        >
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          <span>คะแนนสูงสุด</span>
        </button>

        <button
          type="button"
          onClick={handleOpenModal}
          className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 border shrink-0 cursor-pointer ${
            hasActiveSpecs
              ? "bg-blue-50 text-blue-600 border-blue-500 shadow-2xs font-semibold"
              : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
          }`}
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>
            {hasActiveSpecs ? `ตัวกรองสเปก (${filterCount})` : "สเปกงานพิมพ์และช่วงราคา"}
          </span>
          {hasActiveSpecs && <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />}
        </button>

        <button
          type="button"
          onClick={onResetAll}
          className="px-3.5 py-1.5 rounded-full border border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100 hover:border-rose-300 text-xs font-bold shrink-0 transition-all shadow-2xs cursor-pointer ml-auto flex items-center gap-1.5"
        >
          <RotateCcw className="w-3.5 h-3.5 text-rose-500" />
          <span>ล้างตัวกรอง</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* MODAL POP-UP (กดพื้นหลังเพื่อปิดได้ + มีปุ่ม X เด่นชัดมุมขวาบน) */}
      {/* ========================================================================= */}
      {isFinishingModalOpen && (
        <div 
          onClick={() => setIsFinishingModalOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-xs cursor-pointer"
        >
          <div 
            onClick={(e) => e.stopPropagation()} 
            className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[88vh] cursor-default relative animate-in fade-in zoom-in-95 duration-150"
          >
            {/* Header Pop-up พร้อมปุ่ม X ปิด Modal ชัดเจน */}
            <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-slate-50 via-white to-blue-50/30">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-xl bg-blue-50 text-blue-600">
                    <SlidersHorizontal className="w-4 h-4" />
                  </span>
                  <h3 className="font-extrabold text-sm sm:text-base text-slate-900 tracking-tight">
                    {hasSpecificCategory
                      ? `สเปกงานพิมพ์และช่วงราคา: ${selectedCategory}`
                      : "กำหนดสเปกและช่วงราคาต่อหน่วย"}
                  </h3>
                </div>
                <p className="text-[11px] text-slate-400 pl-8">
                  {hasSpecificCategory
                    ? `ระบบแสดงเฉพาะสเปกย่อยสำหรับงาน "${selectedCategory}" ที่คุณเลือกไว้`
                    : "เลือกประเภทงานพิมพ์ ระบุสเปกย่อย และกำหนดเพดานราคาต่อหน่วยที่ต้องการ"}
                </p>
              </div>

              {/* ปุ่มกากบาทปิด Modal สีเข้ม เด่นชัด */}
              <button
                type="button"
                onClick={() => setIsFinishingModalOpen(false)}
                className="w-9 h-9 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition cursor-pointer shrink-0"
                title="ปิดหน้าต่าง"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* ส่วนที่ 1: เลือกประเภทงานพิมพ์หลัก */}
            {!hasSpecificCategory && (
              <div className="px-5 py-3.5 bg-white border-b border-slate-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-4 h-4 rounded-full bg-blue-100 text-blue-600 text-[10px] flex items-center justify-center font-extrabold">1</span>
                    เลือกประเภทงานพิมพ์หลัก
                  </span>
                  <span className="text-[10px] text-amber-600 font-medium">
                    * เมื่อเปลี่ยนประเภท สเปกย่อยที่เลือกไว้จะถูกรีเซ็ต
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
                        className={`flex flex-col items-start p-2.5 rounded-2xl border transition-all text-left cursor-pointer relative ${
                          isActive
                            ? "bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/25 ring-2 ring-blue-600/30"
                            : "bg-slate-50/70 border-slate-200/80 text-slate-700 hover:bg-slate-100 hover:border-slate-300"
                        }`}
                      >
                        <div className="flex items-center justify-between w-full mb-1.5">
                          <div className={`p-1.5 rounded-xl ${isActive ? "bg-white/20" : "bg-blue-50 text-blue-600"}`}>
                            <IconComponent className="w-4 h-4" />
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
            )}

            {/* ส่วนที่ 2: สเปกย่อย & ช่วงราคา */}
            <div className="p-5 overflow-y-auto space-y-3.5 flex-1 bg-[#F8FAFC]">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-blue-100 text-blue-600 text-[10px] flex items-center justify-center font-extrabold">
                    {hasSpecificCategory ? "1" : "2"}
                  </span>
                  เลือกสเปกย่อยของ: <strong className="text-blue-600 font-extrabold">{modalCategory}</strong>
                </span>

                {selectedOptionsList.length > 0 && (
                  <button
                    type="button"
                    onClick={() => onSelectFinishing([])}
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
                      const isSelected = selectedOptionsList.includes(item);
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

              {/* ช่วงราคาต่อหน่วย */}
              <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
                <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <span className="w-4 h-4 rounded-full bg-blue-100 text-blue-600 text-[10px] flex items-center justify-center font-extrabold">
                      {hasSpecificCategory ? "2" : "3"}
                    </span>
                    งบประมาณราคาต่อหน่วย (บาท)
                  </span>
                  {(tempMinPrice || tempMaxPrice) && (
                    <button
                      type="button"
                      onClick={() => {
                        setTempMinPrice("");
                        setTempMaxPrice("");
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
                    ระบุเพดานราคาต่อ 1 หน่วย เช่น <strong>ค่าพิมพ์ต่อหน้า</strong> หรือ <strong>ค่าเข้าเล่มต่อเล่ม</strong>
                  </span>
                </div>

                <div className="flex items-center gap-2 pt-1 max-w-sm">
                  <div className="flex-1 relative">
                    <span className="absolute left-2.5 top-2 text-xs text-slate-400">฿</span>
                    <input
                      type="number"
                      placeholder="ราคาต่ำสุด"
                      value={tempMinPrice ?? ""}
                      onChange={(e) => setTempMinPrice(e.target.value)}
                      className="w-full pl-6 pr-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-blue-600 focus:bg-white transition"
                    />
                  </div>
                  <span className="text-slate-400 font-bold">-</span>
                  <div className="flex-1 relative">
                    <span className="absolute left-2.5 top-2 text-xs text-slate-400">฿</span>
                    <input
                      type="number"
                      placeholder="ราคาสูงสุด"
                      value={tempMaxPrice ?? ""}
                      onChange={(e) => setTempMaxPrice(e.target.value)}
                      className="w-full pl-6 pr-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-blue-600 focus:bg-white transition"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Pop-up */}
            <div className="px-5 py-3 border-t border-slate-100 bg-white flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs text-slate-500 truncate max-w-md w-full sm:w-auto">
                <span className="font-bold text-slate-700 shrink-0">เงื่อนไข:</span>
                <span className="text-blue-600 truncate font-semibold">
                  {selectedOptionsList.length > 0 ? selectedOptionsList.join(", ") : "ไม่ระบุสเปก"}
                  {(tempMinPrice || tempMaxPrice) &&
                    ` • ฿${tempMinPrice || "0"} - ฿${tempMaxPrice || "ไม่จำกัด"}/หน่วย`}
                </span>
              </div>

              <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end">
                <button
                  type="button"
                  onClick={handleConfirmModal}
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-md shadow-blue-500/25 active:scale-95 cursor-pointer"
                >
                  นำเงื่อนไขไปใช้ ({selectedOptionsList.length + (tempMinPrice || tempMaxPrice ? 1 : 0)})
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </>
  );
}