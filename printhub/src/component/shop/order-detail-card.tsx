"use client";

<<<<<<< HEAD
import { MessageCircle, ExternalLink, FileText } from "lucide-react";
=======
import { useState } from "react";
import { MessageCircle, ExternalLink, Download, Eye, X, Check, Loader2 } from "lucide-react";
>>>>>>> origin/main
import CustomerBadge from "./customer-badge";
import OrderActions, { OrderStatus } from "./order-action";
import { useRouter, useParams } from "next/navigation";

export type OrderItemDetail = {
  id: string;
  category: string;
  describe?: string;
  file_url: string | null;
  quantity: number;
  unit_price: number;
  subtotal: number;
  page_count: number | null;
};

export type OrderDetail = {
  order_id: string;
  order_no?: number;
  date: string;
  customer_name: string;
  customer_avatar?: string;
  status: OrderStatus | string;
  amount: number;
  items: OrderItemDetail[];
  payment?: {
    id: string;
    slip_url: string | null;
    is_verified: boolean | null;
  } | null;
};

type Props = {
  order: OrderDetail;
  onClick?: () => void;
  onUpdateStatus?: (orderId: string, newStatus: OrderStatus) => void;
  onVerifyPayment?: (orderId: string, isVerified: boolean) => Promise<void>;
  onChatClick?: (orderId: string) => void;
  disabled?: boolean;
};

const STATUS_CONFIG: Record<
  string,
  { dot: string; text: string; bg: string }
> = {
  รอการดำเนินการ: {
    dot: "bg-amber-500 animate-pulse",
    text: "text-amber-700",
    bg: "bg-amber-500/10",
  },
  กำลังพิมพ์: {
    dot: "bg-blue-600 animate-pulse",
    text: "text-blue-700",
    bg: "bg-blue-500/10",
  },
  พิมพ์เสร็จสิ้น: {
    dot: "bg-purple-500",
    text: "text-purple-700",
    bg: "bg-purple-500/10",
  },
  รายการเสร็จสิ้น: {
    dot: "bg-emerald-500",
    text: "text-emerald-700",
    bg: "bg-emerald-500/10",
  },
  ยกเลิกการพิมพ์: {
    dot: "bg-rose-500",
    text: "text-rose-700",
    bg: "bg-rose-500/10",
  },
};

const FALLBACK_STATUS = {
  dot: "bg-slate-400",
  text: "text-slate-600",
  bg: "bg-slate-100",
};

function formatDate(value: string) {
  const d = new Date(value);
  if (isNaN(d.getTime())) return value;
  return d.toLocaleString("th-TH", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function OrderDetailCard({
  order,
  onClick,
  onUpdateStatus,
  onVerifyPayment,
  onChatClick,
  disabled = false,
}: Props) {
  const router = useRouter();
  const params = useParams();
  const shopId = params?.shop_id; // ดึง shop_id จาก URL ปัจจุบัน

  const statusConfig = STATUS_CONFIG[order.status] ?? FALLBACK_STATUS;
  const items = order.items ?? [];

<<<<<<< HEAD
  const handleGoToChat = (e: React.MouseEvent) => {
=======
  const [showSlipModal, setShowSlipModal] = useState<boolean>(false);
  const [verifyingSlip, setVerifyingSlip] = useState<boolean>(false);

  const isVerified = order.payment?.is_verified ?? null;

  const isDisabledFile =
    order.status === "รอการดำเนินงาน" ||
    order.status === "ยกเลิกการพิมพ์";

  const handleDownloadFile = async (
    e: React.MouseEvent,
    fileUrl: string,
    fileName: string
  ) => {
>>>>>>> origin/main
    e.stopPropagation();
    if (disabled) return;

    if (onChatClick) {
      onChatClick(order.order_id);
      return;
    }

    const shopId = localStorage.getItem("shop_id") || "";
    if (shopId && order.order_id) {
      router.push(`/shop/order/${shopId}/chat?order_id=${order.order_id}`);
    } else {
      console.warn("ไม่พบ shop_id ใน localStorage หรือ order_id");
    }
  };

  const handleVerify = async (isApproved: boolean) => {
    if (!onVerifyPayment || verifyingSlip) return;
    setVerifyingSlip(true);
    try {
      await onVerifyPayment(order.order_id, isApproved);
      setShowSlipModal(false);
    } catch (err) {
      console.error("Verify payment error:", err);
    } finally {
      setVerifyingSlip(false);
    }
  };

  return (
<<<<<<< HEAD
    <div
      onClick={() => {
        if (disabled) return;
        onClick?.();
      }}
      className={`group relative flex w-full flex-col justify-between rounded-3xl bg-white p-6 border border-slate-100 shadow-sm transition-all duration-300 ${
        disabled
          ? "opacity-60 cursor-not-allowed"
          : "cursor-pointer hover:shadow-xl hover:shadow-slate-200/50 hover:border-slate-200"
      }`}
    >
      <div>
        {/* Header: Status & Date */}
        <div className="flex items-center justify-between">
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${statusConfig.bg} ${statusConfig.text}`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${statusConfig.dot}`} />
            {order.status || "ไม่ทราบสถานะ"}
          </span>

          <span className="text-[11px] font-medium text-slate-400 tracking-wider">
            {formatDate(order.date)}
          </span>
        </div>

        {/* Order ID & Customer */}
        <div className="mt-4 flex items-center justify-between gap-2">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              ORDER
=======
    <>
      <div
        onClick={onClick}
        className="group relative flex w-full cursor-pointer flex-col justify-between rounded-3xl bg-white p-6 border border-slate-100 shadow-sm transition-all duration-300 hover:shadow-xl hover:shadow-slate-200/50 hover:border-slate-200"
      >
        <div>
          {/* Header: Status & Date */}
          <div className="flex items-center justify-between">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${statusConfig.bg} ${statusConfig.text}`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${statusConfig.dot}`} />
              {order.status || "ไม่ทราบสถานะ"}
>>>>>>> origin/main
            </span>

            <span className="text-[11px] font-medium text-slate-400 tracking-wider">
              {formatDate(order.date)}
            </span>
          </div>

          {/* Order ID & Customer */}
          <div className="mt-4 flex items-center justify-between gap-2">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                ORDER
              </span>
              <h3 className="text-xl font-black text-slate-900 tracking-tight leading-none mt-0.5">
                #{order.order_no ?? order.order_id.slice(0, 8)}
              </h3>
            </div>

            <CustomerBadge name={order.customer_name} />
          </div>

          {/* Slip Status Badge Bar */}
          {order.status === "รอการดำเนินงาน" && (
            <div
              onClick={(e) => e.stopPropagation()}
              className="mt-4 flex items-center justify-between p-2.5 rounded-2xl bg-slate-50 border border-slate-100 text-xs"
            >
              <span className="text-slate-600 font-medium">
                สลิปชำระเงิน:{" "}
                {isVerified === true && (
                  <span className="text-emerald-600 font-semibold">ถูกต้องแล้ว</span>
                )}
                {isVerified === false && (
                  <span className="text-rose-600 font-semibold">สลิปไม่ถูกต้อง</span>
                )}
                {isVerified === null && (
                  <span className="text-amber-600 font-semibold">ยังไม่ได้ตรวจสอบ</span>
                )}
              </span>

              {order.payment?.slip_url ? (
                <button
                  type="button"
                  onClick={() => setShowSlipModal(true)}
                  className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 font-semibold hover:underline"
                >
                  <Eye size={14} /> ตรวจสอบสลิป
                </button>
              ) : (
                <span className="text-slate-400 font-medium">ไม่มีสลิป</span>
              )}
            </div>
          )}

          {/* Items List */}
          <div className="mt-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                รายการ ({items.length})
              </span>
            </div>

            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {items.length > 0 ? (
                items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between gap-3 bg-slate-50/80 rounded-2xl p-3 border border-slate-100/80"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-slate-800 text-sm truncate">
                        {item.category}
                      </p>
                      {item.describe && (
                        <p className="text-xs text-slate-400 truncate leading-relaxed">
                          {item.describe}
                        </p>
                      )}
                      <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-1 flex-wrap">
                        <span>{item.quantity} ชิ้น</span>
                        {item.page_count && <span>· {item.page_count} หน้า</span>}
                        <span>· ฿{item.unit_price.toLocaleString()}/ชิ้น</span>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-1 shrink-0">
                      <span className="text-sm font-bold text-slate-900">
                        ฿{item.subtotal.toLocaleString()}
                      </span>
                      {item.file_url && (
                        <button
                          type="button"
                          disabled={isDisabledFile}
                          onClick={(e) =>
                            handleDownloadFile(
                              e,
                              item.file_url!,
                              `order-${order.order_no ?? "file"}-${item.category}`
                            )
                          }
                          className={`flex items-center gap-1 text-[11px] font-semibold transition-all ${
                            isDisabledFile
                              ? "text-slate-400 opacity-50 cursor-not-allowed"
                              : "text-blue-600 hover:text-blue-700 hover:underline cursor-pointer"
                          }`}
                          title={
                            isDisabledFile
                              ? "ไม่สามารถดาวน์โหลดไฟล์ในสถานะนี้ได้"
                              : "ดาวน์โหลดไฟล์"
                          }
                        >
                          <Download size={12} />
                          ดาวน์โหลด
                        </button>
                      )}
                    </div>
                  </div>
<<<<<<< HEAD

                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <span className="text-sm font-bold text-slate-900">
                      ฿{item.subtotal.toLocaleString()}
                    </span>
                    {item.file_url && (
                      <a
                        href={item.file_url}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:text-blue-700 hover:underline"
                      >
                        <FileText size={12} />
                        ไฟล์
                      </a>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 py-3 text-center">
                ไม่มีรายการสินค้า
              </p>
            )}
=======
                ))
              ) : (
                <p className="text-xs text-slate-400 py-3 text-center">
                  ไม่มีรายการสินค้า
                </p>
              )}
            </div>
>>>>>>> origin/main
          </div>

          {/* Chat Action */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              
              // Path ที่ถูกต้องตาม Folder Structure
              const targetPath = shopId
                ? `/shop/order/${shopId}/chat?orderId=${order.order_id}`
                : `/shop/order/chat?orderId=${order.order_id}`;
                
              router.push(targetPath);
              
              // เรียก prop เดิมไว้ด้วยกรณีมี logic อื่นผูกอยู่
              onChatClick?.(order.order_id);
            }}
            className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-blue-600 transition-colors"
          >
            <MessageCircle size={14} />
            <span>แชทกับลูกค้า</span>
            <ExternalLink size={12} className="opacity-60" />
          </button>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-slate-100">
          <div className="flex items-baseline justify-between mb-4">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              ยอดรวม
            </span>
            <div className="text-right">
              <span className="text-xs font-bold text-slate-900 mr-1">฿</span>
              <span className="text-3xl font-black tracking-tight text-slate-900">
                {order.amount.toLocaleString()}
              </span>
            </div>
          </div>

          <div onClick={(e) => e.stopPropagation()}>
            <OrderActions
              status={order.status}
              isVerified={isVerified}
              onUpdateStatus={(newStatus) =>
                onUpdateStatus?.(order.order_id, newStatus)
              }
            />
          </div>
        </div>
      </div>

      {/* Pop-up Modal รูปภาพสลิป */}
      {showSlipModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200"
          onClick={() => setShowSlipModal(false)}
        >
          <div
            className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl relative flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h4 className="font-bold text-slate-900 text-base">
                หลักฐานการชำระเงิน (Order #{order.order_no ?? order.order_id.slice(0, 8)})
              </h4>
              <button
                type="button"
                onClick={() => setShowSlipModal(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body: รูปสลิป */}
            <div className="p-4 flex items-center justify-center bg-slate-50 max-h-[60vh] overflow-auto">
              {order.payment?.slip_url ? (
                <img
                  src={order.payment.slip_url}
                  alt="สลิปชำระเงิน"
                  className="max-h-[55vh] w-auto object-contain rounded-2xl shadow-md"
                />
              ) : (
                <p className="text-slate-400 text-sm py-10 font-medium">
                  ไม่พบรูปภาพสลิป
                </p>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-100 flex items-center justify-between gap-3 bg-white">
              <button
                type="button"
                onClick={() => setShowSlipModal(false)}
                className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              >
                ปิด
              </button>

              {isVerified === null && (
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleVerify(false)}
                    disabled={verifyingSlip}
                    className="px-3 py-2.5 text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-xl transition-colors disabled:opacity-50"
                  >
                    สลิปไม่ถูกต้อง
                  </button>
                  <button
                    type="button"
                    onClick={() => handleVerify(true)}
                    disabled={verifyingSlip}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors disabled:opacity-50"
                  >
                    {verifyingSlip ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <Check size={16} />
                    )}
                    ยืนยันสลิปถูกต้อง
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}