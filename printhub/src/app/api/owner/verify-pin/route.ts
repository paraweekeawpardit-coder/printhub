import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { pin } = await request.json();
    // อ่าน PIN จาก .env ฝั่ง Server (ไม่ต้องมี NEXT_PUBLIC_)
    const SERVER_OWNER_PIN = process.env.OWNER_PIN || "8888";

    if (pin === SERVER_OWNER_PIN) {
      return NextResponse.json({ success: true });
    }

    return NextResponse.json(
      { success: false, message: "รหัส PIN ไม่ถูกต้อง" },
      { status: 401 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "เกิดข้อผิดพลาดในระบบ" },
      { status: 500 }
    );
  }
}