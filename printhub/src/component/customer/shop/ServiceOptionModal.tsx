"use client";

import React, { useState, useMemo, useEffect } from "react";
import { X } from "lucide-react";
import { ServiceType, OptionItem } from "./ServiceMenuGrid";
import supabase from "@/config/supabase";

import DocumentUploadPreview, { UploadedFileInfo } from "./DocumentUploadPreview";
import ServiceOptionForm from "./ServiceOptionForm";
import ServiceOptionFooter from "./ServiceOptionFooter";

let pdfjsLib: any = null;
if (typeof window !== "undefined") {
  pdfjsLib = require("pdfjs-dist");
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;
}

interface ServiceOptionModalProps {
  service: ServiceType;
  initialItem?: any;
  onClose: () => void;
  onAddToCart: (itemData: any) => void;
}

export default function ServiceOptionModal({
  service,
  initialItem,
  onClose,
  onAddToCart,
}: ServiceOptionModalProps) {
  const [modalOptions, setModalOptions] = useState<Record<string, OptionItem>>({});
  const [quantity, setQuantity] = useState(
    initialItem?.quantity ? Number(initialItem.quantity) : 1
  );

  const [uploadedFiles, setUploadedFiles] = useState<UploadedFileInfo[]>([]);
  const [activePreviewIndex, setActivePreviewIndex] = useState<number>(0);
  const [isProcessingFile, setIsProcessingFile] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [fileError, setFileError] = useState<string>("");

  const serviceTypeName = service.type_name || service.type || "บริการงานพิมพ์";

  const rawOptions: OptionItem[] = useMemo(() => {
    return service.options && service.options.length > 0
      ? service.options
      : service.service_detail || [];
  }, [service]);

  useEffect(() => {
    return () => {
      uploadedFiles.forEach((f) => {
        if (f.file.size > 0) URL.revokeObjectURL(f.previewUrl);
      });
    };
  }, []);

  const dynamicGroups = useMemo(() => {
    return Array.from(new Set(rawOptions.map((o) => o.group_type).filter(Boolean)));
  }, [rawOptions]);

  const requiredGroups = useMemo(() => {
    return Array.from(
      new Set(
        rawOptions
          .filter((o) => {
            const req = (o as any).is_required;
            return req === true || req === "true" || req === 1;
          })
          .map((o) => o.group_type)
          .filter(Boolean)
      )
    );
  }, [rawOptions]);

  const isMultiPageService = useMemo(() => {
    return rawOptions.some((opt) => (opt as any).price_type === "per_page");
  }, [rawOptions]);

  // 1. ดึงสเปกตัวเลือกเดิมกลับมาแสดงเมื่อเปิดโหมดแก้ไข
  useEffect(() => {
    if (initialItem && rawOptions.length > 0) {
      const prefilled: Record<string, OptionItem> = {};

      dynamicGroups.forEach((group) => {
        const groupOptions = rawOptions.filter((o) => o.group_type === group);
        const matched = groupOptions.find((opt) => {
          const optName = opt.detail || opt.option_name || "";
          return (
            optName === initialItem.selected_size ||
            optName === initialItem.color_type ||
            optName === initialItem.paper_type ||
            (initialItem.finishing_option &&
              initialItem.finishing_option.includes(optName))
          );
        });

        if (matched) {
          prefilled[group] = matched;
        }
      });

      if (Object.keys(prefilled).length > 0) {
        setModalOptions(prefilled);
      }
    }
  }, [initialItem, rawOptions, dynamicGroups]);

  // 2. 🌟 ดึงไฟล์เดิมจาก initialItem.file_url มาแสดงในรายการและกล่องพรีวิว
  useEffect(() => {
    if (initialItem?.file_url && uploadedFiles.length === 0) {
      const urls = initialItem.file_url
        .split(",")
        .map((u: string) => u.trim())
        .filter(Boolean);

      const existingItems: UploadedFileInfo[] = urls.map((url: string, index: number) => {
        const cleanName =
          url.split("/").pop()?.split("?")[0] ||
          `${initialItem.category || "เอกสาร"}_ไฟล์ที่_${index + 1}`;
        const isPdf = url.toLowerCase().includes(".pdf");
        const isImage = /\.(jpg|jpeg|png|webp)/i.test(url) || !isPdf;

        const totalP = Number(initialItem.total_pages || initialItem.page_count) || 1;
        const pageCount =
          urls.length > 1 ? Math.max(1, Math.round(totalP / urls.length)) : totalP;

        return {
          file: new File([""], cleanName, {
            type: isPdf ? "application/pdf" : "image/jpeg",
          }),
          previewUrl: url,
          pageCount,
          isPdf,
          isImage,
        };
      });

      if (existingItems.length > 0) {
        setUploadedFiles(existingItems);
        setActivePreviewIndex(0);
      }
    }
  }, [initialItem]);

  const missingGroups = useMemo(() => {
    return requiredGroups.filter((g) => !modalOptions[g]);
  }, [requiredGroups, modalOptions]);

  const hasExistingFile = Boolean(initialItem?.file_url);
  const canAddToCart =
    (uploadedFiles.length > 0 || hasExistingFile) &&
    missingGroups.length === 0 &&
    !isUploading;

  const totalPages = useMemo(() => {
    if (uploadedFiles.length === 0) {
      return Number(initialItem?.total_pages || initialItem?.page_count) || 1;
    }
    return uploadedFiles.reduce((sum, f) => sum + f.pageCount, 0);
  }, [uploadedFiles, initialItem]);

  const handleToggleOption = (group: string, opt: OptionItem) => {
    setModalOptions((prev) => {
      if (prev[group]?.id === opt.id) {
        const updated = { ...prev };
        delete updated[group];
        return updated;
      }
      return { ...prev, [group]: opt };
    });
  };

  const priceCalculations = useMemo(() => {
    let perPageSum = 0;
    let fixedPerSetSum = 0;

    Object.entries(modalOptions).forEach(([, item]) => {
      const price = Number(item.price ?? item.unit_price ?? 0);
      if ((item as any).price_type === "per_set") {
        fixedPerSetSum += price;
      } else {
        perPageSum += price;
      }
    });

    const singleSetPrice = isMultiPageService
      ? perPageSum * totalPages + fixedPerSetSum
      : perPageSum + fixedPerSetSum;

    const finalTotalPrice = singleSetPrice * quantity;

    return {
      pricePerPage: perPageSum,
      singleSetPrice,
      finalTotalPrice,
    };
  }, [modalOptions, isMultiPageService, totalPages, quantity]);

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

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileError("");
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (!isMultiPageService && uploadedFiles.length + files.length > 1) {
      setFileError(`บริการนี้เป็นงานพิมพ์แผ่นเดี่ยว รองรับเพียง 1 ไฟล์ต่อรายการ`);
      e.target.value = "";
      return;
    }

    if (uploadedFiles.length + files.length > 10) {
      setFileError("สามารถอัปโหลดได้สูงสุดไม่เกิน 10 ไฟล์ต่อรายการ (FR-2.3)");
      e.target.value = "";
      return;
    }

    setIsProcessingFile(true);
    const newItems: UploadedFileInfo[] = [];
    let currentTotalSize = uploadedFiles.reduce((sum, item) => sum + item.file.size, 0);

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      if (file.size > 50 * 1024 * 1024) {
        setFileError(`ไฟล์ ${file.name} มีขนาดเกิน 50MB (FR-2.3)`);
        continue;
      }

      if (currentTotalSize + file.size > 100 * 1024 * 1024) {
        setFileError("ขนาดไฟล์รวมทั้งหมดเกิน 100MB (FR-2.3)");
        break;
      }

      currentTotalSize += file.size;

      const isPdf = file.type === "application/pdf" || file.name.endsWith(".pdf");
      const isImage = file.type.startsWith("image/");
      const previewUrl = URL.createObjectURL(file);

      let pageCount = 1;
      if (isPdf) {
        pageCount = await countPdfPages(file);
      }

      if (!isMultiPageService && pageCount > 1) {
        setFileError(`บริการนี้รองรับไฟล์เพียง 1 หน้าเท่านั้น (ไฟล์ของคุณมี ${pageCount} หน้า)`);
        setIsProcessingFile(false);
        e.target.value = "";
        return;
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
    if (uploadedFiles[index].file.size > 0) {
      URL.revokeObjectURL(uploadedFiles[index].previewUrl);
    }
    setUploadedFiles((prev) => {
      const updated = prev.filter((_, i) => i !== index);
      if (activePreviewIndex >= updated.length) {
        setActivePreviewIndex(Math.max(0, updated.length - 1));
      }
      return updated;
    });
  };

  const getOptionValue = (keys: string[], fallback: string) => {
    for (const k of keys) {
      const opt = modalOptions[k];
      if (opt) return opt.detail || opt.option_name || fallback;
    }
    return fallback;
  };

  const uploadFilesToSupabase = async (filesToUpload: UploadedFileInfo[]): Promise<string[]> => {
    const urls: string[] = [];

    for (const item of filesToUpload) {
      if (item.file.size === 0) continue; // ข้ามไฟล์เดิมที่เป็น URL อยู่แล้ว

      const ext = item.file.name.split(".").pop()?.toLowerCase() || "pdf";
      const randomString = Math.random().toString(36).substring(2, 8);
      const safeFileName = `${Date.now()}_${randomString}.${ext}`;
      const filePath = `orders/${safeFileName}`;

      const fileContentType = item.isPdf
        ? "application/pdf"
        : item.file.type || "application/octet-stream";

      const { error } = await supabase.storage
        .from("print_files")
        .upload(filePath, item.file, {
          cacheControl: "3600",
          upsert: true,
          contentType: fileContentType,
        });

      if (error) {
        console.error("Storage upload error:", error);
        throw new Error(`อัปโหลดไฟล์ ${item.file.name} ไม่สำเร็จ: ${error.message}`);
      }

      const { data: publicData } = supabase.storage
        .from("print_files")
        .getPublicUrl(filePath);

      if (!publicData?.publicUrl) {
        throw new Error("ไม่สามารถสร้าง URL สำหรับไฟล์ที่อัปโหลดได้");
      }

      urls.push(publicData.publicUrl);
    }

    return urls;
  };

  const handleSubmit = async () => {
    try {
      setIsUploading(true);
      setFileError("");

      const newFilesToUpload = uploadedFiles.filter((item) => item.file.size > 0);
      const existingUrls = uploadedFiles
        .filter((item) => item.file.size === 0)
        .map((item) => item.previewUrl);

      let finalFileUrls: string[] = [...existingUrls];

      if (newFilesToUpload.length > 0) {
        const uploadedUrls = await uploadFilesToSupabase(newFilesToUpload);
        finalFileUrls = [...finalFileUrls, ...uploadedUrls];
      }

      const combinedFileUrls =
        finalFileUrls.length > 0
          ? finalFileUrls.join(", ")
          : initialItem?.file_url || "";

      onAddToCart({
        category: serviceTypeName,
        selected_size: getOptionValue(["ขนาด", "ขนาดกระดาษ", "ขนาดมาตรฐาน", "size"], "A4"),
        color_type: getOptionValue(["ระบบสี", "รูปแบบสีการพิมพ์", "color", "สี"], ""),
        paper_type: getOptionValue(["วัสดุ", "ความหนาและชนิดกระดาษ", "paper", "กระดาษ"], ""),
        finishing_option: getOptionValue(
          ["การเข้าเล่มและตกแต่ง", "รูปแบบการเข้าเล่ม/ตกแต่ง", "finishing", "เข้าเล่ม", "เย็บมุม"],
          "ไม่มี"
        ),
        quantity: Number(quantity),
        unit_price: priceCalculations.singleSetPrice,
        subtotal: priceCalculations.finalTotalPrice,
        file_url: combinedFileUrls,
        page_count: totalPages,
        total_pages: totalPages,
        pages_per_set: totalPages,
      });
    } catch (err: any) {
      setFileError(err.message || "เกิดข้อผิดพลาดในการอัปโหลดไฟล์");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-5xl rounded-3xl shadow-2xl border border-slate-100 flex flex-col max-h-[92vh] overflow-hidden">
        <div className="p-5 sm:px-6 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
          <div>
            <h2 className="text-base sm:text-lg font-extrabold text-slate-800">
              {initialItem ? `แก้ไขสเปก: ${serviceTypeName}` : `กำหนดสเปก: ${serviceTypeName}`}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {isMultiPageService
                ? "อัปโหลดไฟล์ (สูงสุด 50MB/ไฟล์, รวมไม่เกิน 100MB, สูงสุด 10 ไฟล์)"
                : "งานพิมพ์แผ่นเดี่ยว (1 ไฟล์ 1 หน้า, ไม่เกิน 50MB)"}
            </p>
          </div>
          <button
            type="button"
            disabled={isUploading}
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-hidden">
          <DocumentUploadPreview
            uploadedFiles={uploadedFiles}
            activePreviewIndex={activePreviewIndex}
            setActivePreviewIndex={setActivePreviewIndex}
            isProcessingFile={isProcessingFile}
            isUploading={isUploading}
            fileError={fileError}
            totalPages={totalPages}
            isMultiPageService={isMultiPageService}
            onFileChange={handleFileChange}
            onRemoveFile={handleRemoveFile}
          />

          <ServiceOptionForm
            dynamicGroups={dynamicGroups}
            rawOptions={rawOptions}
            modalOptions={modalOptions}
            quantity={quantity}
            onToggleOption={handleToggleOption}
            onQuantityChange={setQuantity}
          />
        </div>

        <ServiceOptionFooter
          isMultiPageService={isMultiPageService}
          totalPages={totalPages}
          quantity={quantity}
          finalTotalPrice={priceCalculations.finalTotalPrice}
          hasUploadedFiles={uploadedFiles.length > 0 || hasExistingFile}
          missingGroups={missingGroups}
          canAddToCart={canAddToCart}
          isUploading={isUploading}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}