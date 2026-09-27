import type { Metadata } from 'next';
import { Instrument_Sans, Kanit } from 'next/font/google';
import './globals.css';

// ฟอนต์ภาษาอังกฤษ
const instrumentSans = Instrument_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-instrument-sans',
  display: 'swap',
});

// ฟอนต์ภาษาไทย
const kanit = Kanit({
  subsets: ['thai', 'latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-kanit',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'PrintHub',
  description: 'แพลตฟอร์มค้นหาและสั่งปริ้นท์เอกสารออนไลน์',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th" className={`${instrumentSans.variable} ${kanit.variable}`}>
      <body className="font-sans bg-slate-50 text-slate-800 antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}