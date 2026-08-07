"use client";

import { useState } from "react";
import LoginPanel from "../../component/auth/login-panel";
import LoginFormCustomer from "../../component/auth/login-customer";
import RegisFormCustomer from "../../component/auth/regis-customer";
import LoginFormShop from "../../component/auth/regis-shop";
import RegisFormShop from "../../component/auth/regis-shop";

export default function Auth() {
  const [isRegis, setRegis] = useState(false);
  const [role, setRole] = useState<"customer" | "shop">("customer");

  return (
    <main className="flex min-h-screen">
      {/* Left Panel */}
      <LoginPanel />

      {/* Right Side */}
      <div className="flex flex-1 items-center justify-center bg-white px-8">
        <div className="w-full max-w-md">
          {/* Role Switch */}
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

          {/* Form */}
          {role === "customer" ? (
            isRegis ? (
              <RegisFormCustomer setRegis={setRegis} />
            ) : (
              <LoginFormCustomer setRegis={setRegis} />
            )
          ) : isRegis ? (
            <RegisFormShop setRegis={setRegis} />
          ) : (
            <LoginFormShop setRegis={setRegis} />
          )}
        </div>
      </div>
    </main>
  );
}
