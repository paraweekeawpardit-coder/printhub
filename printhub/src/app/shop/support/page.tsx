"use client";

import React, { useEffect, useState } from "react";
import { ArrowLeft, Headset } from "lucide-react";
import { useRouter } from "next/navigation";
import ChatBox from "@/component/ChatBox"; // เรียกใช้ ChatBox Component หลัก
import ShopNavbar from "@/component/shop/navbar"; // 👈 นำเข้า Navbar ของฝั่งร้านค้า
import { supabase } from "@/config/supabase";

export default function ShopSupportPage() {
  const router = useRouter();
  const [shopId, setShopId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // ดึงข้อมูล Shop ID / User ID ของร้านค้า
  useEffect(() => {
    const fetchShopSession = async () => {
      try {
        // 1. ลองดึงจาก localStorage
        const storedShopId =
          localStorage.getItem("shop_id") ||
          localStorage.getItem("shopId") ||
          localStorage.getItem("user_id");

        if (storedShopId) {
          setShopId(storedShopId);
          setLoading(false);
          return;
        }

        // 2. แกะจาก object 'shop' หรือ 'user'
        const shopStr = localStorage.getItem("shop") || localStorage.getItem("user");
        if (shopStr) {
          const parsed = JSON.parse(shopStr);
          const actualShopId = parsed.shop_id || parsed.id || parsed.shop?.id;
          if (actualShopId) {
            setShopId(String(actualShopId));
            setLoading(false);
            return;
          }
        }

        // 3. สำรอง: ดึงจาก Supabase Auth Session
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setShopId(user.id);
        } else {
          setShopId("guest_shop");
        }
      } catch (error) {
        console.error("Error fetching shop session:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchShopSession();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <p className="text-sm text-slate-400">กำลังโหลดห้องแชต...</p>
      </div>
    );
  }

  // สร้าง roomId เฉพาะของร้านค้านี้สำหรับแชตกับ Admin
  const roomId = `support_shop_${shopId}`;

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      {/* 🟢 แสดง Navbar ของฝั่งร้านค้า */}
      <ShopNavbar />

      {/* ส่วนเนื้อหาแชต */}
      <div className="flex-1 p-4 sm:p-6 flex justify-center items-center">
        <div className="w-full max-w-5xl bg-white rounded-3xl shadow-sm border border-slate-200/80 flex flex-col h-[720px] overflow-hidden">
          
          {/* Header แชตฝั่งร้านค้า */}
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.back()}
                className="p-2.5 hover:bg-slate-100 text-slate-600 rounded-full transition cursor-pointer"
              >
                <ArrowLeft size={18} />
              </button>

              <div className="w-10 h-10 rounded-full bg-[#001B3A] text-white flex items-center justify-center font-bold">
                <Headset size={20} />
              </div>

              <div>
                <h2 className="font-semibold text-slate-800 text-base leading-tight">
                  PrintHub Support (ศูนย์ช่วยเหลือร้านค้า)
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  ติดต่อเจ้าหน้าที่ / แจ้งปัญหาการรับงานพิมพ์
                </p>
              </div>
            </div>

            <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-xs font-medium rounded-full border border-emerald-200">
              เจ้าหน้าที่พร้อมให้บริการ
            </span>
          </div>

          {/* Chat Box ฝั่งร้านค้า (ส่ง role="shop") */}
          <div className="flex-1 flex flex-col min-h-0 bg-white">
            <ChatBox roomId={roomId} role="shop" />
          </div>

        </div>
      </div>
    </div>
  );
}