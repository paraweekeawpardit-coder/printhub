"use client";

import { useState, useMemo } from "react";

export interface PayoutItem {
  id: string; // payment_id
  order_id?: string;
  order_no?: string | number;
  amount: number;
  platform_fee?: number;
  shop_income?: number;
  payment_date?: string;
  payout_date?: string; // วันที่โอนเงินจริง
  created_at?: string;
  payout_status?: string;
  payout_slip_url?: string;
  shop?: {
    id: string;
    shop_name: string;
    phone?: string;
    bank_account?: {
      bank_name?: string;
      account_number?: string;
      account_name?: string;
    } | any;
  };
}

interface PayoutsTableProps {
  payouts: PayoutItem[];
  loading: boolean;
  activeTab: "PENDING" | "PAID";
  onSelectPayout: (item: PayoutItem) => void;
  onViewSlip?: (url: string) => void;
  formatDate: (dateString?: string) => string;
}

export default function PayoutsTable({
  payouts,
  loading,
  activeTab,
  onSelectPayout,
  onViewSlip,
  formatDate,
}: PayoutsTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  
  // State สลับมุมมอง: "SINGLE" = รายออเดอร์, "GROUPED" = รวมตามร้านค้า
  const [viewMode, setViewMode] = useState<"SINGLE" | "GROUPED">("GROUPED");

  // คำนวณ SLA ความเร่งด่วน
  const getPayoutUrgency = (dateString?: string) => {
    if (!dateString) return { label: "ปกติ", color: "text-slate-500 bg-slate-100" };
    
    const payoutDate = new Date(dateString).getTime();
    const now = Date.now();
    const diffHours = (now - payoutDate) / (1000 * 60 * 60);

    if (diffHours >= 48) {
      return { label: `เกินกำหนด (${Math.floor(diffHours / 24)} วัน)`, color: "text-rose-700 bg-rose-50 border-rose-200" };
    } else if (diffHours >= 24) {
      return { label: "ครบกำหนดวันนี้", color: "text-amber-700 bg-amber-50 border-amber-200" };
    }
    return { label: "อยู่ในกำหนด", color: "text-emerald-700 bg-emerald-50 border-emerald-200" };
  };

  // Helper ดึงข้อมูลธนาคารแบบปลอดภัย
  const getBankDetail = (shop?: PayoutItem["shop"]) => {
    if (!shop?.bank_account) return null;
    const acc = Array.isArray(shop.bank_account) ? shop.bank_account[0] : shop.bank_account;
    if (!acc?.account_number) return null;
    return {
      bank_name: acc.bank_name || "ธนาคาร",
      account_number: acc.account_number,
      account_name: acc.account_name || "",
    };
  };

  const handleCopyBankAcc = (accNo?: string, id?: string) => {
    if (!accNo || !id) return;
    navigator.clipboard.writeText(accNo);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // กรองรายการตามคำค้นหา
  const filteredPayouts = useMemo(() => {
    if (!searchTerm.trim()) return payouts;
    const term = searchTerm.trim().toLowerCase().replace(/^#/, "");

    return payouts.filter((item) => {
      const orderNo = item.order_no ? String(item.order_no).toLowerCase() : "";
      const shopName = (item.shop?.shop_name || "").toLowerCase();
      const phone = (item.shop?.phone || "").toLowerCase();
      const bank = getBankDetail(item.shop);
      const accNo = (bank?.account_number || "").toLowerCase();

      return (
        orderNo.includes(term) ||
        shopName.includes(term) ||
        phone.includes(term) ||
        accNo.includes(term)
      );
    });
  }, [payouts, searchTerm]);

  // จัดกลุ่มข้อมูลตามร้านค้า (Group by Shop)
  const groupedPayouts = useMemo(() => {
    const groups: { [key: string]: { shopName: string; shop: PayoutItem["shop"]; totalAmount: number; items: PayoutItem[] } } = {};

    filteredPayouts.forEach((item) => {
      const shopId = item.shop?.id || item.shop?.shop_name || "unknown";
      if (!groups[shopId]) {
        groups[shopId] = {
          shopName: item.shop?.shop_name || "ไม่ระบุชื่อร้าน",
          shop: item.shop,
          totalAmount: 0,
          items: [],
        };
      }
      const amount = Number(item.shop_income || item.amount || 0);
      groups[shopId].totalAmount += amount;
      groups[shopId].items.push(item);
    });

    return Object.values(groups);
  }, [filteredPayouts]);

  return (
    <div className="space-y-4 font-sans">
      {/* Search Bar & View Mode Toggle */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="relative w-full sm:w-80">
          <svg
            className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="ค้นหา Order ID (#198), ชื่อร้านค้า, หรือเลขบัญชี..."
            className="w-full pl-10 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-800"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold cursor-pointer"
            >
              ✕
            </button>
          )}
        </div>

        {/* ปุ่มสลับรูปแบบการแสดงผล */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-medium">รูปแบบแสดงผล:</span>
          <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setViewMode("GROUPED")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                viewMode === "GROUPED"
                  ? "bg-white text-blue-600 shadow-xs"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              รวมตามร้านค้า ({groupedPayouts.length} ร้าน)
            </button>
            <button
              onClick={() => setViewMode("SINGLE")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                viewMode === "SINGLE"
                  ? "bg-white text-blue-600 shadow-xs"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              แยกรายออเดอร์ ({filteredPayouts.length} รายการ)
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          {viewMode === "GROUPED" ? (
            /* ================= โหมด 1: รวมตามร้านค้า (Grouped Payout) ================= */
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="py-4 px-4 whitespace-nowrap min-w-[280px]">ร้านค้า / บัญชีโอนเงิน</th>
                  <th className="py-4 px-4 whitespace-nowrap min-w-[130px]">จำนวนออเดอร์</th>
                  <th className="py-4 px-4 min-w-[250px]">รายการออเดอร์</th>
                  <th className="py-4 px-4 whitespace-nowrap min-w-[160px]">ยอดเงินรวมที่ต้องโอน</th>
                  {activeTab === "PAID" ? (
                    <>
                      <th className="py-4 px-4 whitespace-nowrap min-w-[160px]">วันที่โอนเงินสำเร็จ</th>
                      <th className="py-4 px-4 text-center whitespace-nowrap min-w-[120px]">สถานะ</th>
                      <th className="py-4 px-4 text-center whitespace-nowrap min-w-[120px]">จัดการ</th>
                    </>
                  ) : (
                    <th className="py-4 px-4 text-center whitespace-nowrap min-w-[180px]">จัดการ</th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={activeTab === "PAID" ? 7 : 5} className="py-12 text-center text-slate-400">
                      กำลังโหลดข้อมูลการโอนเงิน...
                    </td>
                  </tr>
                ) : groupedPayouts.length > 0 ? (
                  groupedPayouts.map((group, idx) => {
                    const bankAcc = getBankDetail(group.shop);
                    const orderNos = group.items
                      .map((i) => `#${String(i.order_no || i.id.slice(0, 8)).replace(/^#+/, "")}`)
                      .join(", ");

                    const aggregatedItem: PayoutItem = {
                      ...group.items[0],
                      id: group.items[0].id,
                      shop_income: group.totalAmount,
                      amount: group.totalAmount,
                    };

                    const completedPayoutDate = group.items[0]?.payout_date || group.items[0]?.payment_date;
                    const slipUrl = group.items.find((i) => i.payout_slip_url)?.payout_slip_url;

                    return (
                      <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                        {/* ร้านค้า & ข้อมูลบัญชีธนาคาร */}
                        <td className="py-4 px-4">
                          <div className="font-bold text-slate-900 text-sm mb-1">
                            {group.shopName}
                          </div>
                          {bankAcc ? (
                            <div className="space-y-1 text-xs text-slate-600">
                              <div className="flex items-center gap-2 whitespace-nowrap">
                                <span className="font-semibold text-slate-700">{bankAcc.bank_name}:</span>
                                <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded text-slate-800 font-bold">
                                  {bankAcc.account_number}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleCopyBankAcc(bankAcc.account_number, `group-${idx}`)}
                                  className="text-[10px] text-blue-600 hover:bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200 transition-all cursor-pointer font-medium shrink-0"
                                >
                                  {copiedId === `group-${idx}` ? "คัดลอกแล้ว!" : "คัดลอก"}
                                </button>
                              </div>
                              {bankAcc.account_name && (
                                <div className="text-slate-500 text-[11px] whitespace-nowrap">
                                  <span className="font-medium text-slate-600">ชื่อบัญชี:</span> {bankAcc.account_name}
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="text-xs text-rose-500 italic mt-0.5">ยังไม่ผูกบัญชีธนาคาร</div>
                          )}
                        </td>

                        {/* จำนวนออเดอร์ */}
                        <td className="py-4 px-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                            {group.items.length} ออเดอร์
                          </span>
                        </td>

                        {/* รายชื่อเลขออเดอร์ */}
                        <td className="py-4 px-4 font-mono text-xs text-slate-600 leading-relaxed break-words max-w-md">
                          {orderNos}
                        </td>

                        {/* ยอดเงินรวม */}
                        <td className="py-4 px-4 whitespace-nowrap font-bold text-emerald-600 text-base">
                          ฿{group.totalAmount.toLocaleString("th-TH", { minimumFractionDigits: 2 })}
                        </td>

                        {/* แท็บ PAID: แยกแสดง วันที่สำเร็จ + สถานะ + ปุ่มจัดการ */}
                        {activeTab === "PAID" ? (
                          <>
                            <td className="py-4 px-4 whitespace-nowrap text-xs text-slate-600 font-medium">
                              {formatDate(completedPayoutDate)}
                            </td>
                            <td className="py-4 px-4 whitespace-nowrap text-center">
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                                โอนเงินสำเร็จ
                              </span>
                            </td>
                            <td className="py-4 px-4 whitespace-nowrap text-center">
                              {slipUrl && onViewSlip ? (
                                <button
                                  onClick={() => onViewSlip(slipUrl)}
                                  className="px-3 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-50 border border-blue-200 rounded-lg transition-all cursor-pointer"
                                >
                                  ดูสลิปโอน
                                </button>
                              ) : (
                                <span className="text-slate-400 text-xs">-</span>
                              )}
                            </td>
                          </>
                        ) : (
                          /* แท็บ PENDING: คอลัมน์จัดการอย่างเดียว */
                          <td className="py-4 px-4 whitespace-nowrap text-center">
                            <button
                              onClick={() => onSelectPayout(aggregatedItem)}
                              className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-xs transition-all active:scale-95 cursor-pointer"
                            >
                              โอนรวมให้ร้านนี้ (฿{group.totalAmount.toLocaleString("th-TH", { minimumFractionDigits: 2 })})
                            </button>
                          </td>
                        )}
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={activeTab === "PAID" ? 7 : 5} className="py-12 text-center text-slate-400">
                      {searchTerm
                        ? `ไม่พบรายการโอนเงินที่ตรงกับ "${searchTerm}"`
                        : "ไม่มีรายการที่รอโอนเงินในขณะนี้"}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          ) : (
            /* ================= โหมด 2: แยกรายออเดอร์ (Single View) ================= */
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="py-4 px-4 whitespace-nowrap">เลขที่ออเดอร์</th>
                  <th className="py-4 px-4 whitespace-nowrap min-w-[280px]">ร้านค้า / บัญชีโอนเงิน</th>
                  <th className="py-4 px-4 whitespace-nowrap">จำนวนเงินที่ต้องโอน</th>
                  <th className="py-4 px-4 whitespace-nowrap">วันที่พร้อมโอน</th>
                  {activeTab === "PAID" ? (
                    <>
                      <th className="py-4 px-4 whitespace-nowrap">วันที่โอนเงินสำเร็จ</th>
                      <th className="py-4 px-4 text-center whitespace-nowrap">สถานะ</th>
                      <th className="py-4 px-4 text-center whitespace-nowrap">จัดการ</th>
                    </>
                  ) : (
                    <>
                      <th className="py-4 px-4 whitespace-nowrap">สถานะกำหนดการ</th>
                      <th className="py-4 px-4 text-center whitespace-nowrap">จัดการ</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={activeTab === "PAID" ? 7 : 6} className="py-12 text-center text-slate-400">
                      กำลังโหลดข้อมูลการโอนเงิน...
                    </td>
                  </tr>
                ) : filteredPayouts.length > 0 ? (
                  filteredPayouts.map((item) => {
                    const displayOrderNo = item.order_no
                      ? `#${String(item.order_no).replace(/^#+/, "")}`
                      : "-";

                    const urgency = getPayoutUrgency(item.payment_date || item.created_at);
                    const bankAcc = getBankDetail(item.shop);

                    const readyDate = item.payment_date || item.created_at;
                    const completedPayoutDate = item.payout_date || item.payment_date;

                    return (
                      <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-4 px-4 font-mono font-bold text-blue-600 text-xs whitespace-nowrap">
                          {displayOrderNo}
                        </td>

                        <td className="py-4 px-4">
                          <div className="font-bold text-slate-800 text-xs mb-1">
                            {item.shop?.shop_name || "-"}
                          </div>
                          {bankAcc ? (
                            <div className="space-y-1 text-xs text-slate-600">
                              <div className="flex items-center gap-2 whitespace-nowrap">
                                <span className="font-semibold">{bankAcc.bank_name}:</span>
                                <span className="font-mono bg-slate-100 px-1 py-0.5 rounded font-bold">{bankAcc.account_number}</span>
                                <button
                                  type="button"
                                  onClick={() => handleCopyBankAcc(bankAcc.account_number, item.id)}
                                  className="text-[10px] text-blue-600 hover:bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200 transition-all cursor-pointer font-medium shrink-0"
                                >
                                  {copiedId === item.id ? "คัดลอกแล้ว!" : "คัดลอก"}
                                </button>
                              </div>
                              {bankAcc.account_name && (
                                <div className="text-slate-500 text-[11px] whitespace-nowrap">
                                  <span className="font-medium text-slate-600">ชื่อบัญชี:</span> {bankAcc.account_name}
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="text-xs text-rose-500 italic">ยังไม่ผูกบัญชีธนาคาร</div>
                          )}
                        </td>

                        <td className="py-4 px-4 whitespace-nowrap font-bold text-emerald-600 text-base">
                          ฿{Number(item.shop_income || item.amount || 0).toLocaleString("th-TH", { minimumFractionDigits: 2 })}
                        </td>

                        <td className="py-4 px-4 whitespace-nowrap text-xs text-slate-500">
                          {formatDate(readyDate)}
                        </td>

                        {/* แท็บ PAID vs PENDING ใน Single View */}
                        {activeTab === "PAID" ? (
                          <>
                            <td className="py-4 px-4 whitespace-nowrap text-xs text-slate-600 font-medium">
                              {formatDate(completedPayoutDate)}
                            </td>
                            <td className="py-4 px-4 whitespace-nowrap text-center">
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                                โอนเงินสำเร็จ
                              </span>
                            </td>
                            <td className="py-4 px-4 whitespace-nowrap text-center">
                              {item.payout_slip_url && onViewSlip ? (
                                <button
                                  onClick={() => onViewSlip(item.payout_slip_url!)}
                                  className="px-3 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-50 border border-blue-200 rounded-lg transition-all cursor-pointer"
                                >
                                  ดูสลิปโอน
                                </button>
                              ) : (
                                <span className="text-slate-400 text-xs">-</span>
                              )}
                            </td>
                          </>
                        ) : (
                          <>
                            <td className="py-4 px-4 whitespace-nowrap">
                              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${urgency.color}`}>
                                {urgency.label}
                              </span>
                            </td>
                            <td className="py-4 px-4 whitespace-nowrap text-center">
                              <button
                                onClick={() => onSelectPayout(item)}
                                className="px-4 py-1.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-xs transition-all active:scale-95 cursor-pointer"
                              >
                                โอนเงินให้ร้าน
                              </button>
                            </td>
                          </>
                        )}
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={activeTab === "PAID" ? 7 : 6} className="py-12 text-center text-slate-400">
                      {searchTerm
                        ? `ไม่พบรายการโอนเงินที่ตรงกับ "${searchTerm}"`
                        : "ไม่มีรายการที่รอโอนเงินในขณะนี้"}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}