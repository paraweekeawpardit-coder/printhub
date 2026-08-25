import { Eye } from "lucide-react";
import CustomerBadge from "./customer-badge";
import OrderActions from "./order-action";

export type OrderDetail = {
  order_id: string;
  date: string;
  customer_name: string;
  customer_avatar: string;
  qty: number;
  type: string;
  detail: string;
  file_name: string;
  file_url: string;
  status: string;
  price: number;
  amount: number;
};

type Props = {
  order: OrderDetail;
};

export default function OrderDetailCard({ order }: Props) {
  return (
    <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-semibold text-[#0F2942]">
            Order #{order.order_id.slice(0, 8)}
          </h3>
          <p className="mt-0.5 text-xs text-slate-400">{order.date}</p>
        </div>

        <CustomerBadge
          name={order.customer_name}
          avatar={order.customer_avatar}
        />
      </div>

      <div className="mt-6 space-y-6">
        <div>
          <p className="text-sm font-semibold text-[#0F2942]">{order.type}</p>

          <div className="mt-2 space-y-1 text-xs text-slate-500">
            <p>จำนวน: {order.qty}</p>
            <p>รายละเอียด: {order.detail}</p>
            <p>รูปแบบพิมพ์: {order.type}</p>

            <p className="flex items-center gap-1.5">
              ไฟล์งาน:
              <span>{order.file_name}</span>
              {order.file_url && (
                <a
                  href={order.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sky-600 hover:text-sky-700"
                >
                  <Eye size={12} />
                  ดูไฟล์
                </a>
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between border-t pt-4">
          <div>
            <p className="text-xs text-slate-400">ราคาต่อชิ้น</p>
            <p className="font-semibold text-[#0F2942]">฿ {order.price}</p>
          </div>

          <div className="text-right">
            <p className="text-xs text-slate-400">ยอดรวม</p>
            <p className="text-lg font-bold text-[#0F2942]">฿ {order.amount}</p>
          </div>
        </div>

        <OrderActions status={order.status} />
      </div>
    </div>
  );
}