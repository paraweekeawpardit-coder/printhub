"use client";

import React from "react";
import { CheckCircle2 } from "lucide-react";
import BankRequestCard, {
  BankChangeRequest,
} from "./BankRequestCard";

interface BankRequestsTabProps {
  // รองรับทั้งชื่อ bankRequests และ requests
  bankRequests?: BankChangeRequest[];
  requests?: BankChangeRequest[];
  // รองรับทั้ง onVerifyBank และ onApprove/onReject
  onVerifyBank?: (requestId: string, action: "approve" | "reject") => void;
  onApprove?: (requestId: string) => void;
  onReject?: (requestId: string) => void;
}

export default function BankRequestsTab({
  bankRequests,
  requests,
  onVerifyBank,
  onApprove,
  onReject,
}: BankRequestsTabProps) {
  // ดึงข้อมูลรายการคำขอ
  const dataList = bankRequests || requests || [];

  const handleApprove = (id: string) => {
    if (onApprove) onApprove(id);
    else if (onVerifyBank) onVerifyBank(id, "approve");
  };

  const handleReject = (id: string) => {
    if (onReject) onReject(id);
    else if (onVerifyBank) onVerifyBank(id, "reject");
  };

  if (dataList.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-8 sm:p-12 text-center border border-dashed border-slate-300 shadow-2xs font-sans">
        <div className="w-12 h-12 sm:w-14 sm:h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
          <CheckCircle2 className="w-6 h-6 sm:w-8 sm:h-8" />
        </div>
        <h3 className="text-base sm:text-lg font-bold text-slate-700">
          ไม่มีคำขอแก้ไขบัญชีธนาคาร
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          คำขอเปลี่ยนบัญชีธนาคารทั้งหมดได้รับการตรวจสอบเรียบร้อยแล้ว
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 sm:gap-4 font-sans">
      {dataList.map((req) => (
        <BankRequestCard
          key={req.id}
          request={req}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      ))}
    </div>
  );
}