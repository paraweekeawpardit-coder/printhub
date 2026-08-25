"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Printer, CircleUserRound } from "lucide-react";

export default function ShopNavbar() {
  const [username, setUsername] = useState("");
  const [shopId, setShopId] = useState("");

  useEffect(() => {
    const name = "PrintHub ลาดกระบัง";

    const id = "2a1e1ec6-1abd-49df-bcfe-cc66e64521d9";
    setShopId(id);

    if (name) setUsername(name);
    if (id) setShopId(id);

    console.log("username:", name);
    console.log("shop_id:", id);
  }, []);

  return (
    <nav className="bg-white h-20 flex items-center px-10 border-b border-slate-200">
      {/* Logo */}
      <div className="flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-lg bg-[#0F2942] flex items-center justify-center">
          <Printer size={18} className="text-white" />
        </div>

        <span className="text-[#0F2942] font-bold text-2xl tracking-tight">
          PrintHub
        </span>
      </div>

      {/* Menu */}
      <div className="flex gap-10 mx-auto text-[15px] font-medium">
        <Link
          href="/shop"
          className="text-slate-500 hover:text-[#0F2942] transition-colors"
        >
          Home
        </Link>

        <Link
          href={shopId ? `/shop/order/${shopId}` : "/shop"}
          className="text-slate-500 hover:text-[#0F2942] transition-colors"
        >
          Order
        </Link>

        <Link
          href="/shop/chat"
          className="text-slate-500 hover:text-[#0F2942] transition-colors"
        >
          Chat
        </Link>
      </div>

      {/* User */}
      <div className="flex items-center gap-2.5">
        <span className="text-sm font-medium text-slate-600">
          {username || "Shop"}
        </span>

        <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center">
          <CircleUserRound
            size={20}
            className="text-slate-500"
          />
        </div>
      </div>
    </nav>
  );
}