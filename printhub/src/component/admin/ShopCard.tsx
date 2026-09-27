"use client";

export interface Shop {
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

interface ShopCardProps {
  shop: Shop;
  onVerify: (shop_id: string, action: "approve" | "reject") => void;
}

export default function ShopCard({ shop, onVerify }: ShopCardProps) {
  const formatTime = (timeStr?: string) => {
    if (!timeStr) return "ไม่ระบุ";
    return timeStr.slice(0, 5) + " น.";
  };

  return (
    <div className="shop-card">
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
        <p className="owner-name">
          เจ้าของร้าน: <span>{shop.owner_name || "ไม่ระบุ"}</span>
        </p>

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
          onClick={() => onVerify(shop.id, "reject")}
        >
          ปฏิเสธ
        </button>
        <button
          className="btn btn-approve"
          onClick={() => onVerify(shop.id, "approve")}
        >
          อนุมัติร้านค้า
        </button>
      </div>

      <style jsx>{`
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
      `}</style>
    </div>
  );
}