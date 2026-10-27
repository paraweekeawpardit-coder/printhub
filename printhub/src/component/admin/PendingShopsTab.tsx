"use client";

import React, { useState, useMemo, useEffect } from "react";
import { CheckCircle2 } from "lucide-react";
// 🟢 Import ShopCard และ Shop type
import ShopCard, { Shop } from "../../component/admin/ShopCard";
import PaginationBar from "../../component/admin/PaginationBar";

interface PendingShopsTabProps {
  shops?: Shop[]; // 🟢 ใส่ ? ป้องกัน undefined
  onVerify: (shop_id: string | number, action: "approve" | "reject") => void;
  onSelectShop: (shop: Shop) => void;
}

export default function PendingShopsTab({
  shops = [], // 🟢 กำหนดค่าเริ่มต้นเป็น Array เปล่า
  onVerify,
  onSelectShop,
}: PendingShopsTabProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  const safeShops = Array.isArray(shops) ? shops : [];

  useEffect(() => {
    setCurrentPage(1);
  }, [safeShops.length]);

  const totalItems = safeShops.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;

  const paginatedShops = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return safeShops.slice(startIndex, startIndex + itemsPerPage);
  }, [safeShops, currentPage, itemsPerPage]);

  if (safeShops.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-8 sm:p-12 text-center border border-dashed border-slate-300 shadow-2xs font-sans">
        <div className="w-12 h-12 sm:w-14 sm:h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
          <CheckCircle2 className="w-6 h-6 sm:w-8 sm:h-8" />
        </div>
        <h3 className="text-base sm:text-lg font-bold text-slate-700">
          ไม่มีคำขอสมัครใหม่
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          คำขอเปิดร้านค้าใหม่ทั้งหมดได้รับการตรวจสอบเรียบร้อยแล้ว
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3.5 sm:space-y-4 font-sans">
      <div className="flex items-center justify-between text-xs sm:text-sm text-slate-500 font-medium px-1">
        <span>
          คำขอสมัครใหม่รอการตรวจสอบทั้งหมด <strong className="text-slate-800">{totalItems}</strong> รายการ
        </span>
        {totalPages > 1 && (
          <span className="shrink-0 pl-2">
            หน้า <strong className="text-slate-800">{currentPage}</strong> / <strong className="text-slate-800">{totalPages}</strong>
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-6">
        {paginatedShops.map((shop, i) => (
          <ShopCard
            key={shop.id || shop._id || i}
            shop={shop}
            onVerify={onVerify}
            onSelectShop={onSelectShop}
          />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="pt-2">
          <PaginationBar
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </div>
  );
}