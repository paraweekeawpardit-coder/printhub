/**
 * Component: FilterFinishingModal
 * หน้าที่: Pop-up Modal ควบคุมการเปิด/ปิดฉากหลัง (Backdrop) และประกอบชิ้นส่วนย่อย
 * (Header, CategoryStep, FinishingStep, PriceStep, Footer) เข้าด้วยกันอย่างสมบูรณ์
 */

"use client";

import React from "react";
import FilterModalHeader from "./FilterModalHeader";
import FilterModalCategoryStep from "./FilterModalCategoryStep";
import FilterModalFinishingStep from "./FilterModalFinishingStep";
import FilterModalPriceStep from "./FilterModalPriceStep";
import FilterModalFooter from "./FilterModalFooter";

interface FilterFinishingModalProps {
  isOpen: boolean;
  onClose: () => void;
  modalCategory: string;
  onCategoryChange: (newCat: string) => void;
  tempFinishing: string[];
  onToggleOption: (item: string) => void;
  onClearFinishing: () => void;
  tempMinPrice: number | string | undefined;
  tempMaxPrice: number | string | undefined;
  priceError: string;
  onMinPriceChange: (val: string) => void;
  onMaxPriceChange: (val: string) => void;
  onClearPrice: () => void;
  onConfirm: () => void;
}

export default function FilterFinishingModal({
  isOpen,
  onClose,
  modalCategory,
  onCategoryChange,
  tempFinishing,
  onToggleOption,
  onClearFinishing,
  tempMinPrice,
  tempMaxPrice,
  priceError,
  onMinPriceChange,
  onMaxPriceChange,
  onClearPrice,
  onConfirm,
}: FilterFinishingModalProps) {
  if (!isOpen) return null;

  return (
    <div 
      onClick={onClose}
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-5 pt-24 sm:pt-28 pb-6 bg-slate-900/60 backdrop-blur-xs cursor-pointer"
    >
      <div 
        onClick={(e) => e.stopPropagation()} 
        className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[80vh] relative animate-in fade-in zoom-in-95 duration-150 cursor-default"
      >
        {/* Header */}
        <FilterModalHeader onClose={onClose} />

        {/* ส่วนที่ 1: เลือกประเภทงานพิมพ์หลัก */}
        <FilterModalCategoryStep 
          modalCategory={modalCategory}
          onCategoryChange={onCategoryChange}
        />

        {/* ส่วนที่ 2: สเปกย่อย & ช่วงราคา */}
        <div className="p-5 overflow-y-auto space-y-3.5 flex-1 bg-[#F8FAFC]">
          <FilterModalFinishingStep 
            modalCategory={modalCategory}
            tempFinishing={tempFinishing}
            onToggleOption={onToggleOption}
            onClearFinishing={onClearFinishing}
          />

          <FilterModalPriceStep 
            tempMinPrice={tempMinPrice}
            tempMaxPrice={tempMaxPrice}
            priceError={priceError}
            onMinPriceChange={onMinPriceChange}
            onMaxPriceChange={onMaxPriceChange}
            onClearPrice={onClearPrice}
          />
        </div>

        {/* Footer */}
        <FilterModalFooter 
          tempFinishing={tempFinishing}
          tempMinPrice={tempMinPrice}
          tempMaxPrice={tempMaxPrice}
          onConfirm={onConfirm}
        />
      </div>
    </div>
  );
}