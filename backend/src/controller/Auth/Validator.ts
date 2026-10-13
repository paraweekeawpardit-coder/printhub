// ตัวตรวจรูปแบบข้อมูลฝั่ง backend (ต้องตรงกับ validators.ts ฝั่งหน้าเว็บ)

export const PASSWORD_MIN_LENGTH = 8;

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());
}

/** คืนข้อความ error ถ้ารหัสผ่านไม่ผ่านเงื่อนไข, คืน null ถ้าผ่าน */
export function passwordPolicyError(password: unknown): string | null {
  if (typeof password !== "string") {
    return "รหัสผ่านไม่ถูกต้อง";
  }

  const missing: string[] = [];
  if (password.length < PASSWORD_MIN_LENGTH) {
    missing.push(`ความยาวอย่างน้อย ${PASSWORD_MIN_LENGTH} ตัวอักษร`);
  }
  if (!/[a-z]/.test(password)) missing.push("ตัวพิมพ์เล็ก (a-z)");
  if (!/[A-Z]/.test(password)) missing.push("ตัวพิมพ์ใหญ่ (A-Z)");
  if (!/\d/.test(password)) missing.push("ตัวเลข (0-9)");
  if (!/[!-\/:-@\[-`{-~]/.test(password)) missing.push("อักขระพิเศษ เช่น ! @ # $ %");

  return missing.length > 0
    ? `รหัสผ่านต้องประกอบด้วย: ${missing.join(", ")}`
    : null;
}