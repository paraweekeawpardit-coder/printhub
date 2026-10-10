"use client";

import {
  useEffect,
  useState,
  ChangeEvent,
  FormEvent,
} from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

interface OrderItem {
  id?: string | number;
  quantity: number;
  unit_price?: number;
  subtotal: number;
}

interface OrderData {
  id: string;
  order_date?: string;
  customer_id?: string;
  shop_id?: string;
  description?: string;
  total_price?: number | string;

  print_shop?: {
    shop_name?: string;
    profile_image?: string;
  };

  order_item?: OrderItem[];
}

interface PreviewFileProps {
  file: File;
  index: number;
  onRemove: (index: number) => void;
}

function PreviewFile({
  file,
  index,
  onRemove,
}: PreviewFileProps) {
  const [previewUrl, setPreviewUrl] = useState("");

  useEffect(() => {
    if (!file.type.startsWith("image/")) {
      setPreviewUrl("");
      return;
    }

    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [file]);

  return (
    <div className="relative w-28 h-24 rounded-xl border border-gray-200 bg-gray-50 overflow-hidden group">
      {previewUrl ? (
        <>
          <img
            src={previewUrl}
            alt={file.name}
            className="w-full h-full object-cover"
          />

          <div className="absolute inset-x-0 bottom-0 bg-black/55 px-1.5 py-1">
            <p className="text-[10px] text-white truncate">
              {file.name}
            </p>
          </div>
        </>
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center px-2 text-center">
          <div className="text-2xl mb-1">📄</div>

          <span className="text-[10px] font-medium text-gray-700 truncate w-full">
            {file.name}
          </span>

          <span className="text-[9px] text-gray-400 mt-0.5">
            {(file.size / 1024).toFixed(0)} KB
          </span>
        </div>
      )}

      <button
        type="button"
        onClick={() => onRemove(index)}
        aria-label={`ลบไฟล์ ${file.name}`}
        className="absolute -top-1.5 -right-1.5 z-10 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs shadow hover:bg-red-600 transition"
      >
        ×
      </button>
    </div>
  );
}

export default function RefundRequestPage() {
  const params = useParams();
  const router = useRouter();

  // ==========================================
  // Order ID จาก URL
  //
  // /customer/orders/[order_id]/report
  // ==========================================
  const rawOrderId =
    params?.order_id || params?.orderId;

  const orderId = Array.isArray(rawOrderId)
    ? rawOrderId[0]
    : (rawOrderId as string);

  // ==========================================
  // Order Data
  // ==========================================
  const [orderData, setOrderData] =
    useState<OrderData | null>(null);

  const [loadingOrder, setLoadingOrder] =
    useState(true);

  const [orderError, setOrderError] =
    useState("");

  // ==========================================
  // Form Data
  // ==========================================
  const [formData, setFormData] = useState({
    issueType: "",
    description: "",
    resolution: "refund",
    bankName: "",
    accountNumber: "",
    accountName: "",
  });

  // ==========================================
  // Files
  // ==========================================
  const [files, setFiles] = useState<File[]>([]);

  // ==========================================
  // Submit State
  // ==========================================
  const [submitting, setSubmitting] = useState(false);

  // ==========================================
  // ดึงข้อมูล Order
  // ใช้ API เดียวกับหน้า Review
  // ==========================================
  const fetchOrderDetail = async (id: string) => {
    setLoadingOrder(true);
    setOrderError("");

    try {
      const url =
        `http://localhost:5000/api/customer/order/${id}/review`;

      console.log(
        "🔵 Report Order API URL:",
        url
      );

      const res = await fetch(url);

      console.log(
        "🟡 Report Order API Status:",
        res.status
      );

      const text = await res.text();

      console.log(
        "🟢 Report Order API Response:",
        text
      );

      let result;

      try {
        result = JSON.parse(text);
      } catch {
        throw new Error(
          `Backend ส่ง Response ที่ไม่ใช่ JSON กลับมา: ${text}`
        );
      }

      if (res.ok && result.success) {
        setOrderData(result.data);
      } else {
        setOrderError(
          result.message ||
          `ไม่สามารถโหลดข้อมูลคำสั่งซื้อได้ (HTTP ${res.status})`
        );
      }
    } catch (err) {
      console.error(
        "🔴 Report Detail API Error:",
        err
      );

      if (err instanceof Error) {
        setOrderError(err.message);
      } else {
        setOrderError(
          "เกิดข้อผิดพลาดในการเชื่อมต่อ Backend"
        );
      }
    } finally {
      setLoadingOrder(false);
    }
  };

  // ==========================================
  // Load Order
  // ==========================================
  useEffect(() => {
    if (
      orderId &&
      orderId !== "undefined"
    ) {
      fetchOrderDetail(orderId);
    } else {
      setLoadingOrder(false);
      setOrderError(
        "ไม่พบรหัสคำสั่งซื้อ"
      );
    }
  }, [orderId]);

  // ==========================================
  // Input Change
  // ==========================================
  const handleInputChange = (
    e: ChangeEvent<
      HTMLInputElement |
      HTMLSelectElement |
      HTMLTextAreaElement
    >
  ) => {
    const {
      name,
      value,
    } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ==========================================
  // File Upload
  // ==========================================
  const handleFileUpload = (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);

      setFiles((prev) => [
        ...prev,
        ...newFiles,
      ]);

      // Reset input so the same file can be selected again.
      e.target.value = "";
    }
  };

  const handleRemoveFile = (indexToRemove: number) => {
    setFiles((prevFiles) => prevFiles.filter((_, index) => index !== indexToRemove));
  };

  // ==========================================
  // Remove File
  // ==========================================
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!orderId) {
      alert("ไม่พบรหัสคำสั่งซื้อ");
      return;
    }

    if (!orderData) {
      alert("ไม่พบข้อมูลคำสั่งซื้อ");
      return;
    }

    if (!formData.issueType) {
      alert("กรุณาเลือกประเภทปัญหา");
      return;
    }

    setSubmitting(true);

    try {
      // สร้าง FormData เพื่อรองรับการแนบไฟล์พร้อมข้อความ
      const data = new FormData();
      data.append("order_id", orderId);
      data.append("shop_id", orderData.shop_id || "");
      data.append("customer_id", orderData.customer_id || "");
      data.append("issue_type", formData.issueType);
      data.append("description", formData.description);
      data.append("resolution", formData.resolution);
      data.append("bank_name", formData.bankName);
      data.append("account_number", formData.accountNumber);
      data.append("account_name", formData.accountName);

      // ถ้าผู้ใช้แนบไฟล์มา ให้แนบไฟล์แรกไปกับ FormData (ใช้คีย์ชื่อ "image" ให้ตรงกับ Backend)
      if (files.length > 0) {
        data.append("image", files[0]);
      }

      console.log("📤 Sending Report FormData...");

      const res = await fetch(
        "http://localhost:5000/api/customer/report", // ปรับ URL ตาม Backend ของคุณ
        {
          method: "POST",
          // 💡 ข้อสังเกต: เมื่อใช้ FormData **ไม่ต้องใส่ Header "Content-Type": "application/json"** 
          // เพราะ Browser จะจัดการกำหนด multipart/form-data ให้เองอัตโนมัติ
          body: data,
        }
      );

      const result = await res.json();

      if (res.ok && result.success) {
        alert(result.message || "ส่งคำร้องขอคืนเงิน/แจ้งปัญหาเรียบร้อยแล้ว");
        router.push("/customer/orders");
      } else {
        alert(result.message || "ไม่สามารถส่งคำร้องได้");
      }
    } catch (err) {
      console.error("❌ Submit Report Error:", err);
      alert("เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์");
    } finally {
      setSubmitting(false);
    }
  };

  // ==========================================
  // Shared Navbar
  // ==========================================
  const Navbar = () => (
    <header className="bg-white border-b border-slate-200/80 sticky top-0 z-30">
      <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <Link
            href="/customer/orders"
            className="shrink-0 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm px-5 py-3 rounded-2xl transition"
          >
            ← คำสั่งซื้อของฉัน
          </Link>

          <h1 className="font-bold text-lg text-slate-900 truncate">
            รายงานปัญหา / ขอคืนเงิน
          </h1>
        </div>

        {orderId && orderId !== "undefined" && (
          <Link
            href={`/customer/orders/${orderId}/review`}
            className="shrink-0 text-xs sm:text-sm text-slate-400 hover:text-slate-700 font-mono transition"
            title="เปิดรายละเอียดคำสั่งซื้อ"
          >
            Order #{orderId.slice(0, 8)}
          </Link>
        )}
      </div>
    </header>
  );

  // ==========================================
  // Loading
  // ==========================================
  if (loadingOrder) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] font-sans">
        <Navbar />

        <main className="max-w-3xl mx-auto px-6 py-20">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto" />

            <p className="mt-3 text-sm text-slate-400">
              กำลังโหลดข้อมูลคำสั่งซื้อ...
            </p>
          </div>
        </main>
      </div>
    );
  }

  // ==========================================
  // Error
  // ==========================================
  if (orderError) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] font-sans">
        <Navbar />

        <main className="max-w-3xl mx-auto px-6 py-10">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-red-50 text-red-500 flex items-center justify-center mx-auto text-xl font-bold">
                !
              </div>

              <h2 className="mt-4 text-lg font-bold text-gray-900">
                ไม่สามารถโหลดข้อมูลคำสั่งซื้อ
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                {orderError}
              </p>

              <button
                type="button"
                onClick={() => router.back()}
                className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2.5 rounded-xl text-sm"
              >
                ย้อนกลับ
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // ==========================================
  // Main Page
  // ==========================================
  return (
    <div className="min-h-screen bg-[#F9FAFB] font-sans pb-12">
      <Navbar />

      <main className="max-w-4xl mx-auto px-6 py-6">
        {/* ==========================================
            Shop / Order Summary
        ========================================== */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs mb-4">
          <div className="flex items-center justify-between gap-5">
            <div className="flex items-center gap-3 min-w-0">
              {/* Shop profile image */}
              <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center overflow-hidden border border-slate-200 shrink-0">
                {orderData?.print_shop?.profile_image ? (
                  <img
                    src={orderData.print_shop.profile_image}
                    alt={
                      orderData.print_shop.shop_name ||
                      "Shop profile"
                    }
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xl text-slate-300">
                    🏪
                  </div>
                )}
              </div>

              <div className="min-w-0">
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 truncate">
                  {orderData?.print_shop?.shop_name || "-"}
                </h2>

                <p className="text-xs text-slate-400 mt-0.5">
                  สั่งซื้อเมื่อ:{" "}
                  {orderData?.order_date
                    ? new Date(
                      orderData.order_date
                    ).toLocaleString("th-TH", {
                      day: "numeric",
                      month: "numeric",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    })
                    : "-"}
                </p>
              </div>
            </div>


          </div>
        </div>

        {/* ==========================================
            Report Form
        ========================================== */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            {/* ==========================================
                1. รายละเอียดปัญหา
            ========================================== */}
            <section className="space-y-3">
              <h2 className="text-base font-semibold text-gray-900 border-b pb-2">
                รายละเอียดปัญหา
              </h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  เลือกประเภทปัญหา{" "}
                  <span className="text-red-500">
                    *
                  </span>
                </label>

                <select
                  name="issueType"
                  required
                  value={formData.issueType}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 bg-white"
                >
                  <option value="" disabled>
                    เลือกประเภทปัญหา
                  </option>

                  <option value="color">
                    สีเพี้ยน / ไม่ตรงตามไฟล์งาน
                  </option>

                  <option value="paper">
                    ชนิดกระดาษ / ขนาด ไม่ตรงตามที่สั่ง
                  </option>

                  <option value="damaged">
                    งานพิมพ์ชำรุด / ยับ / เป็นรอย
                  </option>

                  <option value="quantity">
                    ได้สินค้าไม่ครบตามจำนวน
                  </option>

                  <option value="delay">
                    จัดส่งล่าช้า
                  </option>

                  <option value="other">
                    อื่นๆ
                  </option>
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



            {/* ==========================================
                2. หลักฐาน
            ========================================== */}
            <section className="space-y-3">
              <h2 className="text-base font-semibold text-gray-900 border-b pb-2">
                หลักฐาน
              </h2>

              <p className="text-xs text-gray-500">
                แนบรูปถ่าย หรือ ไฟล์ที่มีปัญหา (JPG, PNG, PDF)
              </p>

              <div className="flex flex-wrap items-center gap-3">
                {files.map((file, idx) => (
                  <PreviewFile
                    key={`${file.name}-${file.lastModified}-${idx}`}
                    file={file}
                    index={idx}
                    onRemove={handleRemoveFile}
                  />
                ))}

                <label className="w-28 h-24 rounded-xl border-2 border-dashed border-blue-200 hover:border-blue-500 bg-blue-50/50 hover:bg-blue-50 flex flex-col items-center justify-center cursor-pointer transition-all text-blue-600 text-xs font-medium gap-1">
                  <span className="text-2xl leading-none">
                    +
                  </span>

                  <span>
                    แนบไฟล์เพิ่ม
                  </span>

                  <input
                    type="file"
                    multiple
                    accept="image/*,.pdf"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {files.length > 0 && (
                <p className="text-xs text-slate-400">
                  แนบแล้ว {files.length} ไฟล์
                  {" · "}
                  รูปภาพจะแสดงตัวอย่างทันที
                </p>
              )}
            </section>

            {/* ==========================================
                3. ความต้องการ
            ========================================== */}
            <section className="space-y-3">
              <h2 className="text-base font-semibold text-gray-900 border-b pb-2">
                ความต้องการ
              </h2>

              <div className="flex gap-6">
                {/* Reprint */}
                <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-gray-700">
                  <input
                    type="radio"
                    name="resolution"
                    value="reprint"
                    checked={
                      formData.resolution ===
                      "reprint"
                    }
                    onChange={handleInputChange}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                  />

                  พิมพ์งานใหม่
                </label>

                {/* Refund */}
                <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-gray-700">
                  <input
                    type="radio"
                    name="resolution"
                    value="refund"
                    checked={
                      formData.resolution ===
                      "refund"
                    }
                    onChange={handleInputChange}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                  />

                  ขอคืนเงิน (Refund)
                </label>
              </div>

              {/* ==========================================
                  Bank Information
              ========================================== */}
              {formData.resolution ===
                "refund" && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-200 grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {/* Bank */}
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

                    {/* Account Number */}
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

                    {/* Account Name */}
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

            {/* ==========================================
                Buttons
            ========================================== */}
            <div className="pt-2 flex flex-col-reverse sm:flex-row gap-3">
              {/* Cancel */}
              <Link
                href="/customer/orders"
                className="w-full sm:w-1/2 bg-white hover:bg-gray-50 text-gray-700 font-medium py-2.5 rounded-xl transition-all border border-gray-300 active:scale-[0.99] text-center"
              >
                ยกเลิกคำร้อง
              </Link>

              {/* Submit */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full sm:w-1/2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-xl transition-all shadow-md shadow-blue-500/10 active:scale-[0.99] disabled:bg-gray-400"
              >
                {submitting
                  ? "กำลังส่งคำร้อง..."
                  : "ส่งคำร้อง"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}