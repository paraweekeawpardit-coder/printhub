"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import NotificationBell from "@/component/NotificationBell";

export default function AdminNavbar() {
  const pathname = usePathname();

  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showFinanceMenu, setShowFinanceMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const [adminName, setAdminName] = useState<string>("Admin");
  const [adminAvatar, setAdminAvatar] = useState<string>("");
  const [adminId, setAdminId] = useState<string>("admin");

  if (pathname === "/admin/login") {
    return null;
  }

  const loadUserData = () => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        if (parsed.name) setAdminName(parsed.name);
        if (parsed.avatar) setAdminAvatar(parsed.avatar);
        if (parsed.id) setAdminId(parsed.id);
      } catch (e) {
        console.error("Error parsing user data", e);
      }
    } else {
      setAdminName("Admin");
      setAdminAvatar("");
      setAdminId("admin");
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
            if (data.id) setAdminId(data.id);

            const currentUser = JSON.parse(
              localStorage.getItem("user") || "{}"
            );
            localStorage.setItem(
              "user",
              JSON.stringify({
                ...currentUser,
                name: data.name,
                avatar: data.avatar || "",
                id: data.id || currentUser.id,
              })
            );
          }
        })
        .catch((err) => console.error("Error fetching layout profile:", err));
    }

    window.addEventListener("userProfileUpdated", loadUserData);

    return () => {
      window.removeEventListener("userProfileUpdated", loadUserData);
    };
  }, [pathname]);

  const handleLogout = async () => {
    try {
      setShowProfileMenu(false);
      setShowMobileMenu(false);
      const token = localStorage.getItem("token");

      if (token) {
        await fetch("http://localhost:5000/api/admin/logout", {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        }).catch((err) => console.error("Logout API warning:", err));
      }
    } catch (error) {
      console.error("Error during logout:", error);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("admin_token");
      localStorage.removeItem("user");
      sessionStorage.clear();
      window.location.href = "/admin/login";
    }
  };

  const isFinanceActive =
    pathname === "/admin/slips" ||
    pathname === "/admin/refunds" ||
    pathname === "/admin/payouts";

  return (
    <nav className="sticky top-0 z-50 w-full bg-slate-900 shadow-md font-sans">
      <div className="flex h-14 items-center justify-between px-3 sm:px-6 max-w-7xl mx-auto">
        
        {/* Brand Logo */}
        <Link
          href="/admin"
          className="flex items-center gap-2 text-white hover:opacity-90 transition-opacity shrink-0"
        >
          <svg className="h-5 w-5 fill-current text-sky-400 shrink-0" viewBox="0 0 24 24">
            <path d="M19 8H5c-1.66 0-3 1.34-3 3v6h4v4h12v-4h4v-6c0-1.66-1.34-3-3-3zm-3 11H8v-5h8v5zm3-7c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm-1-9H6v4h12V3z" />
          </svg>
          <span className="text-sm sm:text-base font-bold tracking-tight truncate">
            PrintHub Admin
          </span>
        </Link>

        {/* Desktop Nav Links (แสดงผลบนจอ md ขึ้นไป) */}
        <div className="hidden md:flex h-full items-center gap-5 lg:gap-6 mx-4">
          <Link
            href="/admin"
            className={`relative flex h-full items-center text-sm font-medium transition-colors whitespace-nowrap ${
              pathname === "/admin"
                ? "text-white font-semibold"
                : "text-slate-400 hover:text-white"
            }`}
          >
            แดชบอร์ด
            {pathname === "/admin" && (
              <span className="absolute bottom-0 left-0 right-0 h-[2.5px] rounded-t-sm bg-sky-400" />
            )}
          </Link>

          <Link
            href="/admin/shops"
            className={`relative flex h-full items-center text-sm font-medium transition-colors whitespace-nowrap ${
              pathname === "/admin/shops"
                ? "text-white font-semibold"
                : "text-slate-400 hover:text-white"
            }`}
          >
            ร้านค้า
            {pathname === "/admin/shops" && (
              <span className="absolute bottom-0 left-0 right-0 h-[2.5px] rounded-t-sm bg-sky-400" />
            )}
          </Link>

          <Link
            href="/admin/reports"
            className={`relative flex h-full items-center text-sm font-medium transition-colors whitespace-nowrap ${
              pathname === "/admin/reports"
                ? "text-white font-semibold"
                : "text-slate-400 hover:text-white"
            }`}
          >
            รายงานปัญหา
            {pathname === "/admin/reports" && (
              <span className="absolute bottom-0 left-0 right-0 h-[2.5px] rounded-t-sm bg-sky-400" />
            )}
          </Link>

          <Link
            href="/admin/support"
            className={`relative flex h-full items-center gap-1.5 text-sm font-medium transition-colors whitespace-nowrap ${
              pathname === "/admin/support"
                ? "text-white font-semibold"
                : "text-slate-400 hover:text-white"
            }`}
          >
            รับเรื่องช่วยเหลือ
            {pathname === "/admin/support" && (
              <span className="absolute bottom-0 left-0 right-0 h-[2.5px] rounded-t-sm bg-sky-400" />
            )}
          </Link>

          {/* Desktop Finance Dropdown */}
          <div
            className="relative flex h-full items-center cursor-pointer"
            onMouseEnter={() => setShowFinanceMenu(true)}
            onMouseLeave={() => setShowFinanceMenu(false)}
          >
            <button
              className={`flex items-center gap-1 text-sm font-medium transition-colors ${
                isFinanceActive ? "text-white font-semibold" : "text-slate-400 hover:text-white"
              }`}
            >
              การเงิน
              <svg
                className={`w-4 h-4 transition-transform ${showFinanceMenu ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {isFinanceActive && (
              <span className="absolute bottom-0 left-0 right-0 h-[2.5px] rounded-t-sm bg-sky-400" />
            )}

            {showFinanceMenu && (
              <div className="absolute left-0 top-12 w-48 rounded-lg border border-slate-200 bg-white py-1 shadow-lg z-50 text-slate-800">
                <Link
                  href="/admin/slips"
                  className={`block px-4 py-2 text-xs hover:bg-slate-50 ${
                    pathname === "/admin/slips" ? "font-bold text-sky-600 bg-sky-50/50" : ""
                  }`}
                >
                  สลิปโอนเงิน
                </Link>
                <Link
                  href="/admin/refunds"
                  className={`block px-4 py-2 text-xs hover:bg-slate-50 ${
                    pathname === "/admin/refunds" ? "font-bold text-sky-600 bg-sky-50/50" : ""
                  }`}
                >
                  รายการคืนเงินลูกค้า
                </Link>
                <Link
                  href="/admin/payouts"
                  className={`block px-4 py-2 text-xs hover:bg-slate-50 border-t border-slate-100 ${
                    pathname === "/admin/payouts" ? "font-bold text-sky-600 bg-sky-50/50" : ""
                  }`}
                >
                  รายการโอนเงินให้ร้านค้า
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Actions (Notifications, Profile & Mobile Hamburger) */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          {/* Notifications Button */}
          <div className="text-white">
            <NotificationBell userId={adminId} role="admin" />
          </div>

          {/* Profile Button */}
          <div className="relative">
            <button
              className="flex items-center gap-1.5 p-1 rounded-full hover:bg-white/10 transition-colors cursor-pointer focus:outline-none"
              onClick={() => setShowProfileMenu(!showProfileMenu)}
            >
              <span className="hidden lg:block text-xs font-semibold text-slate-200 pl-1">
                {adminName}
              </span>
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-sky-500 to-blue-700 flex items-center justify-center text-white text-xs font-bold overflow-hidden shrink-0">
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

          {/* Mobile Hamburger Button (แสดงเฉพาะจอเล็ก md down) */}
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="md:hidden p-1.5 text-slate-300 hover:text-white rounded-lg focus:outline-none"
            aria-label="Toggle Menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {showMobileMenu ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Navigation Menu */}
      {showMobileMenu && (
        <div className="md:hidden bg-slate-800 border-b border-slate-700 px-4 py-3 space-y-2 animate-in slide-in-from-top-2">
          <Link
            href="/admin"
            onClick={() => setShowMobileMenu(false)}
            className={`block px-3 py-2 rounded-lg text-xs font-semibold ${
              pathname === "/admin" ? "bg-slate-900 text-sky-400 font-bold" : "text-slate-300 hover:bg-slate-700 hover:text-white"
            }`}
          >
            แดชบอร์ด
          </Link>

          <Link
            href="/admin/shops"
            onClick={() => setShowMobileMenu(false)}
            className={`block px-3 py-2 rounded-lg text-xs font-semibold ${
              pathname === "/admin/shops" ? "bg-slate-900 text-sky-400 font-bold" : "text-slate-300 hover:bg-slate-700 hover:text-white"
            }`}
          >
            ร้านค้า
          </Link>

          <Link
            href="/admin/reports"
            onClick={() => setShowMobileMenu(false)}
            className={`block px-3 py-2 rounded-lg text-xs font-semibold ${
              pathname === "/admin/reports" ? "bg-slate-900 text-sky-400 font-bold" : "text-slate-300 hover:bg-slate-700 hover:text-white"
            }`}
          >
            รายงานปัญหา
          </Link>

          <Link
            href="/admin/support"
            onClick={() => setShowMobileMenu(false)}
            className={`block px-3 py-2 rounded-lg text-xs font-semibold ${
              pathname === "/admin/support" ? "bg-slate-900 text-sky-400 font-bold" : "text-slate-300 hover:bg-slate-700 hover:text-white"
            }`}
          >
            รับเรื่องช่วยเหลือ
          </Link>

          {/* Mobile Accordion Menu การเงิน */}
          <div>
            <button
              onClick={() => setShowFinanceMenu(!showFinanceMenu)}
              className={`flex w-full items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold ${
                isFinanceActive ? "bg-slate-900 text-sky-400 font-bold" : "text-slate-300 hover:bg-slate-700 hover:text-white"
              }`}
            >
              <span>การเงิน</span>
              <svg
                className={`w-4 h-4 transition-transform ${showFinanceMenu ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {showFinanceMenu && (
              <div className="pl-4 mt-1 space-y-1 border-l-2 border-slate-700 ml-3">
                <Link
                  href="/admin/slips"
                  onClick={() => setShowMobileMenu(false)}
                  className={`block px-3 py-1.5 rounded-md text-xs ${
                    pathname === "/admin/slips" ? "text-sky-400 font-bold" : "text-slate-400 hover:text-white"
                  }`}
                >
                  สลิปโอนเงิน
                </Link>
                <Link
                  href="/admin/refunds"
                  onClick={() => setShowMobileMenu(false)}
                  className={`block px-3 py-1.5 rounded-md text-xs ${
                    pathname === "/admin/refunds" ? "text-sky-400 font-bold" : "text-slate-400 hover:text-white"
                  }`}
                >
                  รายการคืนเงินลูกค้า
                </Link>
                <Link
                  href="/admin/payouts"
                  onClick={() => setShowMobileMenu(false)}
                  className={`block px-3 py-1.5 rounded-md text-xs ${
                    pathname === "/admin/payouts" ? "text-sky-400 font-bold" : "text-slate-400 hover:text-white"
                  }`}
                >
                  รายการโอนเงินให้ร้านค้า
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}