// import type { Metadata } from 'next';
// import './globals.css';

// export const metadata: Metadata = {
//   title: 'PrintHub',
//   description: 'Print Shop Platform',
// };

// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <html lang="th">
//       <body className="bg-gray-50 text-gray-900 min-h-screen">
//         {children}
//       </body>
//     </html>
//   );
// }

import type { Metadata } from 'next';
import { Instrument_Sans } from 'next/font/google';
import './globals.css';

const instrumentSans = Instrument_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-instrument-sans',
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
    <html lang="th" className={instrumentSans.variable}>
      <body className="font-sans bg-[#F9FAFB] text-slate-800 antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}