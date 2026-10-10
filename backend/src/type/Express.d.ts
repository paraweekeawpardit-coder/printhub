// types/express.d.ts
// ไฟล์นี้ต้องไม่มี import/export ระดับบนสุด เพื่อให้ TypeScript ถือเป็น global declaration

declare namespace Express {
  interface Request {
    user?: {
      id: string;
      role?: "customer" | "shop";
      shop_name?: string;
      name?: string;
    };
  }
}