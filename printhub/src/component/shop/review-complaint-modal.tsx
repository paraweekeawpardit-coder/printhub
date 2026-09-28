"use client";

import { useState } from "react";
import { Star, AlertTriangle, ThumbsUp } from "lucide-react";

type Props = {
  reviews: any[];
  complaints: any[];
};

export default function ReviewComplaintModal({ reviews, complaints }: Props) {
  const [activeTab, setActiveTab] = useState<"reviews" | "complaints">("reviews");

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-base font-bold text-[#0F2942]">
            ความคิดเห็นและการร้องเรียน
          </h3>
          <p className="text-xs text-slate-500">
            รีวิวจากลูกค้าและข้อเสนอแนะที่ต้องปรับปรุง
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex rounded-xl bg-slate-100 p-1 text-xs font-semibold">
          <button
            onClick={() => setActiveTab("reviews")}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 transition-all ${
              activeTab === "reviews"
                ? "bg-white text-slate-800 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
            รีวิว ({reviews.length})
          </button>
          <button
            onClick={() => setActiveTab("complaints")}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 transition-all ${
              activeTab === "complaints"
                ? "bg-white text-rose-600 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            <AlertTriangle className="h-3.5 w-3.5 text-rose-500" />
            รายการร้องเรียน ({complaints.length})
          </button>
        </div>
      </div>

      <div className="max-h-80 overflow-y-auto space-y-3">
        {activeTab === "reviews" ? (
          reviews.length > 0 ? (
            reviews.map((rev) => (
              <div
                key={rev.id}
                className="rounded-xl border border-slate-100 bg-slate-50/50 p-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-xs text-slate-800">
                      {rev.customer?.first_name} {rev.customer?.last_name}
                    </span>
                    <div className="flex items-center gap-0.5 text-amber-400">
                      <Star className="h-3 w-3 fill-amber-400" />
                      <span className="text-xs font-bold text-amber-700">
                        {rev.score}
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-400">
                    {new Date(rev.created_at).toLocaleDateString("th-TH")}
                  </span>
                </div>
                <p className="text-xs text-slate-600">{rev.comment || "ไม่มีข้อความเพิ่มเติม"}</p>
              </div>
            ))
          ) : (
            <p className="py-8 text-center text-xs text-slate-400">
              ยังไม่มีรีวิวจากลูกค้า
            </p>
          )
        ) : complaints.length > 0 ? (
          complaints.map((comp) => (
            <div
              key={comp.id}
              className="rounded-xl border border-rose-100 bg-rose-50/40 p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-xs text-rose-900">
                  {comp.customer?.first_name} {comp.customer?.last_name}
                </span>
                <span className="text-[10px] text-rose-400">
                  {new Date(comp.created_at).toLocaleDateString("th-TH")}
                </span>
              </div>
              <p className="text-xs text-rose-800 font-medium">{comp.subject || "การร้องเรียนเรื่องบริการ"}</p>
              <p className="text-xs text-slate-600 mt-1">{comp.detail}</p>
            </div>
          ))
        ) : (
          <p className="py-8 text-center text-xs text-slate-400">
            ไม่มีรายการร้องเรียน
          </p>
        )}
      </div>
    </div>
  );
}