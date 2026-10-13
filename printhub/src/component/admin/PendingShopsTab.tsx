"use client";

import React, { useState, useMemo, useEffect } from "react";
import { CheckCircle2 } from "lucide-react";
import ShopCard, { Shop } from "../../component/admin/ShopCard";
import PaginationBar from "../../component/admin/PaginationBar";

interface PendingShopsTabProps {
  shops: Shop[];
  onVerify: (shop_id: string | number, action: "approve" | "reject") => void;
  onSelectShop: (shop: Shop) => void;
}

export default function PendingShopsTab({
  shops,
  onVerify,
  onSelectShop,
}: PendingShopsTabProps) {
  // 🟢 State และการตั้งค่าระบบ Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9; // แสดงผลหน้าละ 9 การ์ด

  // รีเซ็ตไปที่หน้า 1 เมื่อจำนวนรายการเปลี่ยน (เช่น มีการกดอนุมัติ/ปฏิเสธร้านค้า)
  useEffect(() => {
    setCurrentPage(1);
  }, [shops.length]);

  const totalItems = shops.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;

  // ตัดแบ่งข้อมูลเฉพาะของหน้าปัจจุบัน
  const paginatedShops = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return shops.slice(startIndex, startIndex + itemsPerPage);
  }, [shops, currentPage, itemsPerPage]);

  if (shops.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-12 text-center border border-dashed border-slate-300">
        <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 size={32} />
        </div>
        <h3 className="text-lg font-semibold text-slate-700">
          ไม่มีคำขอสมัครใหม่
        </h3>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* ข้อความบอกจำนวนรายการ */}
      <div className="flex items-center justify-between text-xs md:text-sm text-slate-500 font-medium px-1">
        <span>
          คำขอสมัครใหม่รอการตรวจสอบทั้งหมด <strong>{totalItems}</strong> รายการ
        </span>
        {totalPages > 1 && (
          <span>
            หน้า <strong>{currentPage}</strong> จาก <strong>{totalPages}</strong>
          </span>
        )}
      </div>

      {/* แสดงการ์ดรายการร้านค้า */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedShops.map((shop, i) => (
          <ShopCard
            key={shop.id || (shop as any)._id || i}
            shop={shop}
            onVerify={onVerify}
            onSelectShop={onSelectShop}
          />
        ))}
      </div>

      {/* 🟢 แสดงปุ่ม PaginationBar เมื่อมีรายการมากกว่า 1 หน้า */}
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