"use client";

import React, { useState } from "react";
import axios from "axios";
import supabase from "@/config/supabase";
import {
  X,
  CheckCircle2,
  Loader2,
  Upload,
  FileText,
  ImageIcon,
  Trash2,
  AlertCircle,
  Info,
} from "lucide-react";

interface ContactAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  reason?: string;
}

const MAX_FILES = 3;
const MAX_FILE_SIZE = 5 * 1024 * 1024;

export default function ContactAdminModal({
  isOpen,
  onClose,
  reason,
}: ContactAdminModalProps) {
  const [subject, setSubject] = useState("ขอปลดการระงับใช้งานร้านค้า");
  const [message, setMessage] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    setErrorMessage(null);

    if (files.length + selectedFiles.length > MAX_FILES) {
      setErrorMessage(`สามารถแนบหลักฐานได้สูงสุดไม่เกิน ${MAX_FILES} ไฟล์เท่านั้น`);
      return;
    }

    for (const f of selectedFiles) {
      if (f.size > MAX_FILE_SIZE) {
        setErrorMessage(`ไฟล์ "${f.name}" มีขนาดเกิน 5MB กรุณาเลือกไฟล์ที่มีขนาดเล็กลง`);
        return;
      }
    }

    setFiles((prev) => [...prev, ...selectedFiles]);
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setLoading(true);
    setErrorMessage(null);

    try {
      const shopId =
        localStorage.getItem("shop_id") || localStorage.getItem("id");
      const token = localStorage.getItem("token");
      const backendUrl =
        process.env.NEXT_PUBLIC_BACKEND_URL ||
        process.env.NEXT_PUBLIC_API_URL ||
        "http://localhost:5000";

      const uploadedUrls: string[] = [];

      for (const file of files) {
        const fileExt = file.name.split(".").pop();
        const fileName = `${shopId}_${Date.now()}_${Math.random()
          .toString(36)
          .substring(2, 7)}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from("appeals")
          .upload(fileName, file);

        if (uploadError) {
          throw new Error(`อัปโหลดไฟล์ ${file.name} ไม่สำเร็จ: ${uploadError.message}`);
        }

        const { data: publicUrlData } = supabase.storage
          .from("appeals")
          .getPublicUrl(fileName);

        if (publicUrlData?.publicUrl) {
          uploadedUrls.push(publicUrlData.publicUrl);
        }
      }

      await axios.post(
        `${backendUrl}/api/admin/contact-admin`,
        {
          shop_id: shopId,
          subject,
          message,
          attachment_urls: uploadedUrls,
        },
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );

      console.warn("[ContactAdminModal] Appeal submitted successfully.");
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setMessage("");
        setFiles([]);
        onClose();
      }, 2000);
    } catch (error: any) {
      console.warn(
        "[ContactAdminModal Error] Failed to contact admin:",
        error.message || error
      );
      setErrorMessage(
        error.message ||
          error.response?.data?.error ||
          error.response?.data?.message ||
          "ส่งข้อมูลไม่สำเร็จ กรุณาลองใหม่อีกครั้ง"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setErrorMessage(null);
    setFiles([]);
    onClose();
  };

  return (
    // 🟢 กำหนด z-index เป็น z-[9999] พร้อมจัดตำแหน่ง Center และสั่ง overflow-y-auto ให้เลื่อนดูส่วนบนได้
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto pointer-events-auto">
      <div className="w-full max-w-lg my-auto rounded-2xl bg-white p-6 shadow-2xl transition-all relative max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 sticky top-0 bg-white z-10 pt-1">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-100 text-rose-600 shrink-0">
              <FileText size={20} />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800">
                ยื่นเรื่องขอปลดการระงับใช้งาน
              </h3>
              <p className="text-xs text-slate-500">
                ส่งข้อความชี้แจงและหลักฐานถึงผู้ดูแลระบบ
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Error Message Alert */}
        {errorMessage && (
          <div className="mt-3 flex items-center gap-2 rounded-xl bg-rose-50 p-3 text-xs text-rose-700 border border-rose-200">
            <AlertCircle size={16} className="shrink-0 text-rose-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* สาเหตุที่ถูกระงับ */}
        <div className="mt-3 rounded-xl border border-rose-200 bg-rose-50/70 p-3 text-xs text-rose-800">
          <div className="flex items-center gap-1.5 font-bold text-rose-700">
            <AlertCircle size={15} className="shrink-0" />
            <span>สาเหตุที่ถูกระงับการใช้งาน:</span>
          </div>
          <p className="mt-1 pl-5 text-rose-900/90 font-medium">
            "{reason || "เนื่องจากตรวจพบกิจกรรมที่เข้าข่ายผิดเงื่อนไขระบบ"}"
          </p>
        </div>

        {/* คำแนะนำเบื้องต้น */}
        <div className="mt-2.5 flex items-start gap-2 rounded-xl bg-slate-50 border border-slate-200/80 p-3 text-[11px] text-slate-600 leading-relaxed">
          <Info size={16} className="shrink-0 text-slate-500 mt-0.5" />
          <div>
            <span className="font-semibold text-slate-700">คำแนะนำ:</span>{" "}
            กรุณาระบุรายละเอียดชี้แจงและแนบหลักฐานที่เกี่ยวข้อง (เช่น สลิปโอนเงิน,
            ใบจดทะเบียนร้าน หรือภาพถ่าย) เพื่อให้ผู้ดูแลระบบตรวจสอบได้รวดเร็วยิ่งขึ้น{" "}
            <span className="font-semibold text-slate-700">
              (ใช้เวลาพิจารณา 1–3 วันทำการ)
            </span>
          </div>
        </div>

        {success ? (
          <div className="my-6 flex flex-col items-center text-center text-emerald-600">
            <CheckCircle2 size={48} className="mb-2 text-emerald-500" />
            <p className="text-base font-semibold">
              ส่งข้อความถึงผู้ดูแลระบบเรียบร้อยแล้ว
            </p>
            <p className="text-xs text-slate-500 mt-1">
              ทีมงานจะดำเนินการตรวจสอบภายใน 1–3 วันทำการ
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-4 space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                หัวข้อเรื่อง
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-medium text-slate-900 outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                รายละเอียด / เหตุผลที่ต้องการชี้แจง{" "}
                <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={4}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="ระบุรายละเอียดเพิ่มเติมเพื่อขอยื่นเรื่องปลดระงับ..."
                className="w-full rounded-xl border border-slate-200 p-3 text-xs text-slate-900 outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
              />
            </div>

            {/* แนบไฟล์หลักฐาน */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-700">
                  แนบหลักฐานประกอบ (รูปภาพ หรือ PDF)
                </label>
                <span className="text-[11px] text-slate-400">
                  {files.length}/{MAX_FILES} ไฟล์
                </span>
              </div>

              {files.length < MAX_FILES && (
                <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50/50 py-3 hover:border-rose-500 hover:bg-rose-50/30 transition mb-2">
                  <Upload size={18} className="text-slate-400 mb-1" />
                  <span className="text-xs font-medium text-slate-600">
                    คลิกเพื่อเลือกไฟล์หลักฐาน
                  </span>
                  <span className="text-[10px] text-slate-400">
                    รองรับ PNG, JPG, WEBP หรือ PDF (สูงสุด 5MB/ไฟล์)
                  </span>
                  <input
                    type="file"
                    multiple
                    accept="image/*,application/pdf"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              )}

              {/* แสดงรายการไฟล์ที่เลือก */}
              {files.length > 0 && (
                <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
                  {files.map((f, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        {f.type.startsWith("image/") ? (
                          <img
                            src={URL.createObjectURL(f)}
                            alt="preview"
                            className="h-8 w-8 rounded-lg object-cover border"
                          />
                        ) : (
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                            <ImageIcon size={16} />
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="truncate font-semibold text-slate-800">
                            {f.name}
                          </p>
                          <p className="text-[10px] text-slate-400">
                            {(f.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFile(idx)}
                        className="rounded-lg p-1 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition cursor-pointer"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-2.5 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={handleClose}
                disabled={loading}
                className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition disabled:opacity-50 cursor-pointer"
              >
                ยกเลิก
              </button>
              <button
                type="submit"
                disabled={loading || !message.trim()}
                className="flex items-center gap-1.5 rounded-xl bg-rose-600 px-5 py-2 text-xs font-semibold text-white hover:bg-rose-700 disabled:opacity-50 transition shadow-xs cursor-pointer"
              >
                {loading && <Loader2 size={14} className="animate-spin" />}
                {loading ? "กำลังส่งเรื่อง..." : "ส่งเรื่องถึงผู้ดูแลระบบ"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}