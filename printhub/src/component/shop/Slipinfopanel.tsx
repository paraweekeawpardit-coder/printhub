"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Loader2, AlertTriangle } from "lucide-react";
import { formatThaiDateTime } from "../../lib/Datetime";

const rawApiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const API_URL = `${rawApiUrl.replace(/\/+$/, "")}/api`;

interface SlipData {
  customer_name: string;
  uploaded_at: string | null;
  amount: number | null;
  order_no: number | null;
  payment_ref: string;
}

interface SlipInfoResponse {
  ok: boolean;
  error?: string;
  slip?: SlipData;
}

function Row({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="flex items-start justify-between gap-4 py-1.5 text-sm">
      <span className="text-slate-500 shrink-0">{label}</span>
      <span className="font-medium text-slate-800 text-right break-all">{value || "-"}</span>
    </div>
  );
}

// แสดงข้อมูลการโอนจากฐานข้อมูล — ใส่ไว้ใน modal ตรวจสลิป (mount ตอน modal เปิด)
export default function SlipInfoPanel({ orderId }: { orderId: string }) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<SlipInfoResponse | null>(null);

  useEffect(() => {
    let cancelled = false;
    const shopId =
      typeof window !== "undefined"
        ? localStorage.getItem("shop_id") || localStorage.getItem("id")
        : null;
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

    setLoading(true);
    axios
      .get<SlipInfoResponse>(`${API_URL}/shop/orders/${orderId}/slip-info`, {
        params: shopId ? { shop_id: shopId } : undefined,
        headers: { ...(shopId ? { shop_id: shopId } : {}), ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      })
      .then((r) => !cancelled && setData(r.data))
      .catch(() => !cancelled && setData({ ok: false, error: "ดึงข้อมูลจากสลิปไม่สำเร็จ" }))
      .finally(() => !cancelled && setLoading(false));

    return () => {
      cancelled = true;
    };
  }, [orderId]);

  if (loading) {
    return (
      <div className="flex items-center gap-2 px-4 py-3 text-sm text-slate-500">
        <Loader2 size={16} className="animate-spin" /> กำลังโหลดข้อมูลการโอน...
      </div>
    );
  }

  if (!data?.ok || !data.slip) {
    return (
      <div className="mx-4 my-3 flex items-start gap-2 rounded-xl bg-amber-50 px-3.5 py-3 text-sm text-amber-700">
        <AlertTriangle size={16} className="mt-0.5 shrink-0" />
        <span>{data?.error || "ไม่พบข้อมูลการโอน กรุณาตรวจสอบจากรูปสลิปด้วยตนเอง"}</span>
      </div>
    );
  }

  const s = data.slip;

  return (
    <div className="mx-4 my-3 rounded-xl border border-slate-200 bg-white px-4 py-2 divide-y divide-slate-100">
      <div className="py-1.5">
        <Row label="ชื่อผู้โอน" value={s.customer_name} />
        <Row label="เลขที่ออเดอร์" value={s.order_no !== null ? `#${s.order_no}` : null} />
      </div>
      <div className="py-1.5">
        <Row label="วันเวลาที่อัปโหลดสลิป" value={formatThaiDateTime(s.uploaded_at)} />
        <Row label="รหัสรายการชำระเงิน" value={s.payment_ref} />
        <Row label="ยอดชำระ" value={s.amount !== null ? `฿${s.amount.toLocaleString()}` : null} />
      </div>
    </div>
  );
}