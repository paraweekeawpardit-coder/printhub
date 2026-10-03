"use client";

import { useState } from "react";
import {
  Pencil,
  Landmark,
  User,
  Hash,
  Check,
  Copy,
  Loader2,
  Lock,
  AlertTriangle,
  X,
  ShieldAlert,
  Clock,
} from "lucide-react";

type Props = {
  isVerified: boolean;
  bankName: string;
  setBankName: (v: string) => void;
  accountName: string;
  setAccountName: (v: string) => void;
  accountNumber: string;
  setAccountNumber: (v: string) => void;
  onSave: () => void;
  saving: boolean;
  hasData: boolean;
  isEditing: boolean;
  isPending?: boolean;
  pendingCreatedAt?: string; // เพิ่ม Prop สำหรับรับวันเวลาที่ยื่นคำขอ
  onToggleEdit: () => void;
};

export default function ShopBankTab({
  isVerified,
  bankName,
  setBankName,
  accountName,
  setAccountName,
  accountNumber,
  setAccountNumber,
  onSave,
  saving,
  hasData,
  isEditing,
  isPending = false,
  pendingCreatedAt,
  onToggleEdit,
}: Props) {
  const [copied, setCopied] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // ฟังก์ชันแปลงรูปแบบวันเวลาเป็นภาษาไทย (Timezone: Asia/Bangkok)
  const formatDate = (dateStr?: string) => {
    if (!dateStr || dateStr === "-") return "";

    const safeDateStr =
      typeof dateStr === "string" && !dateStr.endsWith("Z") && !dateStr.includes("+")
        ? `${dateStr}Z`
        : dateStr;

    const date = new Date(safeDateStr);
    if (isNaN(date.getTime())) return "";

    return date.toLocaleDateString("th-TH", {
      timeZone: "Asia/Bangkok",
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  const handleCopy = async () => {
    if (!accountNumber) return;
    try {
      await navigator.clipboard.writeText(accountNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error("Copy failed:", err);
    }
  };

  // ตรวจสอบข้อมูลก่อนเปิด Modal
  const handlePreSave = () => {
    if (!bankName.trim() || !accountName.trim() || !accountNumber.trim()) {
      const msg = "กรุณากรอกข้อมูลบัญชีธนาคารให้ครบทุกช่อง";
      setErrorMessage(msg);
      console.warn("Validation Error:", msg);
      return;
    }

    setErrorMessage("");
    setShowConfirmModal(true);
  };

  // กดยืนยันใน Modal
  const handleConfirmSave = () => {
    console.log("Submitting bank detail changes...", {
      bankName,
      accountName,
      accountNumber,
    });
    setShowConfirmModal(false);
    onSave();
  };

  return (
    <div className="relative space-y-4">
      {/* Banner แจ้งเตือนเมื่อมีคำขอค้างอยู่ */}
      {isPending && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs text-amber-800 space-y-1">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-2 font-bold text-amber-900">
              <ShieldAlert size={18} className="shrink-0 text-amber-600" />
              <span>กำลังอยู่ระหว่างรออนุมัติ</span>
            </div>
            {pendingCreatedAt && (
              <div className="flex items-center gap-1 rounded-full bg-amber-100/80 px-2.5 py-0.5 text-[11px] font-medium text-amber-900 border border-amber-200/60">
                <Clock size={12} className="text-amber-700" />
                <span>ยื่นเมื่อ: {formatDate(pendingCreatedAt)} น.</span>
              </div>
            )}
          </div>
          <p className="text-amber-800/90 leading-relaxed pl-6.5">
            คุณได้ยื่นคำขอเปลี่ยนแปลงข้อมูลบัญชีธนาคารเรียบร้อยแล้ว ขณะนี้กำลังรอผู้ดูแลระบบ (Admin) ตรวจสอบ
            ท่านจะไม่สามารถแก้ไขข้อมูลได้ในขณะนี้
          </p>
        </div>
      )}

      <div
        className={`rounded-2xl border border-slate-200 bg-white shadow-sm ${
          !isVerified ? "pointer-events-none blur-[2px] select-none" : ""
        }`}
      >
        {/* View Mode */}
        {!isEditing ? (
          <div>
            <div className="flex items-center justify-between gap-4 p-6">
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#EAF1FF] text-[#2F6FED] ring-1 ring-[#2F6FED]/15">
                  <Landmark size={20} strokeWidth={2} />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-[#0F2942]">
                    {bankName || "-"}
                  </p>
                  <p className="truncate text-xs text-slate-400">
                    {accountName || "-"}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onToggleEdit}
                disabled={isPending}
                className={`flex shrink-0 items-center gap-1.5 rounded-xl border px-4 py-2 text-xs font-semibold transition-colors ${
                  isPending
                    ? "cursor-not-allowed border-slate-200 bg-slate-50 text-slate-400 opacity-60"
                    : "border-slate-200 text-[#0F2942] hover:border-[#0F2942]"
                }`}
              >
                <Pencil size={14} /> แก้ไขข้อมูล
              </button>
            </div>

            <div className="border-t border-slate-100 px-6 py-4">
              <p className="text-xs font-semibold text-slate-400">เลขที่บัญชี</p>
              <div className="mt-1.5 flex items-center justify-between gap-3">
                <p className="text-base font-semibold tabular-nums tracking-wide text-[#0F2942]">
                  {accountNumber || "-"}
                </p>
                {accountNumber && (
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="flex shrink-0 items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-slate-400 transition-colors hover:bg-slate-50 hover:text-[#2F6FED]"
                  >
                    {copied ? (
                      <>
                        <Check size={13} /> คัดลอกแล้ว
                      </>
                    ) : (
                      <>
                        <Copy size={13} /> คัดลอก
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* Edit / Form Mode */
          <div>
            <div className="space-y-5 p-6">
              <p className="text-xs leading-relaxed text-slate-400">
                ข้อมูลบัญชีนี้จะถูกใช้เป็นช่องทางหลักสำหรับการโอนเงินรายได้จากคำสั่งพิมพ์เข้าสู่ร้านค้าของคุณ
              </p>

              {errorMessage && (
                <div className="rounded-lg bg-red-50 p-3 text-xs font-medium text-red-600 border border-red-100">
                  {errorMessage}
                </div>
              )}

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-semibold text-slate-600">
                    ธนาคาร
                  </label>
                  <div className="relative mt-1.5">
                    <Landmark
                      size={16}
                      className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-300"
                    />
                    <input
                      type="text"
                      value={bankName}
                      onChange={(e) => {
                        setBankName(e.target.value);
                        if (errorMessage) setErrorMessage("");
                      }}
                      placeholder="เช่น ธนาคารกสิกรไทย"
                      className="w-full rounded-xl border border-slate-200 py-2 pl-9 pr-3.5 text-sm text-[#0F2942] outline-none transition-colors placeholder:text-slate-300 focus:border-[#2F6FED] focus:ring-2 focus:ring-[#2F6FED]/15"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-600">
                    ชื่อบัญชี
                  </label>
                  <div className="relative mt-1.5">
                    <User
                      size={16}
                      className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-300"
                    />
                    <input
                      type="text"
                      value={accountName}
                      onChange={(e) => {
                        setAccountName(e.target.value);
                        if (errorMessage) setErrorMessage("");
                      }}
                      placeholder="ชื่อ-นามสกุลเจ้าของบัญชี"
                      className="w-full rounded-xl border border-slate-200 py-2 pl-9 pr-3.5 text-sm text-[#0F2942] outline-none transition-colors placeholder:text-slate-300 focus:border-[#2F6FED] focus:ring-2 focus:ring-[#2F6FED]/15"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-slate-600">
                    เลขที่บัญชี
                  </label>
                  <div className="relative mt-1.5">
                    <Hash
                      size={16}
                      className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-300"
                    />
                    <input
                      type="text"
                      value={accountNumber}
                      onChange={(e) => {
                        setAccountNumber(e.target.value);
                        if (errorMessage) setErrorMessage("");
                      }}
                      placeholder="xxx-x-xxxxx-x"
                      className="w-full rounded-xl border border-slate-200 py-2 pl-9 pr-3.5 text-sm tabular-nums text-[#0F2942] outline-none transition-colors placeholder:text-slate-300 focus:border-[#2F6FED] focus:ring-2 focus:ring-[#2F6FED]/15"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 border-t border-slate-100 px-6 py-4">
              <button
                type="button"
                onClick={onToggleEdit}
                disabled={saving}
                className="rounded-xl border border-slate-200 px-6 py-2.5 text-sm font-semibold text-slate-500 transition-colors hover:border-slate-300 hover:text-slate-700 disabled:opacity-50"
              >
                ยกเลิก
              </button>
              <button
                type="button"
                onClick={handlePreSave}
                disabled={saving}
                className="flex items-center gap-2 rounded-xl bg-[#0F2942] px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#16385c] disabled:opacity-50"
              >
                {saving && <Loader2 size={15} className="animate-spin" />}
                {saving ? "กำลังบันทึก..." : "บันทึกบัญชีธนาคาร"}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Verification Overlay */}
      {!isVerified && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-2xl bg-white/70 backdrop-blur-xs">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-400">
            <Lock size={20} />
          </div>
          <p className="px-6 text-center text-sm font-semibold text-gray-900">
            คุณจะสามารถแก้ไขบัญชีธนาคารได้ เมื่อผ่านการยืนยันตัวตนจากผู้ดูแลระบบแล้ว
          </p>
        </div>
      )}

      {/* Pop-up Modal ยืนยันก่อนบันทึก */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl animate-in zoom-in-95 duration-200">
            <button
              type="button"
              onClick={() => setShowConfirmModal(false)}
              className="absolute right-4 top-4 rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
            >
              <X size={18} />
            </button>

            <div className="flex flex-col items-center text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-amber-600 mb-4">
                <AlertTriangle size={24} />
              </div>

              <h3 className="text-base font-bold text-[#0F2942]">
                ยืนยันการเปลี่ยนแปลงบัญชีธนาคาร
              </h3>
              <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                กรุณาตรวจสอบข้อมูลบัญชีใหม่ของท่าน ข้อมูลนี้จะต้องผ่านการตรวจสอบจากผู้ดูแลระบบก่อนอนุมัติใช้งาน
              </p>

              {/* สรุปข้อมูลใหม่ */}
              <div className="mt-4 w-full rounded-xl border border-slate-100 bg-slate-50 p-4 text-left space-y-2.5">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">ธนาคาร:</span>
                  <span className="font-semibold text-[#0F2942]">{bankName}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">ชื่อบัญชี:</span>
                  <span className="font-semibold text-[#0F2942]">{accountName}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">เลขที่บัญชี:</span>
                  <span className="font-semibold text-[#2F6FED] tabular-nums">
                    {accountNumber}
                  </span>
                </div>
              </div>

              <p className="mt-3 text-[11px] text-amber-700 text-left w-full">
                * เมื่อส่งคำขอแล้ว จะไม่สามารถยื่นขอเปลี่ยนซ้ำได้จนกว่าผู้ดูแลระบบจะพิจารณาแล้วเสร็จ
              </p>

              <div className="mt-6 flex w-full gap-3">
                <button
                  type="button"
                  onClick={() => setShowConfirmModal(false)}
                  disabled={saving}
                  className="flex-1 rounded-xl border border-slate-200 py-2.5 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-50"
                >
                  ย้อนกลับ
                </button>
                <button
                  type="button"
                  onClick={handleConfirmSave}
                  disabled={saving}
                  className="flex-1 rounded-xl bg-[#0F2942] py-2.5 text-xs font-semibold text-white transition-colors hover:bg-[#16385c]"
                >
                  {saving ? "กำลังบันทึก..." : "ยืนยันส่งคำขอ"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}