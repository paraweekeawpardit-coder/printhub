"use client";

import { useEffect, useRef, useState } from "react";
import {
  Pencil,
  Landmark,
  User,
  Hash,
  Check,
  Copy,
  Loader2,
  Lock,
  ChevronDown,
} from "lucide-react";

// ==========================================
// รายชื่อธนาคารในไทยสำหรับ dropdown
// ==========================================
const BANK_OPTIONS = [
  { code: "BBL", name: "ธนาคารกรุงเทพ (BBL)" },
  { code: "KBANK", name: "ธนาคารกสิกรไทย (KBANK)" },
  { code: "KTB", name: "ธนาคารกรุงไทย (KTB)" },
  { code: "SCB", name: "ธนาคารไทยพาณิชย์ (SCB)" },
  { code: "BAY", name: "ธนาคารกรุงศรีอยุธยา (BAY)" },
  { code: "TTB", name: "ธนาคารทหารไทยธนชาต (ttb)" },
  { code: "CIMBT", name: "ธนาคารซีไอเอ็มบี ไทย (CIMBT)" },
  { code: "UOB", name: "ธนาคารยูโอบี (UOB)" },
  { code: "KKP", name: "ธนาคารเกียรตินาคินภัทร (KKP)" },
  { code: "TISCO", name: "ธนาคารทิสโก้ (TISCO)" },
  { code: "LHFG", name: "ธนาคารแลนด์ แอนด์ เฮ้าส์ (LH Bank)" },
  { code: "ICBC", name: "ธนาคารไอซีบีซี (ไทย) (ICBC)" },
  { code: "BOC", name: "ธนาคารแห่งประเทศจีน (ไทย) (BOC)" },
  { code: "SMBC", name: "ธนาคารซูมิโตโม มิตซุย แบงกิ้ง คอร์ปอเรชั่น (SMBC)" },
  { code: "GSB", name: "ธนาคารออมสิน (GSB)" },
  { code: "BAAC", name: "ธนาคารเพื่อการเกษตรและสหกรณ์การเกษตร (ธ.ก.ส.)" },
  { code: "GHB", name: "ธนาคารอาคารสงเคราะห์ (ธอส.)" },
  { code: "EXIM", name: "ธนาคารเพื่อการส่งออกและนำเข้าแห่งประเทศไทย (EXIM)" },
  { code: "SME", name: "ธนาคารพัฒนาวิสาหกิจขนาดกลางและขนาดย่อม (SME Bank)" },
  { code: "IBANK", name: "ธนาคารอิสลามแห่งประเทศไทย (iBank)" },
];

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
  onToggleEdit,
}: Props) {
  const [copied, setCopied] = useState(false);
  const [isBankMenuOpen, setIsBankMenuOpen] = useState(false);
  const bankMenuRef = useRef<HTMLDivElement>(null);

  const handleCopy = async () => {
    if (!accountNumber) return;
    try {
      await navigator.clipboard.writeText(accountNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.log(err)
    }
  };

  // ปิด dropdown เมื่อคลิกข้างนอก
  useEffect(() => {
    if (!isBankMenuOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (bankMenuRef.current && !bankMenuRef.current.contains(e.target as Node)) {
        setIsBankMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isBankMenuOpen]);

  // เผื่อค่าเดิมที่เคยบันทึกไว้ไม่ตรงกับตัวเลือกในลิสต์ (เช่นพิมพ์เอง
  // มาก่อนตอนยังเป็น input ธรรมดา) ให้โชว์เป็นตัวเลือกพิเศษไว้ก่อน
  // จะได้ไม่หายไปเงียบๆ จน dropdown ว่าง
  const isKnownBank = BANK_OPTIONS.some((b) => b.name === bankName);
  const bankListWithFallback =
    bankName && !isKnownBank
      ? [{ code: "__current__", name: bankName }, ...BANK_OPTIONS]
      : BANK_OPTIONS;

  return (
    <div className="relative">
      <div
        className={`rounded-2xl border border-slate-200 bg-white shadow-sm ${
          !isVerified ? "pointer-events-none blur-[2px] select-none" : ""
        }`}
      >
        {/* Default Mode: View mode */}
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
                className="flex shrink-0 items-center gap-1.5 rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-[#0F2942] transition-colors hover:border-[#0F2942]"
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
          /* Edit / Form mode */
          <div>
            <div className="space-y-5 p-6">
              <p className="text-xs leading-relaxed text-slate-400">
                ข้อมูลบัญชีนี้จะถูกใช้เป็นช่องทางหลักสำหรับการโอนเงินรายได้จากคำสั่งพิมพ์เข้าสู่ร้านค้าของคุณ
              </p>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/* ธนาคาร - custom dropdown */}
                <div>
                  <label className="text-xs font-semibold text-slate-600">
                    ธนาคาร
                  </label>
                  <div className="relative mt-1.5" ref={bankMenuRef}>
                    <Landmark
                      size={16}
                      className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 z-10 text-slate-300"
                    />

                    <button
                      type="button"
                      onClick={() => setIsBankMenuOpen((prev) => !prev)}
                      className={`flex w-full items-center justify-between rounded-xl border bg-white py-2 pl-9 pr-3 text-sm outline-none transition-colors ${
                        isBankMenuOpen
                          ? "border-[#2F6FED] ring-2 ring-[#2F6FED]/15"
                          : "border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <span
                        className={`truncate text-left ${
                          bankName ? "text-[#0F2942]" : "text-slate-300"
                        }`}
                      >
                        {bankName || "เลือกธนาคาร"}
                      </span>
                      <ChevronDown
                        size={15}
                        className={`shrink-0 text-slate-400 transition-transform ${
                          isBankMenuOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {/* Panel: เปิดลงด้านล่างเสมอ + จำกัดความสูงแล้วเลื่อนดูได้ */}
                    {isBankMenuOpen && (
                      <div className="absolute left-0 right-0 top-full z-20 mt-1.5 max-h-60 overflow-y-auto rounded-xl border border-slate-200 bg-white py-1.5 shadow-lg shadow-slate-900/10">
                        {bankListWithFallback.map((b) => (
                          <button
                            key={b.code}
                            type="button"
                            onClick={() => {
                              setBankName(b.name);
                              setIsBankMenuOpen(false);
                            }}
                            className={`flex w-full items-center justify-between px-3.5 py-2 text-left text-sm transition-colors hover:bg-slate-50 ${
                              bankName === b.name
                                ? "font-semibold text-[#2F6FED]"
                                : "text-slate-700"
                            }`}
                          >
                            <span className="truncate">{b.name}</span>
                            {bankName === b.name && (
                              <Check size={14} className="shrink-0" />
                            )}
                          </button>
                        ))}
                      </div>
                    )}
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
                      onChange={(e) => setAccountName(e.target.value)}
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
                      onChange={(e) => setAccountNumber(e.target.value)}
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
                onClick={onSave}
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
          <p className="text-center px-6 text-sm font-semibold text-gray-900">
            คุณจะสามารถแก้ไขบัญชีธนาคารได้ เมื่อผ่านการยืนยันตัวตนจากผู้ดูแลระบบแล้ว
          </p>
        </div>
      )}
    </div>
  );
}