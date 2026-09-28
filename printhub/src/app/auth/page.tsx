"use client";

import { useState } from "react";
import LoginPanel from "../../component/auth/login-panel";
import LoginForm from "../../component/auth/login-form";
import RegisFormCustomer from "../../component/auth/regis-customer";
import RegisFormShop from "../../component/auth/regis-shop";

export default function Auth() {
  const [isRegis, setRegis] = useState(false);
  const [role, setRole] = useState<"customer" | "shop">("customer");

  return (
    <main className="flex min-h-screen">
      <LoginPanel />
      <div className="flex flex-1 items-center justify-center bg-white px-8">
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