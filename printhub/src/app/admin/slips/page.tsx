"use client";

import { useState } from "react";

// ประเภทข้อมูลตามตารางใน Database
interface SlipTransaction {
  id: string;
  order_id: string;
  amount: number;
  sender: string;
  receiver: string;
  slip_url: string | null;
  platform_fee: number;
  shop_income: number;
  payment_date: string;
  status?: "pending" | "approved" | "rejected";
}

// Mock Data อ้างอิงจากโครงสร้างตาราง
const MOCK_SLIPS: SlipTransaction[] = [
  {
    id: "a1b2c3d4-e5f6-7890-abcd-111111111111",
    order_id: "bd330d30-5f0a-4aaa-86d4-a92fbece81a9",
    amount: 1500.0,
    sender: "af9b9b2b-0697-46ec-a301-f67123456789",
    receiver: "eaf4885b-750b-416e-b075-b99876543210",
    slip_url: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=600",
    platform_fee: 75.0,
    shop_income: 1425.0,
    payment_date: "2026-08-25 14:20:05",
    status: "pending",
  },
  {
    id: "b2c3d4e5-f6a7-8901-bcde-222222222222",
    order_id: "0d8dd81e-16e0-4f70-8802-410512345678",
    amount: 3200.0,
    sender: "c4d5282c-42a8-46bf-9728-3b1234567890",
    receiver: "8546de40-9eac-4a3c-9850-a12345678901",
    slip_url: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=600",
    platform_fee: 160.0,
    shop_income: 3040.0,
    payment_date: "2026-08-25 13:10:42",
    status: "pending",
  },
  {
    id: "c3d4e5f6-a7b8-9012-cdef-333333333333",
    order_id: "129474d8-b546-4c9e-8895-6e9876543210",
    amount: 450.0,
    sender: "9b981e06-f29d-4ac6-8a28-5f1234567890",
    receiver: "a48af620-476b-423d-86f5-412345678901",
    slip_url: null,
    platform_fee: 22.5,
    shop_income: 427.5,
    payment_date: "2026-08-25 11:05:18",
    status: "pending",
  },
];

export default function VerifySlipPage() {
  const [slips, setSlips] = useState<SlipTransaction[]>(MOCK_SLIPS);
  const [search, setSearch] = useState("");
  const [selectedSlip, setSelectedSlip] = useState<SlipTransaction | null>(null);

  // คำนวณสรุปยอดรวม
  const totalAmount = slips.reduce((sum, s) => sum + s.amount, 0);
  const totalPlatformFee = slips.reduce((sum, s) => sum + s.platform_fee, 0);
  const totalShopIncome = slips.reduce((sum, s) => sum + s.shop_income, 0);

  // กรองข้อมูลด้วย Order ID หรือ Sender UUID
  const filteredSlips = slips.filter(
    (item) =>
      item.order_id.toLowerCase().includes(search.toLowerCase()) ||
      item.sender.toLowerCase().includes(search.toLowerCase()) ||
      item.id.toLowerCase().includes(search.toLowerCase())
  );

  const handleStatusChange = (id: string, newStatus: "approved" | "rejected") => {
    setSlips((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
    );
    if (selectedSlip && selectedSlip.id === id) {
      setSelectedSlip((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 p-4 sm:p-8 font-sans text-slate-800">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              💳 ตรวจสอบสลิปการโอนเงิน
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              ตรวจสอบหลักฐานการชำระเงิน คำนวณค่าธรรมเนียมแพลตฟอร์ม และรายได้ร้านค้า
            </p>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">ยอดรับชำระรวม (Amount)</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">
              ฿{totalAmount.toLocaleString("th-TH", { minimumFractionDigits: 2 })}
            </h3>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-indigo-100 shadow-sm bg-indigo-50/30">
            <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">ค่าธรรมเนียม (Platform Fee)</p>
            <h3 className="text-2xl font-bold text-indigo-700 mt-1">
              ฿{totalPlatformFee.toLocaleString("th-TH", { minimumFractionDigits: 2 })}
            </h3>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-sm bg-emerald-50/30">
            <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">รายได้ร้านค้า (Shop Income)</p>
            <h3 className="text-2xl font-bold text-emerald-700 mt-1">
              ฿{totalShopIncome.toLocaleString("th-TH", { minimumFractionDigits: 2 })}
            </h3>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex justify-between items-center">
          <input
            type="text"
            placeholder="ค้นหา Order ID, Transaction ID หรือ Sender..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-96 px-4 py-2 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
          <span className="text-xs text-slate-400 hidden sm:inline">
            แสดง {filteredSlips.length} จาก {slips.length} รายการ
          </span>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="py-4 px-4">Order / Transaction ID</th>
                  <th className="py-4 px-4">ผู้โอน / ผู้รับ</th>
                  <th className="py-4 px-4 text-right">ยอดเงิน (Amount)</th>
                  <th className="py-4 px-4 text-right">ค่าธรรมเนียม</th>
                  <th className="py-4 px-4 text-right">รายได้ร้านค้า</th>
                  <th className="py-4 px-4 text-center">สลิป</th>
                  <th className="py-4 px-4 text-center">สถานะ</th>
                  <th className="py-4 px-4 text-center">การจัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredSlips.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                    {/* Order & ID */}
                    <td className="py-4 px-4">
                      <div className="font-mono font-medium text-slate-900">
                        {item.order_id.substring(0, 13)}...
                      </div>
                      <div className="text-xs text-slate-400 font-mono mt-0.5">
                        ID: {item.id.substring(0, 8)}
                      </div>
                    </td>

                    {/* Sender & Receiver */}
                    <td className="py-4 px-4">
                      <div className="text-xs font-mono text-slate-600">
                        <span className="text-slate-400">จาก:</span> {item.sender.substring(0, 8)}...
                      </div>
                      <div className="text-xs font-mono text-slate-600 mt-0.5">
                        <span className="text-slate-400">ถึง:</span> {item.receiver.substring(0, 8)}...
                      </div>
                    </td>

                    {/* Amount */}
                    <td className="py-4 px-4 text-right font-semibold text-slate-900">
                      ฿{item.amount.toLocaleString("th-TH", { minimumFractionDigits: 2 })}
                    </td>

                    {/* Platform Fee */}
                    <td className="py-4 px-4 text-right text-xs text-slate-500 font-mono">
                      ฿{item.platform_fee.toLocaleString("th-TH", { minimumFractionDigits: 2 })}
                    </td>

                    {/* Shop Income */}
                    <td className="py-4 px-4 text-right font-medium text-emerald-600 font-mono">
                      ฿{item.shop_income.toLocaleString("th-TH", { minimumFractionDigits: 2 })}
                    </td>

                    {/* Slip URL Button */}
                    <td className="py-4 px-4 text-center">
                      {item.slip_url ? (
                        <button
                          onClick={() => setSelectedSlip(item)}
                          className="px-2.5 py-1.5 rounded-lg text-xs font-medium bg-blue-50 text-blue-600 hover:bg-blue-100 transition-all inline-flex items-center gap-1"
                        >
                          📄 ตรวจสลิป
                        </button>
                      ) : (
                        <span className="text-xs text-slate-400">ไม่มีสลิป</span>
                      )}
                    </td>

                    {/* Status */}
                    <td className="py-4 px-4 text-center">
                      {item.status === "approved" && (
                        <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                          อนุมัติแล้ว
                        </span>
                      )}
                      {item.status === "rejected" && (
                        <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-rose-50 text-rose-700 border border-rose-200">
                          ปฏิเสธ
                        </span>
                      )}
                      {item.status === "pending" && (
                        <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200 animate-pulse">
                          รอตรวจสอบ
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => handleStatusChange(item.id, "approved")}
                          title="อนุมัติ"
                          className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white transition-all flex items-center justify-center font-bold text-xs"
                        >
                          ✓
                        </button>
                        <button
                          onClick={() => handleStatusChange(item.id, "rejected")}
                          title="ปฏิเสธ"
                          className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white transition-all flex items-center justify-center font-bold text-xs"
                        >
                          ✕
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal ขยายสลิปและตรวจสอบรายละเอียด */}
        {selectedSlip && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-100 space-y-4">
              <div className="flex justify-between items-center border-b pb-3">
                <h3 className="font-bold text-slate-900">ตรวจสอบสลิปโอนเงิน</h3>
                <button
                  onClick={() => setSelectedSlip(null)}
                  className="text-slate-400 hover:text-slate-600 text-lg font-bold"
                >
                  ✕
                </button>
              </div>

              {/* รูปสลิป */}
              {selectedSlip.slip_url && (
                <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-center">
                  <img
                    src={selectedSlip.slip_url}
                    alt="สลิปการโอนเงิน"
                    className="max-h-80 w-auto object-contain"
                  />
                </div>
              )}

              {/* รายละเอียดการเงิน */}
              <div className="space-y-2 bg-slate-50 p-4 rounded-xl text-xs space-y-1.5 border border-slate-100">
                <div className="flex justify-between">
                  <span className="text-slate-500">Order ID:</span>
                  <span className="font-mono text-slate-800 font-medium">{selectedSlip.order_id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">ยอดโอนเงิน:</span>
                  <span className="font-bold text-slate-900 text-sm">
                    ฿{selectedSlip.amount.toLocaleString("th-TH", { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">ค่าธรรมเนียมแพลตฟอร์ม:</span>
                  <span className="font-mono text-slate-700">
                    ฿{selectedSlip.platform_fee.toLocaleString("th-TH", { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">รายได้สุทธิร้านค้า:</span>
                  <span className="font-mono text-emerald-600 font-bold">
                    ฿{selectedSlip.shop_income.toLocaleString("th-TH", { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between pt-1 border-t border-slate-200">
                  <span className="text-slate-500">เวลาที่ทำรายการ:</span>
                  <span className="text-slate-600">{selectedSlip.payment_date}</span>
                </div>
              </div>

              {/* ปุ่มอนุมัติ / ปฏิเสธใน Modal */}
              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => handleStatusChange(selectedSlip.id, "rejected")}
                  className="flex-1 py-2.5 rounded-xl border border-rose-200 bg-rose-50 text-rose-700 font-medium text-xs hover:bg-rose-100 transition-all"
                >
                  ปฏิเสธสลิป
                </button>
                <button
                  onClick={() => handleStatusChange(selectedSlip.id, "approved")}
                  className="flex-1 py-2.5 rounded-xl bg-emerald-600 text-white font-medium text-xs hover:bg-emerald-700 shadow-sm transition-all"
                >
                  อนุมัติสลิปนี้
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </main>
  );
}