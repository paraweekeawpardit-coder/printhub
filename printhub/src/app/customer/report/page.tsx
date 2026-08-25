"use client";

import { useState, ChangeEvent, FormEvent } from "react";

export default function RefundRequestPage() {
  const [formData, setFormData] = useState({
    issueType: "",
    description: "",
    resolution: "refund", // "reprint" | "refund"
    bankName: "",
    accountNumber: "",
    accountName: "",
  });

  const [files, setFiles] = useState<File[]>([]);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const handleRemoveFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log("Submitted Data:", { ...formData, files });
    alert("ส่งคำร้องขอคืนเงิน/แจ้งปัญหาเรียบร้อยแล้ว");
  };

  return (
    <main className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8 font-sans text-gray-800">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-10">
        
        {/*Title */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1 flex items-center gap-2">
            คำร้องขอคืนเงิน / ร้องเรียน 🛒
          </h1>
          <div className="w-full bg-gray-100 h-1.5 rounded-full mt-4 overflow-hidden">
            <div className="bg-blue-600 h-full w-2/3 transition-all duration-300" />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* 1. ข้อมูลคำสั่งซื้อ */}
          <section className="space-y-4">
            <h2 className="text-base font-semibold text-gray-900 border-b pb-2">
              ข้อมูลคำสั่งซื้อ
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  หมายเลขคำสั่งซื้อ
                </label>
                {/* ข้อความแสดงหมายเลขแทน input */}
                <div className="w-full rounded-lg border border-gray-200 bg-gray-100 px-3 py-2 text-sm text-gray-500 cursor-not-allowed">
                  TH12345678
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ชื่อร้านค้า
                </label>
                {/* เปลี่ยนเป็นข้อความแสดงชื่อร้านค้าแทน input */}
                <div className="w-full rounded-lg border border-gray-200 bg-gray-100 px-3 py-2 text-sm text-gray-500 cursor-not-allowed">
                  ร้านตัวอย่างค้าส่ง
                </div>
              </div>
            </div>
          </section>

          {/* 2. รายละเอียดปัญหา */}
          <section className="space-y-4">
            <h2 className="text-base font-semibold text-gray-900 border-b pb-2">
              รายละเอียดปัญหา
            </h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                เลือกประเภทปัญหา <span className="text-red-500">*</span>
              </label>
              <select
                name="issueType"
                required
                value={formData.issueType}
                onChange={handleInputChange}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 bg-white"
              >
                <option value="" disabled>เลือกประเภทปัญหา</option>
                <option value="color">สีเพี้ยน / ไม่ตรงตามไฟล์งาน</option>
                <option value="paper">ชนิดกระดาษ / ขนาด ไม่ตรงตามที่สั่ง</option>
                <option value="damaged">งานพิมพ์ชำรุด / ยับ / เป็นรอย</option>
                <option value="quantity">ได้สินค้าไม่ครบตามจำนวน</option>
                <option value="delay">จัดส่งล่าช้า</option>
                <option value="other">อื่นๆ</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                รายละเอียดเพิ่มเติม
              </label>
              <textarea
                name="description"
                rows={3}
                placeholder="ระบุรายละเอียด เช่น สีเพี้ยนจากไฟล์ที่ส่งไปมาก มีรอยพับบริเวณมุมล่าง..."
                value={formData.description}
                onChange={handleInputChange}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
              />
            </div>
          </section>

          {/* 3. หลักฐาน */}
          <section className="space-y-4">
            <h2 className="text-base font-semibold text-gray-900 border-b pb-2">
              หลักฐาน
            </h2>
            <p className="text-xs text-gray-500">แนบรูปถ่าย หรือ ไฟล์ที่มีปัญหา (JPG, PNG, PDF)</p>

            <div className="flex flex-wrap items-center gap-4">
              {files.map((file, idx) => (
                <div
                  key={idx}
                  className="relative w-28 h-24 rounded-lg border border-gray-200 bg-gray-50 flex flex-col items-center justify-center p-2 text-center"
                >
                  <span className="text-xs font-medium text-gray-700 truncate w-full">
                    {file.name}
                  </span>
                  <span className="text-[10px] text-gray-400 mt-1">
                    {(file.size / 1024).toFixed(0)} KB
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveFile(idx)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs shadow hover:bg-red-600 transition-colors"
                  >
                    ×
                  </button>
                </div>
              ))}

              <label className="w-28 h-24 rounded-lg border-2 border-dashed border-blue-200 hover:border-blue-500 bg-blue-50/50 hover:bg-blue-50 flex flex-col items-center justify-center cursor-pointer transition-all text-blue-600 text-xs font-medium gap-1">
                <span className="text-xl">+</span>
                <span>แนบไฟล์เพิ่ม</span>
                <input
                  type="file"
                  multiple
                  accept="image/*,.pdf"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>
          </section>

          {/* 4. ความต้องการ */}
          <section className="space-y-4">
            <h2 className="text-base font-semibold text-gray-900 border-b pb-2">
              ความต้องการ
            </h2>

            <div className="flex gap-6">
              <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-gray-700">
                <input
                  type="radio"
                  name="resolution"
                  value="reprint"
                  checked={formData.resolution === "reprint"}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                />
                พิมพ์งานใหม่
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-gray-700">
                <input
                  type="radio"
                  name="resolution"
                  value="refund"
                  checked={formData.resolution === "refund"}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                />
                ขอคืนเงิน (Refund)
              </label>
            </div>

            {formData.resolution === "refund" && (
              <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-200 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    ธนาคาร
                  </label>
                  <input
                    type="text"
                    name="bankName"
                    placeholder="เช่น กสิกรไทย"
                    value={formData.bankName}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:border-blue-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    เลขที่บัญชี
                  </label>
                  <input
                    type="text"
                    name="accountNumber"
                    placeholder="xxx-x-xxxxx-x"
                    value={formData.accountNumber}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:border-blue-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    ชื่อบัญชี
                  </label>
                  <input
                    type="text"
                    name="accountName"
                    placeholder="ชื่อบัญชีธนาคาร"
                    value={formData.accountName}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:border-blue-600 focus:outline-none"
                  />
                </div>
              </div>
            )}
          </section>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-xl transition-all shadow-md shadow-blue-500/10 active:scale-[0.99]"
            >
              ส่งคำร้อง
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}