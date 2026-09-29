"use client";

import React from "react";
import { CheckCircle2 } from "lucide-react";
import ShopCard, { Shop } from "../../component/admin/ShopCard";

interface PendingShopsTabProps {
  shops: Shop[];
  onVerify: (shop_id: string | number, action: "approve" | "reject") => void;
  onSelectShop: (shop: Shop) => void;
}

export default function PendingShopsTab({
  shops,
  onVerify,
  onSelectShop,
}: PendingShopsTabProps) {
  if (shops.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-12 text-center border border-dashed border-slate-300">
        <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 size={32} />
        </div>
        <h3 className="text-lg font-semibold text-slate-700">
          ไม่มีคำขอสมัครใหม่
        </h3>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {shops.map((shop, i) => (
        <ShopCard
          key={shop.id || (shop as any)._id || i}
          shop={shop}
          onVerify={onVerify}
          onSelectShop={onSelectShop}
        />
      ))}
    </div>
  );
}