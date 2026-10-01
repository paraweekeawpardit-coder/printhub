"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { User } from "lucide-react";

interface Notification {
  _id: string;
  title: string;
  message: string;
  createdAt: string;
  isRead: boolean;
}

export default function AdminNavbar() {
  const pathname = usePathname();
  const router = useRouter();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);

  // State สำหรับเก็บข้อมูลโปรไฟล์แอดมิน
  const [adminName, setAdminName] = useState<string>("Admin");
  const [adminAvatar, setAdminAvatar] = useState<string>("");

  // 1. ถ้าอยู่ที่หน้า Login ให้ซ่อน Navbar ทันที
  if (pathname === "/admin/login") {
    return null;
  }

  // โหลดข้อมูลแอดมินจาก localStorage
  const loadUserData = () => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        if (parsed.name) setAdminName(parsed.name);
        if (parsed.avatar) setAdminAvatar(parsed.avatar);
      } catch (e) {
        console.error("Error parsing user data", e);
      }
    } else {
      setAdminName("Admin");
      setAdminAvatar("");
    }
  };

  useEffect(() => {
    loadUserData();

    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    let queryParam = "";

    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        if (parsed.id) {
          queryParam = `?id=${parsed.id}`;
        } else if (parsed.email) {
          queryParam = `?email=${parsed.email}`;
        }
      } catch (e) {}
    }

    // ดึงข้อมูลโปรไฟล์ล่าสุดโดยระบุ queryParam
    if (token && queryParam) {
      fetch(`http://localhost:5000/api/admin/profile${queryParam}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => {
          if (!res.ok) throw new Error("Unauthorized");
          return res.json();
        })
        .then((data) => {
          if (data && data.name) {
            setAdminName(data.name);
            setAdminAvatar(data.avatar || "");

            const currentUser = JSON.parse(
              localStorage.getItem("user") || "{}",
            );
            localStorage.setItem(
              "user",
              JSON.stringify({
                ...currentUser,
                name: data.name,
                avatar: data.avatar || "",
              }),
            );
          }
        })
        .catch((err) => console.error("Error fetching layout profile:", err));
    }

    // ฟัง Event เมื่อมีการอัปเดตข้อมูลโปรไฟล์หรือเข้าสู่ระบบใหม่
    window.addEventListener("userProfileUpdated", loadUserData);
    return () => {
      window.removeEventListener("userProfileUpdated", loadUserData);
    };
  }, [pathname]);

  const fetchNotifications = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/api/admin/notifications", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        setNotifications(data);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [pathname]);

  const handleLogout = async () => {
    try {
      setShowProfileMenu(false);
      const token = localStorage.getItem("token");

      if (token) {
        await fetch("http://localhost:5000/api/admin/logout", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }).catch((err) => console.error("Logout API warning:", err));
      }
    } catch (error) {
      console.error("Error during logout:", error);
    } finally {
      // เคลียร์ Storage ทั้งหมด
      localStorage.removeItem("token");
      localStorage.removeItem("admin_token");
      localStorage.removeItem("user");
      sessionStorage.clear();

      // สั่งรีไดเรกต์และรีเฟรช State ทั้งหมด
      window.location.href = "/admin/login";
    }
  };

  const navItems = [
    { name: "แดชบอร์ด", path: "/admin" },
    { name: "ร้านค้า", path: "/admin/shops" },
    { name: "รายงาน", path: "/admin/reports" },
    { name: "สลิป", path: "/admin/slips" },
  ];

  const hasUnread = notifications.some((n) => !n.isRead);

  return (
    <nav className="sticky top-0 z-50 flex h-14 w-full items-center justify-between bg-slate-900 px-7 shadow-sm">
      {/* Brand Logo */}
      <Link
        href="/admin"
        className="flex items-center gap-2.5 text-white hover:opacity-90 transition-opacity"
      >
        <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
          <path d="M19 8H5c-1.66 0-3 1.34-3 3v6h4v4h12v-4h4v-6c0-1.66-1.34-3-3-3zm-3 11H8v-5h8v5zm3-7c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm-1-9H6v4h12V3z" />
        </svg>
        <span className="text-base font-bold tracking-tight">
          PrintHub Admin
        </span>
      </Link>

      {/* Nav Links */}
      <div className="flex h-full items-center gap-6">
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link
              key={item.name}
              href={item.path}
              className={`relative flex h-full items-center text-sm font-medium transition-colors ${
                isActive
                  ? "text-white font-semibold"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {item.name}
              {isActive && (
                <span className="absolute bottom-0 left-0 right-0 h-[2.5px] rounded-t-sm bg-sky-400" />
              )}
            </Link>
          );
        })}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        {/* Notification Button */}
        <div className="relative">
          <button
            className="relative flex h-8 w-8 items-center justify-center rounded-md text-slate-400 transition-all hover:bg-white/10 hover:text-white cursor-pointer"
            aria-label="Notifications"
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfileMenu(false);
              if (!showNotifications) fetchNotifications();
            }}
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.8"
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
            {hasUnread && (
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500" />
            )}
          </button>

          {/* Notification Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 top-11 w-64 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-lg z-50">
              <div className="border-b border-slate-100 px-4 py-2.5 text-xs font-bold text-slate-500">
                การแจ้งเตือน
              </div>
              <div className="max-h-60 overflow-y-auto">
                {loading ? (
                  <div className="p-4 text-center text-xs text-slate-400">
                    กำลังโหลด...
                  </div>
                ) : notifications.length === 0 ? (
                  <div className="p-4 text-center text-xs text-slate-400">
                    ไม่มีการแจ้งเตือนใหม่
                  </div>
                ) : (
                  notifications.map((item) => (
                    <div
                      key={item._id}
                      className={`border-b border-slate-50 p-3 text-xs ${
                        !item.isRead ? "bg-sky-50/60" : ""
                      }`}
                    >
                      <p className="font-semibold text-slate-800">
                        {item.title}
                      </p>
                      <p className="mt-0.5 text-slate-500">{item.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Profile Button & Name */}
        <div className="relative">
          <button
            className="flex items-center gap-2.5 p-1 rounded-full hover:bg-white/10 transition-colors cursor-pointer focus:outline-none"
            onClick={() => {
              setShowProfileMenu(!showProfileMenu);
              setShowNotifications(false);
            }}
          >
            <span className="hidden lg:block text-xs font-semibold text-slate-200 pl-1">
              {adminName}
            </span>

            {/* รูปโปรไฟล์แบบสะอาด ไม่ตัดไอคอนเล็กๆ ด้านล่าง */}
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sky-500 to-blue-700 flex items-center justify-center text-white text-xs font-bold overflow-hidden shrink-0">
              {adminAvatar ? (
                <img
                  src={adminAvatar}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                adminName.charAt(0).toUpperCase()
              )}
            </div>
          </button>

          {/* Profile Dropdown */}
          {showProfileMenu && (
            <div className="absolute right-0 top-11 w-44 overflow-hidden rounded-lg border border-slate-200 bg-white py-1 shadow-lg z-50">
              <Link
                href="/admin/profile"
                className="block px-4 py-2 text-xs text-slate-700 hover:bg-slate-50"
                onClick={() => setShowProfileMenu(false)}
              >
                โปรไฟล์แอดมิน
              </Link>
              <div className="my-1 border-t border-slate-100" />
              <button
                className="block w-full px-4 py-2 text-left text-xs text-red-600 hover:bg-red-50 cursor-pointer"
                onClick={handleLogout}
              >
                ออกจากระบบ
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
