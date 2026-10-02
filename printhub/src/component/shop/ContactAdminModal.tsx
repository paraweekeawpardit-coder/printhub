"use client";

import React, { useState } from "react";
import axios from "axios";
import { X, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

interface ContactAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ContactAdminModal({ isOpen, onClose }: ContactAdminModalProps) {
  const [subject, setSubject] = useState("ขอปลดการระงับใช้งานร้านค้า");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setLoading(true);
    setErrorMessage(null);

    try {
      const shopId = localStorage.getItem("shop_id") || localStorage.getItem("id");
      const token = localStorage.getItem("token");
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

      // ยิงตรงไปที่ /api/admin/contact-admin ตามที่กำหนดใน routes/admin.js
      await axios.post(
        `${backendUrl}/api/admin/contact-admin`,
        {
          shop_id: shopId,
          subject,
          message,
        },
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setMessage("");
        onClose();
      }, 2000);
    } catch (error: any) {
      console.error("Failed to contact admin:", error);
      setErrorMessage(
        error.response?.data?.message || "ส่งข้อมูลไม่สำเร็จ กรุณาลองใหม่อีกครั้ง"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setErrorMessage(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 p-4 pointer-events-auto">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl transition-all">
        <div className="flex items-center justify-between border-b pb-3">
          <h3 className="text-lg font-bold text-slate-800">ติดต่อผู้ดูแลระบบ (Admin)</h3>
          <button
            onClick={handleClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
          >
            <X size={20} />
          </button>
        </div>

        {errorMessage && (
          <div className="mt-4 flex items-center gap-2 rounded-xl bg-rose-50 p-3 text-xs text-rose-700 border border-rose-200">
            <AlertCircle size={16} className="shrink-0 text-rose-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        {success ? (
          <div className="my-6 flex flex-col items-center text-center text-emerald-600">
            <CheckCircle2 size={48} className="mb-2 text-emerald-500" />
            <p className="text-base font-semibold">ส่งข้อความถึงผู้ดูแลระบบเรียบร้อยแล้ว</p>
            <p className="text-xs text-slate-500 mt-1">ทีมงานจะดำเนินการตรวจสอบโดยเร็วที่สุด</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">หัวข้อเรื่อง</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                รายละเอียด / เหตุผลที่ต้องการชี้แจง
              </label>
              <textarea
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="ระบุรายละเอียดเพิ่มเติมเพื่อขอยื่นเรื่องปลดระงับ..."
                className="w-full rounded-lg border border-slate-300 p-3 text-sm focus:border-blue-500 focus:outline-none"
                required
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={handleClose}
                className="rounded-lg border border-slate-300 px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 transition"
              >
                ยกเลิก
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-1.5 rounded-lg bg-red-600 px-4 py-2 text-xs font-medium text-white hover:bg-red-700 disabled:opacity-50 transition"
              >
                {loading && <Loader2 size={14} className="animate-spin" />}
                {loading ? "กำลังส่ง..." : "ส่งเรื่องถึงผู้ดูแลระบบ"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}