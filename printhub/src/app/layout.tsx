import "./globals.css";
import { Kanit } from "next/font/google";
import "leaflet/dist/leaflet.css";

const kanit = Kanit({
  subsets: ["thai", "latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-kanit",
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th" className={kanit.variable}>
      <body className="font-sans">{children}</body>
    </html>
  );
}
