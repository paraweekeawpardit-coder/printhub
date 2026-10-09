"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Customer {
  id: string;
  name?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  contact?: string;
  created_at?: string;
  created_at_formatted?: string;
}

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/admin";
        const res = await fetch(`${API_URL}/customers`);

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || `ไม่สามารถดึงข้อมูลได้ (Status: ${res.status})`);
        }
        
        const customerList = Array.isArray(data) 
          ? data 
          : Array.isArray(data?.customers) 
          ? data.customers 
          : [];

        setCustomers(customerList);
      } catch (err: any) {
        console.error("Fetch Customers Error:", err);
        setError(err.message || "เกิดข้อผิดพลาดในการโหลดข้อมูล");
        setCustomers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  const formatDate = (dateString?: string) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString("th-TH", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* 🟢 ปุ่มย้อนกลับไปหน้า Home */}
      <div className="mb-4">
        <Link 
          href="/admin" 
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
        >
          <svg 
            className="w-4 h-4" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
          กลับหน้าหลัก
        </Link>
      </div>

      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        รายชื่อลูกค้าทั้งหมดในระบบ
      </h1>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-500 font-medium">
            กำลังโหลดข้อมูลลูกค้า...
          </div>
        ) : error ? (
          <div className="p-12 text-center text-rose-500 font-medium">
            {error}
          </div>
        ) : customers.length === 0 ? (
          <div className="p-12 text-center text-gray-400">
            ยังไม่มีข้อมูลลูกค้าในระบบ
          </div>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100 text-gray-600 text-sm">
              <tr>
                <th className="p-4">ชื่อลูกค้า</th>
                <th className="p-4">อีเมล / ช่องทางติดต่อ</th>
                <th className="p-4">วันที่สมัคร</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {customers.map((customer) => {
                const fullName = customer.name 
                  ? customer.name 
                  : `${customer.first_name || ""} ${customer.last_name || ""}`.trim() || "ไม่ระบุชื่อ";

                const emailOrContact = customer.contact || customer.email || "-";

                return (
                  <tr key={customer.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 font-medium text-gray-800">{fullName}</td>
                    <td className="p-4 text-gray-600">{emailOrContact}</td>
                    <td className="p-4 text-gray-500">
                      {formatDate(customer.created_at || customer.created_at_formatted)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}