"use client";

import { HelpCircle, X } from "lucide-react";

export interface ConfirmModalState {
  isOpen: boolean;
  title: string;
  message: string;
  type: "approve" | "reject" | "warning";
  onConfirm: () => void;
}

interface ConfirmModalProps {
  modalData: ConfirmModalState;
  onClose: () => void;
}

export default function ConfirmModal({ modalData, onClose }: ConfirmModalProps) {
  if (!modalData.isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="custom-modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose} type="button">
          <X size={18} />
        </button>
        <div className={`modal-icon-wrapper ${modalData.type}`}>
          <HelpCircle size={28} />
        </div>
        <h3 className="modal-title">{modalData.title}</h3>
        <p className="modal-message">{modalData.message}</p>
        <div className="modal-actions">
          <button className="btn-cancel" onClick={onClose} type="button">
            ยกเลิก
          </button>
          <button 
            type="button"
            className={`btn-confirm ${modalData.type}`} 
            onClick={modalData.onConfirm}
          >
            ยืนยัน
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
          background: rgba(15, 23, 42, 0.4);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          animation: fadeIn 0.2s ease-out;
        }
        .custom-modal {
          background: #ffffff;
          width: 90%;
          max-width: 400px;
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
        .modal-icon-wrapper {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 16px;
        }
        .modal-icon-wrapper.approve {
          background-color: #e0f2fe;
          color: #0284c7;
        }
        .modal-icon-wrapper.reject {
          background-color: #fee2e2;
          color: #dc2626;
        }
        .modal-title {
          font-size: 1.15rem;
          font-weight: 700;
          margin: 0 0 8px;
          color: #0f172a;
        }
        .modal-message {
          font-size: 0.9rem;
          color: #64748b;
          margin: 0 0 24px;
          line-height: 1.5;
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
        .btn-confirm.approve {
          background-color: #16a34a;
          color: white;
        }
        .btn-confirm.approve:hover {
          background-color: #15803d;
        }
        .btn-confirm.reject {
          background-color: #dc2626;
          color: white;
        }
        .btn-confirm.reject:hover {
          background-color: #b91c1c;
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