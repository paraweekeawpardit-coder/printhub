"use client";

import { Eye } from "lucide-react";

export interface Shop {
  id?: string;
  _id?: string;
  shop_name?: string;
  name?: string;
  owner_name?: string;
  ownerName?: string;
  email?: string;
  phone?: string;
  profile_image?: string;
  logoUrl?: string;
  open_time?: string;
  close_time?: string;
  openTime?: string;
  closeTime?: string;
  address?: string;
  description?: string;
  documentUrl?: string;
  is_verify?: boolean;
  status?: string;
  created_at?: string;
}

interface ShopCardProps {
  shop: Shop;
  onVerify: (shop_id: string, action: "approve" | "reject") => void;
  onSelectShop?: (shop: Shop) => void;
}

export default function ShopCard({ shop, onVerify, onSelectShop }: ShopCardProps) {
  const shopId = shop.id || shop._id || "";
  const shopName = shop.shop_name || shop.name || "ไม่ระบุชื่อร้าน";
  const ownerName = shop.owner_name || shop.ownerName || "ไม่ระบุ";
  const imageSrc = shop.profile_image || shop.logoUrl;
  const openTime = shop.open_time || shop.openTime;
  const closeTime = shop.close_time || shop.closeTime;

  const formatTime = (timeStr?: string) => {
    if (!timeStr) return "ไม่ระบุ";
    return timeStr.slice(0, 5) + " น.";
  };

  return (
    <div className="shop-card">
      <div className="card-top">
        <div className="avatar-wrapper">
          {imageSrc ? (
            <img src={imageSrc} alt={shopName} className="avatar-img" />
          ) : (
            <div className="avatar-placeholder">
              {shopName.charAt(0) || "S"}
            </div>
          )}
        </div>
        <span className="status-pill">Pending</span>
      </div>

      <div className="card-body">
        <h3 className="shop-name">{shopName}</h3>
        <p className="owner-name">
          เจ้าของร้าน: <span>{ownerName}</span>
        </p>

        <div className="info-divider" />

        <div className="info-list">
          <div className="info-item">
            <span className="info-label">อีเมล</span>
            <span className="info-value">{shop.email || "-"}</span>
          </div>
          <div className="info-item">
            <span className="info-label">เบอร์โทรศัพท์</span>
            <span className="info-value">{shop.phone || "-"}</span>
          </div>
          <div className="info-item">
            <span className="info-label">เวลาทำการ</span>
            <span className="info-value highlight">
              {formatTime(openTime)} - {formatTime(closeTime)}
            </span>
          </div>
        </div>
      </div>

      <div className="card-actions-container">
        {onSelectShop && (
          <button
            type="button"
            className="btn btn-detail"
            onClick={() => onSelectShop(shop)}
          >
            <Eye className="w-4 h-4 inline-block mr-1" />
            ดูรายละเอียดข้อมูลร้าน
          </button>
        )}

        <div className="card-actions">
          <button
            type="button"
            className="btn btn-reject"
            onClick={() => onVerify(shopId, "reject")}
          >
            ปฏิเสธ
          </button>
          <button
            type="button"
            className="btn btn-approve"
            onClick={() => onVerify(shopId, "approve")}
          >
            อนุมัติร้านค้า
          </button>
        </div>
      </div>

      <style jsx>{`
        .shop-card {
          background-color: #ffffff;
          border: 1px solid #e2e8f0;
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
          border-color: #cbd5e1;
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
          background-color: #f0f8ff;
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
          background-color: #e0f2fe;
          color: #0284c7;
          font-size: 1.5rem;
          font-weight: 700;
        }
        .status-pill {
          background-color: #fef3c7;
          color: #d97706;
          font-size: 0.75rem;
          font-weight: 700;
          padding: 4px 12px;
          border-radius: 20px;
          text-transform: uppercase;
        }
        .shop-name {
          font-size: 1.15rem;
          font-weight: 700;
          color: #0f172a;
          margin: 0 0 4px 0;
        }
        .owner-name {
          font-size: 0.88rem;
          color: #64748b;
          margin: 0;
        }
        .owner-name span {
          color: #334155;
          font-weight: 600;
        }
        .info-divider {
          height: 1px;
          background-color: #f1f5f9;
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
          color: #94a3b8;
        }
        .info-value {
          color: #334155;
          font-weight: 500;
        }
        .info-value.highlight {
          color: #003554;
          font-weight: 600;
        }
        .card-actions-container {
          margin-top: 20px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .card-actions {
          display: flex;
          gap: 12px;
        }
        .btn {
          padding: 10px;
          border-radius: 10px;
          font-size: 0.88rem;
          font-weight: 600;
          cursor: pointer;
          border: none;
          transition: background-color 0.15s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .btn-detail {
          width: 100%;
          background-color: #f1f5f9;
          color: #334155;
        }
        .btn-detail:hover {
          background-color: #e2e8f0;
        }
        .btn-approve {
          flex: 1;
          background-color: #003554;
          color: white;
        }
        .btn-approve:hover {
          background-color: #002238;
        }
        .btn-reject {
          flex: 1;
          background-color: #fff5f5;
          color: #e11d48;
          border: 1px solid #fecdd3;
        }
        .btn-reject:hover {
          background-color: #ffe4e6;
        }
      `}</style>
    </div>
  );
}