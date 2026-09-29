"use client";

import { useState, useEffect, useCallback, useMemo, Suspense } from "react";
import {
  FileText,
  Landmark,
  Store,
  AlertCircle,
  CheckCircle2,
  RotateCw,
} from "lucide-react";
import { useSearchParams } from "next/navigation";

// 📌 Import Components จากโฟลเดอร์ src/component/admin/
import ShopCard, { Shop } from "../../../component/admin/ShopCard";
import ShopDetailModal from "../../../component/admin/ShopDetailModal";
import BankRequestCard, {
  BankChangeRequest,
} from "../../../component/admin/BankRequestCard";
import AllShopsTable from "../../../component/admin/AllShopsTable";
import ConfirmModal, {
  ConfirmModalState,
} from "../../../component/admin/ConfirmModal";
import PendingShopsTab from "../../../component/admin/PendingShopsTab";
import ShopFilterControls from "../../../component/admin/ShopFilterControls";
import PaginationBar from "../../../component/admin/PaginationBar";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/admin";
const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

const getImageUrl = (url?: string) => {
  if (!url) return undefined;
  if (url.startsWith("http://") || url.startsWith("https://")) return url;

  const cleanUrl = url.startsWith("/") ? url.slice(1) : url;
  return `${BACKEND_URL}/${cleanUrl}`;
};

const formatAddressString = (addrData: any) => {
  if (!addrData) return "";
  if (typeof addrData === "string") return addrData;
  if (typeof addrData === "object") {
    const parts = [
      addrData.detail || addrData.house_number || addrData.address,
      addrData.subdistrict || addrData.sub_district || addrData.tambon,
      addrData.district || addrData.amphoe,
      addrData.province || addrData.changwat,
      addrData.postcode || addrData.postal_code || addrData.zipcode,
    ];
    return parts.filter(Boolean).join(" ").trim();
  }
  return "";
};

function ShopsContent() {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");

  const [activeTab, setActiveTab] = useState<"pending" | "bank" | "all">(
    tabParam === "all" ? "all" : tabParam === "bank" ? "bank" : "pending",
  );

  const [pendingShops, setPendingShops] = useState<Shop[]>([]);
  const [bankRequests, setBankRequests] = useState<BankChangeRequest[]>([]);
  const [allShops, setAllShops] = useState<Shop[]>([]);

  const [selectedShop, setSelectedShop] = useState<Shop | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // State สำหรับ Filter & Search ใน Tab ร้านค้าทั้งหมด
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "ALL" | "APPROVED" | "SUSPENDED"
  >("ALL");
  const [sortBy, setSortBy] = useState<
    "newest" | "oldest" | "name_asc" | "name_desc"
  >("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handleResetFilters = () => {
    setSearchTerm("");
    setStatusFilter("ALL");
    setSortBy("newest");
    setCurrentPage(1);
  };

  const [confirmModal, setConfirmModal] = useState<ConfirmModalState>({
    isOpen: false,
    title: "",
    message: "",
    type: "approve",
    onConfirm: () => {},
  });

  const closeConfirmModal = () => {
    setConfirmModal((prev) => ({ ...prev, isOpen: false }));
  };

  const fetchAllInitialData = useCallback(async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const [pendingRes, bankRes, allRes] = await Promise.all([
        fetch(`${API_URL}/shops/pending`).catch(() => null),
        fetch(`${API_URL}/bank-accounts/pending`).catch(() => null),
        fetch(`${API_URL}/shops/all`).catch(() => null),
      ]);

      if (pendingRes && pendingRes.ok) {
        const result = await pendingRes.json();
        const data = result.data || result;
        const formatted = (Array.isArray(data) ? data : []).map((s: any) => ({
          ...s,
          profile_image: getImageUrl(s.profile_image || s.logoUrl),
        }));
        setPendingShops(formatted);
      }

      if (bankRes && bankRes.ok) {
        const result = await bankRes.json();
        const data = result.data || result;
        const formatted = (Array.isArray(data) ? data : []).map((req: any) => ({
          ...req,
          created_at:
            req.created_at ||
            req.createdAt ||
            req.requested_at ||
            req.updated_at,
          shopLogo: getImageUrl(
            req.shopLogo || req.logoUrl || req.shop?.profile_image,
          ),
        }));
        setBankRequests(formatted);
      }

      if (allRes && allRes.ok) {
        const result = await allRes.json();
        const data = result.data || result;
        const formatted = (Array.isArray(data) ? data : []).map((s: any) => ({
          ...s,
          profile_image: getImageUrl(s.profile_image || s.logoUrl),
        }));
        setAllShops(formatted);
      }
    } catch (err: any) {
      console.error("Fetch Data Error:", err);
      setErrorMsg(err.message || "ไม่สามารถดึงข้อมูลได้");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllInitialData();
  }, [fetchAllInitialData]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, sortBy, activeTab]);

  // คำนวณข้อมูลค้นหาและ Filter สำหรับร้านค้าทั้งหมด
  const filteredAndSortedShops = useMemo(() => {
    let result = [...allShops];

    if (searchTerm.trim() !== "") {
      const term = searchTerm.toLowerCase();
      result = result.filter((shop: any) => {
        const name = (shop.shop_name || shop.name || "").toLowerCase();
        const owner = (shop.owner_name || shop.ownerName || "").toLowerCase();
        const phone = (shop.phone || "").toLowerCase();
        const email = (shop.email || "").toLowerCase();
        return (
          name.includes(term) ||
          owner.includes(term) ||
          phone.includes(term) ||
          email.includes(term)
        );
      });
    }

    if (statusFilter !== "ALL") {
      result = result.filter((shop: any) => {
        const status = (shop.status || "APPROVED").toUpperCase();
        return status === statusFilter;
      });
    }

    result.sort((a: any, b: any) => {
      if (sortBy === "newest") {
        return (
          new Date(b.created_at || b.createdAt || b.id || 0).getTime() -
          new Date(a.created_at || a.createdAt || a.id || 0).getTime()
        );
      }
      if (sortBy === "oldest") {
        return (
          new Date(a.created_at || a.createdAt || a.id || 0).getTime() -
          new Date(b.created_at || b.createdAt || b.id || 0).getTime()
        );
      }
      if (sortBy === "name_asc") {
        return (a.shop_name || a.name || "").localeCompare(
          b.shop_name || b.name || "",
          "th",
        );
      }
      if (sortBy === "name_desc") {
        return (b.shop_name || b.name || "").localeCompare(
          a.shop_name || a.name || "",
          "th",
        );
      }
      return 0;
    });

    return result;
  }, [allShops, searchTerm, statusFilter, sortBy]);

  const totalItems = filteredAndSortedShops.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const paginatedShops = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedShops.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAndSortedShops, currentPage]);

  // 📌 ปรับแก้ไขฟังก์ชันอนุมัติร้านค้า เพื่อแนบ admin_id ส่งไปด้วย
  const executeVerifyShop = async (
    shop_id: string | number,
    action: "approve" | "reject",
  ) => {
    try {
      // ดึง admin_id และ token จาก Storage (ปรับเปลี่ยน key ให้ตรงกับที่เก็บในแอปของคุณ)
      const adminId = typeof window !== "undefined" ? localStorage.getItem("admin_id") : null;
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const res = await fetch(`${API_URL}/shops/verify`, {
        method: "PATCH",
        headers,
        body: JSON.stringify({ 
          shop_id, 
          action, 
          admin_id: adminId, 
          verified_by: adminId 
        }),
      });
      if (!res.ok) throw new Error("การอัปเดตสถานะล้มเหลว");

      setPendingShops((prev) =>
        prev.filter((s) => String(s.id || (s as any)._id) !== String(shop_id)),
      );
      setSelectedShop(null);
      fetchAllInitialData();
    } catch (err: any) {
      console.error("Verify Shop Error:", err.message);
    } finally {
      closeConfirmModal();
    }
  };

  const handleVerifyShop = (
    shop_id: string | number,
    action: "approve" | "reject",
  ) => {
    const actionText = action === "approve" ? "อนุมัติ" : "ปฏิเสธ";
    setConfirmModal({
      isOpen: true,
      title: `ยืนยันการ${actionText}ร้านค้า`,
      message: `คุณต้องการ${actionText}คำขอเปิดร้านค้านี้ใช่หรือไม่?`,
      type: action === "approve" ? "approve" : "reject",
      onConfirm: () => executeVerifyShop(shop_id, action),
    });
  };

  const executeVerifyBank = async (
    requestId: string,
    action: "approve" | "reject",
  ) => {
    try {
      const res = await fetch(`${API_URL}/bank-accounts/verify`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ request_id: requestId, action }),
      });
      if (!res.ok) throw new Error("การดำเนินการล้มเหลว");

      setBankRequests((prev) => prev.filter((item) => item.id !== requestId));
      fetchAllInitialData();
    } catch (err: any) {
      console.error("Verify Bank Error:", err.message);
    } finally {
      closeConfirmModal();
    }
  };

  const handleVerifyBank = (
    requestId: string,
    action: "approve" | "reject",
  ) => {
    const actionText = action === "approve" ? "อนุมัติ" : "ปฏิเสธ";
    setConfirmModal({
      isOpen: true,
      title: `ยืนยันการ${actionText}เปลี่ยนบัญชีธนาคาร`,
      message: `คุณต้องการ${actionText}คำขอเปลี่ยนบัญชีธนาคารนี้ใช่หรือไม่?`,
      type: action === "approve" ? "approve" : "reject",
      onConfirm: () => executeVerifyBank(requestId, action),
    });
  };

  const executeToggleSuspendShop = async (
    shop_id: string | number,
    currentStatus: string,
    reason?: string,
  ) => {
    try {
      const normalizedStatus = (currentStatus || "").toLowerCase();
      const isSuspending = normalizedStatus !== "suspended" && normalizedStatus !== "banned";

      const res = await fetch(`${API_URL}/shops/suspend`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ shop_id, suspend: isSuspending, reason }),
      });
      if (!res.ok) throw new Error("การเปลี่ยนสถานะล้มเหลว");

      setAllShops((prev) =>
        prev.map((shop) =>
          String(shop.id || (shop as any)._id) === String(shop_id)
            ? { 
                ...shop, 
                status: isSuspending ? "suspended" : "approved",
                suspend_reason: isSuspending ? reason : null
              }
            : shop,
        ),
      );

      fetchAllInitialData();
    } catch (err: any) {
      console.error("Toggle Suspend Error:", err.message);
    } finally {
      closeConfirmModal();
    }
  };

  const handleToggleSuspendShop = (
    shop_id: string | number,
    currentStatus: string,
    reason?: string,
  ) => {
    if (reason) {
      executeToggleSuspendShop(shop_id, currentStatus, reason);
      return;
    }

    const normalizedStatus = (currentStatus || "").toLowerCase();
    const isSuspending = normalizedStatus !== "suspended" && normalizedStatus !== "banned";
    const actionText = isSuspending ? "ระงับการใช้งาน" : "ปลดการระงับ";
    
    setConfirmModal({
      isOpen: true,
      title: `ยืนยันการ${actionText}`,
      message: `คุณต้องการ${actionText}ร้านค้านี้ใช่หรือไม่?`,
      type: isSuspending ? "reject" : "approve",
      onConfirm: () => executeToggleSuspendShop(shop_id, currentStatus),
    });
  };

  const rawAddress = selectedShop
    ? selectedShop.address ||
      (selectedShop as any).Address ||
      (selectedShop as any).full_address ||
      (selectedShop as any).address_detail
    : null;

  const formattedSelectedShop = selectedShop
    ? {
        _id: selectedShop.id || (selectedShop as any)._id || "",
        name:
          selectedShop.shop_name ||
          (selectedShop as any).name ||
          "ไม่ระบุชื่อร้าน",
        ownerName:
          selectedShop.owner_name ||
          (selectedShop as any).ownerName ||
          "ไม่ระบุ",
        email: selectedShop.email || "",
        phone: selectedShop.phone || "",
        openTime: selectedShop.open_time || (selectedShop as any).openTime,
        closeTime: selectedShop.close_time || (selectedShop as any).closeTime,
        address: formatAddressString(rawAddress),
        description: (selectedShop as any).description,
        logoUrl: getImageUrl(
          selectedShop.profile_image || (selectedShop as any).logoUrl,
        ),
        documentUrl: getImageUrl(
          (selectedShop as any).documentUrl ||
            (selectedShop as any).id_card_image,
        ),
        status: (selectedShop.status || "PENDING") as any,
      }
    : null;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 font-['Prompt',sans-serif] text-slate-900">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
          ศูนย์จัดการร้านค้า (Admin Panel)
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          ตรวจสอบคำขอใหม่ บัญชีธนาคาร และจัดการสถานะร้านค้าในระบบ
        </p>
      </div>

      {/* Tabs Menu */}
      <div className="flex gap-4 border-b border-slate-200 mb-6">
        <button
          type="button"
          className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition-all cursor-pointer ${
            activeTab === "pending"
              ? "border-sky-600 text-sky-600"
              : "border-transparent text-slate-500 hover:text-slate-700"
          }`}
          onClick={() => setActiveTab("pending")}
        >
          <FileText size={18} />
          <span>คำขอสมัครใหม่</span>
          {pendingShops.length > 0 && (
            <span className="bg-sky-600 text-white text-xs px-2 py-0.5 rounded-full">
              {pendingShops.length}
            </span>
          )}
        </button>

        <button
          type="button"
          className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition-all cursor-pointer ${
            activeTab === "bank"
              ? "border-sky-600 text-sky-600"
              : "border-transparent text-slate-500 hover:text-slate-700"
          }`}
          onClick={() => setActiveTab("bank")}
        >
          <Landmark size={18} />
          <span>เปลี่ยนบัญชีธนาคาร</span>
          {bankRequests.length > 0 && (
            <span className="bg-amber-500 text-white text-xs px-2 py-0.5 rounded-full">
              {bankRequests.length}
            </span>
          )}
        </button>

        <button
          type="button"
          className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition-all cursor-pointer ${
            activeTab === "all"
              ? "border-sky-600 text-sky-600"
              : "border-transparent text-slate-500 hover:text-slate-700"
          }`}
          onClick={() => setActiveTab("all")}
        >
          <Store size={18} />
          <span>ร้านค้าทั้งหมดในระบบ</span>
          <span className="bg-slate-400 text-white text-xs px-2 py-0.5 rounded-full">
            {allShops.length}
          </span>
        </button>
      </div>

      {errorMsg && (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-xl mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle size={20} className="text-rose-600" />
            <span>{errorMsg}</span>
          </div>
          <button
            type="button"
            onClick={fetchAllInitialData}
            className="bg-rose-700 text-white text-xs px-3 py-1.5 rounded-lg flex items-center gap-1 hover:bg-rose-800 transition cursor-pointer"
          >
            <RotateCw size={14} /> ลองใหม่
          </button>
        </div>
      )}

      {loading ? (
        <div className="text-center py-16 text-slate-500 flex flex-col items-center gap-3">
          <RotateCw size={28} className="animate-spin text-sky-600" />
          <p>กำลังเชื่อมต่อข้อมูล...</p>
        </div>
      ) : (
        <>
          {/* TAB 1: คำขอสมัครใหม่ */}
          {activeTab === "pending" && (
            <PendingShopsTab
              shops={pendingShops}
              onVerify={handleVerifyShop}
              onSelectShop={setSelectedShop}
            />
          )}

          {/* TAB 2: เปลี่ยนบัญชีธนาคาร */}
          {activeTab === "bank" &&
            (bankRequests.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-dashed border-slate-300">
                <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 size={32} />
                </div>
                <h3 className="text-lg font-semibold text-slate-700">
                  ไม่มีคำขอแก้ไขบัญชีธนาคาร
                </h3>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {bankRequests.map((req) => (
                  <BankRequestCard
                    key={req.id}
                    request={req}
                    onApprove={(id) => handleVerifyBank(id, "approve")}
                    onReject={(id) => handleVerifyBank(id, "reject")}
                  />
                ))}
              </div>
            ))}

          {/* TAB 3: ร้านค้าทั้งหมดในระบบ */}
          {activeTab === "all" && (
            <div className="space-y-4">
              <ShopFilterControls
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
                sortBy={sortBy}
                setSortBy={setSortBy}
                onResetFilters={handleResetFilters}
              />

              <div className="text-xs md:text-sm text-slate-500">
                แสดงผล <strong>{paginatedShops.length}</strong> จาก{" "}
                <strong>{totalItems}</strong> รายการ (ร้านค้าในระบบทั้งหมด{" "}
                {allShops.length} รายการ)
              </div>

              {paginatedShops.length === 0 ? (
                <div className="bg-white rounded-2xl p-12 text-center border border-dashed border-slate-300">
                  <h3 className="text-base font-semibold text-slate-700">
                    ไม่พบข้อมูลร้านค้าที่ค้นหา
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    ลองเปลี่ยนคำค้นหาหรือกดรีเซ็ตค่าตัวกรองด้านบน
                  </p>
                </div>
              ) : (
                <>
                  <AllShopsTable
                    shops={paginatedShops}
                    onToggleSuspend={handleToggleSuspendShop}
                  />

                  {totalPages > 1 && (
                    <PaginationBar
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={setCurrentPage}
                    />
                  )}
                </>
              )}
            </div>
          )}
        </>
      )}

      {/* Modal รายละเอียดร้านค้า */}
      {selectedShop && (
        <ShopDetailModal
          shop={formattedSelectedShop}
          onClose={() => setSelectedShop(null)}
          onApprove={(id) => handleVerifyShop(id, "approve")}
          onReject={(id) => handleVerifyShop(id, "reject")}
        />
      )}

      {/* Custom Confirmation Modal */}
      <ConfirmModal modalData={confirmModal} onClose={closeConfirmModal} />
    </div>
  );
}

export default function ShopsPage() {
  return (
    <Suspense
      fallback={
        <div className="text-center py-16 text-slate-500 flex flex-col items-center gap-3">
          <RotateCw size={28} className="animate-spin text-sky-600" />
          <p>กำลังโหลด...</p>
        </div>
      }
    >
      <ShopsContent />
    </Suspense>
  );
}