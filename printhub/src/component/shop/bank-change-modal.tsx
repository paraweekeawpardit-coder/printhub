"use client";

import { AlertTriangle, X } from "lucide-react";

export interface BankData {
  bankName: string;
  accountName: string;
  accountNumber: string;
}

interface BankChangeModalProps {
  isOpen: boolean;
  bankData: BankData;
  isLoading?: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function BankChangeModal({
  isOpen,
  bankData,
  isLoading = false,
  onClose,
  onConfirm,
}: BankChangeModalProps) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        {/* ปุ่มปิด */}
        <button className="close-btn" onClick={onClose} disabled={isLoading} type="button">
          <X size={18} />
        </button>

        {/* ไอคอนแจ้งเตือน */}
        <div className="icon-wrapper">
          <AlertTriangle size={32} />
        </div>

        {/* หัวข้อและคำอธิบาย */}
        <h3 className="modal-title">ยืนยันการเปลี่ยนบัญชีธนาคาร</h3>
        <p className="modal-subtitle">
          กรุณาตรวจสอบความถูกต้อง ข้อมูลนี้จะถูกส่งไปให้ Admin ตรวจสอบก่อนอนุมัติใช้งานจริง
        </p>

        {/* กล่องสรุปข้อมูลที่ต้องการเปลี่ยน */}
        <div className="info-box">
          <div className="info-row">
            <span className="info-label">ธนาคาร:</span>
            <span className="info-value">{bankData.bankName || "-"}</span>
          </div>
          <div className="info-row">
            <span className="info-label">ชื่อบัญชี:</span>
            <span className="info-value">{bankData.accountName || "-"}</span>
          </div>
          <div className="info-row">
            <span className="info-label">เลขที่บัญชี:</span>
            <span className="info-value highlight">{bankData.accountNumber || "-"}</span>
          </div>
        </div>

        {/* ข้อความคำเตือนเพิ่มเติม */}
        <p className="note-text">
          * เมื่อส่งคำขอแล้ว จะไม่สามารถส่งคำขอซ้ำได้จนกว่า Admin จะพิจารณาอนุมัติหรือปฏิเสธคำขอนี้
        </p>

        {/* ปุ่มแอคชัน */}
        <div className="modal-actions">
          <button
            type="button"
            className="btn-cancel"
            onClick={onClose}
            disabled={isLoading}
          >
            ย้อนกลับ
          </button>
          <button
            type="button"
            className="btn-confirm"
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? "กำลังส่งคำขอ..." : "ยืนยันส่งคำขอ"}
          </button>
        </div>
      </div>

      <style jsx>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(15, 23, 42, 0.45);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          animation: fadeIn 0.2s ease-out;
        }
        .modal-card {
          background: #ffffff;
          width: 90%;
          max-width: 420px;
          border-radius: 16px;
          padding: 24px;
          position: relative;
          text-align: center;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
          animation: scaleUp 0.2s ease-out;
        }
        .close-btn {
          position: absolute;
          top: 16px;
          right: 16px;
          background: none;
          border: none;
          color: #94a3b8;
          cursor: pointer;
          padding: 4px;
          border-radius: 50%;
          transition: background-color 0.2s;
        }
        .close-btn:hover {
          background-color: #f1f5f9;
          color: #0f172a;
        }
        .icon-wrapper {
          width: 56px;
          height: 56px;
          background-color: #fef3c7;
          color: #d97706;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 16px;
        }
        .modal-title {
          font-size: 1.15rem;
          font-weight: 700;
          color: #0f172a;
          margin: 0 0 6px;
        }
        .modal-subtitle {
          font-size: 0.875rem;
          color: #64748b;
          margin: 0 0 18px;
          line-height: 1.4;
        }
        .info-box {
          background-color: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 14px 16px;
          margin-bottom: 12px;
          text-align: left;
        }
        .info-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
          font-size: 0.875rem;
        }
        .info-row:last-child {
          margin-bottom: 0;
        }
        .info-label {
          color: #64748b;
        }
        .info-value {
          font-weight: 600;
          color: #0f172a;
        }
        .info-value.highlight {
          color: #0284c7;
        }
        .note-text {
          font-size: 0.75rem;
          color: #ef4444;
          margin: 0 0 20px;
          text-align: left;
          line-height: 1.3;
        }
        .modal-actions {
          display: flex;
          gap: 12px;
        }
        .modal-actions button {
          flex: 1;
          padding: 10px 16px;
          border-radius: 10px;
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
          border: none;
          transition: all 0.2s ease;
        }
        .btn-cancel {
          background-color: #f1f5f9;
          color: #475569;
        }
        .btn-cancel:hover {
          background-color: #e2e8f0;
        }
        .btn-confirm {
          background-color: #0f172a;
          color: #ffffff;
        }
        .btn-confirm:hover {
          background-color: #1e293b;
        }
        .btn-confirm:disabled,
        .btn-cancel:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleUp {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}