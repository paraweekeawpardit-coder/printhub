/**
 * Helper: วันเปิดร้าน (print_shop.open_days)
 * - เก็บเป็นตัวเลข 0-6 (0 = อาทิตย์ ... 6 = เสาร์)
 * - ถ้าไม่มีข้อมูล ให้ถือว่าเปิดทุกวัน (รองรับร้านเก่าที่ยังไม่ได้ตั้งค่า)
 */

const SHORT = ["อา.", "จ.", "อ.", "พ.", "พฤ.", "ศ.", "ส."];
const FULL = ["อาทิตย์", "จันทร์", "อังคาร", "พุธ", "พฤหัสบดี", "ศุกร์", "เสาร์"];
const WEEK_ORDER = [1, 2, 3, 4, 5, 6, 0]; // เรียงจันทร์ -> อาทิตย์ สำหรับแสดงผล

/** แปลงค่าจาก DB ให้เป็น array ตัวเลข 0-6 (รองรับ [1,2], ["1","2"], "{1,2}") คืน null = เปิดทุกวัน */
export const normalizeOpenDays = (raw: unknown): number[] | null => {
  if (raw === null || raw === undefined) return null;
  let list: unknown[] = [];
  if (Array.isArray(raw)) list = raw;
  else if (typeof raw === "string") list = raw.replace(/[{}\[\]"\s]/g, "").split(",").filter(Boolean);
  else return null;

  const days = Array.from(
    new Set(list.map((d) => Number(d)).filter((d) => Number.isInteger(d) && d >= 0 && d <= 6))
  );
  return days.length > 0 ? days.sort((a, b) => a - b) : null;
};

export const isEveryDay = (raw: unknown) => {
  const days = normalizeOpenDays(raw);
  return !days || days.length === 7;
};

/** ร้านเปิดในวันนี้ (0-6) หรือไม่ */
export const isOpenOnWeekday = (raw: unknown, weekday: number) => {
  const days = normalizeOpenDays(raw);
  return !days || days.includes(weekday);
};

/** วันในสัปดาห์ของวันที่รูปแบบ YYYY-MM-DD (ไม่ขึ้นกับ timezone) */
export const weekdayOfDateStr = (dateStr: string) => {
  const [y, m, d] = String(dateStr).slice(0, 10).split("-").map(Number);
  return new Date(y, (m || 1) - 1, d || 1).getDay();
};

/** วันในสัปดาห์ของ "ตอนนี้" ตามเวลาไทย */
export const todayWeekdayBangkok = () => {
  const name = new Intl.DateTimeFormat("en-US", { timeZone: "Asia/Bangkok", weekday: "short" }).format(new Date());
  return ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(name);
};

export const weekdayFullName = (weekday: number) => FULL[weekday] || "";

/** ข้อความวันเปิด เช่น "ทุกวัน", "จ.–ศ.", "จ.–ศ., อา.", "จ., พ., ศ." */
export const formatOpenDays = (raw: unknown) => {
  const days = normalizeOpenDays(raw);
  if (!days || days.length === 7) return "ทุกวัน";

  const ordered = WEEK_ORDER.filter((d) => days.includes(d));
  const runs: number[][] = [];
  ordered.forEach((d) => {
    const last = runs[runs.length - 1];
    if (last && WEEK_ORDER.indexOf(d) === WEEK_ORDER.indexOf(last[last.length - 1]) + 1) last.push(d);
    else runs.push([d]);
  });

  return runs
    .map((r) => (r.length >= 3 ? `${SHORT[r[0]]}–${SHORT[r[r.length - 1]]}` : r.map((d) => SHORT[d]).join(", ")))
    .join(", ");
};

export const weekdayShortName = (weekday: number) => SHORT[weekday] || "";

/** วันเปิดถัดไปหลังจากวันที่กำหนด (ไม่นับวันนั้นเอง) คืน -1 ถ้าไม่มีวันเปิดเลย */
export const nextOpenWeekday = (raw: unknown, fromWeekday: number) => {
  for (let i = 1; i <= 7; i++) {
    const d = (fromWeekday + i) % 7;
    if (isOpenOnWeekday(raw, d)) return d;
  }
  return -1;
};

/** ข้อมูลแถบวัน อา-ส สำหรับแสดงผล (เรียงอาทิตย์ -> เสาร์) */
export const weekStrip = (raw: unknown) =>
  [0, 1, 2, 3, 4, 5, 6].map((d) => ({
    weekday: d,
    label: SHORT[d].replace(".", ""),
    isOpen: isOpenOnWeekday(raw, d),
  }));

/** ชื่อวันเต็ม เช่น "วันจันทร์" */
export const weekdayLongName = (weekday: number) => (FULL[weekday] ? `วัน${FULL[weekday]}` : "");

const toHHMM = (t?: string | null) => (t ? String(t).slice(0, 5) : "");

/** ร้านเปิดทั้งวัน (00:00 - 23:59/24:00) */
export const isAllDayHours = (open?: string | null, close?: string | null) => {
  const o = toHHMM(open);
  const c = toHHMM(close);
  return o === "00:00" && (c === "23:59" || c === "24:00" || c === "00:00");
};

/** ข้อความเวลาทำการแบบเดียวกันทุกหน้า */
export const hoursLabel = (open?: string | null, close?: string | null) => {
  const o = toHHMM(open);
  const c = toHHMM(close);
  if (!o || !c) return "ไม่ระบุเวลาทำการ";
  if (isAllDayHours(o, c)) return "เปิด 24 ชั่วโมง";
  return `${o} - ${c} น.`;
};

/** "เปิดอีกครั้งวันจันทร์ เวลา 08:00 น." (ร้าน 24 ชม. ไม่ต่อท้ายเวลา) */
export const nextOpenText = (raw: unknown, open?: string | null, close?: string | null) => {
  const next = nextOpenWeekday(raw, todayWeekdayBangkok());
  if (next < 0) return "";
  const time = toHHMM(open) && !isAllDayHours(open, close) ? ` เวลา ${toHHMM(open)} น.` : "";
  return `เปิดอีกครั้ง${weekdayLongName(next)}${time}`;
};

/** ตารางวันเปิด-ปิดทั้งสัปดาห์ (เรียงจันทร์ -> อาทิตย์) */
export const weekSchedule = (raw: unknown, open?: string | null, close?: string | null) => {
  const today = todayWeekdayBangkok();
  return WEEK_ORDER.map((d) => {
    const isOpen = isOpenOnWeekday(raw, d);
    return {
      weekday: d,
      name: weekdayLongName(d),
      isOpen,
      isToday: d === today,
      text: isOpen ? hoursLabel(open, close).replace("เปิด ", "") : "ปิดทำการ",
    };
  });
};
