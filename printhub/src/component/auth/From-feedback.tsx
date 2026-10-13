"use client";

import { Check, X } from "lucide-react";
import { PASSWORD_RULES } from "../auth/Validators";

/** ข้อความเตือนสีแดงใต้ช่องกรอก */
export function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p
      role="alert"
      data-field-error
      className="mt-1 text-xs font-medium text-red-500"
    >
      {message}
    </p>
  );
}

/** รายการเงื่อนไขรหัสผ่าน แสดงว่าข้อไหนผ่านแล้ว/ยังไม่ผ่าน */
export function PasswordChecklist({
  value,
  visible,
}: {
  value: string;
  visible: boolean;
}) {
  if (!visible) return null;

  const results = PASSWORD_RULES.map((rule) => ({
    ...rule,
    ok: rule.test(value),
  }));

  if (results.every((r) => r.ok)) {
    return (
      <p className="mt-1.5 flex items-center gap-1 text-xs font-medium text-emerald-600">
        <Check size={13} /> รหัสผ่านตรงตามรูปแบบที่กำหนด
      </p>
    );
  }

  return (
    <div
      data-field-error
      className="mt-1.5 rounded-xl border border-red-100 bg-red-50/60 px-3 py-2 text-xs"
    >
      <p className="mb-1 font-semibold text-red-600">
        รหัสผ่านต้องเป็นไปตามรูปแบบนี้จึงจะสมัครได้:
      </p>
      <ul className="space-y-0.5">
        {results.map((r) => (
          <li
            key={r.key}
            className={`flex items-center gap-1.5 ${
              r.ok ? "text-emerald-600" : "text-red-500"
            }`}
          >
            {r.ok ? <Check size={13} /> : <X size={13} />}
            {r.label}
          </li>
        ))}
      </ul>
    </div>
  );
}

/** เลื่อนหน้าจอไปที่ข้อผิดพลาดแรก (ฟอร์มยาว กดสมัครแล้วจะได้เห็นว่าผิดตรงไหน) */
export function scrollToFirstError() {
  setTimeout(() => {
    document
      .querySelector("[data-field-error]")
      ?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, 50);
}