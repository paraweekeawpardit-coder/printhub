"use client";

import { useState } from "react";
import { Eye, Ban, CheckCircle, AlertTriangle, Loader2 } from "lucide-react";
import { Shop } from "./ShopCard";
import ShopDetailModal from "./ShopDetailModal";

interface AllShopsTableProps {
  shops: Shop[];
  onToggleSuspend: (
    shopId: string | number,
    currentStatus: string,
    reason?: string
  ) => Promise<void> | void;
}

export default function AllShopsTable({
  shops,
  onToggleSuspend,
}: AllShopsTableProps) {
  const [selectedShopDetail, setSelectedShopDetail] = useState<any | null>(
    null
  );
  const [selectedShopForBan, setSelectedShopForBan] = useState<any | null>(
    null
  );
  const [banReason, setBanReason] = useState<string>("");
  const [banning, setBanning] = useState<boolean>(false);

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
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs">
              <th className="px-5 py-3.5 font-medium">ร้านค้า</th>
              <th className="px-5 py-3.5 font-medium">เจ้าของร้าน</th>
              <th className="px-5 py-3.5 font-medium">เบอร์โทรศัพท์</th>
              <th className="px-5 py-3.5 font-medium">สถานะ</th>
              <th className="px-5 py-3.5 font-medium">การจัดการ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {shops.map((shop: any) => {
              const shopId = shop.id || shop._id || "";

              // 📌 1. ปรับการเช็คสถานะให้รองรับทั้งตัวพิมพ์เล็ก/ใหญ่ และเช็ค status ตรงๆ
              const rawStatus = (shop.status || "").toLowerCase();
              const isSuspended =
                rawStatus === "suspended" ||
                rawStatus === "banned" ||
                shop.is_banned === true;

              // 📌 2. ร้านจะขึ้น "ปิดร้านชั่วคราว" ก็ต่อเมื่อได้รับอนุมัติแล้ว แต่เจ้าของร้านกดปิดร้าน (is_open === false)
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
                        className="w-10 h-10 rounded-full object-cover"
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
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition"
                      >
                        <Eye size={14} />
                        รายละเอียด
                      </button>

                      {isSuspended ? (
                        <button
                          type="button"
                          onClick={() => handleUnban(shop)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 border border-emerald-200 text-emerald-700 hover:bg-emerald-100 transition"
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
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-50 border border-rose-200 text-rose-600 hover:bg-rose-100 transition"
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

      {/* Modal แสดงรายละเอียดร้านค้า */}
      {selectedShopDetail && (
        <ShopDetailModal
          shop={selectedShopDetail}
          onClose={() => setSelectedShopDetail(null)}
        />
      )}

      {/* Modal ยืนยันระงับใช้งาน */}
      {selectedShopForBan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm bg-white rounded-2xl p-6 shadow-xl flex flex-col items-center text-center">
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
                className="mt-1.5 w-full rounded-xl border border-slate-200 p-2.5 text-xs outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
              />
            </div>

            <div className="mt-5 flex gap-3 w-full">
              <button
                type="button"
                onClick={() => setSelectedShopForBan(null)}
                disabled={banning}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-600 hover:bg-slate-50 transition disabled:opacity-50"
              >
                ยกเลิก
              </button>
              <button
                type="button"
                onClick={handleConfirmBan}
                disabled={banning || !banReason.trim()}
                className="flex-1 py-2.5 rounded-xl border-none bg-rose-600 text-xs font-semibold text-white hover:bg-rose-700 transition flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {banning && <Loader2 size={14} className="animate-spin" />}
                {banning ? "กำลังบันทึก..." : "ยืนยันระงับใช้งาน"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}