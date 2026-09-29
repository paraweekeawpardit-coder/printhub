"use client";

import {
  useState,
  useEffect,
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
  const [files, setFiles] =
    useState<File[]>([]);

  // ==========================================
  // Submit State
  // ==========================================
  const [submitting, setSubmitting] =
    useState(false);

  // ==========================================
  // ดึงข้อมูล Order
  //
  // ใช้ API เดียวกับหน้า Review
  // ==========================================
  const fetchOrderDetail = async (
    id: string
  ) => {
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
      const newFiles =
        Array.from(e.target.files);

      setFiles((prev) => [
        ...prev,
        ...newFiles,
      ]);
    }
  };

  // ==========================================
  // Remove File
  // ==========================================
  const handleRemoveFile = (
    index: number
  ) => {
    setFiles((prev) =>
      prev.filter(
        (_, i) => i !== index
      )
    );
  };

  // ==========================================
  // Cancel
  // ==========================================
  const handleCancel = () => {
    const confirmed =
      window.confirm(
        "คุณต้องการยกเลิกคำร้องนี้ใช่หรือไม่?"
      );

    if (!confirmed) {
      return;
    }

    setFormData({
      issueType: "",
      description: "",
      resolution: "refund",
      bankName: "",
      accountNumber: "",
      accountName: "",
    });

    setFiles([]);

    alert(
      "ยกเลิกคำร้องเรียบร้อยแล้ว"
    );

    // กลับหน้า Review
    if (orderId) {
      router.push(
        `/customer/orders/${orderId}/review`
      );
    } else {
      router.push(
        "/customer/orders"
      );
    }
  };

  // ==========================================
  // Submit
  // ==========================================
  const handleSubmit = async (
    e: FormEvent
  ) => {
    e.preventDefault();

    if (!orderId) {
      alert(
        "ไม่พบรหัสคำสั่งซื้อ"
      );
      return;
    }

    if (!orderData) {
      alert(
        "ไม่พบข้อมูลคำสั่งซื้อ"
      );
      return;
    }

    if (!formData.issueType) {
      alert(
        "กรุณาเลือกประเภทปัญหา"
      );
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        order_id: orderId,

        shop_id:
          orderData.shop_id,

        customer_id:
          orderData.customer_id,

        issue_type:
          formData.issueType,

        description:
          formData.description,

        resolution:
          formData.resolution,

        bank_name:
          formData.bankName,

        account_number:
          formData.accountNumber,

        account_name:
          formData.accountName,

        files: files.map(
          (file) => ({
            name: file.name,
            size: file.size,
            type: file.type,
          })
        ),
      };

      console.log(
        "📤 Report / Refund Payload:",
        payload
      );

      /*
       * =================================================
       * ตรงนี้เอาไว้เชื่อม API สำหรับส่งคำร้องจริง
       *
       * ตัวอย่าง:
       *
       * const res = await fetch(
       *   "http://localhost:5000/api/customer/report",
       *   {
       *     method: "POST",
       *     headers: {
       *       "Content-Type":
       *         "application/json",
       *     },
       *     body: JSON.stringify(payload),
       *   }
       * );
       *
       * =================================================
       */

      alert(
        "ส่งคำร้องขอคืนเงิน/แจ้งปัญหาเรียบร้อยแล้ว"
      );

      router.push(
        "/customer/orders"
      );
    } catch (err) {
      console.error(
        "❌ Submit Report Error:",
        err
      );

      alert(
        "ไม่สามารถส่งคำร้องได้"
      );
    } finally {
      setSubmitting(false);
    }
  };

  // ==========================================
  // Loading
  // ==========================================
  if (loadingOrder) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] font-sans">

        {/* Navbar */}
        <header className="bg-white border-b border-slate-200/80 sticky top-0 z-30">

          <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">

            <div className="flex items-center gap-3">

              <Link
                href="/customer/orders"
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs px-3.5 py-2 rounded-xl transition"
              >
                ← คำสั่งซื้อของฉัน
              </Link>

              <h1 className="font-bold text-lg text-slate-900">
                รายงานปัญหา / ขอคืนเงิน
              </h1>

            </div>

          </div>

        </header>

        <main className="max-w-3xl mx-auto px-6 py-20">

          <div className="text-center">

            <div className="w-7 h-7 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto" />

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

        {/* Navbar */}
        <header className="bg-white border-b border-slate-200/80 sticky top-0 z-30">

          <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">

            <div className="flex items-center gap-3">

              <Link
                href="/customer/orders"
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs px-3.5 py-2 rounded-xl transition"
              >
                ← คำสั่งซื้อของฉัน
              </Link>

              <h1 className="font-bold text-lg text-slate-900">
                รายงานปัญหา / ขอคืนเงิน
              </h1>

            </div>

            {orderId &&
              orderId !== "undefined" && (
                <span className="text-xs text-slate-400 font-mono">
                  Order #{orderId.slice(0, 8)}
                </span>
              )}

          </div>

        </header>

        <main className="max-w-3xl mx-auto px-6 py-10">

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-10">

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
                onClick={() =>
                  router.back()
                }
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

      {/* ==========================================
          Navbar
      ========================================== */}
      <header className="bg-white border-b border-slate-200/80 sticky top-0 z-30">

        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">

          <div className="flex items-center gap-3">

            <Link
              href="/customer/orders"
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs px-3.5 py-2 rounded-xl transition"
            >
              ← คำสั่งซื้อของฉัน
            </Link>

            <h1 className="font-bold text-lg text-slate-900">
              รายงานปัญหา / ขอคืนเงิน
            </h1>

          </div>

          {orderId &&
            orderId !== "undefined" && (
              <span className="text-xs text-slate-400 font-mono">
                Order #{orderId.slice(0, 8)}
              </span>
            )}

        </div>

      </header>

      {/* ==========================================
          Main
      ========================================== */}
      <main className="max-w-3xl mx-auto px-6 py-6">

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-10">

          {/* ==========================================
              Title
          ========================================== */}
          <div className="mb-8">

            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1 flex items-center gap-2">
              คำร้องขอคืนเงิน / ร้องเรียน 🛒
            </h2>

            <div className="w-full bg-gray-100 h-1.5 rounded-full mt-4 overflow-hidden">

              <div className="bg-blue-600 h-full w-2/3 transition-all duration-300" />

            </div>

          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-8"
          >

            {/* ==========================================
                1. ข้อมูลคำสั่งซื้อ
            ========================================== */}
            <section className="space-y-4">

              <h2 className="text-base font-semibold text-gray-900 border-b pb-2">
                ข้อมูลคำสั่งซื้อ
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                {/* Order ID */}
                <div>

                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    หมายเลขคำสั่งซื้อ
                  </label>

                  <div className="w-full rounded-lg border border-gray-200 bg-gray-100 px-3 py-2 text-sm text-gray-500 cursor-not-allowed">

                    #
                    {orderData?.id
                      ? orderData.id.slice(
                        0,
                        8
                      )
                      : orderId
                        ? orderId.slice(
                          0,
                          8
                        )
                        : "-"}

                  </div>

                </div>

                {/* Shop Name */}
                <div>

                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ชื่อร้านค้า
                  </label>

                  <div className="w-full rounded-lg border border-gray-200 bg-gray-100 px-3 py-2 text-sm text-gray-500 cursor-not-allowed truncate">

                    {orderData
                      ?.print_shop
                      ?.shop_name ||
                      "-"}

                  </div>

                </div>

              </div>

            </section>

            {/* ==========================================
                2. รายละเอียดปัญหา
            ========================================== */}
            <section className="space-y-4">

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
                  value={
                    formData.issueType
                  }
                  onChange={
                    handleInputChange
                  }
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 bg-white"
                >

                  <option
                    value=""
                    disabled
                  >
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
                  value={
                    formData.description
                  }
                  onChange={
                    handleInputChange
                  }
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
                />

              </div>

            </section>

            {/* ==========================================
                3. หลักฐาน
            ========================================== */}
            <section className="space-y-4">

              <h2 className="text-base font-semibold text-gray-900 border-b pb-2">
                หลักฐาน
              </h2>

              <p className="text-xs text-gray-500">
                แนบรูปถ่าย หรือ ไฟล์ที่มีปัญหา (JPG, PNG, PDF)
              </p>

              <div className="flex flex-wrap items-center gap-4">

                {files.map(
                  (file, idx) => (
                    <div
                      key={idx}
                      className="relative w-28 h-24 rounded-lg border border-gray-200 bg-gray-50 flex flex-col items-center justify-center p-2 text-center"
                    >

                      <span className="text-xs font-medium text-gray-700 truncate w-full">
                        {file.name}
                      </span>

                      <span className="text-[10px] text-gray-400 mt-1">
                        {(
                          file.size /
                          1024
                        ).toFixed(0)}{" "}
                        KB
                      </span>

                      <button
                        type="button"
                        onClick={() =>
                          handleRemoveFile(
                            idx
                          )
                        }
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs shadow hover:bg-red-600 transition-colors"
                      >
                        ×
                      </button>

                    </div>
                  )
                )}

                <label className="w-28 h-24 rounded-lg border-2 border-dashed border-blue-200 hover:border-blue-500 bg-blue-50/50 hover:bg-blue-50 flex flex-col items-center justify-center cursor-pointer transition-all text-blue-600 text-xs font-medium gap-1">

                  <span className="text-xl">
                    +
                  </span>

                  <span>
                    แนบไฟล์เพิ่ม
                  </span>

                  <input
                    type="file"
                    multiple
                    accept="image/*,.pdf"
                    onChange={
                      handleFileUpload
                    }
                    className="hidden"
                  />

                </label>

              </div>

            </section>

            {/* ==========================================
                4. ความต้องการ
            ========================================== */}
            <section className="space-y-4">

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
                    onChange={
                      handleInputChange
                    }
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
                    onChange={
                      handleInputChange
                    }
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

                  <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-200 grid grid-cols-1 sm:grid-cols-3 gap-4">

                    {/* Bank */}
                    <div>

                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        ธนาคาร
                      </label>

                      <input
                        type="text"
                        name="bankName"
                        placeholder="เช่น กสิกรไทย"
                        value={
                          formData.bankName
                        }
                        onChange={
                          handleInputChange
                        }
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
                        value={
                          formData.accountNumber
                        }
                        onChange={
                          handleInputChange
                        }
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
                        value={
                          formData.accountName
                        }
                        onChange={
                          handleInputChange
                        }
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
              <button
                type="button"
                onClick={
                  handleCancel
                }
                className="w-full sm:w-1/2 bg-white hover:bg-gray-50 text-gray-700 font-medium py-3 rounded-xl transition-all border border-gray-300 active:scale-[0.99]"
              >
                ยกเลิกคำร้อง
              </button>

              {/* Submit */}
              <button
                type="submit"
                disabled={
                  submitting
                }
                className="w-full sm:w-1/2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-xl transition-all shadow-md shadow-blue-500/10 active:scale-[0.99] disabled:bg-gray-400"
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
