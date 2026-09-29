"use client";

import { useState } from "react";

export default function AdminSettingsPage() {
  const [siteName, setSiteName] = useState("PrintHub Admin");
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  const handleSave = async () => {
    try {
      await fetch("http://localhost:5000/api/admin/settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ siteName, maintenanceMode }),
      });
      alert("บันทึกการตั้งค่าแล้ว");
    } catch (error) {
      alert("เกิดข้อผิดพลาด");
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 max-w-2xl mx-auto">
      <h1 className="text-xl font-bold mb-4 text-slate-800">ตั้งค่าระบบ</h1>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">ชื่อระบบ</label>
          <input
            type="text"
            className="w-full border border-slate-300 rounded-lg p-2 text-sm text-slate-800"
            value={siteName}
            onChange={(e) => setSiteName(e.target.value)}
          />
        </div>
        <div className="flex items-center justify-between border-t pt-4">
          <div>
            <p className="text-sm font-medium text-slate-700">โหมดปิดปรับปรุงระบบ</p>
            <p className="text-xs text-slate-500">ปิดการใช้งานระบบชั่วคราวสำหรับผู้ใช้ทั่วไป</p>
          </div>
          <input
            type="checkbox"
            className="w-5 h-5"
            checked={maintenanceMode}
            onChange={(e) => setMaintenanceMode(e.target.checked)}
          />
        </div>
        <button
          onClick={handleSave}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition"
        >
          บันทึกการตั้งค่า
        </button>
      </div>
    </div>
  );
}