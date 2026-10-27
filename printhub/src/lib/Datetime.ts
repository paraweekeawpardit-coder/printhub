// lib/Datetime.ts
export const TH_TZ = "Asia/Bangkok";

// แปลงค่าวันที่จาก API ให้เป็น Date อย่างปลอดภัย
export function parseDate(value?: string | null): Date | null {
  if (!value) return null;
  let s = String(value).trim();

  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) {
    // วันที่ล้วน → ถือเป็นเที่ยงคืนเวลาไทย
    s += "T00:00:00+07:00";
  } else {
    s = s.replace(" ", "T");
    // "+00" → "+00:00" (Supabase บางครั้งส่งแบบสั้น)
    s = s.replace(/([+-]\d{2})$/, "$1:00");
    // ไม่มี timezone ติดมา → ถือเป็น UTC
    if (!/(Z|[+-]\d{2}:\d{2})$/.test(s)) s += "Z";
  }

  const d = new Date(s);
  return isNaN(d.getTime()) ? null : d;
}

// เช่น "27 ต.ค. 2569 เวลา 14:30 น."  (เวลาไทย, 24 ชั่วโมง)
export function formatThaiDateTime(value?: string | null): string {
  const d = parseDate(value);
  if (!d) return value || "-";

  const date = d.toLocaleDateString("th-TH", {
    timeZone: TH_TZ,
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  const time = d.toLocaleTimeString("en-GB", {
    timeZone: TH_TZ,
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  });
  return `${date} เวลา ${time} น.`;
}

// คืนค่า "YYYY-MM-DD" ตามเวลาไทย (ใช้กรองด้วยปฏิทิน)
// หมายเหตุ: ถ้าของเดิมในโปรเจกต์ทำงานถูกอยู่แล้ว ให้เก็บของเดิมไว้
export function toThaiDateKey(value?: string | null): string {
  const d = parseDate(value);
  if (!d) return "";
  return new Intl.DateTimeFormat("en-CA", { timeZone: TH_TZ }).format(d);
}