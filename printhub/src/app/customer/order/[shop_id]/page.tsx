"use client";

import { useState, useRef, useMemo } from "react";
import {
  Upload,
  X,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Clock,
  Plus,
  Minus,
  FileText,
  Info,
} from "lucide-react";

const PRICE_BW = 1;
const PRICE_COLOR = 5;

type ColorMode = "bw" | "color" | "custom" | null;

type Props = {
  onClose?: () => void;
  onSubmit?: (payload: Record<string, unknown>) => void;
};

export default function NewOrderModal({ onClose, onSubmit }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [fileName, setFileName] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const [note, setNote] = useState("");
  const [pickupDate, setPickupDate] = useState("");
  const [pickupTime, setPickupTime] = useState("");

  const [colorMode, setColorMode] = useState<ColorMode>(null);
  const [customPages, setCustomPages] = useState("");
  const [bindingGlue, setBindingGlue] = useState(false);
  const [bindingSpiral, setBindingSpiral] = useState(false);

  const [quantity, setQuantity] = useState(1);

  function handleFile(file: File) {
    setFileName(file.name);
    // demo page count — real extraction would happen via pdf.js or server-side
    const mockPages = 9;
    setTotalPages(mockPages);
    setCurrentPage(1);

    if (file.type.startsWith("image/")) {
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      setPreviewUrl(null);
    }
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  }

  const perPagePrice =
    colorMode === "color" ? PRICE_COLOR : colorMode === "bw" ? PRICE_BW : 0;

  const total = useMemo(() => {
    if (!totalPages || !colorMode) return 0;
    return perPagePrice * totalPages * quantity;
  }, [perPagePrice, totalPages, quantity, colorMode]);

  const canSubmit = Boolean(fileName && colorMode && quantity > 0);

  function handleSubmit() {
    if (!canSubmit) return;
    onSubmit?.({
      fileName,
      note,
      pickupDate,
      pickupTime,
      colorMode,
      customPages: colorMode === "custom" ? customPages : undefined,
      bindingGlue,
      bindingSpiral,
      quantity,
      total,
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0F2942]/40 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-3xl bg-white rounded-[28px] shadow-2xl border border-slate-200 overflow-hidden">
        {/* close button */}
        <button
          onClick={onClose}
          aria-label="ปิดหน้าต่าง"
          className="absolute top-5 right-5 z-10 w-9 h-9 flex items-center justify-center rounded-full bg-[#0F2942] text-white hover:bg-[#16385c] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2F6FED]"
        >
          <X size={18} />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-[280px_1px_1fr] max-h-[88vh] md:max-h-[80vh]">
          {/* ---------- LEFT: preview ---------- */}
          <div className="flex flex-col items-center gap-4 px-6 py-8 bg-[#F7F9FB]">
            <h3 className="text-sm font-semibold text-[#0F2942] tracking-wide">
              ตัวอย่างงานพิมพ์
            </h3>

            <div className="relative w-full max-w-[190px]">
              {/* ticket-stub page tab */}
              <div className="absolute -top-3 left-3 z-10 bg-white border border-slate-200 rounded-full px-3 py-0.5 text-[11px] font-medium text-slate-500 shadow-sm tabular-nums">
                Page&nbsp;{totalPages ? currentPage : 0}/{totalPages || 0}
              </div>

              <div
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                onClick={() => fileInputRef.current?.click()}
                className="aspect-[3/4] w-full rounded-xl border border-slate-200 bg-white shadow-[0_8px_24px_-8px_rgba(15,41,66,0.18)] overflow-hidden cursor-pointer flex items-center justify-center"
              >
                {previewUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={previewUrl}
                    alt="ตัวอย่างไฟล์ที่อัพโหลด"
                    className="w-full h-full object-cover"
                  />
                ) : fileName ? (
                  <div className="flex flex-col items-center gap-2 text-slate-400">
                    <FileText size={40} strokeWidth={1.5} />
                    <span className="text-xs px-4 text-center truncate max-w-[160px]">
                      {fileName}
                    </span>
                  </div>
                ) : (
                  <svg
                    viewBox="0 0 100 100"
                    className="w-2/3 h-2/3 text-slate-300"
                  >
                    <line
                      x1="8"
                      y1="8"
                      x2="92"
                      y2="92"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                    <line
                      x1="92"
                      y1="8"
                      x2="8"
                      y2="92"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                  </svg>
                )}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={!totalPages || currentPage <= 1}
                className="w-8 h-8 flex items-center justify-center rounded-full border border-slate-200 text-slate-500 disabled:opacity-30 hover:bg-slate-100 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#2F6FED]"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={!totalPages || currentPage >= totalPages}
                className="w-8 h-8 flex items-center justify-center rounded-full border border-slate-200 text-slate-500 disabled:opacity-30 hover:bg-slate-100 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#2F6FED]"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          {/* ---------- perforated divider (ticket-stub signature) ---------- */}
          <div className="relative hidden md:block bg-slate-200/70">
            <div className="absolute inset-0 border-l border-dashed border-slate-300" />
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-[#F7F9FB]" />
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-[#F7F9FB]" />
          </div>

          {/* ---------- RIGHT: form ---------- */}
          <div className="flex flex-col overflow-y-auto">
            <div className="px-7 pt-8 pb-4 space-y-6">
              <div>
                <label className="text-sm font-semibold text-[#0F2942]">
                  ชื่อร้าน
                </label>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFile(file);
                  }}
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="mt-2 w-full flex items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 bg-[#F7F9FB] py-8 text-sm text-slate-500 hover:border-[#2F6FED] hover:text-[#2F6FED] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#2F6FED]"
                >
                  <Upload size={16} />
                  {fileName ? fileName : "อัพโหลดไฟล์"}
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-[#0F2942]">
                    ประเภทงานพิมพ์
                  </label>
                  <div className="relative mt-2">
                    <select
                      disabled
                      className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-3 text-sm text-slate-400 cursor-not-allowed"
                    >
                      <option>เร็วๆ นี้</option>
                    </select>
                    <Info
                      size={14}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-semibold text-[#0F2942]">
                    หมายเหตุ
                  </label>
                  <input
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="ระบุเพิ่มเติม..."
                    className="mt-2 w-full rounded-xl border border-slate-200 py-2.5 px-3 text-sm text-[#0F2942] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2F6FED]/40 focus:border-[#2F6FED]"
                  />
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 overflow-hidden">
                <div className="px-4 py-2.5 bg-[#EAF1FF] text-xs font-semibold text-[#2F6FED] tracking-wide">
                  เวลารับงาน
                </div>
                <div className="p-4 space-y-3">
                  <button
                    type="button"
                    className="w-full flex items-center justify-between rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-500 hover:border-[#2F6FED] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#2F6FED]"
                    onClick={() =>
                      (
                        document.getElementById(
                          "pickup-date"
                        ) as HTMLInputElement
                      )?.showPicker?.()
                    }
                  >
                    <span className="flex items-center gap-2">
                      <Calendar size={15} className="text-slate-400" />
                      วันที่
                    </span>
                    <span className="flex items-center gap-2 text-[#0F2942]">
                      {pickupDate || "เลือกวันที่"}
                      <ChevronRight size={14} className="text-slate-300" />
                    </span>
                    <input
                      id="pickup-date"
                      type="date"
                      value={pickupDate}
                      onChange={(e) => setPickupDate(e.target.value)}
                      className="sr-only"
                    />
                  </button>

                  <button
                    type="button"
                    className="w-full flex items-center justify-between rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-500 hover:border-[#2F6FED] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#2F6FED]"
                    onClick={() =>
                      (
                        document.getElementById(
                          "pickup-time"
                        ) as HTMLInputElement
                      )?.showPicker?.()
                    }
                  >
                    <span className="flex items-center gap-2">
                      <Clock size={15} className="text-slate-400" />
                      เวลา
                    </span>
                    <span className="flex items-center gap-2 text-[#0F2942]">
                      {pickupTime || "เลือกเวลา"}
                      <ChevronRight size={14} className="text-slate-300" />
                    </span>
                    <input
                      id="pickup-time"
                      type="time"
                      value={pickupTime}
                      onChange={(e) => setPickupTime(e.target.value)}
                      className="sr-only"
                    />
                  </button>

                  <p className="text-[11px] text-slate-400">
                    ร้านใช้เวลาจัดทำประมาณ 30–45 นาที หลังชำระเงิน
                  </p>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-[#0F2942] mb-3">
                  ตั้งค่าการพิมพ์
                </h4>

                <div className="rounded-2xl border border-slate-200 overflow-hidden">
                  <div className="px-4 py-2.5 bg-[#EAF1FF] text-xs font-semibold text-[#2F6FED] tracking-wide">
                    สีการพิมพ์
                  </div>
                  <div className="p-4 space-y-3">
                    <label className="flex items-center gap-2.5 text-sm text-[#0F2942] cursor-pointer">
                      <input
                        type="radio"
                        name="colorMode"
                        checked={colorMode === "bw"}
                        onChange={() => setColorMode("bw")}
                        className="accent-[#2F6FED] w-4 h-4"
                      />
                      พิมพ์ขาว-ดำ ทั้งหมด
                      <span className="text-slate-400 tabular-nums">
                        ({PRICE_BW} บาท/แผ่น)
                      </span>
                    </label>

                    <label className="flex items-center gap-2.5 text-sm text-[#0F2942] cursor-pointer">
                      <input
                        type="radio"
                        name="colorMode"
                        checked={colorMode === "color"}
                        onChange={() => setColorMode("color")}
                        className="accent-[#2F6FED] w-4 h-4"
                      />
                      พิมพ์สี ทั้งหมด
                      <span className="text-slate-400 tabular-nums">
                        ({PRICE_COLOR} บาท/แผ่น)
                      </span>
                    </label>

                    <label className="flex items-center gap-2.5 text-sm text-[#0F2942] cursor-pointer">
                      <input
                        type="radio"
                        name="colorMode"
                        checked={colorMode === "custom"}
                        onChange={() => setColorMode("custom")}
                        className="accent-[#2F6FED] w-4 h-4"
                      />
                      กำหนดสีแยกตามหน้า
                    </label>

                    {colorMode === "custom" && (
                      <input
                        value={customPages}
                        onChange={(e) => setCustomPages(e.target.value)}
                        placeholder="ระบุเป็นตัวเลข เช่น 1, 3-5"
                        className="w-full rounded-xl border border-slate-200 py-2 px-3 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2F6FED]/40 focus:border-[#2F6FED]"
                      />
                    )}
                    <p className="text-[11px] text-slate-400">
                      ระบุเป็นตัวเลข เช่น 1, 3-5 (หน้าที่เหลือจะพิมพ์เป็นขาว-ดำ)
                    </p>

                    <div className="pt-2 border-t border-slate-100 flex items-center gap-6">
                      <label className="flex items-center gap-2 text-sm text-[#0F2942] cursor-pointer">
                        <input
                          type="checkbox"
                          checked={bindingGlue}
                          onChange={(e) => setBindingGlue(e.target.checked)}
                          className="accent-[#2F6FED] w-4 h-4 rounded"
                        />
                        เข้าเล่มสันกาว
                      </label>
                      <label className="flex items-center gap-2 text-sm text-[#0F2942] cursor-pointer">
                        <input
                          type="checkbox"
                          checked={bindingSpiral}
                          onChange={(e) => setBindingSpiral(e.target.checked)}
                          className="accent-[#2F6FED] w-4 h-4 rounded"
                        />
                        เข้าเล่มเกลียว
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 mt-auto flex items-center justify-between gap-4 border-t border-slate-100 bg-white px-7 py-4">
              <div className="flex items-center gap-3">
                <span className="text-sm text-slate-500">จำนวนชุด:</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-7 h-7 flex items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-100 transition-colors"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="w-6 text-center text-sm font-medium text-[#0F2942] tabular-nums">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="w-7 h-7 flex items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-100 transition-colors"
                  >
                    <Plus size={14} />
                  </button>
                  <span className="text-sm text-slate-500">ชุด</span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span className="text-base font-semibold text-[#0F2942] tabular-nums">
                  {total} บาท
                </span>
                <button
                  onClick={handleSubmit}
                  disabled={!canSubmit}
                  className="rounded-xl bg-[#2F6FED] px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#255cd1] disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2F6FED]"
                >
                  ส่งปริ้นท์งาน
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}