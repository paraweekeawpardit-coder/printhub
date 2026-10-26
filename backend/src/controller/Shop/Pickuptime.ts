// pickupTime.ts  (วางไว้โฟลเดอร์เดียวกับ home.ts / order.ts / detail.ts)
//
// ฝั่งลูกค้าบันทึกเวลานัดรับ "เวลานาฬิกาไทย" ลง DB โดยไม่ใส่ +07:00
// DB จึงเก็บ 07:06 เป็น 07:06 UTC (= 14:06 เวลาไทย) → เพี้ยน +7 ชม.
// ฟังก์ชันนี้ลบ 7 ชม. กลับ เพื่อให้ได้เวลาจริงที่ลูกค้าเลือก
const SHIFT_MS = 7 * 60 * 60 * 1000;

export const fixPickupTime = (v: unknown): string | null => {
  if (!v) return null;
  const s = String(v).trim();
  if (!s) return null;

  // date-only หรือ time-only ไม่ต้องแก้ (ไม่มีส่วนที่เพี้ยน)
  if (/^\d{4}-\d{2}-\d{2}$/.test(s) || /^\d{2}:\d{2}(:\d{2})?$/.test(s)) return s;

  let iso = s.replace(" ", "T");
  iso = iso.replace(/([+-]\d{2})$/, "$1:00");           // "+00" → "+00:00"
  if (!/(Z|[+-]\d{2}:\d{2})$/.test(iso)) iso += "Z";    // ไม่มี tz → UTC (เหมือนที่ DB ตีความ)

  const d = new Date(iso);
  return isNaN(d.getTime()) ? s : new Date(d.getTime() - SHIFT_MS).toISOString();
};