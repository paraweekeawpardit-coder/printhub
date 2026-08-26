import './globals.css'; 
export const metadata = {
    title: 'PrintHub - Order Review',
    description: 'ระบบรีวิวและแจ้งปัญหาการพิมพ์',
};

export default function RootLayout({ children }) {
    return (
        <html lang="th">
            <body className="bg-slate-50 text-slate-800 antialiased">
                {children}
            </body>
        </html>
    );
}