"use client";

import { Shop } from "./ShopCard";

interface AllShopsTableProps {
  shops: Shop[];
  onToggleSuspend: (shopId: string | number, currentStatus: string) => void;
}

export default function AllShopsTable({ shops, onToggleSuspend }: AllShopsTableProps) {
  return (
    <div className="all-shops-table-container">
      <table className="all-shops-table">
        <thead>
          <tr>
            <th>ร้านค้า</th>
            <th>เจ้าของร้าน</th>
            <th>เบอร์โทรศัพท์</th>
            <th>สถานะ</th>
            <th>การจัดการ</th>
          </tr>
        </thead>
        <tbody>
          {shops.map((shop) => {
            const shopId = shop.id || shop._id || "";
            const isSuspended = shop.status === "SUSPENDED";
            return (
              <tr key={shopId}>
                <td className="shop-cell">
                  <img
                    src={shop.profile_image || shop.logoUrl || "/placeholder.png"}
                    alt=""
                    className="shop-avatar"
                  />
                  <div>
                    <div className="shop-name-txt">{shop.shop_name || shop.name}</div>
                    <div className="shop-sub-txt">{shop.email}</div>
                  </div>
                </td>
                <td>{shop.owner_name || shop.ownerName || "-"}</td>
                <td>{shop.phone || "-"}</td>
                <td>
                  <span className={`status-pill ${isSuspended ? "suspended" : "approved"}`}>
                    {isSuspended ? "ถูกระงับ" : "เปิดใช้งานปกติ"}
                  </span>
                </td>
                <td>
                  <button
                    onClick={() => onToggleSuspend(shopId, shop.status || "APPROVED")}
                    className={`btn-suspend ${isSuspended ? "unsuspend" : ""}`}
                  >
                    {isSuspended ? "🔓 ปลดการระงับ" : "🚫 ระงับการใช้งาน"}
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <style jsx>{`
        .all-shops-table-container {
          background: white;
          border-radius: 16px;
          border: 1px solid #e2e8f0;
          overflow: hidden;
        }
        .all-shops-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
        }
        .all-shops-table th {
          background-color: #f8fafc;
          padding: 14px 20px;
          font-size: 0.85rem;
          color: #64748b;
          border-bottom: 1px solid #e2e8f0;
        }
        .all-shops-table td {
          padding: 16px 20px;
          border-bottom: 1px solid #f1f5f9;
          font-size: 0.9rem;
        }
        .shop-cell {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .shop-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          object-fit: cover;
        }
        .shop-name-txt {
          font-weight: 600;
        }
        .shop-sub-txt {
          font-size: 0.8rem;
          color: #64748b;
        }
        .status-pill {
          padding: 4px 10px;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 600;
        }
        .status-pill.approved {
          background-color: #dcfce7;
          color: #15803d;
        }
        .status-pill.suspended {
          background-color: #fee2e2;
          color: #b91c1c;
        }
        .btn-suspend {
          background-color: #f1f5f9;
          color: #dc2626;
          border: 1px solid #fca5a5;
          padding: 6px 12px;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
        }
        .btn-suspend.unsuspend {
          color: #16a34a;
          border-color: #86efac;
        }
      `}</style>
    </div>
  );
}