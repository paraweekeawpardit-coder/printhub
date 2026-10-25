/**
 * Component: FilterPillButtonList
 * หน้าที่: แสดงแถบปุ่ม Pills ตัวกรองด้านนอกในแนวนอน (Horizontal Scroll)
 * ประกอบด้วย ปุ่มระยะทางใกล้ที่สุด, เปิดให้บริการ, คะแนนสูงสุด, ปุ่มเปิด Pop-up สเปก และปุ่มล้างตัวกรอง
 */

"use client";

import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { MapPin, Star, SlidersHorizontal, RotateCcw, ChevronDown, ArrowDownWideNarrow, ArrowUpNarrowWide } from "lucide-react";

type RatingSort = "none" | "high" | "low";
const RATING_OPTIONS = [1, 2, 3, 4, 5];
const ratingLabel = (n: number) => (n === 5 ? "5 ดาว" : `${n} ดาวขึ้นไป`);

interface FilterPillButtonListProps {
  isNearest: boolean;
  onToggleNearest: () => void;
  isOpenOnly: boolean;
  onToggleOpenOnly: () => void;
  isTopRated: boolean;
  onToggleTopRated: () => void;
  minRating?: number; // 0 = ไม่กรอง, 1-5 = ตั้งแต่ X ดาวขึ้นไป
  onChangeMinRating?: (rating: number) => void;
  ratingSort?: RatingSort;
  onChangeRatingSort?: (sort: RatingSort) => void;
  hasActiveSpecs: boolean;
  filterCount: number;
  onOpenModal: () => void;
  onResetAll: () => void;
}

export default function FilterPillButtonList({
  isNearest,
  onToggleNearest,
  isOpenOnly,
  onToggleOpenOnly,
  isTopRated,
  onToggleTopRated,
  minRating = 0,
  onChangeMinRating,
  ratingSort,
  onChangeRatingSort,
  hasActiveSpecs,
  filterCount,
  onOpenModal,
  onResetAll,
}: FilterPillButtonListProps) {
  // เมนูคะแนน (เรียง + กรองดาว) — วาดผ่าน portal เพราะแถบตัวกรองเลื่อนแนวนอนได้ (overflow) จะตัดเมนูทิ้ง
  const ratingBtnRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [menuPos, setMenuPos] = useState<{ top: number; left: number } | null>(null);
  const isMenuOpen = menuPos !== null;

  const openMenu = () => {
    const rect = ratingBtnRef.current?.getBoundingClientRect();
    if (!rect) return;
    const menuWidth = 300;
    setMenuPos({
      top: rect.bottom + 6,
      left: Math.max(8, Math.min(rect.left, window.innerWidth - menuWidth - 8)),
    });
  };
  const closeMenu = () => setMenuPos(null);

  useEffect(() => {
    if (!isMenuOpen) return;
    const onDown = (e: MouseEvent) => {
      const t = e.target as Node;
      if (menuRef.current?.contains(t) || ratingBtnRef.current?.contains(t)) return;
      closeMenu();
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeMenu();
    document.addEventListener("mousedown", onDown);
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", closeMenu);
    window.addEventListener("scroll", closeMenu, true);
    return () => {
      document.removeEventListener("mousedown", onDown);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", closeMenu);
      window.removeEventListener("scroll", closeMenu, true);
    };
  }, [isMenuOpen]);

  // ถ้าหน้าแม่ไม่ได้ส่ง ratingSort มา ใช้ isTopRated แบบเดิม
  const sort: RatingSort = ratingSort ?? (isTopRated ? "high" : "none");
  const changeSort = (next: RatingSort) => {
    if (onChangeRatingSort) onChangeRatingSort(next);
    else if ((next === "high") !== isTopRated) onToggleTopRated();
  };

  const isRatingActive = sort !== "none" || minRating > 0;
  const sortText = sort === "high" ? "สูงสุด" : sort === "low" ? "ต่ำสุด" : "";
  const ratingPillText =
    minRating > 0
      ? `${ratingLabel(minRating)}${sortText ? ` · เรียง${sortText}` : ""}`
      : sortText
      ? `คะแนน${sortText}`
      : "คะแนน";

  const chipClass = (selected: boolean) =>
    `flex items-center justify-center gap-1 px-2.5 py-1.5 rounded-xl border text-[11px] font-semibold transition cursor-pointer ${
      selected
        ? "bg-amber-500 border-amber-500 text-white"
        : "bg-white border-slate-200 text-slate-600 hover:border-amber-300 hover:bg-amber-50"
    }`;

  return (
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

      {/* คะแนน: ปุ่มเดียว กดแล้วมีเมนู เรียงคะแนนสูงสุด + กรองตามดาว */}
      <button
        ref={ratingBtnRef}
        type="button"
        onClick={() => (isMenuOpen ? closeMenu() : openMenu())}
        aria-haspopup="menu"
        aria-expanded={isMenuOpen}
        className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 border shrink-0 cursor-pointer ${
          isRatingActive
            ? "bg-amber-50 text-amber-700 border-amber-500 shadow-2xs font-semibold"
            : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
        }`}
      >
        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
        <span>{ratingPillText}</span>
        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isMenuOpen ? "rotate-180" : ""}`} />
      </button>

      {isMenuOpen &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            ref={menuRef}
            role="menu"
            style={{ top: menuPos!.top, left: menuPos!.left }}
            className="fixed z-[90] w-[300px] bg-white rounded-2xl border border-slate-200 shadow-xl p-3 space-y-3 text-xs animate-in fade-in zoom-in-95 duration-100"
          >
            {/* เรียงตามคะแนน (กดซ้ำเพื่อยกเลิก) */}
            <div className="space-y-1.5">
              <p className="text-[11px] font-semibold text-slate-500">เรียงตามคะแนน</p>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  type="button"
                  onClick={() => changeSort(sort === "high" ? "none" : "high")}
                  className={chipClass(sort === "high")}
                >
                  <ArrowDownWideNarrow className="w-3.5 h-3.5" />
                  สูงสุดก่อน
                </button>
                <button
                  type="button"
                  onClick={() => changeSort(sort === "low" ? "none" : "low")}
                  className={chipClass(sort === "low")}
                  disabled={!onChangeRatingSort}
                >
                  <ArrowUpNarrowWide className="w-3.5 h-3.5" />
                  ต่ำสุดก่อน
                </button>
              </div>
            </div>

            {/* กรองตามดาว: ตั้งแต่ X ดาวขึ้นไป (แถวเดียว) */}
            {onChangeMinRating && (
              <div className="space-y-1.5 pt-3 border-t border-slate-100">
                <p className="text-[11px] font-semibold text-slate-500">กรองตามดาว</p>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => onChangeMinRating(0)}
                    className={`${chipClass(minRating === 0)} flex-1`}
                  >
                    ทั้งหมด
                  </button>
                  {RATING_OPTIONS.map((n) => (
                    <button
                      key={n}
                      type="button"
                      title={ratingLabel(n)}
                      onClick={() => onChangeMinRating(minRating === n ? 0 : n)}
                      className={`${chipClass(minRating === n)} px-2`}
                    >
                      <Star
                        className={`w-3 h-3 ${minRating === n ? "fill-white text-white" : "fill-amber-400 text-amber-400"}`}
                      />
                      {n === 5 ? "5" : `${n}+`}
                    </button>
                  ))}
                </div>
                <p className="text-[10px] text-slate-400">
                  {minRating > 0 ? `แสดงเฉพาะร้านที่ได้ ${ratingLabel(minRating)}` : "แสดงร้านทุกคะแนน"}
                </p>
              </div>
            )}
          </div>,
          document.body
        )}

      <button
        type="button"
        onClick={onOpenModal}
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
  );
}





// return (
//     <div className="flex items-center gap-2.5 overflow-x-auto no-scrollbar py-2 text-sm font-medium relative z-30">
//       {/* 1. ปุ่มระยะทางใกล้ที่สุด */}
//       <button
//         type="button"
//         onClick={onToggleNearest}
//         className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-150 flex items-center gap-2 border shrink-0 cursor-pointer ${
//           isNearest
//             ? "bg-blue-50 text-blue-600 border-blue-500 shadow-2xs font-semibold"
//             : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-slate-300"
//         }`}
//       >
//         <MapPin className="w-4 h-4 text-blue-600 shrink-0" />
//         <span>ระยะทางใกล้ที่สุด</span>
//       </button>

//       {/* 2. ปุ่มเปิดให้บริการ */}
//       <button
//         type="button"
//         onClick={onToggleOpenOnly}
//         className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-150 flex items-center gap-2 border shrink-0 cursor-pointer ${
//           isOpenOnly
//             ? "bg-emerald-50 text-emerald-700 border-emerald-500 shadow-2xs font-semibold"
//             : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-slate-300"
//         }`}
//       >
//         <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${isOpenOnly ? "bg-emerald-500" : "bg-slate-300"}`} />
//         <span>เปิดให้บริการ</span>
//       </button>

//       {/* 3. ปุ่มคะแนนสูงสุด */}
//       <button
//         type="button"
//         onClick={onToggleTopRated}
//         className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-150 flex items-center gap-2 border shrink-0 cursor-pointer ${
//           isTopRated
//             ? "bg-amber-50 text-amber-700 border-amber-500 shadow-2xs font-semibold"
//             : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-slate-300"
//         }`}
//       >
//         <Star className="w-4 h-4 fill-amber-400 text-amber-400 shrink-0" />
//         <span>คะแนนสูงสุด</span>
//       </button>

//       {/* 4. ปุ่มเปิด Modal สเปกและราคา */}
//       <button
//         type="button"
//         onClick={onOpenModal}
//         className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-150 flex items-center gap-2 border shrink-0 cursor-pointer ${
//           hasActiveSpecs
//             ? "bg-blue-50 text-blue-600 border-blue-500 shadow-2xs font-semibold"
//             : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-slate-300"
//         }`}
//       >
//         <SlidersHorizontal className="w-4 h-4 shrink-0" />
//         <span>
//           {hasActiveSpecs ? `ตัวกรองสเปก (${filterCount})` : "สเปกงานพิมพ์และช่วงราคา"}
//         </span>
//         {hasActiveSpecs && <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0" />}
//       </button>

//       {/* 5. ปุ่มล้างตัวกรอง */}
//       <button
//         type="button"
//         onClick={onResetAll}
//         className="px-4 py-2 rounded-full border border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100 hover:border-rose-300 text-sm font-bold shrink-0 transition-all duration-150 shadow-2xs cursor-pointer ml-auto flex items-center gap-1.5"
//       >
//         <RotateCcw className="w-4 h-4 text-rose-500 shrink-0" />
//         <span>ล้างตัวกรอง</span>
//       </button>
//     </div>
//   );