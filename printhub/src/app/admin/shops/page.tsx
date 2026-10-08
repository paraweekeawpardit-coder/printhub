"use client";

import { useState, useEffect, useCallback, useMemo, Suspense } from "react";
import {
  FileText,
  Landmark,
  Store,
  CheckCircle2,
  RotateCw,
  MessageSquareWarning,
  ShieldCheck,
  Filter,
  AlertTriangle,
  Clock,
  Sparkles,
} from "lucide-react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

import { Shop } from "../../../component/admin/ShopCard";
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

const formatAddressString = (addrData: unknown) => {
  if (!addrData) return "";
  if (typeof addrData === "string") return addrData;
  if (typeof addrData === "object" && addrData !== null) {
    const addr = addrData as Record<string, string | undefined>;
    const parts = [
      addr.detail || addr.house_number || addr.address,
      addr.subdistrict || addr.sub_district || addr.tambon,
      addr.district || addr.amphoe,
      addr.province || addr.changwat,
      addr.postcode || addr.postal_code || addr.zipcode,
    ];
    return parts.filter(Boolean).join(" ").trim();
  }
  return "";
};

const getAppealUrgencyBadge = (createdAtStr: string, status: string) => {
  if (status !== "pending") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">
        <CheckCircle2 size={13} />
        อนุมัติเรียบร้อย
      </span>
    );
  }

  const createdTime = new Date(createdAtStr).getTime();
  const now = Date.now();
  const diffHours =
    (now - (isNaN(createdTime) ? now : createdTime)) / (1000 * 60 * 60);

  if (diffHours >= 72) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-rose-100 px-2.5 py-1 text-xs font-semibold text-rose-700 animate-pulse">
        <AlertTriangle size={13} />
        เกินกำหนด (ล่าช้า)
      </span>
    );
  } else if (diffHours >= 24) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-700">
        <Clock size={13} />
        รอการตรวจสอบ
      </span>
    );
  } else {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-sky-100 px-2.5 py-1 text-xs font-semibold text-sky-700">
        <Sparkles size={13} />
        ยื่นมาใหม่
      </span>
    );
  }
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
          (req: UnknownRecord) => ({
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
          }),
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

  const filteredAppeals = useMemo(() => {
    if (appealSlaFilter === "ALL") return appeals;

    const now = Date.now();
    return appeals.filter((appeal) => {
      if (appeal.status !== "pending") return false;

      const createdTime = new Date(appeal.created_at).getTime();
      const diffHours =
        (now - (isNaN(createdTime) ? now : createdTime)) / (1000 * 60 * 60);

      if (appealSlaFilter === "NEW") return diffHours < 24;
      if (appealSlaFilter === "WAITING")
        return diffHours >= 24 && diffHours < 72;
      if (appealSlaFilter === "OVERDUE") return diffHours >= 72;
      return true;
    });
  }, [appeals, appealSlaFilter]);

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

  const rawAddress = selectedShop
    ? selectedShop.address ||
      (selectedShop as UnknownRecord).Address ||
      (selectedShop as UnknownRecord).full_address ||
      (selectedShop as UnknownRecord).address_detail
    : null;

  const formattedSelectedShop = selectedShop
    ? {
        _id: String(
          selectedShop.id || (selectedShop as UnknownRecord)._id || "",
        ),
        name:
          selectedShop.shop_name ||
          (selectedShop as UnknownRecord).name ||
          "ไม่ระบุชื่อร้าน",
        ownerName:
          selectedShop.owner_name ||
          (selectedShop as UnknownRecord).ownerName ||
          "ไม่ระบุ",
        email: selectedShop.email || "",
        phone: selectedShop.phone || "",
        openTime:
          selectedShop.open_time || (selectedShop as UnknownRecord).openTime,
        closeTime:
          selectedShop.close_time || (selectedShop as UnknownRecord).closeTime,
        address: formatAddressString(rawAddress),
        description: (selectedShop as UnknownRecord).description as
          | string
          | undefined,
        logoUrl: getImageUrl(
          selectedShop.profile_image ||
            ((selectedShop as UnknownRecord).logoUrl as string | undefined),
        ),
        documentUrl: getImageUrl(
          ((selectedShop as UnknownRecord).documentUrl ||
            (selectedShop as UnknownRecord).id_card_image) as
            | string
            | undefined,
        ),
        status: (selectedShop.status || "PENDING") as unknown as Shop["status"],
      }
    : null;

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

      {/* Tabs Menu */}
      <div className="flex gap-4 border-b border-slate-200 mb-6 overflow-x-auto">
        <button
          type="button"
          className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === "pending"
              ? "border-sky-600 text-sky-600"
              : "border-transparent text-slate-500 hover:text-slate-700"
          }`}
          onClick={() => handleTabChange("pending")}
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
          className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === "bank"
              ? "border-sky-600 text-sky-600"
              : "border-transparent text-slate-500 hover:text-slate-700"
          }`}
          onClick={() => handleTabChange("bank")}
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
          className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === "appeals"
              ? "border-sky-600 text-sky-600"
              : "border-transparent text-slate-500 hover:text-slate-700"
          }`}
          onClick={() => handleTabChange("appeals")}
        >
          <MessageSquareWarning size={18} />
          <span>คำขอปลดระงับ</span>
          {pendingAppealsCount > 0 && (
            <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
              {pendingAppealsCount}
            </span>
          )}
        </button>

        <button
          type="button"
          className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === "all"
              ? "border-sky-600 text-sky-600"
              : "border-transparent text-slate-500 hover:text-slate-700"
          }`}
          onClick={() => handleTabChange("all")}
        >
          <Store size={18} />
          <span>ร้านค้าทั้งหมดในระบบ</span>
          <span className="bg-slate-400 text-white text-xs px-2 py-0.5 rounded-full">
            {allShops.length}
          </span>
        </button>
      </div>

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

          {/* TAB 3: คำขอปลดระงับ */}
          {activeTab === "appeals" && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                  <Filter size={16} className="text-sky-600" />
                  <span>กรองตามระยะเวลาดำเนินการ:</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() => setAppealSlaFilter("ALL")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                      appealSlaFilter === "ALL"
                        ? "bg-slate-800 text-white shadow-sm"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    ทั้งหมด ({appeals.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setAppealSlaFilter("NEW")}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                      appealSlaFilter === "NEW"
                        ? "bg-sky-600 text-white shadow-sm"
                        : "bg-sky-50 text-sky-700 hover:bg-sky-100 border border-sky-100"
                    }`}
                  >
                    <Sparkles size={13} /> ยื่นมาใหม่ (&lt; 24 ชม.)
                  </button>
                  <button
                    type="button"
                    onClick={() => setAppealSlaFilter("WAITING")}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                      appealSlaFilter === "WAITING"
                        ? "bg-amber-500 text-white shadow-sm"
                        : "bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-100"
                    }`}
                  >
                    <Clock size={13} /> รอการตรวจสอบ (1-3 วัน)
                  </button>
                  <button
                    type="button"
                    onClick={() => setAppealSlaFilter("OVERDUE")}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                      appealSlaFilter === "OVERDUE"
                        ? "bg-rose-600 text-white shadow-sm animate-pulse"
                        : "bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-100"
                    }`}
                  >
                    <AlertTriangle size={13} /> เกินกำหนด (&gt; 3 วัน)
                  </button>
                </div>
              </div>

              {filteredAppeals.length === 0 ? (
                <div className="bg-white rounded-2xl p-12 text-center border border-dashed border-slate-300">
                  <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 size={32} />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-700">
                    ไม่พบคำขอปลดระงับในหมวดหมู่นี้
                  </h3>
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {filteredAppeals.map((appeal) => (
                    <div
                      key={appeal.id}
                      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-start justify-between border-b border-slate-100 pb-3">
                          <div>
                            <h4 className="font-bold text-slate-800 text-base">
                              {appeal.shop?.shop_name ||
                                `ร้านค้า ID: ${appeal.shop_id}`}
                            </h4>
                            <p className="text-xs text-slate-400">
                              {appeal.shop?.email || ""}
                            </p>
                          </div>
                          {getAppealUrgencyBadge(
                            appeal.created_at,
                            appeal.status,
                          )}
                        </div>

                        <div className="my-3 space-y-1.5 text-sm">
                          <p className="font-semibold text-slate-700">
                            เรื่อง: {appeal.subject}
                          </p>
                          <div className="rounded-xl bg-slate-50 p-3 text-xs text-slate-600 border border-slate-100">
                            {appeal.message}
                          </div>
                          <p className="text-[11px] text-slate-400">
                            วันที่ยื่นเรื่อง:{" "}
                            {new Date(appeal.created_at).toLocaleString(
                              "th-TH",
                            )}
                          </p>
                        </div>
                      </div>

                      {appeal.status === "pending" && (
                        <div className="flex justify-end pt-2 border-t border-slate-100">
                          <button
                            type="button"
                            onClick={() =>
                              handleToggleSuspendShop(
                                appeal.shop_id,
                                "suspended",
                              )
                            }
                            className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow hover:bg-emerald-700 transition cursor-pointer"
                          >
                            <ShieldCheck size={16} />
                            อนุมัติปลดระงับร้านค้า
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
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
      {selectedShop && formattedSelectedShop && (
        <ShopDetailModal
          shop={formattedSelectedShop as any}
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
