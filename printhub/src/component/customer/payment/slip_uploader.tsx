'use client';

import React from 'react';

interface SlipUploaderProps {
  previewUrl: string | null;
  isExpired: boolean;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function SlipUploader({ previewUrl, isExpired, onFileChange }: SlipUploaderProps) {
  if (isExpired) {
    return (
      <div className="p-4 bg-red-100 border border-red-300 text-red-700 rounded-xl text-center">
        <p className="font-bold text-base">หมดเวลาในการชำระเงิน</p>
        <p className="text-xs mt-1">คำสั่งซื้อนี้ถูกยกเลิกแล้ว กรุณาทำรายการใหม่อีกครั้ง</p>
      </div>
    );
  }

  return (
    <label className="border-2 border-dashed border-gray-200 hover:border-blue-400 transition-colors rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer bg-gray-50 min-h-[200px]">
      <input
        type="file"
        accept="image/png, image/jpeg, image/jpg"
        className="hidden"
        onChange={onFileChange}
        disabled={isExpired}
      />
      {previewUrl ? (
        <div className="relative w-full h-44">
          <img src={previewUrl} alt="Slip Preview" className="w-full h-full object-contain rounded-lg" />
        </div>
      ) : (
        <>
          <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-2 font-bold text-xl">
            ↑
          </div>
          <p className="text-sm font-semibold text-gray-700">คลิกเพื่ออัปโหลดสลิปโอนเงิน</p>
          <p className="text-xs text-gray-400 mt-1">รองรับไฟล์ JPG, PNG (สูงสุด 5MB)</p>
        </>
      )}
    </label>
  );
}