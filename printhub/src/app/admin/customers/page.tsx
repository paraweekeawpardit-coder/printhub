"use client";

import { useState, useEffect } from "react";

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  created_at: string;
}

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);

  useEffect(() => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/admin";
    fetch(`${API_URL}/customers`)
      .then((res) => res.json())
      .then((data) => setCustomers(Array.isArray(data) ? data : []))
      .catch(() => setCustomers([]));
  }, []);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">รายชื่อลูกค้าทั้งหมดในระบบ</h1>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100 text-gray-600 text-sm">
            <tr>
              <th className="p-4">ชื่อลูกค้า</th>
              <th className="p-4">อีเมล</th>
              <th className="p-4">เบอร์โทรศัพท์</th>
              <th className="p-4">วันที่สมัคร</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm">
            {customers.map((customer) => (
              <tr key={customer.id} className="hover:bg-gray-50">
                <td className="p-4 font-medium text-gray-800">{customer.name}</td>
                <td className="p-4 text-gray-600">{customer.email}</td>
                <td className="p-4 text-gray-600">{customer.phone || "-"}</td>
                <td className="p-4 text-gray-500">{customer.created_at}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}