"use client";

import { useState, useEffect } from "react";

export default function AdminProfilePage() {
  const [profile, setProfile] = useState({
    name: "Admin User",
    email: "admin@printhub.com",
    role: "Super Admin",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // ดึงข้อมูลโปรไฟล์จาก API
    fetch("http://localhost:5000/api/admin/profile", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.name) setProfile(data);
      })
      .catch((err) => console.error("Error fetching profile:", err));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await fetch("http://localhost:5000/api/admin/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(profile),
      });
      alert("บันทึกข้อมูลสำเร็จ");
    } catch (error) {
      alert("เกิดข้อผิดพลาดในการบันทึก");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 max-w-2xl mx-auto">
      <h1 className="text-xl font-bold mb-4 text-slate-800">โปรไฟล์แอดมิน</h1>
      <form onSubmit={handleSave} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">ชื่อ-นามสกุล</label>
          <input
            type="text"
            className="w-full border border-slate-300 rounded-lg p-2 text-sm text-slate-800"
            value={profile.name}
            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">อีเมล</label>
          <input
            type="email"
            className="w-full border border-slate-300 rounded-lg p-2 text-sm text-slate-800"
            value={profile.email}
            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">ตำแหน่ง</label>
          <input
            type="text"
            disabled
            className="w-full border border-slate-200 bg-slate-100 rounded-lg p-2 text-sm text-slate-500"
            value={profile.role}
          />
        </div>
        <button
          type="submit"
          disabled={saving}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition"
        >
          {saving ? "กำลังบันทึก..." : "บันทึกข้อมูล"}
        </button>
      </form>
    </div>
  );
}