import Link from "next/link";
import { Printer } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/70 backdrop-blur-lg">
      <div className="mx-auto flex h-18 max-w-6xl items-center justify-between px-8 py-4">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-navy text-white">
            <Printer size={18} strokeWidth={2} />
          </div>
          <h1 className="text-xl font-semibold tracking-tight text-navy">
            PrintHub
          </h1>
        </Link>
        <Link
          href="/auth"
          className="rounded-full bg-navy px-5 py-2 text-sm font-medium text-white transition hover:bg-black"
        >
         เข้าสู่ระบบ
        </Link>
      </div>
    </nav>
  );
}
