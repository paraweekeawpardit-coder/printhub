"use client";

import { useState, useEffect, useCallback } from "react";

// 🟢 ปรับ Interface ให้ตรงกับโครงสร้างข้อมูลจริงจาก Supabase Backend
interface RefundItem {
  id: string;
  order_no?: number;
  total_price?: number;
  total_amount?: number;
  order_date?: string;
  created_at?: string;
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
  payment?:
    | {
        id: string;
        slip_url?: string;
        amount?: number;
        status?: string;
        payment_date?: string;
      }
    | Array<{
        id: string;
        slip_url?: string;
        amount?: number;
        status?: string;
        payment_date?: string;
      }>;
}

export default function RefundsAdminPage() {
  const [refunds, setRefunds] = useState<RefundItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRefund, setSelectedRefund] = useState<RefundItem | null>(null);
  const [refundSlipUrl, setRefundSlipUrl] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  // 🟢 แก้เป็น Port 5000 ของ Express Backend พร้อมจัดการ Slash ท้าย URL
  const rawApiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/admin";
  const API_URL = rawApiUrl.replace(/\/+$/, "");

  const fetchRefunds = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/refunds`);
      if (!res.ok) throw new Error("Failed to fetch refunds");
      const data = await res.json();
      setRefunds(Array.isArray(data) ? data : []);
    } catch (err) {
      console.warn("Error fetching refunds:", err);
      setRefunds([]);
    } finally {
      setLoading(false);
    }
  }, [API_URL]);

  useEffect(() => {
    fetchRefunds();
  }, [fetchRefunds]);

  // Helper ฟังก์ชันในการดึงราคาออเดอร์
  const getOrderAmount = (item: RefundItem) => {
    return Number(item.total_amount || item.total_price || 0);
  };

  // Helper ฟังก์ชันแสดงชื่อลูกค้า
  const getCustomerName = (item: RefundItem) => {
    if (item.customer?.name) return item.customer.name;
    const firstName = item.customer?.first_name || "";
    const lastName = item.customer?.last_name || "";
    const fullName = `${firstName} ${lastName}`.trim();
    return fullName || "ลูกค้าทั่วไป";
  };

  // Helper ฟังก์ชันแสดงวันที่
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

  const handleProcessRefund = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRefund) return;

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

      alert("ดำเนินการคืนเงินเรียบร้อยแล้ว");
      setSelectedRefund(null);
      setRefundSlipUrl("");
      fetchRefunds();
    } catch (err) {
      console.error(err);
      alert("เกิดข้อผิดพลาดในการคืนเงิน");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 p-4 sm:p-8 font-sans text-slate-800">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              ระบบดำเนินการคืนเงิน (Refunds)
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              จัดการรายการยกเลิกออเดอร์ และโอนเงินคืนให้แก่ลูกค้าภายใน 48 ชั่วโมง
            </p>
          </div>
          <span className="bg-amber-100 text-amber-800 text-xs font-semibold px-3 py-1.5 rounded-full">
            รอคืนเงิน ({refunds.length} รายการ)
          </span>
        </div>

        {/* Refund Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-slate-500">
              กำลังโหลดรายการรอคืนเงิน...
            </div>
          ) : refunds.length === 0 ? (
            <div className="p-12 text-center text-slate-400">
              ไม่มีรายการที่รอคืนเงินในขณะนี้
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
                    <th className="p-4">วันที่ยกเลิก / สั่งซื้อ</th>
                    <th className="p-4 text-center">จัดการ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {refunds.map((item) => (
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
                        <button
                          onClick={() => setSelectedRefund(item)}
                          className="px-4 py-1.5 bg-blue-600 text-white rounded-xl text-xs font-semibold hover:bg-blue-700 transition-all shadow-sm"
                        >
                          โอนเงินคืน
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal โอนเงินคืน */}
      {selectedRefund && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl space-y-4">
            <h3 className="text-lg font-bold text-slate-900">
              ยืนยันการโอนเงินคืน
            </h3>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-sm space-y-1">
              <p>
                <span className="text-slate-500">ออเดอร์:</span> #
                {selectedRefund.order_no || selectedRefund.id}
              </p>
              <p>
                <span className="text-slate-500">ชื่อลูกค้า:</span>{" "}
                {getCustomerName(selectedRefund)}
              </p>
              <p>
                <span className="text-slate-500">ติดต่อ:</span>{" "}
                {selectedRefund.customer?.contact || "-"}
              </p>
              <p className="text-base font-bold text-emerald-600 pt-1">
                ยอดโอนคืน: ฿{getOrderAmount(selectedRefund).toLocaleString()}
              </p>
            </div>

            <form onSubmit={handleProcessRefund} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  URL สลิปการโอนเงินคืน
                </label>
                <input
                  type="text"
                  required
                  placeholder="https://..."
                  value={refundSlipUrl}
                  onChange={(e) => setRefundSlipUrl(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedRefund(null)}
                  className="px-4 py-2 border rounded-xl text-sm text-slate-600 hover:bg-slate-100"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm font-semibold hover:bg-emerald-700 disabled:opacity-50"
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