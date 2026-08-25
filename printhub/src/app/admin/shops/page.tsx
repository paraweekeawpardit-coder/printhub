"use client";

import { useState, useEffect } from "react";

interface Shop {
  id: string;
  shop_name: string;
  owner_name: string;
  email: string;
  phone: string;
  profile_image?: string;
  open_time?: string;
  close_time?: string;
  is_verify: boolean;
  created_at?: string;
}

export default function ShopsPage() {
  const [pendingShops, setPendingShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/admin";

  useEffect(() => {
    fetchPendingShops();
  }, []);

  // ดึงข้อมูลร้านค้า status = 'pending' จาก Supabase ผ่าน Backend API
  const fetchPendingShops = async () => {
    try {
      setLoading(true);
      setErrorMsg(null);
      const res = await fetch(`${API_URL}/shops/pending`);

      if (!res.ok) {
        throw new Error(`เกิดข้อผิดพลาดจากเซิร์ฟเวอร์ (${res.status})`);
      }

      const data = await res.json();
      setPendingShops(Array.isArray(data) ? data : []);
    } catch (err: any) {
      console.error("Fetch Pending Shops Error:", err);
      setErrorMsg(err.message || "ไม่สามารถดึงข้อมูลร้านค้าได้");
    } fontFinally: {
      setLoading(false);
    }
  };

  // ส่งคำขออนุมัติหรือปฏิเสธไปยัง Supabase
  const handleVerifyShop = async (shop_id: string, action: "approve" | "reject") => {
    const actionText = action == "approve" ? "อนุมัติ" : "ปฏิเสธ";
    if (!window.confirm(`คุณต้องการ${actionText}ร้านค้านี้ใช่หรือไม่?`)) return;

    try {
      const res = await fetch(`${API_URL}/shops/verify`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ shop_id, action }),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "การอัปเดตสถานะล้มเหลว");
      }

      // ลบรายการที่อนุมัติ/ปฏิเสธแล้วออกจาก State
      setPendingShops((prev) => prev.filter((shop) => shop.id !== shop_id));
      alert(`ทำรายการ${actionText}ร้านค้าเรียบร้อยแล้ว`);
    } catch (err: any) {
      console.error("Verify Shop Error:", err);
      alert(`เกิดข้อผิดพลาด: ${err.message}`);
    }
  };

  const formatTime = (timeStr?: string) => {
    if (!timeStr) return "ไม่ระบุ";
    return timeStr.slice(0, 5) + " น.";
  };

  return (
    <div className="shops-container">
      {/* Header Section */}
      <div className="page-header">
        <div>
          <h2 className="section-title">ตรวจสอบและอนุมัติร้านค้า</h2>
          <p className="subtitle">คำขอลงทะเบียนร้านค้าใหม่ที่รอการตรวจสอบข้อมูลในระบบ</p>
        </div>
        <div className="pending-badge">
          <span>รอการอนุมัติ</span>
          <strong className="count">{pendingShops.length}</strong>
        </div>
      </div>

      {/* Error State */}
      {errorMsg && (
        <div className="error-box">
          <p>⚠️ {errorMsg}</p>
          <button onClick={fetchPendingShops} className="btn-retry">ลองใหม่</button>
        </div>
      )}

      {/* Content Area */}
      {loading ? (
        <div className="loading-state">กำลังเชื่อมต่อข้อมูลกับ Supabase...</div>
      ) : pendingShops.length === 0 ? (
        <div className="empty-card">
          <div className="empty-icon">✓</div>
          <h3>ไม่มีคำขออนุมัติในขณะนี้</h3>
          <p>ร้านค้าทั้งหมดในระบบได้รับการตรวจสอบเรียบร้อยแล้ว</p>
        </div>
      ) : (
        <div className="shop-grid">
          {pendingShops.map((shop) => (
            <div key={shop.id} className="shop-card">
              <div className="card-top">
                <div className="avatar-wrapper">
                  {shop.profile_image ? (
                    <img src={shop.profile_image} alt={shop.shop_name} className="avatar-img" />
                  ) : (
                    <div className="avatar-placeholder">
                      {shop.shop_name?.charAt(0) || "S"}
                    </div>
                  )}
                </div>
                <span className="status-pill">Pending</span>
              </div>

              <div className="card-body">
                <h3 className="shop-name">{shop.shop_name}</h3>
                <p className="owner-name">เจ้าของร้าน: <span>{shop.owner_name || "ไม่ระบุ"}</span></p>

                <div className="info-divider" />

                <div className="info-list">
                  <div className="info-item">
                    <span className="info-label">อีเมล</span>
                    <span className="info-value">{shop.email}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">เบอร์โทรศัพท์</span>
                    <span className="info-value">{shop.phone || "-"}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">เวลาทำการ</span>
                    <span className="info-value highlight">
                      {formatTime(shop.open_time)} - {formatTime(shop.close_time)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="card-actions">
                <button
                  className="btn btn-reject"
                  onClick={() => handleVerifyShop(shop.id, "reject")}
                >
                  ปฏิเสธ
                </button>
                <button
                  className="btn btn-approve"
                  onClick={() => handleVerifyShop(shop.id, "approve")}
                >
                  อนุมัติร้านค้า
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <style jsx>{`
        .shops-container {
          max-width: 1200px;
          margin: 0 auto;
          font-family: 'Prompt', 'Kanit', sans-serif;
          color: #0F172A;
        }
        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 28px;
        }
        .section-title {
          font-size: 1.35rem;
          font-weight: 700;
          color: #0F172A;
          margin: 0 0 4px 0;
        }
        .subtitle {
          font-size: 0.9rem;
          color: #64748B;
          margin: 0;
        }
        .pending-badge {
          background-color: #F0F8FF;
          border-radius: 12px;
          padding: 8px 16px;
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 0.9rem;
          color: #003554;
          font-weight: 600;
        }
        .pending-badge .count {
          background-color: #003554;
          color: white;
          padding: 2px 10px;
          border-radius: 20px;
          font-size: 0.85rem;
        }
        .error-box {
          background-color: #FEF2F2;
          border: 1px solid #FECDD3;
          color: #991B1B;
          padding: 12px 16px;
          border-radius: 12px;
          margin-bottom: 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .btn-retry {
          background-color: #991B1B;
          color: white;
          border: none;
          padding: 6px 12px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 0.8rem;
        }
        .shop-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
          gap: 24px;
        }
        .shop-card {
          background-color: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 16px;
          padding: 24px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          transition: all 0.2s ease;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.02);
        }
        .shop-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
          border-color: #CBD5E1;
        }
        .card-top {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 16px;
        }
        .avatar-wrapper {
          width: 56px;
          height: 56px;
          border-radius: 14px;
          overflow: hidden;
          background-color: #F0F8FF;
        }
        .avatar-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .avatar-placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #E0F2FE;
          color: #0284C7;
          font-size: 1.5rem;
          font-weight: 700;
        }
        .status-pill {
          background-color: #FEF3C7;
          color: #D97706;
          font-size: 0.75rem;
          font-weight: 700;
          padding: 4px 12px;
          border-radius: 20px;
          text-transform: uppercase;
        }
        .shop-name {
          font-size: 1.15rem;
          font-weight: 700;
          color: #0F172A;
          margin: 0 0 4px 0;
        }
        .owner-name {
          font-size: 0.88rem;
          color: #64748B;
          margin: 0;
        }
        .owner-name span {
          color: #334155;
          font-weight: 600;
        }
        .info-divider {
          height: 1px;
          background-color: #F1F5F9;
          margin: 16px 0;
        }
        .info-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .info-item {
          display: flex;
          justify-content: space-between;
          font-size: 0.85rem;
        }
        .info-label {
          color: #94A3B8;
        }
        .info-value {
          color: #334155;
          font-weight: 500;
        }
        .info-value.highlight {
          color: #003554;
          font-weight: 600;
        }
        .card-actions {
          display: flex;
          gap: 12px;
          margin-top: 24px;
        }
        .btn {
          flex: 1;
          padding: 10px;
          border-radius: 10px;
          font-size: 0.88rem;
          font-weight: 600;
          cursor: pointer;
          border: none;
          transition: background-color 0.15s ease;
        }
        .btn-approve {
          background-color: #003554;
          color: white;
        }
        .btn-approve:hover {
          background-color: #002238;
        }
        .btn-reject {
          background-color: #FFF5F5;
          color: #E11D48;
          border: 1px solid #FECDD3;
        }
        .btn-reject:hover {
          background-color: #FFE4E6;
        }
        .empty-card {
          background-color: #FFFFFF;
          border-radius: 16px;
          padding: 48px;
          text-align: center;
          border: 1px dashed #CBD5E1;
        }
        .empty-icon {
          width: 48px;
          height: 48px;
          background-color: #DCFCE7;
          color: #16A34A;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          margin: 0 auto 16px;
          font-weight: bold;
        }
        .empty-card h3 {
          margin: 0 0 8px;
          color: #0F172A;
        }
        .empty-card p {
          color: #64748B;
          margin: 0;
          font-size: 0.9rem;
        }
        .loading-state {
          text-align: center;
          padding: 40px;
          color: #64748B;
        }
      `}</style>
    </div>
  );
}