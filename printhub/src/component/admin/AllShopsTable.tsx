"use client";

import { useState, useMemo, useEffect } from "react";
import { Eye, Ban, CheckCircle, AlertTriangle, Loader2 } from "lucide-react";
import { Shop } from "./ShopCard";
import ShopDetailModal from "./ShopDetailModal";
import PaginationBar from "./PaginationBar";

interface AllShopsTableProps {
  shops: Shop[];
  onToggleSuspend: (
    shopId: string | number,
    currentStatus: string,
    reason?: string
  ) => Promise<void> | void;
  itemsPerPage?: number;
}

export default function AllShopsTable({
  shops,
  onToggleSuspend,
  itemsPerPage = 10,
}: AllShopsTableProps) {
  const [selectedShopDetail, setSelectedShopDetail] = useState<any | null>(null);
  const [selectedShopForBan, setSelectedShopForBan] = useState<any | null>(null);
  const [banReason, setBanReason] = useState<string>("");
  const [banning, setBanning] = useState<boolean>(false);

  // State สำหรับจัดการ Pagination
  const [currentPage, setCurrentPage] = useState<number>(1);

  // รีเซ็ตหน้ากลับไปหน้า 1 เมื่อมีการค้นหา/กรองข้อมูลใหม่
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

  const handleConfirmBan = async () => {
    if (!selectedShopForBan || !banReason.trim()) return;

    try {
      setBanning(true);
      const shopId = selectedShopForBan.id || selectedShopForBan._id;
      await onToggleSuspend(
        shopId,
        selectedShopForBan.status || "approved",
        banReason
      );
      setSelectedShopForBan(null);
      setBanReason("");
    } catch (error) {
      console.error("Failed to suspend shop:", error);
    } finally {
      setBanning(false);
    }
  };

  const handleUnban = async (shop: any) => {
    const shopId = shop.id || shop._id;
    await onToggleSuspend(shopId, "suspended");
  };

  return (
    <div className="space-y-4 font-sans">
      {/* 📱 Mobile Card View (สำหรับจอมือถือ) */}
      <div className="block md:hidden space-y-3">
        {paginatedShops.map((shop: any) => {
          const shopId = shop.id || shop._id || "";

          const rawStatus = (shop.status || "").toLowerCase();
          const isSuspended =
            rawStatus === "suspended" ||
            rawStatus === "banned" ||
            shop.is_banned === true;

          const isApproved = rawStatus === "approved";
          const isClosed = isApproved && shop.is_open === false;

          return (
            <div
              key={shopId}
              className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3 text-xs"
            >
              {/* Header Card */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <div className="flex items-center gap-2.5 min-w-0">
                  <img
                    src={
                      shop.profile_image ||
                      shop.logoUrl ||
                      shop.logo_url ||
                      "/placeholder.png"
                    }
                    alt=""
                    className="w-10 h-10 rounded-full object-cover shrink-0 border border-slate-100"
                  />
                  <div className="min-w-0">
                    <h4 className="font-bold text-slate-900 text-xs truncate">
                      {shop.shop_name || shop.name}
                    </h4>
                    <p className="text-[11px] text-slate-500 truncate">
                      {shop.email || "-"}
                    </p>
                  </div>
                </div>

                <div className="shrink-0">
                  {isSuspended ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                      ถูกระงับ
                    </span>
                  ) : isClosed ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                      ปิดชั่วคราว
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      ปกติ
                    </span>
                  )}
                </div>
              </div>

              {/* Owner & Phone Info */}
              <div className="grid grid-cols-2 gap-2 text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <div>
                  <span className="text-[10px] text-slate-400 block">เจ้าของร้าน</span>
                  <span className="font-semibold text-slate-800 truncate block">
                    {shop.owner_name || shop.ownerName || "-"}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">เบอร์โทรศัพท์</span>
                  <span className="font-medium text-slate-700 truncate block">
                    {shop.phone || "-"}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setSelectedShopDetail(shop)}
                  className="inline-flex items-center justify-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition"
                >
                  <Eye size={13} />
                  รายละเอียด
                </button>

                {isSuspended ? (
                  <button
                    type="button"
                    onClick={() => handleUnban(shop)}
                    className="inline-flex items-center justify-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-50 border border-emerald-200 text-emerald-700 hover:bg-emerald-100 transition"
                  >
                    <CheckCircle size={13} />
                    ปลดระงับ
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedShopForBan(shop);
                      setBanReason("");
                    }}
                    className="inline-flex items-center justify-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold bg-rose-50 border border-rose-200 text-rose-600 hover:bg-rose-100 transition"
                  >
                    <Ban size={13} />
                    ระงับ
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* 💻 Desktop Table View (สำหรับจอใหญ่) */}
      <div className="hidden md:block bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs font-semibold uppercase tracking-wider">
                <th className="px-5 py-3.5 font-medium">ร้านค้า</th>
                <th className="px-5 py-3.5 font-medium">เจ้าของร้าน</th>
                <th className="px-5 py-3.5 font-medium">เบอร์โทรศัพท์</th>
                <th className="px-5 py-3.5 font-medium">สถานะ</th>
                <th className="px-5 py-3.5 font-medium">การจัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {paginatedShops.map((shop: any) => {
                const shopId = shop.id || shop._id || "";

                const rawStatus = (shop.status || "").toLowerCase();
                const isSuspended =
                  rawStatus === "suspended" ||
                  rawStatus === "banned" ||
                  shop.is_banned === true;

                const isApproved = rawStatus === "approved";
                const isClosed = isApproved && shop.is_open === false;

                return (
                  <tr key={shopId} className="hover:bg-slate-50/50 transition">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={
                            shop.profile_image ||
                            shop.logoUrl ||
                            shop.logo_url ||
                            "/placeholder.png"
                          }
                          alt=""
                          className="w-10 h-10 rounded-full object-cover shrink-0"
                        />
                        <div>
                          <div className="font-semibold text-slate-900">
                            {shop.shop_name || shop.name}
                          </div>
                          <div className="text-xs text-slate-500">
                            {shop.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-slate-700">
                      {shop.owner_name || shop.ownerName || "-"}
                    </td>
                    <td className="px-5 py-4 text-slate-700">
                      {shop.phone || "-"}
                    </td>
                    <td className="px-5 py-4">
                      {isSuspended ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />{" "}
                          ถูกระงับการใช้งาน
                        </span>
                      ) : isClosed ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />{" "}
                          ปิดร้านชั่วคราว
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />{" "}
                          เปิดใช้งานปกติ
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setSelectedShopDetail(shop)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition cursor-pointer"
                        >
                          <Eye size={14} />
                          รายละเอียด
                        </button>

                        {isSuspended ? (
                          <button
                            type="button"
                            onClick={() => handleUnban(shop)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 border border-emerald-200 text-emerald-700 hover:bg-emerald-100 transition cursor-pointer"
                          >
                            <CheckCircle size={14} />
                            ปลดระงับ
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedShopForBan(shop);
                              setBanReason("");
                            }}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-50 border border-rose-200 text-rose-600 hover:bg-rose-100 transition cursor-pointer"
                          >
                            <Ban size={14} />
                            ระงับการใช้งาน
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal แสดงรายละเอียดร้านค้า */}
      {selectedShopDetail && (
        <ShopDetailModal
          shop={selectedShopDetail}
          onClose={() => setSelectedShopDetail(null)}
        />
      )}

      {/* Modal ยืนยันระงับใช้งาน */}
      {selectedShopForBan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-3.5 sm:p-4">
          <div className="w-full max-w-sm bg-white rounded-2xl p-5 sm:p-6 shadow-2xl border border-slate-100 flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mb-3">
              <AlertTriangle size={24} />
            </div>

            <h3 className="text-base font-bold text-slate-900">
              ยืนยันการระงับร้านค้า
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              คุณกำลังจะระงับการใช้งานร้านค้า{" "}
              <span className="font-bold text-slate-800">
                "{selectedShopForBan.shop_name || selectedShopForBan.name}"
              </span>
            </p>

            <div className="mt-4 w-full text-left">
              <label className="text-xs font-semibold text-slate-600">
                เหตุผลในการระงับ <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={3}
                value={banReason}
                onChange={(e) => setBanReason(e.target.value)}
                placeholder="ระบุเหตุผลการระงับ..."
                className="mt-1.5 w-full rounded-xl border border-slate-200 p-2.5 text-xs outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 text-slate-800 placeholder:text-slate-400 bg-slate-50 focus:bg-white transition-all"
              />
            </div>

            <div className="mt-5 flex gap-2.5 w-full">
              <button
                type="button"
                onClick={() => setSelectedShopForBan(null)}
                disabled={banning}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-600 hover:bg-slate-50 transition cursor-pointer disabled:opacity-50"
              >
                ยกเลิก
              </button>
              <button
                type="button"
                onClick={handleConfirmBan}
                disabled={banning || !banReason.trim()}
                className="flex-1 py-2.5 rounded-xl border-none bg-rose-600 text-xs font-semibold text-white hover:bg-rose-700 transition flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-2xs"
              >
                {banning && <Loader2 size={14} className="animate-spin" />}
                {banning ? "กำลังบันทึก..." : "ยืนยันระงับใช้งาน"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* แสดงปุ่มเปลี่ยนหน้า Pagination เมื่อข้อมูลมีมากกว่า 1 หน้า */}
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