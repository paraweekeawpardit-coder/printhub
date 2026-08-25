'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

interface ServiceDetail {
  id: string | number;
  option_name: string;
  unit_price: number;
  unit_name?: string;
}

interface ServiceType {
  id: string | number;
  type_name: string;
  details: ServiceDetail[];
}

interface ShopInfo {
  id: string | number;
  shop_name: string;
  open_time: string;
  close_time: string;
  rating?: number;
}

interface UploadedFileInfo {
  file: File;
  previewUrl: string;
  isImage: boolean;
  isPdf: boolean;
}

export default function OrderPage() {
  const params = useParams();
  const shopId = params?.shopId;

  // Supabase Data States
  const [shop, setShop] = useState<ShopInfo | null>(null);
  const [serviceTypes, setServiceTypes] = useState<ServiceType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [fetchError, setFetchError] = useState<string>('');

  // Form Selections
  const [selectedTypeId, setSelectedTypeId] = useState<string>('');
  const [selectedDetailId, setSelectedDetailId] = useState<string>('');
  const [copies, setCopies] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  // Date & Time Validation States
  const [pickupTime, setPickupTime] = useState<string>('');
  const [timeError, setTimeError] = useState<string>('');

  // Upload States
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFileInfo[]>([]);
  const [activeFileIndex, setActiveFileIndex] = useState<number>(0);

  // คำนวณวันและเวลาปัจจุบันสำหรับป้องกันการเลือกย้อนหลัง
  const currentDateTimeString = useMemo(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }, []);

  // 1. ดึงข้อมูล service_type และ service_detail เฉพาะร้านค้านี้จาก Backend
  useEffect(() => {
    const fetchShopServices = async () => {
      if (!shopId) return;
      setLoading(true);
      setFetchError('');

      try {
        const res = await fetch(`http://localhost:5000/api/customer/shops/${shopId}/services`);
        const result = await res.json();

        if (result.success && result.data) {
          const types: ServiceType[] = result.data.service_types || [];
          setServiceTypes(types);

          if (result.data.shop) {
            setShop({
              id: result.data.shop.id,
              shop_name: result.data.shop.shop_name,
              open_time: result.data.shop.open_time ? result.data.shop.open_time.slice(0, 5) : '08:00',
              close_time: result.data.shop.close_time ? result.data.shop.close_time.slice(0, 5) : '20:00',
              rating: result.data.shop.rating || 5.0,
            });
          }

          // เลือกตัวเลือกแรกให้อัตโนมัติ
          if (types.length > 0) {
            setSelectedTypeId(String(types[0].id));
            if (types[0].details && types[0].details.length > 0) {
              setSelectedDetailId(String(types[0].details[0].id));
            }
          }
        } else {
          setFetchError(result.message || 'ไม่สามารถโหลดข้อมูลบริการของร้านนี้ได้');
        }
      } catch (err: any) {
        console.error('Fetch error:', err);
        setFetchError('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ Backend ได้');
      } finally {
        setLoading(false);
      }
    };

    fetchShopServices();
  }, [shopId]);

  // หา Service Type ที่กำลังเลือก
  const currentServiceType = useMemo(() => {
    return serviceTypes.find((t) => String(t.id) === selectedTypeId);
  }, [serviceTypes, selectedTypeId]);

  // หา Service Details ของ Type นั้นๆ
  const currentDetails = useMemo(() => {
    return currentServiceType?.details || [];
  }, [currentServiceType]);

  // เมื่อเปลี่ยน service_type ให้สลับตัวเลือก detail แรกทันที
  const handleTypeChange = (typeId: string) => {
    setSelectedTypeId(typeId);
    const target = serviceTypes.find((t) => String(t.id) === typeId);
    if (target && target.details && target.details.length > 0) {
      setSelectedDetailId(String(target.details[0].id));
    } else {
      setSelectedDetailId('');
    }
  };

  // ตรวจสอบวันและเวลาเปิด-ปิดร้าน
  const handlePickupTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setPickupTime(val);

    if (!val) {
      setTimeError('กรุณาระบุวันและเวลานัดหมายรับเอกสาร');
      return;
    }

    const selectedDate = new Date(val);
    const now = new Date();

    // เช็คห้ามเลือกวัน/เวลาย้อนหลัง
    if (selectedDate.getTime() < now.getTime()) {
      setTimeError('❌ ไม่สามารถเลือกวันหรือเวลาย้อนหลังในอดีตได้');
      return;
    }

    // เช็คช่วงเวลาเปิด-ปิดทำการของร้าน
    if (shop) {
      const selectedMinutes = selectedDate.getHours() * 60 + selectedDate.getMinutes();
      const [openH, openM] = shop.open_time.split(':').map(Number);
      const [closeH, closeM] = shop.close_time.split(':').map(Number);
      const openMinutes = openH * 60 + openM;
      const closeMinutes = closeH * 60 + closeM;

      if (selectedMinutes < openMinutes || selectedMinutes > closeMinutes) {
        setTimeError(`❌ ร้านเปิดให้บริการช่วง ${shop.open_time} - ${shop.close_time} น. เท่านั้น`);
        return;
      }
    }

    setTimeError('');
  };

  // จัดการอัปโหลดไฟล์
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      const newFiles: UploadedFileInfo[] = files.map((file) => ({
        file,
        previewUrl: URL.createObjectURL(file),
        isImage: file.type.startsWith('image/'),
        isPdf: file.type === 'application/pdf',
      }));

      setUploadedFiles((prev) => [...prev, ...newFiles]);
      setTotalPages((prev) => prev + files.length);
    }
  };

  useEffect(() => {
    return () => {
      uploadedFiles.forEach((item) => URL.revokeObjectURL(item.previewUrl));
    };
  }, [uploadedFiles]);

  const removeFile = (index: number) => {
    URL.revokeObjectURL(uploadedFiles[index].previewUrl);
    const updated = uploadedFiles.filter((_, i) => i !== index);
    setUploadedFiles(updated);
    if (activeFileIndex >= updated.length) {
      setActiveFileIndex(Math.max(0, updated.length - 1));
    }
    setTotalPages(Math.max(1, updated.length));
  };

  // คำนวณราคาจริงจาก unit_price ของ Supabase
  const calculatedPrice = useMemo(() => {
    const detail = currentDetails.find((d) => String(d.id) === selectedDetailId);
    const unitPrice = Number(detail?.unit_price) || 0;
    const total = unitPrice * totalPages * Math.max(1, copies);
    return total.toFixed(2);
  }, [currentDetails, selectedDetailId, totalPages, copies]);

  const currentFile = uploadedFiles[activeFileIndex];

  return (
    <div className="min-h-screen bg-[#F9FAFB] font-sans pb-12">
      {/* Top Bar */}
      <div className="bg-white border-b border-slate-200/80 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs px-3.5 py-2 rounded-xl transition active:scale-95"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
              </svg>
              <span>ย้อนกลับ</span>
            </Link>

            <h1 className="font-bold text-lg text-slate-900 truncate">
              {shop ? shop.shop_name : 'กำลังโหลดข้อมูลร้านค้า...'}
            </h1>
          </div>

          {shop && (
            <div className="flex items-center gap-4 text-xs font-medium text-slate-600">
              <span>🕒 {shop.open_time} - {shop.close_time} น.</span>
              <span className="text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md font-bold">
                ★ {shop.rating}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Main Grid */}
      <main className="max-w-6xl mx-auto px-6 py-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* ฝั่งซ้าย: Preview & Upload */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white p-6 rounded-2xl border-2 border-dashed border-slate-300 hover:border-blue-500 transition cursor-pointer relative flex flex-col items-center justify-center text-center shadow-xs">
            <input
              type="file"
              multiple
              accept=".pdf,.png,.jpg,.jpeg,.webp"
              onChange={handleFileUpload}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
            />
            <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-xl mb-2">
              📤
            </div>
            <p className="font-bold text-sm text-slate-800">คลิกหรือลากไฟล์มาวางที่นี่เพื่ออัปโหลด</p>
            <p className="text-xs text-slate-400 mt-0.5">รองรับไฟล์ PDF, รูปภาพ JPG, PNG (สูงสุด 50MB)</p>
          </div>

          {uploadedFiles.length > 0 && (
            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
              {uploadedFiles.map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => setActiveFileIndex(idx)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs cursor-pointer transition shrink-0 ${
                    activeFileIndex === idx
                      ? 'bg-blue-50 border-blue-500 text-blue-700 font-bold shadow-xs'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span className="truncate max-w-[120px]">{item.file.name}</span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile(idx);
                    }}
                    className="text-slate-400 hover:text-rose-500 font-bold ml-1"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
            <h3 className="font-bold text-sm text-slate-800">ตัวอย่างเอกสาร (Preview)</h3>
            <div className="w-full h-[420px] bg-slate-900/5 border border-slate-200 rounded-xl flex items-center justify-center overflow-hidden relative">
              {currentFile ? (
                currentFile.isImage ? (
                  <img
                    src={currentFile.previewUrl}
                    alt="Preview"
                    className="max-w-full max-h-full object-contain shadow-sm rounded-lg"
                  />
                ) : currentFile.isPdf ? (
                  <iframe
                    src={`${currentFile.previewUrl}#toolbar=0`}
                    title="PDF Preview"
                    className="w-full h-full rounded-xl border-0"
                  />
                ) : (
                  <div className="text-center text-slate-400 space-y-1">
                    <span className="text-4xl">📄</span>
                    <p className="text-xs font-medium">{currentFile.file.name}</p>
                  </div>
                )
              ) : (
                <div className="text-center text-slate-400 space-y-2">
                  <p className="text-xs font-medium">อัปโหลดไฟล์เพื่อดูตัวอย่างเอกสารจริง</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ฝั่งขวา: รายละเอียดบริการจาก Supabase */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-5">
            <div className="bg-slate-100 -m-5 mb-0 p-3.5 rounded-t-2xl border-b border-slate-200 text-center font-bold text-sm text-slate-800">
              รายละเอียดคำสั่งพิมพ์
            </div>

            {loading ? (
              <div className="py-12 text-center text-xs text-slate-400 space-y-2">
                <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p>กำลังดึงข้อมูลบริการจากร้านค้านี้...</p>
              </div>
            ) : fetchError ? (
              <div className="py-8 text-center text-xs text-rose-500 font-medium">
                {fetchError}
              </div>
            ) : serviceTypes.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">
                ร้านค้านี้ยังไม่ได้ระบุประเภทบริการในระบบ
              </div>
            ) : (
              <>
                {/* 1. ประเภทงานพิมพ์ */}
                <div className="space-y-1.5 pt-2">
                  <label className="text-xs font-bold text-slate-800 block">1. ประเภทงานพิมพ์</label>
                  <select
                    value={selectedTypeId}
                    onChange={(e) => handleTypeChange(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 font-medium focus:outline-blue-500 cursor-pointer"
                  >
                    {serviceTypes.map((t) => (
                      <option key={t.id} value={String(t.id)}>
                        {t.type_name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 2. ตัวเลือกย่อยและราคา */}
                <div className="space-y-3">
                  <label className="text-xs font-bold text-slate-800 block">2. ตัวเลือกย่อยและราคา</label>
                  <select
                    value={selectedDetailId}
                    onChange={(e) => setSelectedDetailId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 font-medium focus:outline-blue-500 cursor-pointer"
                  >
                    {currentDetails.length === 0 ? (
                      <option value="">ไม่มีตัวเลือกย่อยในหมวดนี้</option>
                    ) : (
                      currentDetails.map((d) => (
                        <option key={d.id} value={String(d.id)}>
                          {d.option_name} — ฿{Number(d.unit_price).toFixed(2)} / {d.unit_name || 'หน่วย'}
                        </option>
                      ))
                    )}
                  </select>

                  {/* จำนวนหน้า & จำนวนชุด */}
                  <div className="flex items-center justify-between gap-3 text-xs pt-2">
                    <span className="text-slate-600 font-medium shrink-0">• จำนวนหน้า</span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setTotalPages(Math.max(1, totalPages - 1))}
                        className="w-7 h-7 rounded-lg bg-slate-100 border border-slate-200 font-bold hover:bg-slate-200 transition"
                      >
                        -
                      </button>
                      <span className="w-8 text-center font-bold text-slate-900">{totalPages}</span>
                      <button
                        type="button"
                        onClick={() => setTotalPages(totalPages + 1)}
                        className="w-7 h-7 rounded-lg bg-slate-100 border border-slate-200 font-bold hover:bg-slate-200 transition"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-3 text-xs">
                    <span className="text-slate-600 font-medium shrink-0">• จำนวนชุด</span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setCopies(Math.max(1, copies - 1))}
                        className="w-7 h-7 rounded-lg bg-slate-100 border border-slate-200 font-bold hover:bg-slate-200 transition"
                      >
                        -
                      </button>
                      <span className="w-8 text-center font-bold text-slate-900">{copies}</span>
                      <button
                        type="button"
                        onClick={() => setCopies(copies + 1)}
                        className="w-7 h-7 rounded-lg bg-slate-100 border border-slate-200 font-bold hover:bg-slate-200 transition"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                {/* 3. นัดหมายเวลารับ */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-slate-800 block">3. นัดหมายเวลารับเอกสาร</label>
                    {shop && (
                      <span className="text-[10px] text-slate-400 font-medium">
                        เปิด: {shop.open_time} - {shop.close_time} น.
                      </span>
                    )}
                  </div>

                  <input
                    type="datetime-local"
                    min={currentDateTimeString}
                    value={pickupTime}
                    onChange={handlePickupTimeChange}
                    className={`w-full bg-slate-50 border rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-blue-500 transition ${
                      timeError ? 'border-rose-500 bg-rose-50/30' : 'border-slate-200'
                    }`}
                  />

                  {timeError && (
                    <div className="p-2 rounded-lg bg-rose-50 border border-rose-200 text-rose-600 text-[11px] font-medium leading-tight">
                      {timeError}
                    </div>
                  )}
                </div>

                {/* สรุปราคา */}
                <div className="pt-4 border-t border-slate-100 space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <div>
                      <span className="font-medium text-slate-600 block">ราคารวมโดยประมาณ</span>
                      <span className="text-[10px] text-slate-400">({totalPages} หน้า x {copies} ชุด)</span>
                    </div>
                    <span className="font-extrabold text-blue-600 text-2xl">฿{calculatedPrice}</span>
                  </div>

                  <button
                    disabled={Boolean(timeError) || !pickupTime || currentDetails.length === 0}
                    className="w-full bg-blue-600 hover:bg-blue-700 active:scale-98 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold text-sm py-3 rounded-xl transition shadow-md shadow-blue-500/20"
                  >
                    {!pickupTime
                      ? 'กรุณาเลือกเวลานัดหมายรับเอกสาร'
                      : timeError
                      ? 'เวลาที่เลือกไม่ถูกต้อง'
                      : `ยืนยันการสั่งปริ้นท์งาน (฿${calculatedPrice})`}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}