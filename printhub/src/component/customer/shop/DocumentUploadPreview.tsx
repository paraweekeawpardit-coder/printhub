/**
 * Component: DocumentUploadPreview
 * หน้าที่: จัดการการอัปโหลดไฟล์, การแจ้งเตือนเงื่อนไขไฟล์ตามประเภทบริการล่วงหน้า,
 * การแสดงรายการไฟล์ที่เลือก และหน้าต่างพรีวิวเอกสารแบบ Fit Width พร้อมปุ่มเปิดดูเต็มจอ
 */

"use client";

import React from "react";
import { FileUp, Eye, FileText, Trash2, Loader2, AlertCircle } from "lucide-react";

export interface UploadedFileInfo {
  file: File;
  previewUrl: string;
  pageCount: number;
  isPdf: boolean;
  isImage: boolean;
}

interface DocumentUploadPreviewProps {
  uploadedFiles: UploadedFileInfo[];
  activePreviewIndex: number;
  setActivePreviewIndex: (index: number) => void;
  isProcessingFile: boolean;
  isUploading: boolean;
  fileError: string;
  totalPages: number;
  isMultiPageService: boolean; // 👈 เพิ่มตัวแปรนี้เพื่อเช็คประเภทบริการ
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveFile: (index: number) => void;
}

export default function DocumentUploadPreview({
  uploadedFiles,
  activePreviewIndex,
  setActivePreviewIndex,
  isProcessingFile,
  isUploading,
  fileError,
  totalPages,
  isMultiPageService,
  onFileChange,
  onRemoveFile,
}: DocumentUploadPreviewProps) {
  const currentPreviewFile = uploadedFiles[activePreviewIndex];

  return (
    <div className="md:col-span-7 p-5 sm:p-6 bg-slate-50/70 border-b md:border-b-0 md:border-r border-slate-100 flex flex-col overflow-y-auto space-y-4">
      {/* 1. ส่วนอัปโหลดไฟล์ */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-slate-700 block">
            อัปโหลดไฟล์งานพิมพ์
          </span>
          <span className="text-[10px] text-slate-400 font-medium">
            {/* {isMultiPageService ? "โหมด: เอกสาร / รายงาน" : "โหมด: งานพิมพ์แผ่นเดี่ยว"} */}
          </span>
        </div>

        {/* 🌟 กล่องเตือนสีแดง: ระบุ JPG, PNG ชัดเจนแทนคำว่ารูปภาพ */}
        <div className="mb-2.5 p-3 rounded-xl border border-rose-200 bg-rose-50/80 flex items-start gap-2.5 text-rose-600">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
          <div className="text-xs space-y-1">
            {isMultiPageService ? (
              <>
                <p className="font-bold text-rose-700">
                  สำหรับงานเอกสาร: รวมไฟล์ได้สูงสุด 10 ไฟล์
                </p>
                <p className="text-[11px] text-rose-600/95 leading-relaxed">
                  • <b>ประเภทไฟล์:</b> แนะนำเป็นไฟล์ <b>PDF</b> หรือไฟล์ <b>JPG, PNG</b><br />
                  • <b>ขนาดไฟล์:</b> ไม่เกิน 50MB ต่อไฟล์ (ขนาดรวมทุกไฟล์ไม่เกิน 100MB)<br />
                  • ระบบจะรวมจำนวนหน้าของทุกไฟล์อัตโนมัติ เพื่อคิดราคาเนื้อหา
                </p>
              </>
            ) : (
              <>
                <p className="font-bold text-rose-700">
                  สำหรับงานแผ่นเดี่ยว: กำหนด 1 ไฟล์ (1 หน้าเท่านั้น)
                </p>
                <p className="text-[11px] text-rose-600/95 leading-relaxed">
                  • <b>ประเภทไฟล์:</b> <b>JPG, PNG</b> ความละเอียดสูง หรือ <b>PDF (หน้าเดียว)</b><br />
                  • <b>เงื่อนไข:</b> ขนาดไม่เกิน 50MB (หากมีหลายแบบ กรุณาแยกสั่งทีละรายการ)
                </p>
              </>
            )}
          </div>
        </div>

        {/* กล่องลากวางไฟล์: ระบุ JPG, PNG */}
        <label className="border-2 border-dashed border-slate-300 hover:border-blue-500 bg-white rounded-2xl p-4 text-center transition cursor-pointer block group">
          {isProcessingFile ? (
            <div className="flex flex-col items-center justify-center py-2">
              <Loader2 className="w-5 h-5 text-blue-600 animate-spin mb-1" />
              <span className="text-xs text-slate-500">กำลังประมวลผลและนับหน้า...</span>
            </div>
          ) : (
            <>
              <FileUp className="w-6 h-6 text-blue-500 mx-auto mb-1 group-hover:scale-110 transition" />
              <span className="text-xs font-bold text-slate-800 block">
                {isMultiPageService
                  ? "คลิกเพื่อเลือกไฟล์เอกสาร หรือลากไฟล์มาวาง"
                  : "คลิกเพื่อเลือกไฟล์อาร์ตเวิร์ก (1 ไฟล์/1 หน้า)"}
              </span>
              <span className="text-[11px] text-slate-500 font-medium block mt-1">
                {isMultiPageService
                  ? "รองรับ PDF, JPG, PNG (สูงสุด 10 ไฟล์, รวมไม่เกิน 100MB)"
                  : "รองรับ JPG, PNG, PDF 1 หน้า (ไม่เกิน 50MB)"}
              </span>
            </>
          )}
          <input
            type="file"
            multiple={isMultiPageService}
            accept={isMultiPageService ? ".pdf,image/png,image/jpeg,image/jpg" : "image/png,image/jpeg,image/jpg,.pdf"}
            className="hidden"
            disabled={isProcessingFile || isUploading}
            onChange={onFileChange}
          />
        </label>

        {fileError && (
          <p className="text-xs text-rose-500 mt-1.5 flex items-center gap-1 bg-rose-50 p-2 rounded-xl border border-rose-100">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {fileError}
          </p>
        )}
      </div>

      {/* 2. รายการไฟล์ที่เลือก */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-700">
              ไฟล์ที่เลือก ({uploadedFiles.length})
            </span>
            <span className="text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded-md">
              รวมทั้งสิ้น {totalPages} หน้า
            </span>
          </div>

          <div className="max-h-28 overflow-y-auto space-y-1.5 pr-1">
            {uploadedFiles.map((item, idx) => (
              <div
                key={idx}
                onClick={() => setActivePreviewIndex(idx)}
                className={`flex items-center justify-between p-2 rounded-xl border text-xs cursor-pointer transition ${
                  activePreviewIndex === idx
                    ? "bg-blue-50 border-blue-400 font-semibold shadow-2xs"
                    : "bg-white border-slate-200 hover:bg-slate-50"
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <FileText className="w-4 h-4 text-blue-600 shrink-0" />
                  <span className="truncate text-slate-800">{item.file.name}</span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[10px] text-slate-500 font-semibold bg-slate-100 px-1.5 py-0.5 rounded">
                    {item.pageCount} หน้า
                  </span>
                  <button
                    type="button"
                    disabled={isUploading}
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveFile(idx);
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

      {/* 3. กล่องพรีวิวเอกสาร */}
      <div className="flex-1 flex flex-col space-y-2 min-h-[500px]">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-700 truncate max-w-[280px]">
            ตัวอย่างเอกสาร: {currentPreviewFile?.file.name || "(ยังไม่มีไฟล์)"}
          </span>

          {currentPreviewFile && (
            <a
              href={currentPreviewFile.previewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] text-blue-600 hover:text-blue-700 hover:underline flex items-center gap-1 font-semibold transition"
            >
              เปิดดูเต็มจอ ↗
            </a>
          )}
        </div>

        <div className="w-full flex-1 min-h-[500px] bg-slate-100 rounded-2xl border border-slate-300 overflow-hidden flex items-center justify-center relative shadow-inner">
          {currentPreviewFile ? (
            currentPreviewFile.isPdf ? (
              <object
                data={`${currentPreviewFile.previewUrl}#toolbar=0&navpanes=0&view=FitH`}
                type="application/pdf"
                className="w-full h-full min-h-[500px] border-0 bg-white"
              >
                <iframe
                  src={`${currentPreviewFile.previewUrl}#toolbar=0&navpanes=0&view=FitH`}
                  className="w-full h-full min-h-[500px] border-0 bg-white"
                  title="PDF Preview"
                />
              </object>
            ) : currentPreviewFile.isImage ? (
              <div className="w-full h-full p-2 flex items-center justify-center bg-white overflow-auto">
                <img
                  src={currentPreviewFile.previewUrl}
                  alt="Preview"
                  className="max-h-full max-w-full object-contain"
                />
              </div>
            ) : (
              <div className="text-center p-4">
                <FileText className="w-10 h-10 text-slate-400 mx-auto mb-1" />
                <p className="text-xs text-slate-500">{currentPreviewFile.file.name}</p>
              </div>
            )
          ) : (
            <div className="text-center p-6 space-y-2">
              <Eye className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="text-xs text-slate-400 font-medium">อัปโหลดไฟล์เพื่อดูตัวอย่างเอกสาร</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}