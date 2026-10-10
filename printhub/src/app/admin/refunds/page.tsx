"use client";

import { useState, useEffect, useCallback, ChangeEvent, FormEvent } from "react";

interface PaymentDetail {
  id?: string;
  slip_url?: string;
  amount?: number;
  status?: string;
  payment_date?: string;
}

interface RefundItem {
  id: string;
  order_no?: number;
  total_price?: number;
  total_amount?: number;
  order_date?: string;
  created_at?: string;
  status?: string; // สถานะออเดอร์ หรือ สถานะคืนเงิน
  refund_status?: string; // e.g. 'PENDING', 'REFUNDED'
  refund_slip_url?: string;
  payment_status?: string; // รองรับกรณี backend flatten ฟิลด์ payment
  customer?: {
    id: string;
    first_name?: string;
    last_name?: string;
    name?: string;
    contact?: string;
    bank_account_no?: string;
    bank_name?: string;
  };
  shop?: {
    id?: string;
    shop_name?: string;
  };
  payment?: PaymentDetail | PaymentDetail[];
}

export default function RefundsAdminPage() {
  const [refunds, setRefunds] = useState<RefundItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRefund, setSelectedRefund] = useState<RefundItem | null>(null);
  const [refundSlipUrl, setRefundSlipUrl] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [copiedType, setCopiedType] = useState<"contact" | "amount" | null>(null);
  const [activeTab, setActiveTab] = useState<"PENDING" | "REFUNDED">("PENDING");
  const [viewSlipUrl, setViewSlipUrl] = useState<string | null>(null);

  const [feedbackMessage, setFeedbackMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const rawApiUrl =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/admin";
  const API_URL = rawApiUrl.replace(/\/+$/, "");

  const fetchRefunds = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/refunds`);
      if (!res.ok) throw new Error("Failed to fetch refunds");
      const data = await res.json();
      setRefunds(Array.isArray(data) ? data : []);
      console.log("Fetched refunds successfully:", data);
    } catch (err) {
      console.error("Error fetching refunds:", err);
      setRefunds([]);
    } finally {
      setLoading(false);
    }
  }, [API_URL]);

  useEffect(() => {
    fetchRefunds();
  }, [fetchRefunds]);

  const getOrderAmount = (item: RefundItem) => {
    return Number(item.total_amount || item.total_price || 0);
  };

  const getCustomerName = (item: RefundItem) => {
    if (item.customer?.name) return item.customer.name;
    const firstName = item.customer?.first_name || "";
    const lastName = item.customer?.last_name || "";
    const fullName = `${firstName} ${lastName}`.trim();
    return fullName || "ลูกค้าทั่วไป";
  };

  const getOrderDate = (item: RefundItem) => {
    const rawDate = item.order_date || item.created_at;
    if (!rawDate) return "-";
    return new Date(rawDate).toLocaleDateString("th-TH", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Helper Check: ตรวจสอบสถานะการคืนเงินแบบรัดกุม
  const isRefundCompleted = (item: RefundItem) => {
    // 1. ถ้ามี URL สลิปคืนเงิน ให้ถือว่าคืนเงินแล้วทันที
    if (Boolean(item.refund_slip_url)) return true;

    // รายการคำสถานะที่ถือว่าคืนเงินแล้ว
    const completedKeywords = ["REFUNDED", "REFUND_COMPLETED", "คืนเงินแล้ว", "COMPLETED"];

    // 2. เช็คจาก payment_status ที่แนบมาที่ root object
    const rootPaymentStatus = String(item.payment_status || "").toUpperCase();
    if (completedKeywords.includes(rootPaymentStatus)) return true;

    // 3. เช็คจากกรณี payment เป็น Array
    if (Array.isArray(item.payment)) {
      const hasRefundedInArray = item.payment.some((p) => {
        const pStatus = String(p?.status || "").toUpperCase();
        return completedKeywords.includes(pStatus);
      });
      if (hasRefundedInArray) return true;
    }

    // 4. เช็คจากกรณี payment เป็น Object
    if (item.payment && typeof item.payment === "object" && !Array.isArray(item.payment)) {
      const paymentObj = item.payment as PaymentDetail;
      const pStatus = String(paymentObj?.status || "").toUpperCase();
      if (completedKeywords.includes(pStatus)) return true;
    }

    // 5. เช็คจาก status หรือ refund_status ของออเดอร์
    const statusUpper = String(item.status || "").toUpperCase();
    const refundStatusUpper = String(item.refund_status || "").toUpperCase();

    return (
      completedKeywords.includes(refundStatusUpper) ||
      completedKeywords.includes(statusUpper)
    );
  };

  const handleCopy = (text: string, type: "contact" | "amount") => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setRefundSlipUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleProcessRefund = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedRefund) return;

    setFeedbackMessage(null);

    try {
      setIsProcessing(true);
      const res = await fetch(`${API_URL}/refunds/process`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          order_id: selectedRefund.id,
          refund_slip_url: refundSlipUrl,
          refund_amount: getOrderAmount(selectedRefund),
        }),
      });

      if (!res.ok) throw new Error("Process refund failed");

      setFeedbackMessage({
        type: "success",
        text: "ดำเนินการคืนเงินเรียบร้อยแล้ว",
      });

      setTimeout(() => {
        setSelectedRefund(null);
        setRefundSlipUrl("");
        setFeedbackMessage(null);
        fetchRefunds();
      }, 1500);
    } catch (err) {
      console.error("Refund processing error:", err);
      setFeedbackMessage({
        type: "error",
        text: "เกิดข้อผิดพลาดในการบันทึกข้อมูลการคืนเงิน",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const filteredRefunds = refunds.filter((item) => {
    const completed = isRefundCompleted(item);
    return activeTab === "REFUNDED" ? completed : !completed;
  });

  const completedCount = refunds.filter((item) => isRefundCompleted(item)).length;
  const pendingCount = refunds.length - completedCount;

  return (
    <main className="min-h-screen bg-slate-50 p-4 sm:p-8 font-sans text-slate-800">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              ระบบดำเนินการคืนเงิน (Refunds)
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              จัดการรายการยกเลิกออเดอร์ และตรวจสอบประวัติการโอนเงินคืน
            </p>
          </div>

          {/* แท็บสลับสถานะ */}
          <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setActiveTab("PENDING")}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
                activeTab === "PENDING"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              รอคืนเงิน ({pendingCount})
            </button>
            <button
              onClick={() => setActiveTab("REFUNDED")}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
                activeTab === "REFUNDED"
                  ? "bg-white text-emerald-700 shadow-sm"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              คืนเงินแล้ว ({completedCount})
            </button>
          </div>
        </div>

        {/* Refund Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-slate-500">
              กำลังโหลดรายการ...
            </div>
          ) : filteredRefunds.length === 0 ? (
            <div className="p-12 text-center text-slate-400">
              {activeTab === "PENDING"
                ? "ไม่มีรายการที่รอคืนเงินในขณะนี้"
                : "ยังไม่มีประวัติการคืนเงิน"}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-medium">
                    <th className="p-4">เลขที่ออเดอร์</th>
                    <th className="p-4">ลูกค้า / ช่องทางติดต่อ</th>
                    <th className="p-4">ร้านค้า</th>
                    <th className="p-4">จำนวนเงิน</th>
                    <th className="p-4">วันที่ยกเลิก</th>
                    <th className="p-4 text-center">จัดการ / สถานะ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredRefunds.map((item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      <td className="p-4 font-semibold text-slate-900">
                        #{item.order_no || item.id.slice(0, 8)}
                      </td>
                      <td className="p-4">
                        <p className="font-medium text-slate-800">
                          {getCustomerName(item)}
                        </p>
                        <p className="text-xs text-slate-500">
                          {item.customer?.contact ||
                            item.customer?.bank_account_no ||
                            "ไม่ระบุช่องทางติดต่อ"}
                        </p>
                      </td>
                      <td className="p-4 text-slate-600">
                        {item.shop?.shop_name || "-"}
                      </td>
                      <td className="p-4 font-bold text-emerald-600">
                        ฿{getOrderAmount(item).toLocaleString()}
                      </td>
                      <td className="p-4 text-xs text-slate-500">
                        {getOrderDate(item)}
                      </td>
                      <td className="p-4 text-center">
                        {activeTab === "PENDING" ? (
                          <button
                            onClick={() => setSelectedRefund(item)}
                            className="px-4 py-1.5 bg-blue-600 text-white rounded-xl text-xs font-semibold hover:bg-blue-700 transition-all shadow-sm"
                          >
                            โอนเงินคืน
                          </button>
                        ) : (
                          <div className="flex items-center justify-center gap-2">
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                              คืนเงินแล้ว
                            </span>
                            {item.refund_slip_url && (
                              <button
                                onClick={() =>
                                  setViewSlipUrl(item.refund_slip_url || null)
                                }
                                className="text-xs text-blue-600 hover:underline font-medium"
                              >
                                ดูสลิป
                              </button>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal ดูสลิปการโอนคืน */}
      {viewSlipUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-xl space-y-4 text-center">
            <h3 className="text-md font-bold text-slate-900">
              หลักฐานการโอนเงินคืน
            </h3>
            <div className="border rounded-xl p-2 bg-slate-50 max-h-[60vh] overflow-y-auto">
              <img
                src={viewSlipUrl}
                alt="Refund Slip"
                className="w-full h-auto rounded-lg object-contain mx-auto"
              />
            </div>
            <button
              onClick={() => setViewSlipUrl(null)}
              className="w-full py-2 bg-slate-800 text-white rounded-xl text-xs font-semibold hover:bg-slate-900"
            >
              ปิดหน้าต่าง
            </button>
          </div>
        </div>
      )}

      {/* Modal โอนเงินคืน */}
      {selectedRefund && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="text-lg font-bold text-slate-900">
                ยืนยันการโอนเงินคืน
              </h3>
              <button
                onClick={() => setSelectedRefund(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-3">
              <p className="font-semibold text-slate-800 text-sm border-b pb-2">
                รายละเอียดคำขอคืนเงิน
              </p>

              <div className="flex justify-between items-center">
                <span className="text-slate-500">เลขที่ออเดอร์:</span>
                <span className="font-bold text-slate-900">
                  #{selectedRefund.order_no || selectedRefund.id.slice(0, 8)}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-slate-500">ชื่อลูกค้า:</span>
                <span className="font-medium text-slate-800">
                  {getCustomerName(selectedRefund)}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-slate-500">อีเมล/ติดต่อ:</span>
                <div className="flex items-center gap-1.5">
                  <span className="font-mono text-slate-800">
                    {selectedRefund.customer?.contact || "-"}
                  </span>
                  {selectedRefund.customer?.contact && (
                    <button
                      type="button"
                      onClick={() =>
                        handleCopy(
                          selectedRefund.customer?.contact || "",
                          "contact"
                        )
                      }
                      className="px-2 py-0.5 text-[11px] font-medium text-blue-600 hover:bg-blue-50 border border-blue-200 rounded-md transition-all"
                    >
                      {copiedType === "contact" ? "คัดลอกแล้ว!" : "คัดลอกอีเมล"}
                    </button>
                  )}
                </div>
              </div>

              <div className="pt-2 border-t flex justify-between items-center">
                <span className="text-slate-700 font-semibold text-sm">
                  ยอดเงินที่ต้องคืน:
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-base font-bold text-emerald-600">
                    ฿{getOrderAmount(selectedRefund).toLocaleString()}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      handleCopy(
                        getOrderAmount(selectedRefund).toString(),
                        "amount"
                      )
                    }
                    className="px-2 py-0.5 text-[11px] font-medium text-emerald-700 hover:bg-emerald-100 bg-emerald-50 border border-emerald-200 rounded-md transition-all"
                  >
                    {copiedType === "amount" ? "คัดลอกแล้ว!" : "คัดลอกยอดเงิน"}
                  </button>
                </div>
              </div>
            </div>

            {feedbackMessage && (
              <div
                className={`p-3 rounded-xl text-xs font-medium ${
                  feedbackMessage.type === "success"
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    : "bg-rose-50 text-rose-700 border border-rose-200"
                }`}
              >
                {feedbackMessage.text}
              </div>
            )}

            <form onSubmit={handleProcessRefund} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  แนบไฟล์สลิปการโอนเงินคืน (รูปภาพ)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200 cursor-pointer border border-slate-200 rounded-xl p-1"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  หรือวาง URL สลิปโอนเงิน
                </label>
                <input
                  type="text"
                  placeholder="https://..."
                  value={refundSlipUrl}
                  onChange={(e) => setRefundSlipUrl(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedRefund(null)}
                  className="px-4 py-2 border rounded-xl text-xs text-slate-600 hover:bg-slate-100"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  disabled={isProcessing || !refundSlipUrl}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-semibold hover:bg-emerald-700 disabled:opacity-50 transition-all"
                >
                  {isProcessing ? "กำลังบันทึก..." : "ยืนยันโอนเงินเรียบร้อย"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}