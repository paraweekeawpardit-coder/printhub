import { MessageCircle, ExternalLink, Download } from "lucide-react";
import CustomerBadge from "./customer-badge";
import OrderActions, { OrderStatus } from "./order-action";
import { useRouter } from "next/navigation";

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
};

type Props = {
  order: OrderDetail;
  onClick?: () => void;
  onUpdateStatus?: (orderId: string, newStatus: OrderStatus) => void;
  onChatClick?: (orderId: string) => void;
  disabled?: boolean;
};

const STATUS_CONFIG: Record<
  string,
  { dot: string; text: string; bg: string }
> = {
  รอการดำเนินงาน: {
    dot: "bg-yellow-500 animate-pulse",
    text: "text-amber-800",
    bg: "bg-amber-100",
  },
  กำลังพิมพ์: {
    dot: "bg-blue-400 animate-pulse",
    text: "text-blue-500 font-semibold",
    bg: "bg-blue-50",
  },
  พิมพ์เสร็จสิ้น: {
    dot: "bg-blue-500",
    text: "text-blue-700",
    bg: "bg-blue-500/10",
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
  onChatClick,
  disabled = false,
}: Props) {
  const router = useRouter();
  const statusConfig = STATUS_CONFIG[order.status] ?? FALLBACK_STATUS;
  const items = order.items ?? [];

  const isDisabledFile =
    order.status === "รอการดำเนินงาน" ||
    order.status === "ยกเลิกการพิมพ์";

  const handleDownloadFile = async (
    e: React.MouseEvent,
    fileUrl: string,
    fileName: string
  ) => {
    e.stopPropagation();
    if (isDisabledFile) return;

    try {
      const response = await fetch(fileUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName || "download-file";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed, fallbacking to direct URL:", error);
      window.open(fileUrl, "_self");
    }
  };

  return (
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
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${statusConfig.bg} ${statusConfig.text}`}
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
            </span>
            <h3 className="text-xl font-black text-slate-900 tracking-tight leading-none mt-0.5">
              #{order.order_no ?? order.order_id.slice(0, 8)}
            </h3>
          </div>

          <CustomerBadge name={order.customer_name} />
        </div>

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
              ))
            ) : (
              <p className="text-xs text-slate-400 py-3 text-center">
                ไม่มีรายการสินค้า
              </p>
            )}
          </div>
        </div>

        {/* Chat Action */}
        <button
          type="button"
          disabled={disabled}
          onClick={handleGoToChat}
          className={`mt-3 inline-flex items-center gap-1.5 text-xs font-semibold ${
            disabled
              ? "text-slate-400 cursor-not-allowed"
              : "text-slate-600 hover:text-blue-600 transition-colors cursor-pointer"
          }`}
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
            disabled={disabled}
            onUpdateStatus={(newStatus) => {
              if (disabled) return;
              onUpdateStatus?.(order.order_id, newStatus);
            }}
          />
        </div>
      </div>
    </div>
  );
}