"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  const navItems = [
    { name: "Home", path: "/admin" },
    { name: "ร้านค้า", path: "/admin/shops" },
    { name: "Report", path: "/admin/reports" },
    { name: "สลิป", path: "/admin/slips" },
  ];

  return (
    <div className="admin-layout">
      {/* Navbar แบบอ้างอิงจาก image_b1ba0a.png */}
      <nav className="admin-navbar">
        <div className="nav-brand">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="white"><path d="M19 8H5c-1.66 0-3 1.34-3 3v6h4v4h12v-4h4v-6c0-1.66-1.34-3-3-3zm-3 11H8v-5h8v5zm3-7c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm-1-9H6v4h12V3z"/></svg>
          <h2>PrintHub Admin</h2>
        </div>
        <ul className="nav-links">
          {navItems.map((item) => (
            <li key={item.name}>
              <Link
                href={item.path}
                className={pathname === item.path ? "active" : ""}
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
        <div className="nav-actions">
          <button className="icon-btn">🔔</button>
          <div className="profile-avatar">👤</div>
        </div>
      </nav>

      <main className="dashboard">{children}</main>

      <style jsx global>{`
        :root {
          --navy: #14264d;
          --blue: #2f5fde;
          --blue-light: #eaf0ff;
          --bg: #f4f6fa;
          --card: #ffffff;
          --border: #e5e9f0;
          --text: #1b2437;
          --text-muted: #6b7688;
        }
        body { background: var(--bg); margin: 0; font-family: "Inter", sans-serif; }
        
        .admin-navbar {
          background-color: var(--navy);
          color: white;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 24px;
          height: 64px;
        }
        .nav-brand { display: flex; align-items: center; gap: 12px; font-weight: bold; font-size: 1.2rem; }
        .nav-links {
          display: flex; gap: 32px; list-style: none; margin: 0; padding: 0; height: 100%;
        }
        .nav-links a {
          color: #a0aec0; text-decoration: none; font-weight: 500;
          display: flex; align-items: center; height: 100%; border-bottom: 3px solid transparent;
        }
        .nav-links a:hover { color: white; }
        .nav-links a.active { color: white; border-bottom: 3px solid #63b3ed; }
        .nav-actions { display: flex; align-items: center; gap: 16px; }
        .icon-btn { background: none; border: none; font-size: 1.2rem; cursor: pointer; }
        .profile-avatar { width: 32px; height: 32px; background: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; }
        .dashboard { max-width: 1200px; margin: 0 auto; padding: 32px 24px; }
      `}</style>
    </div>
  );
}