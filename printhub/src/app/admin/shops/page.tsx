"use client";

import { useState, useEffect } from "react";
import ShopCard, { Shop } from "../../../component/admin/ShopCard";

export default function ShopsPage() {
  const [pendingShops, setPendingShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/admin";

  useEffect(() => {
    fetchPendingShops();
  }, []);

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
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyShop = async (shop_id: string, action: "approve" | "reject") => {
    const actionText = action === "approve" ? "อนุมัติ" : "ปฏิเสธ";
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

      setPendingShops((prev) => prev.filter((shop) => shop.id !== shop_id));
      alert(`ทำรายการ${actionText}ร้านค้าเรียบร้อยแล้ว`);
    } catch (err: any) {
      console.error("Verify Shop Error:", err);
      alert(`เกิดข้อผิดพลาด: ${err.message}`);
    }
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
        <div className="loading-state">กำลังเชื่อมต่อข้อมูล...</div>
      ) : pendingShops.length === 0 ? (
        <div className="empty-card">
          <div className="empty-icon">✓</div>
          <h3>ไม่มีคำขออนุมัติในขณะนี้</h3>
          <p>ร้านค้าทั้งหมดในระบบได้รับการตรวจสอบเรียบร้อยแล้ว</p>
        </div>
      ) : (
        <div className="shop-grid">
          {pendingShops.map((shop) => (
            <ShopCard key={shop.id} shop={shop} onVerify={handleVerifyShop} />
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