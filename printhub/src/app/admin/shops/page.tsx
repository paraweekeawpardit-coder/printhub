"use client";

import { useState, useEffect, useCallback, useMemo, Suspense } from "react";
import { RotateCw } from "lucide-react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

// Imports Components
import { Shop } from "@/component/admin/ShopCard";
import ShopDetailModal from "@/component/admin/ShopDetailModal";
import { BankChangeRequest } from "@/component/admin/BankRequestCard";
import BankRequestsTab from "@/component/admin/BankRequestsTab";
import AllShopsTable from "@/component/admin/AllShopsTable";
import ConfirmModal, {
  ConfirmModalState,
} from "@/component/admin/ConfirmModal";
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
  shop?: {
    shop_name?: string;
    profile_image?: string;
    email?: string;
  };
}

type UnknownRecord = Record<string, unknown>;

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

const getAuthHeaders = (): Record<string, string> => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }
  return headers;
};

function ShopsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const tabParam = searchParams.get("tab");

  const [activeTab, setActiveTab] = useState<
    "pending" | "bank" | "all" | "appeals"
  >(
    tabParam === "all"
      ? "all"
      : tabParam === "bank"
      ? "bank"
      : tabParam === "appeals"
      ? "appeals"
      : "pending",
  );

  useEffect(() => {
    const currentTab =
      tabParam === "all"
        ? "all"
        : tabParam === "bank"
        ? "bank"
        : tabParam === "appeals"
        ? "appeals"
        : "pending";
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

  const [appealSlaFilter, setAppealSlaFilter] = useState<
    "ALL" | "NEW" | "WAITING" | "OVERDUE"
  >("ALL");

  const [selectedShop, setSelectedShop] = useState<Shop | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

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
    const headers = getAuthHeaders();
    try {
      const [pendingRes, bankRes, allRes, appealsRes] = await Promise.all([
        fetch(`${API_URL}/shops/pending`, { headers }).catch((e) => {
          console.error("Fetch Pending Shops Error:", e);
          return null;
        }),
        fetch(`${API_URL}/bank-accounts/pending`, { headers }).catch((e) => {
          console.error("Fetch Bank Accounts Error:", e);
          return null;
        }),
        fetch(`${API_URL}/shops/all`, { headers }).catch((e) => {
          console.error("Fetch All Shops Error:", e);
          return null;
        }),
        fetch(`${API_URL}/appeals`, { headers }).catch((e) => {
          console.error("Fetch Appeals Error:", e);
          return null;
        }),
      ]);

      if (pendingRes && pendingRes.ok) {
        const result = await pendingRes.json();
        const data = result.data || result;
        const formatted = (Array.isArray(data) ? data : []).map(
          (s: UnknownRecord) => ({
            ...s,
            profile_image: getImageUrl(
              (s.profile_image || s.logoUrl) as string | undefined,
            ),
          }),
        );
        setPendingShops(formatted as unknown as Shop[]);
      }

      if (bankRes && bankRes.ok) {
        const result = await bankRes.json();
        const data = result.data || result;
        const formatted = (Array.isArray(data) ? data : []).map(
          (req: UnknownRecord) => {
            const rawOld =
              (req.old_account || req.old_bank || req.old_bank_account) as UnknownRecord | undefined;
            const oldAccount = rawOld
              ? {
                  bank_name: (rawOld.bank_name || req.old_bank_name || "-") as string,
                  account_number: (rawOld.account_number || req.old_account_number || "-") as string,
                  account_name: (rawOld.account_name || req.old_account_name || "-") as string,
                }
              : req.old_bank_name
              ? {
                  bank_name: (req.old_bank_name || "-") as string,
                  account_number: (req.old_account_number || "-") as string,
                  account_name: (req.old_account_name || "-") as string,
                }
              : undefined;

            const rawNew =
              (req.new_account || req.new_bank || req.new_bank_account) as UnknownRecord | undefined;
            const newAccount = rawNew
              ? {
                  bank_name: (rawNew.bank_name || req.bank_name || "-") as string,
                  account_number: (rawNew.account_number || req.account_number || "-") as string,
                  account_name: (rawNew.account_name || req.account_name || "-") as string,
                }
              : {
                  bank_name: (req.bank_name || "-") as string,
                  account_number: (req.account_number || "-") as string,
                  account_name: (req.account_name || "-") as string,
                };

            return {
              ...req,
              created_at:
                req.created_at ||
                req.createdAt ||
                req.requested_at ||
                req.updated_at,
              shopLogo: getImageUrl(
                (req.shopLogo ||
                  req.logoUrl ||
                  (req.shop as UnknownRecord)?.profile_image) as
                  | string
                  | undefined,
              ),
              old_account: oldAccount,
              new_account: newAccount,
            };
          },
        );
        setBankRequests(formatted as unknown as BankChangeRequest[]);
      }

      if (allRes && allRes.ok) {
        const result = await allRes.json();
        const data = result.data || result;
        const formatted = (Array.isArray(data) ? data : []).map(
          (s: UnknownRecord) => ({
            ...s,
            profile_image: getImageUrl(
              (s.profile_image || s.logoUrl) as string | undefined,
            ),
          }),
        );
        setAllShops(formatted as unknown as Shop[]);
      }

      if (appealsRes && appealsRes.ok) {
        const result = await appealsRes.json();
        const data = result.data || result;
        setAppeals(Array.isArray(data) ? data : []);
      }
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      console.error("Fetch Data Error:", errorMsg);
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
        const name = String(s.shop_name || s.name || "").toLowerCase();
        const owner = String(s.owner_name || s.ownerName || "").toLowerCase();
        const phone = String(s.phone || "").toLowerCase();
        const email = String(s.email || "").toLowerCase();
        return (
          name.includes(term) ||
          owner.includes(term) ||
          phone.includes(term) ||
          email.includes(term)
        );
      });
    }

    if (statusFilter !== "ALL") {
      result = result.filter((shop) => {
        const s = shop as any;
        const status = String(s.status || "APPROVED").toUpperCase();
        return status === statusFilter;
      });
    }

    result.sort((a, b) => {
      const sA = a as any;
      const sB = b as any;
      if (sortBy === "newest") {
        return (
          new Date(sB.created_at || sB.createdAt || sB.id || 0).getTime() -
          new Date(sA.created_at || sA.createdAt || sA.id || 0).getTime()
        );
      }
      if (sortBy === "oldest") {
        return (
          new Date(sA.created_at || sA.createdAt || sA.id || 0).getTime() -
          new Date(sB.created_at || sB.createdAt || sB.id || 0).getTime()
        );
      }
      if (sortBy === "name_asc") {
        return String(sA.shop_name || sA.name || "").localeCompare(
          String(sB.shop_name || sB.name || ""),
          "th",
        );
      }
      if (sortBy === "name_desc") {
        return String(sB.shop_name || sB.name || "").localeCompare(
          String(sA.shop_name || sA.name || ""),
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

  const executeVerifyShop = async (
    shop_id: string | number,
    action: "approve" | "reject",
  ) => {
    try {
      const adminId =
        typeof window !== "undefined" ? localStorage.getItem("admin_id") : null;

      const res = await fetch(`${API_URL}/shops/verify`, {
        method: "PATCH",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          shop_id,
          action,
          admin_id: adminId,
          verified_by: adminId,
        }),
      });
      if (!res.ok) throw new Error("การอัปเดตสถานะล้มเหลว");

      setPendingShops((prev) =>
        prev.filter(
          (s) => String(s.id || (s as UnknownRecord)._id) !== String(shop_id),
        ),
      );
      setSelectedShop(null);
      fetchAllInitialData();
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      console.error("Verify Shop Error:", errorMsg);
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
        headers: getAuthHeaders(),
        body: JSON.stringify({ request_id: requestId, action }),
      });
      if (!res.ok) throw new Error("การดำเนินการล้มเหลว");

      setBankRequests((prev) => prev.filter((item) => item.id !== requestId));
      fetchAllInitialData();
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      console.error("Verify Bank Error:", errorMsg);
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
      const isSuspending =
        normalizedStatus !== "suspended" && normalizedStatus !== "banned";

      const res = await fetch(`${API_URL}/shops/suspend`, {
        method: "PATCH",
        headers: getAuthHeaders(),
        body: JSON.stringify({ shop_id, suspend: isSuspending, reason }),
      });
      if (!res.ok) throw new Error("การเปลี่ยนสถานะล้มเหลว");

      setAllShops((prev) =>
        prev.map((shop) =>
          String(shop.id || (shop as UnknownRecord)._id) === String(shop_id)
            ? ({
                ...shop,
                status: isSuspending ? "suspended" : "approved",
                suspend_reason: isSuspending ? reason || undefined : undefined,
              } as Shop)
            : shop,
        ),
      );

      fetchAllInitialData();
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      console.error("Toggle Suspend Error:", errorMsg);
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
    const isSuspending =
      normalizedStatus !== "suspended" && normalizedStatus !== "banned";
    const actionText = isSuspending ? "ระงับการใช้งาน" : "ปลดการระงับ";

    setConfirmModal({
      isOpen: true,
      title: `ยืนยันการ${actionText}`,
      message: `คุณต้องการ${actionText}ร้านค้านี้ใช่หรือไม่?`,
      type: isSuspending ? "reject" : "approve",
      onConfirm: () => executeToggleSuspendShop(shop_id, currentStatus),
    });
  };

  const pendingAppealsCount = appeals.filter(
    (a) => a.status === "pending",
  ).length;

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

      {/* Component Navigation Tabs */}
      <ShopTabsNavigation
        activeTab={activeTab}
        onTabChange={handleTabChange}
        pendingShopsCount={pendingShops.length}
        bankRequestsCount={bankRequests.length}
        pendingAppealsCount={pendingAppealsCount}
        allShopsCount={allShops.length}
      />

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
              onSelectShop={(shop) => setSelectedShop(shop)}
            />
          )}

          {/* TAB 2: เปลี่ยนบัญชีธนาคาร */}
          {activeTab === "bank" && (
            <BankRequestsTab
              requests={bankRequests}
              onApprove={(id) => handleVerifyBank(id, "approve")}
              onReject={(id) => handleVerifyBank(id, "reject")}
            />
          )}

          {/* TAB 3: คำขอปลดระงับ */}
          {activeTab === "appeals" && (
            <AppealsTab
              appeals={appeals}
              appealSlaFilter={appealSlaFilter}
              setAppealSlaFilter={setAppealSlaFilter}
              onApproveUnsuspend={(shopId) =>
                handleToggleSuspendShop(shopId, "suspended")
              }
            />
          )}

          {/* TAB 4: ร้านค้าทั้งหมดในระบบ */}
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
          shop={selectedShop as any}
          onClose={() => setSelectedShop(null)}
          onApprove={() =>
            handleVerifyShop(
              selectedShop.id || (selectedShop as any)._id,
              "approve",
            )
          }
          onReject={() =>
            handleVerifyShop(
              selectedShop.id || (selectedShop as any)._id,
              "reject",
            )
          }
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