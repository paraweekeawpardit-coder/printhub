"use client";

import React, { useEffect, useState } from "react";
import { ArrowLeft, Headset } from "lucide-react";
import { useRouter } from "next/navigation";
import ChatBox from "@/component/ChatBox";
import NavBar from "@/component/customer/NavBar";
import { supabase } from "@/config/supabase";

export default function CustomerSupportPage() {
  const router = useRouter();
  const [customerId, setCustomerId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomerSession = async () => {
      try {
        setLoading(true);
        let activeCustId: string | null = null;

        if (typeof window !== "undefined") {
          // 1. ดึง ID จาก localStorage (ที่เก็บบันทึกไว้ตอน Login)
          activeCustId =
            localStorage.getItem("customer_id") ||
            localStorage.getItem("id") ||
            localStorage.getItem("userId");

          // 2. ถ้าไม่มี ID ให้ลองค้นจาก contact/email ใน localStorage
          const storedContact =
            localStorage.getItem("user_email") ||
            localStorage.getItem("contact") ||
            localStorage.getItem("email");

          if (!activeCustId && storedContact) {
            const { data } = await supabase
              .from("customer")
              .select("id")
              .eq("contact", storedContact)
              .maybeSingle();

            if (data?.id) {
              activeCustId = data.id;
            }
          }
        }

        // 3. ถ้าดึงจาก Supabase Auth ได้
        if (!activeCustId) {
          const { data: authData } = await supabase.auth.getUser();
          if (authData?.user) {
            activeCustId = authData.user.id;
          }
        }

        setCustomerId(activeCustId);
      } catch (error) {
        console.error("Error fetching customer session:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomerSession();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <p className="text-sm text-slate-400">กำลังโหลดห้องแชต...</p>
      </div>
    );
  }

  // หากไม่ได้ล็อกอินจริงๆ ให้แจ้งเตือนไปหน้าเข้าสู่ระบบ
  if (!customerId) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center gap-3">
        <p className="text-sm text-slate-600">ไม่พบข้อมูลผู้ใช้ กรุณาเข้าสู่ระบบก่อนใช้งาน</p>
        <button
          onClick={() => router.push("/login")}
          className="px-5 py-2.5 bg-[#001B3A] text-white text-xs font-medium rounded-xl hover:bg-slate-800 transition cursor-pointer"
        >
          ไปหน้าเข้าสู่ระบบ
        </button>
      </div>
    );
  }

  // 🟢 roomId ตรงตาม Pattern ฝั่ง Admin (เช่น support_customer_2878bab1-2fea-496f-8fc1-55fb501483fb)
  const roomId = `support_customer_${customerId}`;

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      <NavBar />

      <div className="flex-1 p-4 sm:p-6 flex justify-center items-center">
        <div className="w-full max-w-5xl bg-white rounded-3xl shadow-sm border border-slate-200/80 flex flex-col h-[700px] overflow-hidden">
          
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
                  PrintHub Support (เจ้าหน้าที่ดูแลระบบ)
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  สอบถามปัญหาการใช้งาน / ร้องเรียน
                </p>
              </div>
            </div>

            <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-xs font-medium rounded-full border border-emerald-200">
              เปิดให้บริการ
            </span>
          </div>

          <div className="flex-1 flex flex-col min-h-0 bg-white">
            <ChatBox
              key={roomId}
              roomId={roomId}
              role="customer"
              currentUserId={customerId}
            />
          </div>

        </div>
      </div>
    </div>
  );
}