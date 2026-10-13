// ตัวตรวจรูปแบบข้อมูลสำหรับฟอร์มสมัคร/เข้าสู่ระบบ (ฝั่งหน้าเว็บ)
// กฎรหัสผ่านต้องตรงกับ backend: controller/Auth/validators.ts

export const PASSWORD_MIN_LENGTH = 8;

export type PasswordRule = {
  key: string;
  label: string;
  test: (value: string) => boolean;
};

export const PASSWORD_RULES: PasswordRule[] = [
  {
    key: "length",
    label: `มีความยาวอย่างน้อย ${PASSWORD_MIN_LENGTH} ตัวอักษร`,
    test: (v) => v.length >= PASSWORD_MIN_LENGTH,
  },
  {
    key: "lower",
    label: "มีตัวพิมพ์เล็ก (a-z) อย่างน้อย 1 ตัว",
    test: (v) => /[a-z]/.test(v),
  },
  {
    key: "upper",
    label: "มีตัวพิมพ์ใหญ่ (A-Z) อย่างน้อย 1 ตัว",
    test: (v) => /[A-Z]/.test(v),
  },
  {
    key: "digit",
    label: "มีตัวเลข (0-9) อย่างน้อย 1 ตัว",
    test: (v) => /\d/.test(v),
  },
  {
    key: "special",
    label: "มีอักขระพิเศษ เช่น ! @ # $ % & * อย่างน้อย 1 ตัว",
    // เครื่องหมายวรรคตอน ASCII ทั้งหมด (ไม่นับตัวอักษรไทย)
    test: (v) => /[!-\/:-@\[-`{-~]/.test(v),
  },
];

export function isPasswordValid(value: string): boolean {
  return PASSWORD_RULES.every((rule) => rule.test(value));
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());
}

export const EMAIL_FORMAT_ERROR = "รูปแบบอีเมลไม่ถูกต้อง (ตัวอย่าง: name@example.com)";