"use client";

import React, { useState, useMemo, useEffect } from "react";
import { X, FileUp, Plus, Eye, FileText, Trash2, Loader2, AlertCircle } from "lucide-react";
import { ServiceType, OptionItem } from "./ServiceMenuGrid";

// กำหนด Worker สำหรับอ่านและนับหน้า PDF
let pdfjsLib: any = null;
if (typeof window !== "undefined") {
  pdfjsLib = require("pdfjs-dist");
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;
}

interface UploadedFileInfo {
  file: File;
  previewUrl: string;
  pageCount: number;
  isPdf: boolean;
  isImage: boolean;
}

interface ServiceOptionModalProps {
  service: ServiceType;
  onClose: () => void;
  onAddToCart: (itemData: {
    category: string;
    selected_size: string;
    color_type: string;
    paper_type: string;
    finishing_option: string;
    quantity: number;
    unit_price: number;
    subtotal: number;
    file_url: string;
    total_pages: number;
  }) => void;
}

export default function ServiceOptionModal({
  service,
  onClose,
  onAddToCart,
}: ServiceOptionModalProps) {
  const [modalOptions, setModalOptions] = useState<Record<string, OptionItem>>({});
  const [isDoubleSided, setIsDoubleSided] = useState(false);
  const [quantity, setQuantity] = useState(1);

  // States สำหรับรายการไฟล์หลายไฟล์
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFileInfo[]>([]);
  const [activePreviewIndex, setActivePreviewIndex] = useState<number>(0);
  const [isProcessingFile, setIsProcessingFile] = useState<boolean>(false);
  const [fileError, setFileError] = useState<string>("");

  // คืน Memory เมื่อปิด Modal หรือไฟล์ถูกลบ
  useEffect(() => {
    return () => {
      uploadedFiles.forEach((f) => URL.revokeObjectURL(f.previewUrl));
    };
  }, []);

  // รวมจำนวนหน้าจริงจากทุกไฟล์ที่อัปโหลด
  const totalPages = useMemo(() => {
    if (uploadedFiles.length === 0) return 1;
    return uploadedFiles.reduce((sum, f) => sum + f.pageCount, 0);
  }, [uploadedFiles]);

  // ฟังก์ชันสลับเลือก/ยกเลิกตัวเลือก (Toggle Selection)
  const handleToggleOption = (group: string, opt: OptionItem) => {
    setModalOptions((prev) => {
      // ถ้าเลือกตัวเลือกเดิมอยู่แล้ว ให้ทำการลบออก (ยกเลิกการเลือก)
      if (prev[group]?.id === opt.id) {
        const updated = { ...prev };
        delete updated[group];
        return updated;
      }
      // ถ้ายังไม่ได้เลือก ให้ตั้งค่าตัวเลือกนั้น
      return { ...prev, [group]: opt };
    });
  };

  // 🧮 คำนวณราคาแบบแยกประเภทการพิมพ์และตัวเลือกเสริม
  const priceCalculations = useMemo(() => {
    let perPageOptionsSum = 0;
    let finishingOptionsSum = 0;

    Object.entries(modalOptions).forEach(([groupName, item]) => {
      const price = Number(item.unit_price || 0);
      // แยก Option สำหรับเข้าเล่ม/ตกแต่งออกจากราคาพิมพ์ต่อหน้า
      if (groupName.includes("เข้าเล่ม") || groupName.includes("ตกแต่ง") || groupName.includes("finishing")) {
        finishingOptionsSum += price;
      } else {
        perPageOptionsSum += price;
      }
    });

    // หากเลือกพิมพ์หน้า-หลัง เพิ่มตัวคูณ 2 ในกรณีบริการเอกสาร
    const printMultiplier = service.type_name === "เอกสาร" && isDoubleSided ? 2 : 1;
    
    // ราคาต่อหน้า/หน่วย
    const pricePerPage = perPageOptionsSum * printMultiplier;
    
    // ราคารวม 1 ชุด = (ราคาต่อหน้า x จำนวนหน้า) + ค่าเข้าเล่ม
    const singleSetPrice = service.type_name === "เอกสาร" 
      ? (pricePerPage * totalPages) + finishingOptionsSum
      : (pricePerPage + finishingOptionsSum);

    // ราคารวมสุทธิทั้งหมด = ราคา 1 ชุด x จำนวนชุดที่สั่ง
    const finalTotalPrice = singleSetPrice * quantity;

    return {
      pricePerPage,
      singleSetPrice,
      finalTotalPrice,
    };
  }, [modalOptions, service.type_name, isDoubleSided, totalPages, quantity]);

  // ฟังก์ชันคำนวณจำนวนหน้าของ PDF
  const countPdfPages = async (file: File): Promise<number> => {
    try {
      if (!pdfjsLib) return 1;
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      return pdf.numPages || 1;
    } catch (err) {
      console.error("Count PDF pages error:", err);
      return 1;
    }
  };

  // Logic อัปโหลดหลายไฟล์ พร้อมตรวจขนาดไม่เกิน 100MB ต่อไฟล์
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileError("");
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsProcessingFile(true);
    const newItems: UploadedFileInfo[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      if (file.size > 100 * 1024 * 1024) {
        setFileError(`ไฟล์ ${file.name} มีขนาดเกิน 100MB`);
        continue;
      }

      const isPdf = file.type === "application/pdf" || file.name.endsWith(".pdf");
      const isImage = file.type.startsWith("image/");
      const previewUrl = URL.createObjectURL(file);

      let pageCount = 1;
      if (isPdf) {
        pageCount = await countPdfPages(file);
      }

      newItems.push({
        file,
        previewUrl,
        pageCount,
        isPdf,
        isImage,
      });
    }

    setUploadedFiles((prev) => [...prev, ...newItems]);
    setIsProcessingFile(false);
    e.target.value = "";
  };

  const handleRemoveFile = (index: number) => {
    URL.revokeObjectURL(uploadedFiles[index].previewUrl);
    setUploadedFiles((prev) => {
      const updated = prev.filter((_, i) => i !== index);
      if (activePreviewIndex >= updated.length) {
        setActivePreviewIndex(Math.max(0, updated.length - 1));
      }
      return updated;
    });
  };

  const handleSubmit = () => {
    const fileNames = uploadedFiles.map((f) => f.file.name).join(", ");

    onAddToCart({
      category: service.type_name,
      selected_size:
        modalOptions["ขนาดกระดาษ"]?.option_name ||
        modalOptions["ขนาดมาตรฐาน"]?.option_name ||
        modalOptions["size"]?.option_name ||
        "A4",
      color_type:
        modalOptions["รูปแบบสีการพิมพ์"]?.option_name ||
        modalOptions["color"]?.option_name ||
        "ขาว-ดำ",
      paper_type:
        modalOptions["ความหนาและชนิดกระดาษ"]?.option_name ||
        modalOptions["paper"]?.option_name ||
        "80 แกรม",
      finishing_option: `${
        modalOptions["รูปแบบการเข้าเล่ม/ตกแต่ง"]?.option_name ||
        modalOptions["finishing"]?.option_name ||
        "ไม่มี"
      }${service.type_name === "เอกสาร" && isDoubleSided ? " (พิมพ์หน้า-หลัง)" : ""}`,
      quantity: Number(quantity),
      unit_price: priceCalculations.singleSetPrice,
      subtotal: priceCalculations.finalTotalPrice,
      file_url: fileNames || "https://example.com/demo.pdf",
      total_pages: totalPages,
    });
  };

  const currentPreviewFile = uploadedFiles[activePreviewIndex];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl border border-slate-100 flex flex-col max-h-[92vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-base sm:text-lg text-slate-900">
              กำหนดสเปก: {service.type_name}
            </h3>
            <span className="text-xs text-slate-400">
              อัปโหลดไฟล์ (สูงสุด 100MB/ไฟล์) ตรวจสอบพรีวิว และกำหนดสเปก
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-700 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content 2 คอลัมน์ */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-hidden">
          {/* ฝั่งซ้าย: อัปโหลดหลายไฟล์ + รายการไฟล์ + พรีวิว */}
          <div className="md:col-span-6 p-5 sm:p-6 bg-slate-50/70 border-b md:border-b-0 md:border-r border-slate-100 flex flex-col overflow-y-auto space-y-4">
            <div>
              <span className="text-xs font-bold text-slate-700 block mb-1.5">
                อัปโหลดไฟล์งาน (เลือกได้หลายไฟล์)
              </span>

              <label className="border-2 border-dashed border-slate-300 hover:border-blue-500 bg-white rounded-2xl p-4 text-center transition cursor-pointer block group">
                {isProcessingFile ? (
                  <div className="flex flex-col items-center justify-center py-2">
                    <Loader2 className="w-6 h-6 text-blue-600 animate-spin mb-1" />
                    <span className="text-xs text-slate-500">กำลังประมวลผลและนับหน้า...</span>
                  </div>
                ) : (
                  <>
                    <FileUp className="w-7 h-7 text-blue-500 mx-auto mb-1.5 group-hover:scale-110 transition" />
                    <span className="text-xs font-bold text-slate-800 block">
                      คลิกเพื่อเลือกไฟล์ หรือลากไฟล์มาวาง
                    </span>
                    <span className="text-[11px] text-slate-400 block mt-0.5">
                      PDF, JPG, PNG (ไม่เกิน 100MB ต่อไฟล์)
                    </span>
                  </>
                )}
                <input
                  type="file"
                  multiple
                  accept=".pdf,image/png,image/jpeg,image/jpg"
                  className="hidden"
                  disabled={isProcessingFile}
                  onChange={handleFileChange}
                />
              </label>

              {fileError && (
                <p className="text-xs text-rose-500 mt-1.5 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> {fileError}
                </p>
              )}
            </div>

            {/* รายการไฟล์ที่อัปโหลดแล้ว */}
            {uploadedFiles.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-700">
                    ไฟล์ที่เลือก ({uploadedFiles.length})
                  </span>
                  <span className="text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded-md">
                    รวมทั้งสิ้น {totalPages} หน้า
                  </span>
                </div>

                <div className="max-h-36 overflow-y-auto space-y-1.5 pr-1">
                  {uploadedFiles.map((item, idx) => (
                    <div
                      key={idx}
                      onClick={() => setActivePreviewIndex(idx)}
                      className={`flex items-center justify-between p-2 rounded-xl border text-xs cursor-pointer transition ${
                        activePreviewIndex === idx
                          ? "bg-blue-50 border-blue-400 shadow-2xs"
                          : "bg-white border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <FileText className="w-4 h-4 text-blue-600 shrink-0" />
                        <span className="truncate text-slate-800 font-medium">
                          {item.file.name}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[11px] text-slate-500 font-semibold bg-slate-100 px-1.5 py-0.5 rounded">
                          {item.pageCount} หน้า
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveFile(idx);
                          }}
                          className="p-1 text-slate-400 hover:text-rose-500 transition cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* กล่อง Preview เอกสาร */}
            <div className="flex-1 flex flex-col min-h-[220px]">
              <span className="text-xs font-bold text-slate-700 block mb-1">
                ตัวอย่างเอกสาร: {currentPreviewFile?.file.name || "(ยังไม่มีไฟล์)"}
              </span>

              <div className="flex-1 w-full bg-white rounded-2xl border border-slate-200 overflow-hidden flex items-center justify-center relative min-h-[200px]">
                {currentPreviewFile ? (
                  currentPreviewFile.isPdf ? (
                    <iframe
                      src={`${currentPreviewFile.previewUrl}#toolbar=0`}
                      className="w-full h-full min-h-[220px] border-0"
                      title="PDF Preview"
                    />
                  ) : currentPreviewFile.isImage ? (
                    <img
                      src={currentPreviewFile.previewUrl}
                      alt="Preview"
                      className="max-h-[220px] w-auto object-contain p-2"
                    />
                  ) : (
                    <div className="text-center p-4">
                      <FileText className="w-10 h-10 text-slate-400 mx-auto mb-1" />
                      <p className="text-xs text-slate-500">{currentPreviewFile.file.name}</p>
                    </div>
                  )
                ) : (
                  <div className="text-center p-6 space-y-2">
                    <Eye className="w-8 h-8 text-slate-300 mx-auto" />
                    <p className="text-xs text-slate-400">อัปโหลดไฟล์เพื่อดูตัวอย่างเอกสาร</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ฝั่งขวา: กำหนดสเปกย่อย & จำนวนชุด */}
          <div className="md:col-span-6 p-5 sm:p-6 overflow-y-auto space-y-4 bg-white">
            {/* หน้าเดียว vs หน้า-หลัง */}
            {service.type_name === "เอกสาร" && (
              <div className="space-y-1.5 bg-blue-50/60 p-3.5 rounded-2xl border border-blue-100">
                <span className="text-xs font-bold text-blue-900 block">หน้าที่ต้องการพิมพ์</span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setIsDoubleSided(false)}
                    className={`py-2 rounded-xl text-xs font-bold border transition cursor-pointer ${
                      !isDoubleSided
                        ? "bg-blue-600 text-white border-blue-600 shadow-xs"
                        : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    พิมพ์หน้าเดียว (ราคาปกติ)
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsDoubleSided(true)}
                    className={`py-2 rounded-xl text-xs font-bold border transition cursor-pointer ${
                      isDoubleSided
                        ? "bg-blue-600 text-white border-blue-600 shadow-xs"
                        : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    พิมพ์หน้า-หลัง (x2)
                  </button>
                </div>
              </div>
            )}

            {/* รายการสเปกย่อยตาม Template พร้อมปุ่มกดสลับ Toggle */}
            {Array.from(new Set(service.options.map((o) => o.group_type))).map((group) => {
              const groupItems = service.options.filter((o) => o.group_type === group);
              return (
                <div key={group} className="space-y-1.5">
                  <span className="text-xs font-bold text-slate-700 block">{group}</span>
                  <div className="grid grid-cols-2 gap-2">
                    {groupItems.map((opt) => {
                      const isSelected = modalOptions[group]?.id === opt.id;
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => handleToggleOption(group, opt)}
                          className={`p-2.5 rounded-xl text-left border text-xs transition cursor-pointer flex items-center justify-between ${
                            isSelected
                              ? "bg-blue-50 border-blue-600 text-blue-700 font-bold shadow-2xs"
                              : "border-slate-200 hover:bg-slate-50 text-slate-700"
                          }`}
                        >
                          <span>{opt.option_name}</span>
                          <span className="text-[11px] text-slate-500">฿{opt.unit_price}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}

            {/* จำนวนชุด / สำเนา */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-700 block">จำนวนชุดที่ต้องการ</span>
                <span className="text-[10px] text-slate-400">พิมพ์ซ้ำตามจำนวนสำเนา</span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 rounded-lg border border-slate-200 font-bold hover:bg-slate-100 cursor-pointer text-slate-700"
                >
                  -
                </button>
                <span className="text-xs font-bold w-6 text-center text-slate-800">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-8 h-8 rounded-lg border border-slate-200 font-bold hover:bg-slate-100 cursor-pointer text-slate-700"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer คำนวณราคาถูกต้อง */}
        <div className="p-4 sm:px-6 border-t border-slate-100 bg-white flex items-center justify-between">
          <div>
            <span className="text-[11px] text-slate-400 block">
              {service.type_name === "เอกสาร"
                ? `ราคาคำนวณ (${totalPages} หน้า × ${quantity} ชุด)`
                : "ราคาคำนวณสุทธิ"}
            </span>
            <span className="text-base font-extrabold text-blue-600">
              ฿{priceCalculations.finalTotalPrice.toFixed(2)}
            </span>
          </div>

          <button
            type="button"
            disabled={uploadedFiles.length === 0}
            onClick={handleSubmit}
            className={`px-6 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-md transition cursor-pointer ${
              uploadedFiles.length > 0
                ? "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20"
                : "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
            }`}
          >
            <Plus className="w-4 h-4" />
            ใส่ตะกร้า
          </button>
        </div>
      </div>
    </div>
  );
}