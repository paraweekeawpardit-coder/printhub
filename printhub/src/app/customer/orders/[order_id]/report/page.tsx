"use client";

import {
  useEffect,
  useState,
  useRef,
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
  order_no?: string | number;
  order_date?: string;
  customer_id?: string;
  shop_id?: string;
  description?: string;
  total_price?: number | string;
  has_reported?: boolean;

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
    if (!file.type.startsWith("image/") && file.type !== "application/pdf") {
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
    <div className="relative w-full h-80 sm:h-96 rounded-2xl border border-slate-200 bg-slate-50 overflow-hidden group shadow-xs">
      {previewUrl ? (
        file.type === "application/pdf" ? (
          <div className="w-full h-full relative bg-white">
            <iframe
              src={`${previewUrl}#toolbar=0&navpanes=0&scrollbar=1&view=FitH`}
              title={file.name}
              className="w-full h-full border-0"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-4 py-2 pointer-events-none">
              <p className="text-xs text-white truncate font-medium">
                📄 {file.name}
              </p>
            </div>
          </div>
        ) : (
          <div className="w-full h-full relative">
            <img
              src={previewUrl}
              alt={file.name}
              className="w-full h-full object-contain bg-slate-900/5"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-4 py-2">
              <p className="text-xs text-white truncate font-medium">
                {file.name}
              </p>
            </div>
          </div>
        )
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center">
          <div className="text-4xl mb-2">📄</div>
          <span className="text-sm font-medium text-slate-700 truncate max-w-xs">
            {file.name}
          </span>
          <span className="text-xs text-slate-400 mt-1">
            {(file.size / 1024).toFixed(0)} KB
          </span>
        </div>
      )}

      <button
        type="button"
        onClick={() => onRemove(index)}
        aria-label={`ลบไฟล์ ${file.name}`}
        className="absolute top-3 right-3 z-10 bg-red-500/90 hover:bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm shadow-md transition-all active:scale-95 cursor-pointer"
      >
        ✕
      </button>
    </div>
  );
}

export default function RefundRequestPage() {
  const params = useParams();
  const router = useRouter();

  const rawOrderId = params?.order_id || params?.orderId;
  const orderId = Array.isArray(rawOrderId) ? rawOrderId[0] : (rawOrderId as string);

  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [loadingOrder, setLoadingOrder] = useState(true);
  const [orderError, setOrderError] = useState("");

  const [exactOrderNo, setExactOrderNo] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    issueType: "",
    description: "",
    resolution: "refund",
    bankName: "",
    accountNumber: "",
    accountName: "",
  });

  const [existingReport, setExistingReport] = useState<boolean>(false);
  const [files, setFiles] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const hiddenInputRef = useRef<HTMLInputElement>(null);

  const fetchOrderDetail = async (id: string) => {
    setLoadingOrder(true);
    setOrderError("");

    try {
      const url = `http://localhost:5000/api/customer/order/${id}/review`;
      const res = await fetch(url);
      const result = await res.json();

      if (res.ok && result.success) {
        const currentOrder = result.data;
        setOrderData(currentOrder);

        if (currentOrder.customer_id) {
          try {
            const dashRes = await fetch(`http://localhost:5000/api/customer/dashboard?customer_id=${currentOrder.customer_id}`);
            const dashJson = await dashRes.json();

            if (dashRes.ok && dashJson.success && Array.isArray(dashJson.data?.orders)) {
              const matchedOrder = dashJson.data.orders.find((o: any) => o.id === id);
              if (matchedOrder) {
                const calculatedNo = matchedOrder.order_no || matchedOrder.id?.slice(0, 6);
                setExactOrderNo(calculatedNo);
              }
            }
          } catch (dashErr) {
            console.error("Could not fetch dashboard order details:", dashErr);
          }
        }
      } else {
        setOrderError(result.message || "ไม่สามารถโหลดข้อมูลคำสั่งซื้อได้");
      }
    } catch (err) {
      console.error("Error:", err);
      setOrderError("เกิดข้อผิดพลาดในการเชื่อมต่อ Backend");
    } finally {
      setLoadingOrder(false);
    }
  };

  useEffect(() => {
    if (orderId && orderId !== "undefined") {
      fetchOrderDetail(orderId);
    } else {
      setLoadingOrder(false);
      setOrderError("ไม่พบรหัสคำสั่งซื้อ");
    }
  }, [orderId]);

  // 🌟 อัปเดต HTML Validation message ให้ Dummy input ทันทีเมื่อไฟล์เปลี่ยนแปลง
  useEffect(() => {
    if (hiddenInputRef.current) {
      if (files.length === 0) {
        hiddenInputRef.current.setCustomValidity("กรุณาแนบรูปภาพหรือไฟล์หลักฐานอย่างน้อย 1 ไฟล์เพื่อดำเนินการต่อ");
      } else {
        hiddenInputRef.current.setCustomValidity("");
      }
    }
  }, [files]);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...newFiles]);
      e.target.value = "";
    }
  };

  const handleRemoveFile = (indexToRemove: number) => {
    setFiles((prevFiles) => prevFiles.filter((_, index) => index !== indexToRemove));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!orderId || !orderData) return;
    if (files.length === 0) return;

    setSubmitting(true);

    try {
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

      if (files.length > 0) {
        data.append("image", files[0]);
      }

      const res = await fetch("http://localhost:5000/api/customer/report", {
        method: "POST",
        body: data,
      });

      const result = await res.json();

      if (res.ok && result.success) {
        // 🌟 นำ alert ออกแล้ว นำทางไปยังหน้าคำสั่งซื้อของฉันทันที
        router.push("/customer/orders");
      } else {
        alert(result.message || result.error || "ไม่สามารถส่งคำร้องได้");
        setExistingReport(true);
      }
    } catch (err) {
      console.error("❌ Submit Report Error:", err);
      alert("เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์");
    } finally {
      setSubmitting(false);
    }
  };

  const displayOrderNo = exactOrderNo || orderData?.order_no || orderId?.slice(0, 6) || "------";
  const orderNumberStr = `#ORD-${displayOrderNo}`;

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
            ขอคืนเงิน
          </h1>
        </div>

        {orderId && orderId !== "undefined" && (
          <span className="font-extrabold text-slate-900 text-sm sm:text-base tracking-tight shrink-0">
            {orderNumberStr}
          </span>
        )}
      </div>
    </header>
  );

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
              <p className="mt-2 text-sm text-gray-500">{orderError}</p>
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

  return (
    <div className="min-h-screen bg-[#F9FAFB] font-sans pb-12">
      <Navbar />

      <main className="max-w-4xl mx-auto px-6 py-6">
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs mb-4">
          <div className="flex items-center justify-between gap-5">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center overflow-hidden border border-slate-200 shrink-0">
                {orderData?.print_shop?.profile_image ? (
                  <img
                    src={orderData.print_shop.profile_image}
                    alt={orderData.print_shop.shop_name || "Shop profile"}
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
                    ? new Date(orderData.order_date).toLocaleString("th-TH", {
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

        {existingReport || orderData?.has_reported ? (
          <div className="bg-white rounded-2xl shadow-sm border border-amber-200 p-8 text-center space-y-4">
            <div className="w-16 h-16 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center mx-auto text-2xl font-bold">
              ⚠️
            </div>
            <h2 className="text-xl font-bold text-gray-900">
              คุณได้ส่งคำร้องขอคืนเงินสำหรับคำสั่งซื้อนี้ไปแล้ว
            </h2>
            <p className="text-sm text-gray-500 max-w-md mx-auto">
              ระบบได้รับคำร้องของคุณเรียบร้อยแล้ว อยู่ระหว่างการตรวจสอบ
              คุณสามารถติดตามสถานะคำสั่งซื้อได้จากเมนูคำสั่งซื้อของฉัน
            </p>
            <div className="pt-4">
              <Link
                href="/customer/orders"
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2.5 rounded-xl text-sm transition"
              >
                กลับไปยังคำสั่งซื้อของฉัน
              </Link>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* 1. รายละเอียดปัญหา */}
              <section className="space-y-3">
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
                    <option value="" disabled>
                      เลือกประเภทปัญหา
                    </option>
                    <option value="color">สีเพี้ยน / ไม่ตรงตามไฟล์งาน</option>
                    <option value="paper">
                      ชนิดกระดาษ / ขนาด ไม่ตรงตามที่สั่ง
                    </option>
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

              {/* 2. หลักฐานการขอคืนเงิน */}
              <section className="space-y-3">
                <h2 className="text-base font-semibold text-gray-900 border-b pb-2 flex items-center justify-between">
                  <span>
                    หลักฐานการขอคืนเงิน <span className="text-red-500">*</span>
                  </span>
                  <span className="text-xs font-normal text-slate-400">
                    บังคับแนบไฟล์อย่างน้อย 1 ไฟล์
                  </span>
                </h2>

                <p className="text-xs text-gray-500">
                  แนบรูปถ่าย หรือ ไฟล์ที่มีปัญหา (JPG, PNG, PDF)
                </p>

                <div className="flex flex-wrap items-center gap-3 relative">
                  {files.map((file, idx) => (
                    <PreviewFile
                      key={`${file.name}-${file.lastModified}-${idx}`}
                      file={file}
                      index={idx}
                      onRemove={handleRemoveFile}
                    />
                  ))}

                  <div className="relative">
                    <label className="w-28 h-24 rounded-xl border-2 border-dashed border-blue-200 hover:border-blue-500 bg-blue-50/50 hover:bg-blue-50 flex flex-col items-center justify-center cursor-pointer transition-all text-blue-600 text-xs font-medium gap-1">
                      <span className="text-2xl leading-none">+</span>
                      <span>แนบไฟล์</span>
                      <input
                        type="file"
                        multiple
                        accept="image/*,.pdf"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>

                    {/* Invisible input สำหรับ trigger Native HTML Validation Tooltip ตรงปุ่มแนบไฟล์ */}
                    <input
                      ref={hiddenInputRef}
                      type="text"
                      required
                      value={files.length > 0 ? "VALID" : ""}
                      onChange={() => { }}
                      className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 opacity-0 pointer-events-none"
                      tabIndex={-1}
                    />
                  </div>
                </div>

                {files.length > 0 && (
                  <p className="text-xs text-emerald-600 font-medium">
                    ✓ แนบแล้ว {files.length} ไฟล์
                  </p>
                )}
              </section>

              {/* 3. ความต้องการ */}
              <section className="space-y-3">
                <h2 className="text-base font-semibold text-gray-900 border-b pb-2">
                  ความต้องการ
                </h2>

                <div className="flex gap-6">
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
                  <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-200 grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        ธนาคาร <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="bankName"
                        required
                        placeholder="เช่น กสิกรไทย"
                        value={formData.bankName}
                        onChange={handleInputChange}
                        className="w-full rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:border-blue-600 focus:outline-none bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        เลขที่บัญชี <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="accountNumber"
                        required
                        placeholder="xxx-x-xxxxx-x"
                        value={formData.accountNumber}
                        onChange={handleInputChange}
                        className="w-full rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:border-blue-600 focus:outline-none bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        ชื่อบัญชี <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="accountName"
                        required
                        placeholder="ชื่อบัญชีธนาคาร"
                        value={formData.accountName}
                        onChange={handleInputChange}
                        className="w-full rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:border-blue-600 focus:outline-none bg-white"
                      />
                    </div>
                  </div>
                )}
              </section>

              {/* Buttons */}
              <div className="pt-2 flex flex-col-reverse sm:flex-row gap-3">
                <Link
                  href="/customer/orders"
                  className="w-full sm:w-1/2 bg-white hover:bg-gray-50 text-gray-700 font-medium py-2.5 rounded-xl transition-all border border-gray-300 active:scale-[0.99] text-center"
                >
                  ยกเลิกคำร้อง
                </Link>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full sm:w-1/2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-xl transition-all shadow-md shadow-blue-500/10 active:scale-[0.99] disabled:bg-gray-400 cursor-pointer"
                >
                  {submitting ? "กำลังส่งคำร้อง..." : "ส่งคำร้องขอคืนเงิน"}
                </button>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}