"use client";

import { useState, useEffect, useCallback, useMemo, Suspense } from "react";
import { RotateCw } from "lucide-react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

import { Shop } from "@/component/admin/ShopCard";
import ShopDetailModal from "@/component/admin/ShopDetailModal";
import { BankChangeRequest } from "@/component/admin/BankRequestCard";
import BankRequestsTab from "@/component/admin/BankRequestsTab";
import AllShopsTable from "@/component/admin/AllShopsTable";
import ConfirmModal, { ConfirmModalState } from "@/component/admin/ConfirmModal";
import PendingShopsTab from "@/component/admin/PendingShopsTab";
import ShopFilterControls from "@/component/admin/ShopFilterControls";
import PaginationBar from "@/component/admin/PaginationBar";
import AppealsTab from "@/component/admin/AppealsTab";
import ShopTabsNavigation from "@/component/admin/ShopTabsNavigation";

export interface ShopAppeal {
  id: string | number;
  shop_id: string | number;
  subject: string;
  message: string;
  status: string;
  created_at: string;
  attachment_urls?: string[];
  shop?: {
    shop_name?: string;
    profile_image?: string;
    email?: string;
    phone?: string;
    suspend_reason?: string;
  };
}

type UnknownRecord = Record<string, unknown>;

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/admin";
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

const getImageUrl = (url?: string) => {
  if (!url) return undefined;
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  const cleanUrl = url.startsWith("/") ? url.slice(1) : url;
  return `${BACKEND_URL}/${cleanUrl}`;
};

const getAuthHeaders = (): Record<string, string> => {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
};

function ShopsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const tabParam = searchParams.get("tab");
  const [activeTab, setActiveTab] = useState<"pending" | "bank" | "all" | "appeals">(
    tabParam === "all" ? "all" : tabParam === "bank" ? "bank" : tabParam === "appeals" ? "appeals" : "pending"
  );

  useEffect(() => {
    const currentTab =
      tabParam === "all" ? "all" : tabParam === "bank" ? "bank" : tabParam === "appeals" ? "appeals" : "pending";
    setActiveTab(currentTab);
  }, [tabParam]);

  const handleTabChange = (tab: "pending" | "bank" | "all" | "appeals") => {
    setActiveTab(tab);
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", tab);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const [pendingShops, setPendingShops] = useState<Shop[]>([]);
  const [bankRequests, setBankRequests] = useState<BankChangeRequest[]>([]);
  const [allShops, setAllShops] = useState<Shop[]>([]);
  const [appeals, setAppeals] = useState<ShopAppeal[]>([]);
  const [appealSlaFilter, setAppealSlaFilter] = useState<"ALL" | "NEW" | "WAITING" | "OVERDUE">("ALL");

  const [selectedShop, setSelectedShop] = useState<Shop | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Filters & Pagination for All Shops Tab
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "APPROVED" | "SUSPENDED">("ALL");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "name_asc" | "name_desc">("newest");
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
    const headers = getAuthHeaders();
    try {
      const [pendingRes, bankRes, allRes, appealsRes] = await Promise.all([
        fetch(`${API_URL}/shops/pending`, { headers }).catch(() => null),
        fetch(`${API_URL}/bank-accounts/pending`, { headers }).catch(() => null),
        fetch(`${API_URL}/shops/all`, { headers }).catch(() => null),
        fetch(`${API_URL}/appeals`, { headers }).catch(() => null),
      ]);

      if (pendingRes?.ok) {
        const result = await pendingRes.json();
        const formatted = (Array.isArray(result.data || result) ? result.data || result : []).map((s: UnknownRecord) => ({
          ...s,
          profile_image: getImageUrl((s.profile_image || s.logoUrl) as string | undefined),
        }));
        setPendingShops(formatted as unknown as Shop[]);
      }

      if (bankRes?.ok) {
        const result = await bankRes.json();
        const data = result.data || result;
        const formatted = (Array.isArray(data) ? data : []).map((req: UnknownRecord) => ({
          ...req,
          created_at: req.created_at || req.createdAt || req.requested_at || req.updated_at,
          shopLogo: getImageUrl((req.shopLogo || req.logoUrl || (req.shop as UnknownRecord)?.profile_image) as string | undefined),
          old_account: (req.old_account || req.old_bank || req.old_bank_account)
            ? {
                bank_name: ((req.old_account as UnknownRecord)?.bank_name || req.old_bank_name || "-") as string,
                account_number: ((req.old_account as UnknownRecord)?.account_number || req.old_account_number || "-") as string,
                account_name: ((req.old_account as UnknownRecord)?.account_name || req.old_account_name || "-") as string,
              }
            : undefined,
          new_account: {
            bank_name: ((req.new_account as UnknownRecord)?.bank_name || req.bank_name || "-") as string,
            account_number: ((req.new_account as UnknownRecord)?.account_number || req.account_number || "-") as string,
            account_name: ((req.new_account as UnknownRecord)?.account_name || req.account_name || "-") as string,
          },
        }));
        setBankRequests(formatted as unknown as BankChangeRequest[]);
      }

      if (allRes?.ok) {
        const result = await allRes.json();
        const formatted = (Array.isArray(result.data || result) ? result.data || result : []).map((s: UnknownRecord) => ({
          ...s,
          profile_image: getImageUrl((s.profile_image || s.logoUrl) as string | undefined),
        }));
        setAllShops(formatted as unknown as Shop[]);
      }

      if (appealsRes?.ok) {
        const result = await appealsRes.json();
        setAppeals(Array.isArray(result.data || result) ? result.data || result : []);
      }
    } catch (err) {
      console.error("Fetch Data Error:", err);
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

  const filteredAndSortedShops = useMemo(() => {
    let result = [...allShops];
    if (searchTerm.trim() !== "") {
      const term = searchTerm.toLowerCase();
      result = result.filter((shop) => {
        const s = shop as any;
        return (
          String(s.shop_name || s.name || "").toLowerCase().includes(term) ||
          String(s.owner_name || s.ownerName || "").toLowerCase().includes(term) ||
          String(s.phone || "").toLowerCase().includes(term) ||
          String(s.email || "").toLowerCase().includes(term)
        );
      });
    }

    if (statusFilter !== "ALL") {
      result = result.filter((shop) => String((shop as any).status || "APPROVED").toUpperCase() === statusFilter);
    }

    result.sort((a, b) => {
      const sA = a as any;
      const sB = b as any;
      if (sortBy === "newest") return new Date(sB.created_at || sB.createdAt || 0).getTime() - new Date(sA.created_at || sA.createdAt || 0).getTime();
      if (sortBy === "oldest") return new Date(sA.created_at || sA.createdAt || 0).getTime() - new Date(sB.created_at || sB.createdAt || 0).getTime();
      if (sortBy === "name_asc") return String(sA.shop_name || sA.name || "").localeCompare(String(sB.shop_name || sB.name || ""), "th");
      if (sortBy === "name_desc") return String(sB.shop_name || sB.name || "").localeCompare(String(sA.shop_name || sA.name || ""), "th");
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

  const handleVerifyShop = (shop_id: string | number, action: "approve" | "reject") => {
    const actionText = action === "approve" ? "อนุมัติ" : "ปฏิเสธ";
    setConfirmModal({
      isOpen: true,
      title: `ยืนยันการ${actionText}ร้านค้า`,
      message: `คุณต้องการ${actionText}คำขอเปิดร้านค้านี้ใช่หรือไม่?`,
      type: action === "approve" ? "approve" : "reject",
      onConfirm: async () => {
        try {
          const adminId = typeof window !== "undefined" ? localStorage.getItem("admin_id") : null;
          const res = await fetch(`${API_URL}/shops/verify`, {
            method: "PATCH",
            headers: getAuthHeaders(),
            body: JSON.stringify({ shop_id, action, admin_id: adminId, verified_by: adminId }),
          });
          if (!res.ok) throw new Error("การอัปเดตสถานะล้มเหลว");
          setSelectedShop(null);
          fetchAllInitialData();
        } catch (e) {
          console.error(e);
        } finally {
          closeConfirmModal();
        }
      },
    });
  };

  const handleVerifyBank = (requestId: string, action: "approve" | "reject") => {
    const actionText = action === "approve" ? "อนุมัติ" : "ปฏิเสธ";
    setConfirmModal({
      isOpen: true,
      title: `ยืนยันการ${actionText}เปลี่ยนบัญชีธนาคาร`,
      message: `คุณต้องการ${actionText}คำขอเปลี่ยนบัญชีธนาคารนี้ใช่หรือไม่?`,
      type: action === "approve" ? "approve" : "reject",
      onConfirm: async () => {
        try {
          const res = await fetch(`${API_URL}/bank-accounts/verify`, {
            method: "PATCH",
            headers: getAuthHeaders(),
            body: JSON.stringify({ request_id: requestId, action }),
          });
          if (!res.ok) throw new Error("การดำเนินการล้มเหลว");
          fetchAllInitialData();
        } catch (e) {
          console.error(e);
        } finally {
          closeConfirmModal();
        }
      },
    });
  };

  const handleToggleSuspendShop = (shop_id: string | number, currentStatus: string, reason?: string) => {
    const execute = async () => {
      try {
        const normalizedStatus = (currentStatus || "").toLowerCase();
        const isSuspending = normalizedStatus !== "suspended" && normalizedStatus !== "banned";
        const res = await fetch(`${API_URL}/shops/suspend`, {
          method: "PATCH",
          headers: getAuthHeaders(),
          body: JSON.stringify({ shop_id, suspend: isSuspending, reason }),
        });
        if (!res.ok) throw new Error("การเปลี่ยนสถานะล้มเหลว");
        fetchAllInitialData();
      } catch (e) {
        console.error(e);
      } finally {
        closeConfirmModal();
      }
    };

    if (reason) {
      execute();
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
      onConfirm: execute,
    });
  };

  const handleRejectAppeal = (appealId: string | number) => {
    setConfirmModal({
      isOpen: true,
      title: "ยืนยันการปฏิเสธคำขอปลดระงับ",
      message: "คุณต้องการปฏิเสธคำขออุทธรณ์ปลดระงับร้านค้านี้ใช่หรือไม่?",
      type: "reject",
      onConfirm: async () => {
        try {
          const res = await fetch(`${API_URL}/appeals/reject`, {
            method: "PATCH",
            headers: getAuthHeaders(),
            body: JSON.stringify({ appeal_id: appealId }),
          });
          if (!res.ok) throw new Error("การปฏิเสธคำขอล้มเหลว");
          fetchAllInitialData();
        } catch (e) {
          console.error(e);
        } finally {
          closeConfirmModal();
        }
      },
    });
  };

  const pendingAppealsCount = appeals.filter((a) => a.status === "pending").length;

  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 py-3 sm:py-6 font-sans text-slate-900 space-y-4 sm:space-y-6">
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-2xs">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight leading-snug">
          ศูนย์จัดการร้านค้า (Admin Panel)
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          ตรวจสอบคำขอใหม่ บัญชีธนาคาร และจัดการสถานะร้านค้าในระบบ
        </p>
      </div>

      <ShopTabsNavigation
        activeTab={activeTab}
        onTabChange={handleTabChange}
        pendingShopsCount={pendingShops.length}
        bankRequestsCount={bankRequests.length}
        pendingAppealsCount={pendingAppealsCount}
        allShopsCount={allShops.length}
      />

      {loading ? (
        <div className="text-center py-12 sm:py-16 text-slate-500 flex flex-col items-center gap-2.5 sm:gap-3 bg-white rounded-2xl border border-slate-200">
          <RotateCw size={26} className="animate-spin text-sky-600" />
          <p className="text-xs sm:text-sm font-medium">กำลังเชื่อมต่อข้อมูล...</p>
        </div>
      ) : (
        <>
          {activeTab === "pending" && (
            <PendingShopsTab shops={pendingShops} onVerify={handleVerifyShop} onSelectShop={(shop) => setSelectedShop(shop)} />
          )}

          {activeTab === "bank" && (
            <BankRequestsTab requests={bankRequests} onApprove={(id) => handleVerifyBank(id, "approve")} onReject={(id) => handleVerifyBank(id, "reject")} />
          )}

          {activeTab === "appeals" && (
            <AppealsTab
              appeals={appeals}
              appealSlaFilter={appealSlaFilter}
              setAppealSlaFilter={setAppealSlaFilter}
              onApproveUnsuspend={(shopId) => handleToggleSuspendShop(shopId, "suspended")}
              onRejectAppeal={handleRejectAppeal}
            />
          )}

          {activeTab === "all" && (
            <div className="space-y-3 sm:space-y-4">
              <ShopFilterControls
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
                sortBy={sortBy}
                setSortBy={setSortBy}
                onResetFilters={handleResetFilters}
              />

              <div className="text-xs sm:text-sm text-slate-500 leading-relaxed px-1">
                แสดงผล <strong className="text-slate-800">{paginatedShops.length}</strong> จาก <strong className="text-slate-800">{totalItems}</strong> รายการ (ร้านค้าในระบบทั้งหมด {allShops.length} รายการ)
              </div>

              {paginatedShops.length === 0 ? (
                <div className="bg-white rounded-2xl p-8 sm:p-12 text-center border border-dashed border-slate-300 shadow-2xs">
                  <h3 className="text-sm sm:text-base font-semibold text-slate-700">ไม่พบข้อมูลร้านค้าที่ค้นหา</h3>
                </div>
              ) : (
                <>
                  <AllShopsTable shops={paginatedShops} onToggleSuspend={handleToggleSuspendShop} />
                  {totalPages > 1 && <PaginationBar currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />}
                </>
              )}
            </div>
          )}
        </>
      )}

      {selectedShop && (
        <ShopDetailModal
          shop={selectedShop as any}
          onClose={() => setSelectedShop(null)}
          onApprove={() => handleVerifyShop(selectedShop.id || (selectedShop as any)._id, "approve")}
          onReject={() => handleVerifyShop(selectedShop.id || (selectedShop as any)._id, "reject")}
        />
      )}

      <ConfirmModal modalData={confirmModal} onClose={closeConfirmModal} />
    </div>
  );
}

export default function ShopsPage() {
  return (
    <Suspense
      fallback={
        <div className="text-center py-12 sm:py-16 text-slate-500 flex flex-col items-center gap-2.5 sm:gap-3">
          <RotateCw size={26} className="animate-spin text-sky-600" />
          <p className="text-xs sm:text-sm font-medium">กำลังโหลด...</p>
        </div>
      }
    >
      <ShopsContent />
    </Suspense>
  );
}