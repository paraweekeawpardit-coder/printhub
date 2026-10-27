/**
 * เลือกหน้าที่ต้องการพิมพ์ (เฉพาะงานเอกสารหลายหน้า)
 * - ลูกค้ากรอกช่วงหน้า เช่น "1-3, 5" ต่อไฟล์
 * - เก็บลง cart_item.page_selection เป็น JSON (เรียงตามลำดับไฟล์ใน file_url)
 */

export interface FilePageSelection {
  pages_total: number; // จำนวนหน้าทั้งหมดของไฟล์
  print_all: boolean; // true = พิมพ์ทุกหน้า
  range: string; // ช่วงหน้าที่เลือก (รูปแบบมาตรฐาน เช่น "1-3, 5") ถ้า print_all = ""
  selected: number; // จำนวนหน้าที่จะพิมพ์จริง
}

/** แปลงข้อความ "1-3, 5" เป็นรายการเลขหน้า พร้อมข้อความ error ถ้ากรอกผิด */
export const parsePageRange = (input: string, maxPage: number): { pages: number[]; error: string } => {
  const text = String(input || "")
    .replace(/[–—]/g, "-")
    .replace(/\s+/g, "");
  if (!text) return { pages: [], error: "กรุณาระบุหน้าที่ต้องการพิมพ์ เช่น 1-3, 5" };

  const set = new Set<number>();
  for (const part of text.split(",")) {
    if (!part) continue;
    const m = part.match(/^(\d+)(?:-(\d+))?$/);
    if (!m) return { pages: [], error: `รูปแบบไม่ถูกต้อง "${part}" (ตัวอย่าง: 1-3, 5)` };
    const start = Number(m[1]);
    const end = m[2] ? Number(m[2]) : start;
    if (start < 1) return { pages: [], error: "เลขหน้าต้องเริ่มที่ 1" };
    if (start > end) return { pages: [], error: `ช่วง "${part}" ไม่ถูกต้อง (หน้าแรกต้องไม่มากกว่าหน้าสุดท้าย)` };
    if (end > maxPage) return { pages: [], error: `ไฟล์นี้มีแค่ ${maxPage} หน้า` };
    for (let p = start; p <= end; p++) set.add(p);
  }

  if (set.size === 0) return { pages: [], error: "กรุณาระบุหน้าที่ต้องการพิมพ์ เช่น 1-3, 5" };
  return { pages: Array.from(set).sort((a, b) => a - b), error: "" };
};

/** แปลงรายการเลขหน้าเป็นข้อความสั้น เช่น [1,2,3,5] -> "1-3, 5" */
export const compactPages = (pages: number[]) => {
  const parts: string[] = [];
  let i = 0;
  while (i < pages.length) {
    let j = i;
    while (j + 1 < pages.length && pages[j + 1] === pages[j] + 1) j++;
    parts.push(i === j ? `${pages[i]}` : `${pages[i]}-${pages[j]}`);
    i = j + 1;
  }
  return parts.join(", ");
};

/** อ่าน page_selection (JSON string หรือ array) */
export const readPageSelection = (raw: unknown): FilePageSelection[] => {
  try {
    const data = typeof raw === "string" ? JSON.parse(raw) : raw;
    return Array.isArray(data) ? (data as FilePageSelection[]) : [];
  } catch {
    return [];
  }
};

/** ข้อความสำหรับแสดงผล เช่น "พิมพ์เฉพาะหน้า 1-3, 5"
 *  หลายไฟล์คั่นด้วย " | " เช่น "ไฟล์ 1: พิมพ์หน้า 2-3 | ไฟล์ 2: พิมพ์หน้า 9, 15" (ไม่มีการเลือก = "") */
export const formatPageSelection = (raw: unknown): string => {
  const list = readPageSelection(raw);
  const custom = list
    .map((s, idx) => ({ ...s, idx }))
    .filter((s) => s && s.print_all === false && s.range);
  if (custom.length === 0) return "";
  if (list.length === 1) return `พิมพ์เฉพาะหน้า ${custom[0].range}`;
  return custom.map((s) => `ไฟล์ ${s.idx + 1}: พิมพ์หน้า ${s.range}`).join(" | ");
};

/** แยกเป็นแท็กทีละไฟล์ (ใช้แสดงเป็นป้ายในตะกร้า) */
export const pageSelectionTags = (raw: unknown): string[] =>
  formatPageSelection(raw)
    .split(" | ")
    .map((t) => t.trim())
    .filter(Boolean);

/** ค่าที่ไม่ต้องแสดงในสเปก (ค่าตั้งต้น / ไม่ได้เลือก / side_type เก่า) */
const HIDDEN_SPEC_TOKENS = /^(SINGLE|DOUBLE|ไม่มี|มาตรฐาน)$/i;

/** แปลงข้อความเลือกหน้าแบบเก่า "พิมพ์เฉพาะ ไฟล์ 1 หน้า 2-3, ไฟล์ 2 หน้า 9, 15"
 *  เป็นแบบใหม่ทีละไฟล์ ["ไฟล์ 1: พิมพ์หน้า 2-3", "ไฟล์ 2: พิมพ์หน้า 9, 15"] */
const normalizeLegacyPageToken = (token: string): string[] => {
  if (!token.startsWith("พิมพ์เฉพาะ ไฟล์")) return [token];
  const parts = token.replace(/^พิมพ์เฉพาะ\s*/, "").split(/,\s*(?=ไฟล์\s*\d+)/);
  return parts.map((part) => part.replace(/^ไฟล์\s*(\d+)\s*หน้า\s*/, "ไฟล์ $1: พิมพ์หน้า ").trim());
};

/** แยก describe ("A4 | ขาว-ดำ | ไฟล์ 1: พิมพ์หน้า 2-3 | ...") เป็นรายการสเปกสำหรับแสดงผล
 *  ตัดค่าที่ไม่มีความหมายออก และแปลงข้อความเลือกหน้าแบบเก่าให้เป็นแบบใหม่ */
export const splitSpecText = (text: unknown): string[] =>
  String(text || "")
    .split("|")
    .map((t) => t.trim())
    .filter((t) => t && !HIDDEN_SPEC_TOKENS.test(t))
    .flatMap(normalizeLegacyPageToken);
