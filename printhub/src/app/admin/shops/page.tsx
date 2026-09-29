"use client";

import { useState, useEffect } from "react";
import { 
  FileText, 
  Landmark, 
  Store, 
  AlertCircle, 
  CheckCircle2, 
  RotateCw 
} from "lucide-react";

import ShopCard, { Shop } from "../../../component/admin/ShopCard";
import ShopDetailModal from "../../../component/admin/ShopDetailModal";
import BankRequestCard, { BankChangeRequest } from "../../../component/admin/BankRequestCard";
import AllShopsTable from "../../../component/admin/AllShopsTable";
import { useSearchParams } from "next/navigation";

export default function ShopsPage() {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");
  
  // ตั้งค่า Active Tab ตาม Query Parameter ที่ส่งมา
  const [activeTab, setActiveTab] = useState<"pending" | "bank" | "all">(
    tabParam === "all" ? "all" : "pending"
  );

  const [pendingShops, setPendingShops] = useState<Shop[]>([]);
  const [bankRequests, setBankRequests] = useState<BankChangeRequest[]>([]);
  const [allShops, setAllShops] = useState<Shop[]>([]);

  const [selectedShop, setSelectedShop] = useState<Shop | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/admin";
  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

  // Helper ฟังก์ชั่นจัดการ Path รูปภาพไม่ให้แตก ( Fix 404 Image )
  const getImageUrl = (url?: string) => {
    if (!url) return "/placeholder.png";
    if (url.startsWith("http://") || url.startsWith("https://")) return url;
    return `${BACKEND_URL}${url.startsWith("/") ? "" : "/"}${url}`;
  };

  useEffect(() => {
    fetchTabData();
  }, [activeTab]);

  const fetchTabData = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      if (activeTab === "pending") {
        const res = await fetch(`${API_URL}/shops/pending`);
        if (!res.ok) throw new Error(`ไม่สามารถดึงข้อมูลคำขอใหม่ได้ (${res.status})`);
        const data = await res.json();
        // ปรับแต่ง image url ก่อนเก็บลง state
        const formatted = (Array.isArray(data) ? data : []).map((s) => ({
          ...s,
          profile_image: getImageUrl(s.profile_image || s.logoUrl),
        }));
        setPendingShops(formatted);
      } else if (activeTab === "bank") {
        const res = await fetch(`${API_URL}/bank-accounts/pending`);
        if (!res.ok) {
          // หาก Backend ยังไม่มี Route นี้ ให้จัดการ Soft Error เพื่อไม่ให้ UI ค้าง
          setBankRequests([]);
          return;
        }
        const data = await res.json();
        setBankRequests(Array.isArray(data) ? data : []);
      } else if (activeTab === "all") {
        const res = await fetch(`${API_URL}/shops/all`);
        if (!res.ok) {
          setAllShops([]);
          return;
        }
        const data = await res.json();
        const formatted = (Array.isArray(data) ? data : []).map((s) => ({
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
  };

  const handleVerifyShop = async (shop_id: string | number, action: "approve" | "reject") => {
    const actionText = action === "approve" ? "อนุมัติ" : "ปฏิเสธ";
    if (!window.confirm(`คุณต้องการ${actionText}ร้านค้านี้ใช่หรือไม่?`)) return;

    try {
      const res = await fetch(`${API_URL}/shops/verify`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ shop_id, action }),
      });
      if (!res.ok) throw new Error("การอัปเดตสถานะล้มเหลว");

      setPendingShops((prev) => prev.filter((s) => String(s.id || s._id) !== String(shop_id)));
      setSelectedShop(null);
      alert(`ทำรายการ${actionText}ร้านค้าเรียบร้อยแล้ว`);
    } catch (err: any) {
      alert(`เกิดข้อผิดพลาด: ${err.message}`);
    }
  };

  const handleVerifyBank = async (requestId: string, action: "approve" | "reject") => {
    const actionText = action === "approve" ? "อนุมัติ" : "ปฏิเสธ";
    if (!window.confirm(`คุณต้องการ${actionText}การเปลี่ยนบัญชีนี้ใช่หรือไม่?`)) return;

    try {
      const res = await fetch(`${API_URL}/bank-accounts/verify`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ request_id: requestId, action }),
      });
      if (!res.ok) throw new Error("การดำเนินการล้มเหลว");

      setBankRequests((prev) => prev.filter((item) => item.id !== requestId));
      alert(`${actionText}คำขอเรียบร้อยแล้ว`);
    } catch (err: any) {
      alert(`เกิดข้อผิดพลาด: ${err.message}`);
    }
  };

  const handleToggleSuspendShop = async (shop_id: string | number, currentStatus: string) => {
    const isSuspending = currentStatus !== "SUSPENDED";
    const actionText = isSuspending ? "ระงับการใช้งาน" : "ปลดการระงับ";
    if (!window.confirm(`คุณต้องการ${actionText}ร้านค้านี้ใช่หรือไม่?`)) return;

    try {
      const res = await fetch(`${API_URL}/shops/suspend`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ shop_id, suspend: isSuspending }),
      });
      if (!res.ok) throw new Error("การเปลี่ยนสถานะล้มเหลว");

      setAllShops((prev) =>
        prev.map((shop) =>
          String(shop.id || shop._id) === String(shop_id)
            ? { ...shop, status: isSuspending ? "SUSPENDED" : "APPROVED" }
            : shop
        )
      );
      alert(`${actionText}ร้านค้าเรียบร้อยแล้ว`);
    } catch (err: any) {
      alert(`เกิดข้อผิดพลาด: ${err.message}`);
    }
  };

  const formattedSelectedShop = selectedShop
    ? {
        _id: selectedShop.id || selectedShop._id || "",
        name: selectedShop.shop_name || selectedShop.name || "ไม่ระบุชื่อร้าน",
        ownerName: selectedShop.owner_name || selectedShop.ownerName || "ไม่ระบุ",
        email: selectedShop.email || "",
        phone: selectedShop.phone || "",
        openTime: selectedShop.open_time || selectedShop.openTime,
        closeTime: selectedShop.close_time || selectedShop.closeTime,
        address: selectedShop.address,
        description: selectedShop.description,
        logoUrl: getImageUrl(selectedShop.profile_image || selectedShop.logoUrl),
        documentUrl: getImageUrl(selectedShop.documentUrl),
        status: (selectedShop.status || "PENDING") as any,
      }
    : null;

  return (
    <div className="shops-container">
      <div className="page-header">
        <h2 className="section-title">ศูนย์จัดการร้านค้า (Admin Panel)</h2>
        <p className="subtitle">ตรวจสอบคำขอใหม่ บัญชีธนาคาร และจัดการสถานะร้านค้าในระบบ</p>
      </div>

      {/* Tabs Menu ใช้ Lucide Icons แทน Emoji */}
      <div className="tabs-bar">
        <button
          className={`tab-btn ${activeTab === "pending" ? "active" : ""}`}
          onClick={() => setActiveTab("pending")}
        >
          <FileText size={18} />
          <span>คำขอสมัครใหม่</span>
          {pendingShops.length > 0 && <span className="tab-badge">{pendingShops.length}</span>}
        </button>

        <button
          className={`tab-btn ${activeTab === "bank" ? "active" : ""}`}
          onClick={() => setActiveTab("bank")}
        >
          <Landmark size={18} />
          <span>เปลี่ยนบัญชีธนาคาร</span>
          {bankRequests.length > 0 && <span className="tab-badge warn">{bankRequests.length}</span>}
        </button>

        <button
          className={`tab-btn ${activeTab === "all" ? "active" : ""}`}
          onClick={() => setActiveTab("all")}
        >
          <Store size={18} />
          <span>ร้านค้าทั้งหมดในระบบ</span>
        </button>
      </div>

      {errorMsg && (
        <div className="error-box">
          <div className="error-content">
            <AlertCircle size={20} className="error-icon" />
            <span>{errorMsg}</span>
          </div>
          <button onClick={fetchTabData} className="btn-retry">
            <RotateCw size={14} /> ลองใหม่
          </button>
        </div>
      )}

      {loading ? (
        <div className="loading-state">
          <RotateCw size={24} className="spin-icon" />
          <p>กำลังเชื่อมต่อข้อมูล...</p>
        </div>
      ) : (
        <>
          {activeTab === "pending" && (
            pendingShops.length === 0 ? (
              <div className="empty-card">
                <div className="empty-icon-wrapper">
                  <CheckCircle2 size={32} />
                </div>
                <h3>ไม่มีคำขอสมัครใหม่</h3>
              </div>
            ) : (
              <div className="shop-grid">
                {pendingShops.map((shop, i) => (
                  <ShopCard
                    key={shop.id || shop._id || i}
                    shop={shop}
                    onVerify={handleVerifyShop}
                    onSelectShop={setSelectedShop}
                  />
                ))}
              </div>
            )
          )}

          {activeTab === "bank" && (
            bankRequests.length === 0 ? (
              <div className="empty-card">
                <div className="empty-icon-wrapper">
                  <CheckCircle2 size={32} />
                </div>
                <h3>ไม่มีคำขอแก้ไขบัญชีธนาคาร</h3>
              </div>
            ) : (
              <div className="bank-requests-list">
                {bankRequests.map((req) => (
                  <BankRequestCard
                    key={req.id}
                    request={req}
                    onApprove={(id) => handleVerifyBank(id, "approve")}
                    onReject={(id) => handleVerifyBank(id, "reject")}
                  />
                ))}
              </div>
            )
          )}

          {activeTab === "all" && (
            allShops.length === 0 ? (
              <div className="empty-card">
                <h3>ยังไม่มีร้านค้าในระบบ</h3>
              </div>
            ) : (
              <AllShopsTable shops={allShops} onToggleSuspend={handleToggleSuspendShop} />
            )
          )}
        </>
      )}

      <ShopDetailModal
        shop={formattedSelectedShop}
        onClose={() => setSelectedShop(null)}
        onApprove={(id) => handleVerifyShop(id, "approve")}
        onReject={(id) => handleVerifyShop(id, "reject")}
      />

      <style jsx>{`
        .shops-container {
          max-width: 1200px;
          margin: 0 auto;
          font-family: 'Prompt', sans-serif;
          color: #0f172a;
        }
        .page-header {
          margin-bottom: 20px;
        }
        .section-title {
          font-size: 1.4rem;
          font-weight: 700;
          margin: 0 0 4px;
        }
        .subtitle {
          font-size: 0.9rem;
          color: #64748b;
          margin: 0;
        }
        .tabs-bar {
          display: flex;
          gap: 12px;
          border-bottom: 2px solid #e2e8f0;
          margin-bottom: 24px;
        }
        .tab-btn {
          background: none;
          border: none;
          padding: 12px 18px;
          font-size: 0.95rem;
          font-weight: 600;
          color: #64748b;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: all 0.2s ease;
        }
        .tab-btn.active {
          color: #0284c7;
          border-bottom: 3px solid #0284c7;
        }
        .tab-badge {
          background-color: #0284c7;
          color: white;
          font-size: 0.75rem;
          padding: 2px 8px;
          border-radius: 12px;
        }
        .tab-badge.warn {
          background-color: #eab308;
        }
        .bank-requests-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .shop-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
          gap: 24px;
        }
        .empty-card {
          background-color: #ffffff;
          border-radius: 16px;
          padding: 48px;
          text-align: center;
          border: 1px dashed #cbd5e1;
        }
        .empty-icon-wrapper {
          width: 56px;
          height: 56px;
          background-color: #dcfce7;
          color: #16a34a;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 16px;
        }
        .loading-state {
          text-align: center;
          padding: 40px;
          color: #64748b;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
        }
        :global(.spin-icon) {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .error-box {
          background-color: #fef2f2;
          border: 1px solid #fecdd3;
          color: #991b1b;
          padding: 12px 16px;
          border-radius: 12px;
          margin-bottom: 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .error-content {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .btn-retry {
          background-color: #991b1b;
          color: white;
          border: none;
          padding: 6px 12px;
          border-radius: 6px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.85rem;
        }
      `}</style>
    </div>
  );
}