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

        <ul className="hidden items-center gap-9 text-sm font-medium text-gray-500 md:flex">
          {[
            { href: "/", label: "Home" },
            { href: "/order", label: "Order" },
            { href: "/chat", label: "Chat" },
            { href: "/setting", label: "Setting" },
            { href: "/contact", label: "Contact" },
          ].map((item) => (
            <li key={item.href}>
              <Link href={item.href} className="transition-colors hover:text-navy">
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        <Link
          href="/auth"
          className="rounded-full bg-navy px-5 py-2 text-sm font-medium text-white transition hover:bg-black"
        >
          Sign Up
        </Link>
      </div>
    </nav>
  );
}