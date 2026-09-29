"use client";

export interface BankChangeRequest {
  id: string;
  shop_id: string;
  shop_name: string;
  logo_url?: string;
  created_at: string;
  old_account: {
    bank_name: string;
    account_number: string;
    account_name: string;
  };
  new_account: {
    bank_name: string;
    account_number: string;
    account_name: string;
  };
}

interface BankRequestCardProps {
  request: BankChangeRequest;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

export default function BankRequestCard({ request, onApprove, onReject }: BankRequestCardProps) {
  return (
    <div className="bank-req-card">
      <div className="req-header">
        <div className="shop-info">
          {request.logo_url && <img src={request.logo_url} alt="Logo" className="shop-logo-sm" />}
          <h4>{request.shop_name}</h4>
        </div>
        <span className="req-date">ยื่นเมื่อ: {new Date(request.created_at).toLocaleDateString("th-TH")}</span>
      </div>

      <div className="comparison-box">
        <div className="account-col old">
          <h5>บัญชีเดิม</h5>
          <p><strong>ธนาคาร:</strong> {request.old_account?.bank_name || "-"}</p>
          <p><strong>เลขบัญชี:</strong> {request.old_account?.account_number || "-"}</p>
          <p><strong>ชื่อบัญชี:</strong> {request.old_account?.account_name || "-"}</p>
        </div>

        <div className="arrow-divider">➔</div>

        <div className="account-col new">
          <h5>บัญชีใหม่ที่ขอเปลี่ยน</h5>
          <p><strong>ธนาคาร:</strong> {request.new_account.bank_name}</p>
          <p><strong>เลขบัญชี:</strong> {request.new_account.account_number}</p>
          <p><strong>ชื่อบัญชี:</strong> {request.new_account.account_name}</p>
        </div>
      </div>

      <div className="req-actions">
        <button onClick={() => onApprove(request.id)} className="btn-approve">
          ✓ อนุมัติเปลี่ยนบัญชี
        </button>
        <button onClick={() => onReject(request.id)} className="btn-reject">
          ✕ ปฏิเสธ
        </button>
      </div>

      <style jsx>{`
        .bank-req-card {
          background-color: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          padding: 20px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.02);
        }
        .req-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }
        .shop-info {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .shop-logo-sm {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          object-fit: cover;
        }
        .req-header h4 {
          margin: 0;
          font-size: 1.1rem;
        }
        .req-date {
          font-size: 0.8rem;
          color: #94a3b8;
        }
        .comparison-box {
          display: flex;
          align-items: center;
          background-color: #f8fafc;
          border-radius: 12px;
          padding: 16px;
          gap: 16px;
          margin-bottom: 16px;
        }
        .account-col {
          flex: 1;
        }
        .account-col h5 {
          margin: 0 0 8px;
          font-size: 0.85rem;
          color: #64748b;
        }
        .account-col.new h5 {
          color: #0284c7;
        }
        .account-col p {
          margin: 4px 0;
          font-size: 0.9rem;
        }
        .arrow-divider {
          font-size: 1.5rem;
          color: #94a3b8;
          font-weight: bold;
        }
        .req-actions {
          display: flex;
          justify-content: flex-end;
          gap: 12px;
        }
        .btn-approve {
          background-color: #16a34a;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
        }
        .btn-reject {
          background-color: #dc2626;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}