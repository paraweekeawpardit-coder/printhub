"use client";

import React, { useState, useEffect, useCallback } from "react";
import ContactAdminModal from "./ContactAdminModal";
import { Clock, ShieldAlert, AlertTriangle, BellRing } from "lucide-react";

interface SuspendedBannerProps {
  reason?: string;
  shopId?: string;
}

interface AppealData {
  id: string;
  status: "pending" | "approved" | "rejected";
  created_at: string;
  is_overdue?: boolean;
  days_pending?: number;
  is_nudge?: boolean;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/admin";

export default function SuspendedBanner({ reason, shopId }: SuspendedBannerProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [appeal, setAppeal] = useState<AppealData | null>(null);
  const [loading, setLoading] = useState(false);
  const [isNudged, setIsNudged] = useState(false);
  const [nudgeLoading, setNudgeLoading] = useState(false);

  const getShopId = useCallback(() => {
    if (shopId) return shopId;
    if (typeof window === "undefined") return null;

    try {
      const storedShop = localStorage.getItem("shop");
      if (storedShop) {
        const parsed = JSON.parse(storedShop);
        if (parsed.id || parsed._id) return parsed.id || parsed._id;
      }
    } catch (e) {}

    return localStorage.getItem("shop_id") || localStorage.getItem("shopId");
  }, [shopId]);

  const fetchAppealStatus = useCallback(async () => {
    const id = getShopId();
    if (!id) return;

    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/shop-appeal/${id}`);
      if (res.ok) {
        const result = await res.json();
        if (result.success && result.appeal) {
          setAppeal(result.appeal);
          if (result.appeal.is_nudge) {
            setIsNudged(true);
          }
        }
      }
    } catch (err) {
      console.error("Fetch Appeal Error:", err);
    } finally {
      setLoading(false);
    }
  }, [getShopId]);

  useEffect(() => {
    fetchAppealStatus();
  }, [fetchAppealStatus]);

  const handleNudge = async () => {
    if (!appeal?.id || isNudged) return;

    try {
      setNudgeLoading(true);
      const res = await fetch(`${API_URL}/shop-appeal/nudge`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ appeal_id: appeal.id }),
      });

      if (res.ok) {
        setIsNudged(true);
        alert("เร่งติดตามคำร้องเรียบร้อยแล้ว แอดมินได้รับการแจ้งเตือนแล้วครับ");
      } else {
        alert("เกิดข้อผิดพลาดในการส่งข้อความติดตามคำร้อง");
      }
    } catch (err) {
      console.error("Nudge Error:", err);
      alert("ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้");
    } finally {
      setNudgeLoading(false);
    }
  };

  const formatThaiDateTime = (dateString?: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("th-TH", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const renderTimeRemaining = () => {
    if (!appeal?.created_at) return null;
    const createdAt = new Date(appeal.created_at).getTime();
    const now = new Date().getTime();
    const diffDays = Math.floor((now - createdAt) / (1000 * 60 * 60 * 24));
    const daysLeft = Math.max(0, 3 - diffDays);

    if (diffDays >= 3) {
      return <span className="text-amber-200 font-semibold">เกินกำหนดระยะเวลาตรวจสอบแล้ว</span>;
    }
    return (
      <span>
        โดยปกติใช้เวลา 1–3 วันทำการ (เหลือประมาณ {daysLeft > 0 ? `${daysLeft} วัน` : "วันนี้"})
      </span>
    );
  };

  const isOverdue = (): boolean => {
    if (appeal?.is_overdue !== undefined) return appeal.is_overdue;
    if (!appeal?.created_at) return false;

    const createdAt = new Date(appeal.created_at).getTime();
    const now = new Date().getTime();
    const diffDays = (now - createdAt) / (1000 * 60 * 60 * 24);
    return diffDays >= 3;
  };

  return (
    <>
      {/* เพิ่ม relative z-50 เพื่อให้อยู่เหนือชั้น Read-Only ของเนื้อหาหลัก */}
      <div className="relative z-50 w-full bg-rose-600 px-4 py-3 text-white shadow-md">
        <div className="mx-auto flex max-w-7xl flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          
          <div className="flex items-start gap-3">
            <ShieldAlert className="h-6 w-6 shrink-0 text-white mt-0.5" />
            <div>
              <p className="font-bold text-white text-sm md:text-base">
                บัญชีร้านค้าของคุณถูกระงับการใช้งานชั่วคราว
              </p>
              <p className="text-xs text-rose-100 opacity-90">
                เหตุผล: {reason || "เนื่องจากตรวจพบกิจกรรมที่เข้าข่ายผิดเงื่อนไขระบบ"}
              </p>
            </div>
          </div>

          <div className="w-full lg:w-auto flex flex-col sm:flex-row items-start sm:items-center justify-end gap-3">
            {appeal?.status === "pending" ? (
              isOverdue() ? (
                <div className="w-full lg:w-auto flex flex-col sm:flex-row items-start sm:items-center gap-2 rounded-lg bg-amber-500/25 border border-amber-300/50 p-2.5 text-xs text-amber-100">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-amber-300 shrink-0 animate-bounce" />
                    <div>
                      <p className="font-bold text-amber-200">
                        คำร้องเกินกำหนดตรวจสอบ (ยื่นเมื่อ {formatThaiDateTime(appeal.created_at)})
                      </p>
                      <p className="text-[11px] text-amber-100/90">
                        เกินระยะเวลาปกติ 3 วันทำการ สามารถกดเร่งติดตามคำร้องได้
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleNudge}
                    disabled={isNudged || nudgeLoading}
                    className={`shrink-0 ml-auto flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold shadow-sm transition cursor-pointer ${
                      isNudged
                        ? "bg-amber-200/20 text-amber-200 border border-amber-300/30 cursor-not-allowed"
                        : "bg-amber-400 text-slate-900 hover:bg-amber-300 active:scale-95"
                    }`}
                  >
                    <BellRing className="h-3.5 w-3.5" />
                    {nudgeLoading
                      ? "กำลังส่ง..."
                      : isNudged
                      ? "แจ้งติดตามแล้ว"
                      : "ติดตามคำร้อง / เร่งด่วน"}
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2.5 rounded-lg bg-amber-500/20 border border-amber-300/40 px-3.5 py-2 text-xs text-amber-100">
                  <Clock className="h-4 w-4 text-amber-300 animate-pulse shrink-0" />
                  <div>
                    <p className="font-semibold text-amber-200">
                      ยื่นเรื่องแล้วเมื่อ {formatThaiDateTime(appeal.created_at)}
                    </p>
                    <p className="text-[11px] text-amber-100/80">
                      {renderTimeRemaining()}
                    </p>
                  </div>
                </div>
              )
            ) : (
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="shrink-0 rounded-lg bg-white px-4 py-2 text-xs font-semibold text-rose-700 shadow-sm transition hover:bg-rose-50 active:scale-95 cursor-pointer"
              >
                ยื่นเรื่องปลดระงับ
              </button>
            )}
          </div>

        </div>
      </div>

      <ContactAdminModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          fetchAppealStatus();
        }}
      />
    </>
  );
}