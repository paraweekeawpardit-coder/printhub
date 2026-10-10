"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import LoginPanel from "../../component/auth/login-panel";
import LoginForm from "../../component/auth/login-form";
import RegisFormCustomer from "../../component/auth/regis-customer";
import RegisFormShop from "../../component/auth/regis-shop";

export default function Auth() {
  const [isRegis, setRegis] = useState(false);
  const [role, setRole] = useState<"customer" | "shop">("customer");

  return (
    <main className="flex min-h-screen relative">
      <LoginPanel />
      
      <div className="flex flex-1 flex-col justify-center items-center bg-white px-8 relative">
        {/* ปุ่มกดกลับหน้า Landing Page (มุมขวาบน) */}
        <div className="absolute top-6 right-8">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-900 transition-colors py-1.5 px-3 rounded-full hover:bg-slate-100"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            กลับหน้าหลัก
          </Link>
        </div>

        <div className="w-full max-w-md">
          {isRegis && (
            <div className="mb-8 flex rounded-full bg-gray-100 p-1">
              <button
                onClick={() => setRole("customer")}
                className={`flex-1 rounded-full py-2.5 text-sm font-medium transition-all ${
                  role === "customer"
                    ? "bg-white text-blue-600 shadow"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Customer
              </button>
              
              <button
                onClick={() => setRole("shop")}
                className={`flex-1 rounded-full py-2.5 text-sm font-medium transition-all ${
                  role === "shop"
                    ? "bg-white text-blue-600 shadow"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Shop
              </button>
            </div>
          )}

          {!isRegis ? (
            <LoginForm setRegis={setRegis} />
          ) : role === "customer" ? (
            <RegisFormCustomer setRegis={setRegis} />
          ) : (
            <RegisFormShop setRegis={setRegis} />
          )}
        </div>
      </div>
    </main>
  );
}