/**
 * Component: FilterPillsBar
 * หน้าที่: แถบตัวกรองหลักที่นำ Component ย่อยทั้งหมดมาประกอบกัน ควบคุม State 
 * การเปิด Modal, การเลือกสเปก, ตรวจสอบความถูกต้องของราคา และส่งค่ากรองกลับไปยังหน้าหลัก
 */

"use client";

import React, { useState } from "react";
import FilterPillButtonList from "./FilterPillButtonList";
import FilterFinishingModal from "./FilterFinishingModal";

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

  const [modalCategory, setModalCategory] = useState<string>("เอกสาร");
  const [tempFinishing, setTempFinishing] = useState<string[]>([]);
  const [priceError, setPriceError] = useState("");

  const selectedOptionsList = Array.isArray(selectedFinishing) ? selectedFinishing : [];

  const hasPriceFilter = Boolean(
    (minPrice !== undefined && minPrice !== "" && minPrice !== null) ||
    (maxPrice !== undefined && maxPrice !== "" && maxPrice !== null)
  );
  const filterCount = selectedOptionsList.length + (hasPriceFilter ? 1 : 0);
  const hasActiveSpecs = filterCount > 0;

  const handleOpenModal = () => {
    setModalCategory(selectedCategory && selectedCategory !== "ทั้งหมด" ? selectedCategory : "เอกสาร");
    setTempFinishing(selectedFinishing || []);
    setTempMinPrice(minPrice);
    setTempMaxPrice(maxPrice);
    setPriceError("");
    setIsFinishingModalOpen(true);
  };

  const handleCategoryChange = (newCat: string) => {
    if (modalCategory !== newCat) {
      setModalCategory(newCat);
      setTempFinishing([]);
    }
  };

  const toggleOption = (item: string) => {
    if (tempFinishing.includes(item)) {
      setTempFinishing(tempFinishing.filter((x) => x !== item));
    } else {
      setTempFinishing([...tempFinishing, item]);
    }
  };

  // Logic ตรวจสอบความถูกต้องของราคาก่อนตกลง
  const handleConfirmModal = () => {
    const min = tempMinPrice !== "" && tempMinPrice !== undefined && tempMinPrice !== null ? Number(tempMinPrice) : undefined;
    const max = tempMaxPrice !== "" && tempMaxPrice !== undefined && tempMaxPrice !== null ? Number(tempMaxPrice) : undefined;

    // 1. ตรวจสอบหากกรอกราคา <= 0
    if ((min !== undefined && min <= 0) || (max !== undefined && max <= 0)) {
      setPriceError("กรุณาระบุงบประมาณราคาที่มากกว่า 0 บาท");
      return;
    }

    // 2. ตรวจสอบกรณีราคาต่ำสุดมากกว่าราคาสูงสุด
    if (min !== undefined && max !== undefined && min > max) {
      setPriceError("ราคาต่ำสุดต้องไม่มากกว่าราคาสูงสุด");
      return;
    }

    setPriceError("");

    if (onSelectCategory) onSelectCategory(modalCategory);
    onSelectFinishing(tempFinishing);
    onApplyPrice(min, max);
    setIsFinishingModalOpen(false);
  };

  return (
    <>
      {/* แถบตัวกรอง Pills Bar ด้านนอก */}
      <FilterPillButtonList 
        isNearest={isNearest}
        onToggleNearest={onToggleNearest}
        isOpenOnly={isOpenOnly}
        onToggleOpenOnly={onToggleOpenOnly}
        isTopRated={isTopRated}
        onToggleTopRated={onToggleTopRated}
        hasActiveSpecs={hasActiveSpecs}
        filterCount={filterCount}
        onOpenModal={handleOpenModal}
        onResetAll={onResetAll}
      />

      {/* Pop-up Modal สเปกและช่วงราคา */}
      <FilterFinishingModal 
        isOpen={isFinishingModalOpen}
        onClose={() => setIsFinishingModalOpen(false)}
        modalCategory={modalCategory}
        onCategoryChange={handleCategoryChange}
        tempFinishing={tempFinishing}
        onToggleOption={toggleOption}
        onClearFinishing={() => setTempFinishing([])}
        tempMinPrice={tempMinPrice}
        tempMaxPrice={tempMaxPrice}
        priceError={priceError}
        onMinPriceChange={(val) => {
          setTempMinPrice(val);
          setPriceError("");
        }}
        onMaxPriceChange={(val) => {
          setTempMaxPrice(val);
          setPriceError("");
        }}
        onClearPrice={() => {
          setTempMinPrice("");
          setTempMaxPrice("");
          setPriceError("");
        }}
        onConfirm={handleConfirmModal}
      />
    </>
  );
}