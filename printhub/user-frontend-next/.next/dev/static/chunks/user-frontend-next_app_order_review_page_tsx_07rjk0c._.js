(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/user-frontend-next/app/order/review/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>OrderReviewPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$user$2d$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/user-frontend-next/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$user$2d$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/user-frontend-next/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$user$2d$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/user-frontend-next/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$user$2d$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/user-frontend-next/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$user$2d$frontend$2d$next$2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/user-frontend-next/node_modules/@supabase/supabase-js/dist/index.mjs [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$user$2d$frontend$2d$next$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$star$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Star$3e$__ = __turbopack_context__.i("[project]/user-frontend-next/node_modules/lucide-react/dist/esm/icons/star.mjs [app-client] (ecmascript) <export default as Star>");
var __TURBOPACK__imported__module__$5b$project$5d2f$user$2d$frontend$2d$next$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$upload$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Upload$3e$__ = __turbopack_context__.i("[project]/user-frontend-next/node_modules/lucide-react/dist/esm/icons/upload.mjs [app-client] (ecmascript) <export default as Upload>");
var __TURBOPACK__imported__module__$5b$project$5d2f$user$2d$frontend$2d$next$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2d$big$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle$3e$__ = __turbopack_context__.i("[project]/user-frontend-next/node_modules/lucide-react/dist/esm/icons/circle-check-big.mjs [app-client] (ecmascript) <export default as CheckCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$user$2d$frontend$2d$next$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$alert$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertCircle$3e$__ = __turbopack_context__.i("[project]/user-frontend-next/node_modules/lucide-react/dist/esm/icons/circle-alert.mjs [app-client] (ecmascript) <export default as AlertCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$user$2d$frontend$2d$next$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$copy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Copy$3e$__ = __turbopack_context__.i("[project]/user-frontend-next/node_modules/lucide-react/dist/esm/icons/copy.mjs [app-client] (ecmascript) <export default as Copy>");
var __TURBOPACK__imported__module__$5b$project$5d2f$user$2d$frontend$2d$next$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__ = __turbopack_context__.i("[project]/user-frontend-next/node_modules/lucide-react/dist/esm/icons/check.mjs [app-client] (ecmascript) <export default as Check>");
var __TURBOPACK__imported__module__$5b$project$5d2f$user$2d$frontend$2d$next$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__ = __turbopack_context__.i("[project]/user-frontend-next/node_modules/lucide-react/dist/esm/icons/triangle-alert.mjs [app-client] (ecmascript) <export default as AlertTriangle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$user$2d$frontend$2d$next$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$printer$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Printer$3e$__ = __turbopack_context__.i("[project]/user-frontend-next/node_modules/lucide-react/dist/esm/icons/printer.mjs [app-client] (ecmascript) <export default as Printer>");
var __TURBOPACK__imported__module__$5b$project$5d2f$user$2d$frontend$2d$next$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$user$2d$round$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CircleUserRound$3e$__ = __turbopack_context__.i("[project]/user-frontend-next/node_modules/lucide-react/dist/esm/icons/circle-user-round.mjs [app-client] (ecmascript) <export default as CircleUserRound>");
;
var _s = __turbopack_context__.k.signature();
// 'use client';
// import React, { useState, useEffect } from 'react';
// import Link from 'next/link';
// import { createClient } from '@supabase/supabase-js';
// import { Star, Upload, CheckCircle, AlertCircle, Copy, Check, AlertTriangle, Printer, CircleUserRound } from 'lucide-react';
// // กำหนด TypeScript Interfaces
// interface OrderItem {
//     id?: string | number;
//     quantity: number;
//     subtotal: number;
// }
// interface OrderData {
//     id: string;
//     order_no?: number | string;
//     order_date?: string;
//     customer_id?: string;
//     shop_id?: string;
//     description?: string;
//     total_price?: number | string;
// }
// interface ShopData {
//     shop_name?: string;
//     profile_image?: string;
// }
// interface ReviewListItem {
//     id: string;
//     label: string;
// }
// // ตั้งค่า Supabase Client
// const supabaseUrl: string = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
// const supabaseAnonKey: string = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
// const supabase = createClient(supabaseUrl, supabaseAnonKey);
// export default function OrderReviewPage() {
//     const targetId: string = '0d8dd81e-16e0-4f70-8802-41dc1d97ac7c';
//     const [activeOrderId] = useState<string>(targetId);
//     const [orderData, setOrderData] = useState<OrderData | null>(null);
//     const [shopData, setShopData] = useState<ShopData | null>(null);
//     const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
//     const [loading, setLoading] = useState<boolean>(true);
//     const [dbError, setDbError] = useState<string>('');
//     // State สำหรับสลับหน้าฝั่งขวา ('review' หรือ 'report')
//     const [formTab, setFormTab] = useState<'review' | 'report'>('review');
//     // State สำหรับฟอร์มรีวิว
//     const [rating, setRating] = useState<number>(0);
//     const [hoverRating, setHoverRating] = useState<number>(0);
//     const [comment, setComment] = useState<string>('');
//     const [imageUrl, setImageUrl] = useState<string>('');
//     const [submitting, setSubmitting] = useState<boolean>(false);
//     const [success, setSuccess] = useState<boolean>(false);
//     const [copied, setCopied] = useState<boolean>(false);
//     // รายการรีวิวการบริการ
//     const serviceReviewList: ReviewListItem[] = [
//         { id: 'speed', label: 'ความรวดเร็วในการจัดทำและจัดส่ง' },
//         { id: 'quality', label: 'คุณภาพงานพิมพ์และสีสันคมชัด' },
//         { id: 'service', label: 'การให้บริการและการตอบแชทของร้าน' },
//         { id: 'accuracy', label: 'ความถูกต้องตรงตามไฟล์ที่สั่งพิมพ์' },
//     ];
//     const [selectedServiceReviews, setSelectedServiceReviews] = useState<string[]>([]);
//     const toggleServiceReview = (id: string): void => {
//         if (selectedServiceReviews.includes(id)) {
//             setSelectedServiceReviews(selectedServiceReviews.filter(item => item !== id));
//         } else {
//             setSelectedServiceReviews([...selectedServiceReviews, id]);
//         }
//     };
//     // State สำหรับฟอร์มรายงานปัญหา
//     const [reportRating, setReportRating] = useState<number>(0);
//     const [reportHoverRating, setReportHoverRating] = useState<number>(0);
//     const [reportComment, setReportComment] = useState<string>('');
//     const [reportImageUrl, setReportImageUrl] = useState<string>('');
//     const [submittingReport, setSubmittingReport] = useState<boolean>(false);
//     const [reportSuccess, setReportSuccess] = useState<boolean>(false);
//     const reportIssueList: ReviewListItem[] = [
//         { id: 'wrong_color', label: 'สีเพี้ยนหรือไม่ตรงกับไฟล์ต้นฉบับ' },
//         { id: 'incomplete', label: 'ได้รับสินค้าไม่ครบตามจำนวน' },
//         { id: 'damaged', label: 'สินค้าชำรุด เสียหาย หรือยับย่น' },
//         { id: 'late', label: 'ได้รับสินค้าล่าช้ากว่ากำหนด' },
//     ];
//     const [selectedReportIssues, setSelectedReportIssues] = useState<string[]>([]);
//     const toggleReportIssue = (id: string): void => {
//         if (selectedReportIssues.includes(id)) {
//             setSelectedReportIssues(selectedReportIssues.filter(item => item !== id));
//         } else {
//             setSelectedReportIssues([...selectedReportIssues, id]);
//         }
//     };
//     // ฟังก์ชันแปลงเลขรันจริงจาก Database (order_no) ให้เป็นรูปแบบ #ORD-001
//     const formatOrderCode = (orderNo?: number | string): string => {
//         if (!orderNo) return '#ORD-001';
//         const padded = String(orderNo).padStart(3, '0');
//         return `#ORD-${padded}`;
//     };
//     // ฟังก์ชันคัดลอกรหัส UUID เต็ม
//     const handleCopyUuid = (): void => {
//         if (orderData?.id) {
//             navigator.clipboard.writeText(orderData.id);
//             setCopied(true);
//             setTimeout(() => setCopied(false), 2000);
//         }
//     };
//     // ดึงข้อมูลหลัก
//     useEffect(() => {
//         if (activeOrderId) {
//             fetchDataInstantly(activeOrderId);
//         }
//     }, [activeOrderId]);
//     const fetchDataInstantly = async (id: string): Promise<void> => {
//         setLoading(true);
//         setDbError('');
//         try {
//             const { data: order, error: orderError } = await supabase
//                 .from('print_order')
//                 .select('*')
//                 .eq('id', id)
//                 .single();
//             if (orderError) throw orderError;
//             setOrderData(order);
//             const [shopResponse, itemsResponse] = await Promise.all([
//                 order?.shop_id
//                     ? supabase.from('print_shop').select('*').eq('id', order.shop_id).single()
//                     : Promise.resolve({ data: null }),
//                 supabase.from('order_item').select('*').eq('order_id', id)
//             ]);
//             setShopData(shopResponse.data);
//             setOrderItems(itemsResponse.data || []);
//         } catch (err: any) {
//             console.error('Error fetching:', err.message);
//             setDbError(`ไม่พบข้อมูลออร์เดอร์นี้ (${err.message})`);
//             setOrderData(null);
//         } finally {
//             setLoading(false);
//         }
//     };
//     const handleSubmitReview = async (e: React.FormEvent): Promise<void> => {
//         e.preventDefault();
//         if (rating === 0) {
//             alert('กรุณาให้คะแนนดาวก่อนยืนยันครับ');
//             return;
//         }
//         setSubmitting(true);
//         setSuccess(false);
//         try {
//             const { error } = await supabase.from('review').insert([
//                 {
//                     order_id: activeOrderId,
//                     shop_id: orderData?.shop_id || null,
//                     customer_id: orderData?.customer_id || null,
//                     score: rating,
//                     comment: comment,
//                     image_url: imageUrl || null,
//                 }
//             ]);
//             if (error) throw error;
//             setSuccess(true);
//             alert('บันทึกรีวิวลงตาราง review สำเร็จเรียบร้อย!');
//             setRating(0);
//             setComment('');
//             setImageUrl('');
//             setSelectedServiceReviews([]);
//         } catch (error: any) {
//             console.error('Error submitting review:', error);
//             alert('เกิดข้อผิดพลาดในการบันทึกรีวิว: ' + error.message);
//         } finally {
//             setSubmitting(false);
//         }
//     };
//     const handleSubmitReport = async (e: React.FormEvent): Promise<void> => {
//         e.preventDefault();
//         if (reportRating === 0) {
//             alert('กรุณาระบุระดับความรุนแรงของปัญหาก่อนยืนยันครับ');
//             return;
//         }
//         setSubmittingReport(true);
//         setReportSuccess(false);
//         try {
//             const { error } = await supabase.from('report').insert([
//                 {
//                     order_id: activeOrderId,
//                     shop_id: orderData?.shop_id || null,
//                     customer_id: orderData?.customer_id || null,
//                     severity: reportRating,
//                     comment: reportComment,
//                     image_url: reportImageUrl || null,
//                 }
//             ]);
//             if (error) throw error;
//             setReportSuccess(true);
//             alert('ส่งรายงานปัญหาเรียบร้อยแล้ว ทีมงานจะตรวจสอบโดยเร็วที่สุด');
//             setReportRating(0);
//             setReportComment('');
//             setReportImageUrl('');
//             setSelectedReportIssues([]);
//         } catch (error: any) {
//             console.error('Error submitting report:', error);
//             setReportSuccess(true);
//             alert('ส่งรายงานปัญหาเรียบร้อยแล้ว (บันทึกข้อมูลจำลองสำเร็จ)');
//         } finally {
//             setSubmittingReport(false);
//         }
//     };
//     return (
//         <div className="min-h-screen bg-white font-sans text-slate-800">
//             {/* Navbar ดีไซน์ใหม่ (ลบชื่อ username ออกแล้ว) */}
//             <nav className="bg-white h-20 flex items-center px-10 border-b border-slate-200 sticky top-0 z-50">
//                 {/* Logo */}
//                 <div className="flex items-center gap-2.5">
//                     <div className="w-9 h-9 rounded-lg bg-[#0F2942] flex items-center justify-center">
//                         <Printer size={18} className="text-white" />
//                     </div>
//                     <span className="text-[#0F2942] font-bold text-2xl tracking-tight">
//                         PrintHub
//                     </span>
//                 </div>
//                 {/* Menu */}
//                 <div className="flex gap-10 mx-auto text-[15px] font-medium">
//                     <Link
//                         href="/shop"
//                         className="text-slate-500 hover:text-[#0F2942] transition-colors"
//                     >
//                         Home
//                     </Link>
//                     <Link
//                         href={orderData?.shop_id ? `/shop/order/${orderData.shop_id}` : "/shop"}
//                         className="text-[#0F2942] font-semibold transition-colors"
//                     >
//                         Order
//                     </Link>
//                     <Link
//                         href="/shop/chat"
//                         className="text-slate-500 hover:text-[#0F2942] transition-colors"
//                     >
//                         Chat
//                     </Link>
//                 </div>
//                 {/* User Profile Icon Only */}
//                 <div className="flex items-center">
//                     <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center">
//                         <CircleUserRound
//                             size={20}
//                             className="text-slate-500"
//                         />
//                     </div>
//                 </div>
//             </nav>
//             {/* เนื้อหาหลัก */}
//             <main className="max-w-6xl mx-auto px-6 py-8">
//                 <h1 className="text-2xl font-bold text-slate-800 mb-6">รายละเอียดคำสั่งพิมพ์</h1>
//                 {loading ? (
//                     <div className="py-12 text-center text-blue-600 font-medium flex flex-col items-center justify-center gap-2">
//                         <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
//                         กำลังดึงข้อมูล...
//                     </div>
//                 ) : dbError ? (
//                     <div className="p-6 bg-red-50 border border-red-200 rounded-2xl text-red-700 flex items-center gap-3 shadow-sm">
//                         <AlertCircle className="w-6 h-6 flex-shrink-0" />
//                         <div>
//                             <p className="font-bold">เกิดข้อผิดพลาด:</p>
//                             <p className="text-sm mt-1">{dbError}</p>
//                         </div>
//                     </div>
//                 ) : (
//                     <>
//                         {/* ข้อมูลร้านค้า */}
//                         <div className="mb-6">
//                             <h2 className="text-lg font-semibold text-slate-700 mb-3">
//                                 {shopData?.shop_name || 'กำลังโหลดชื่อร้าน...'}
//                             </h2>
//                             <div className="w-full h-64 rounded-2xl overflow-hidden shadow-sm border border-slate-200 bg-slate-100">
//                                 <img
//                                     src={shopData?.profile_image || 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80'}
//                                     alt="Shop"
//                                     className="w-full h-full object-cover"
//                                 />
//                             </div>
//                         </div>
//                         {/* Grid 2 คอลัมน์ */}
//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
//                             {/* ฝั่งซ้าย: ข้อมูล Order ปกติ */}
//                             <div className="bg-white p-6 rounded-2xl border border-slate-300 shadow-sm space-y-4">
//                                 <div className="flex justify-between items-center border-b border-slate-100 pb-3">
//                                     <div>
//                                         <div className="flex items-center gap-2">
//                                             <span className="text-lg font-extrabold text-blue-600 tracking-wide font-mono">
//                                                 {formatOrderCode(orderData?.order_no)}
//                                             </span>
//                                             <button
//                                                 onClick={handleCopyUuid}
//                                                 title="คัดลอกรหัส UUID เต็ม"
//                                                 className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition flex items-center gap-1 text-[10px]"
//                                             >
//                                                 {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
//                                                 {copied ? 'คัดลอกแล้ว' : ''}
//                                             </button>
//                                         </div>
//                                         <span className="text-xs text-slate-400 block mt-0.5">
//                                             {orderData?.order_date ? new Date(orderData.order_date).toLocaleString('th-TH') : '-'}
//                                         </span>
//                                     </div>
//                                 </div>
//                                 <div className="space-y-3 text-sm">
//                                     <p className="font-semibold text-slate-800">รายละเอียดคำสั่งซื้อ</p>
//                                     {/* กล่องแสดงรายการสินค้าแบบเคลียร์และชัดเจน */}
//                                     <div className="space-y-2 text-slate-600 text-xs bg-slate-50 p-3.5 rounded-xl border border-slate-100">
//                                         {orderItems.length > 0 ? (
//                                             orderItems.map((item, idx) => {
//                                                 // คำนวณราคาต่อหน่วยจาก subtotal หารด้วย quantity เผื่อใช้แสดงผล
//                                                 const unitPrice = item.quantity && item.quantity > 0
//                                                     ? (Number(item.subtotal) / Number(item.quantity)).toFixed(2)
//                                                     : '0.00';
//                                                 return (
//                                                     <div key={item.id || idx} className="flex justify-between items-center border-b border-slate-200/60 pb-2.5 mb-2.5 last:border-b-0 last:pb-0 last:mb-0">
//                                                         <div>
//                                                             <span className="font-bold text-slate-800 block text-xs">รายการที่ {idx + 1}</span>
//                                                             <span className="text-[11px] text-slate-500">
//                                                                 จำนวน: <strong className="text-slate-700">{item.quantity}</strong> หน่วย
//                                                                 <span className="mx-1 text-slate-300">|</span>
//                                                                 ราคาต่อหน่วย: <strong className="text-slate-700">฿{unitPrice}</strong>
//                                                             </span>
//                                                         </div>
//                                                         <div className="text-right">
//                                                             <span className="text-[10px] text-slate-400 block">ราคารวม</span>
//                                                             <span className="font-bold text-slate-900 text-sm">฿ {item.subtotal}</span>
//                                                         </div>
//                                                     </div>
//                                                 );
//                                             })
//                                         ) : (
//                                             <p className="text-center text-slate-400 py-2">ไม่มีรายการสินค้าใน order_item</p>
//                                         )}
//                                     </div>
//                                     <p className="text-xs text-slate-600 pt-1">
//                                         <span className="font-medium">หมายเหตุ / Description:</span> {orderData?.description || '-'}
//                                     </p>
//                                 </div>
//                                 <div className="mt-6 pt-4 border-t border-slate-100 flex justify-between items-center">
//                                     <div>
//                                         <span className="text-xs text-slate-500 block">ยอดรวมทั้งสิ้น</span>
//                                         <span className="text-base font-bold text-slate-900">฿ {orderData?.total_price || '0.00'}</span>
//                                     </div>
//                                 </div>
//                             </div>
//                             {/* ฝั่งขวา: Switch Tab (รีวิวสินค้า vs รายงานปัญหา) */}
//                             <div className="space-y-4 bg-slate-50/50 p-6 rounded-2xl border border-slate-200 shadow-sm">
//                                 {/* ปุ่มสลับ Tab (Switch) */}
//                                 <div className="flex bg-slate-200/80 p-1 rounded-xl">
//                                     <button
//                                         type="button"
//                                         onClick={() => setFormTab('review')}
//                                         className={`flex-1 py-2 text-xs font-semibold rounded-lg transition flex items-center justify-center gap-1.5 ${formTab === 'review' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
//                                             }`}
//                                     >
//                                         <Star className="w-3.5 h-3.5" /> รีวิวสินค้า
//                                     </button>
//                                     <button
//                                         type="button"
//                                         onClick={() => setFormTab('report')}
//                                         className={`flex-1 py-2 text-xs font-semibold rounded-lg transition flex items-center justify-center gap-1.5 ${formTab === 'report' ? 'bg-white text-red-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
//                                             }`}
//                                     >
//                                         <AlertTriangle className="w-3.5 h-3.5" /> รายงานปัญหา
//                                     </button>
//                                 </div>
//                                 {/* TAB 1: ฟอร์มรีวิวสินค้า */}
//                                 {formTab === 'review' && (
//                                     <div className="space-y-4 pt-1">
//                                         <h3 className="text-xs font-bold text-slate-700">ให้คะแนนและความคิดเห็น</h3>
//                                         <div className="bg-white p-4 rounded-xl border border-slate-200 flex justify-center items-center gap-3">
//                                             {[1, 2, 3, 4, 5].map((star) => (
//                                                 <button
//                                                     type="button"
//                                                     key={star}
//                                                     onClick={() => setRating(star)}
//                                                     onMouseEnter={() => setHoverRating(star)}
//                                                     onMouseLeave={() => setHoverRating(0)}
//                                                     className="focus:outline-none transition transform hover:scale-110"
//                                                 >
//                                                     <Star
//                                                         className={`w-9 h-9 ${(hoverRating || rating) >= star
//                                                                 ? 'text-amber-400 fill-amber-400 drop-shadow-sm'
//                                                                 : 'text-slate-300'
//                                                             }`}
//                                                     />
//                                                 </button>
//                                             ))}
//                                         </div>
//                                         <div>
//                                             <label className="text-xs font-semibold text-slate-700 block mb-2">
//                                                 ประเด็นการให้บริการ (เลือกหัวข้อที่ประทับใจ):
//                                             </label>
//                                             <div className="space-y-2 bg-white p-3 rounded-xl border border-slate-200">
//                                                 {serviceReviewList.map((item) => (
//                                                     <label
//                                                         key={item.id}
//                                                         className="flex items-center gap-2.5 text-xs cursor-pointer hover:bg-slate-50 p-2 rounded-lg transition"
//                                                     >
//                                                         <input
//                                                             type="checkbox"
//                                                             checked={selectedServiceReviews.includes(item.id)}
//                                                             onChange={() => toggleServiceReview(item.id)}
//                                                             className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4"
//                                                         />
//                                                         <span className="text-slate-700 font-medium">{item.label}</span>
//                                                     </label>
//                                                 ))}
//                                             </div>
//                                         </div>
//                                         <div className="border-2 border-dashed border-slate-300 rounded-xl p-4 text-center bg-white hover:bg-slate-50 transition cursor-pointer relative">
//                                             <input
//                                                 type="file"
//                                                 accept="image/*"
//                                                 onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
//                                                     if (e.target.files && e.target.files[0]) {
//                                                         setImageUrl(e.target.files[0].name);
//                                                     }
//                                                 }}
//                                                 className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
//                                             />
//                                             <div className="flex flex-col items-center justify-center space-y-1">
//                                                 <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
//                                                     <Upload className="w-5 h-5" />
//                                                 </div>
//                                                 <p className="text-xs font-medium text-slate-600">
//                                                     {imageUrl ? `📎 เลือกไฟล์แล้ว: ${imageUrl}` : 'คลิกเพื่ออัปโหลดรูปภาพรีวิวสินค้า'}
//                                                 </p>
//                                                 <span className="text-[10px] text-slate-400">PNG, JPG หรืออื่นๆ</span>
//                                             </div>
//                                         </div>
//                                         <div>
//                                             <textarea
//                                                 rows={3}
//                                                 placeholder="แสดงความคิดเห็นเพิ่มเติม..."
//                                                 value={comment}
//                                                 onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setComment(e.target.value)}
//                                                 className="w-full p-3 rounded-xl bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs text-slate-800 resize-none placeholder-slate-400"
//                                             ></textarea>
//                                         </div>
//                                         <button
//                                             type="button"
//                                             onClick={handleSubmitReview}
//                                             disabled={submitting}
//                                             className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md transition flex items-center justify-center gap-2 text-sm"
//                                         >
//                                             {submitting ? 'กำลังบันทึกข้อมูล...' : 'ยืนยันรีวิว'}
//                                         </button>
//                                         {success && (
//                                             <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-emerald-700 text-xs">
//                                                 <CheckCircle className="w-4 h-4 flex-shrink-0" />
//                                                 <span>บันทึกรีวิวของคุณลงตาราง review สำเร็จเรียบร้อย!</span>
//                                             </div>
//                                         )}
//                                     </div>
//                                 )}
//                                 {/* TAB 2: ฟอร์มรายงานปัญหา */}
//                                 {formTab === 'report' && (
//                                     <div className="space-y-4 pt-1">
//                                         <h3 className="text-xs font-bold text-red-600 flex items-center gap-1">
//                                             <AlertTriangle className="w-4 h-4" /> ระบุระดับความรุนแรงและรายละเอียดปัญหา
//                                         </h3>
//                                         <div className="bg-white p-4 rounded-xl border border-slate-200 flex justify-center items-center gap-3">
//                                             {[1, 2, 3, 4, 5].map((star) => (
//                                                 <button
//                                                     type="button"
//                                                     key={star}
//                                                     onClick={() => setReportRating(star)}
//                                                     onMouseEnter={() => setReportHoverRating(star)}
//                                                     onMouseLeave={() => setReportHoverRating(0)}
//                                                     className="focus:outline-none transition transform hover:scale-110"
//                                                 >
//                                                     <Star
//                                                         className={`w-9 h-9 ${(reportHoverRating || reportRating) >= star
//                                                                 ? 'text-red-500 fill-red-500 drop-shadow-sm'
//                                                                 : 'text-slate-300'
//                                                             }`}
//                                                     />
//                                                 </button>
//                                             ))}
//                                         </div>
//                                         <div>
//                                             <label className="text-xs font-semibold text-slate-700 block mb-2">
//                                                 หัวข้อปัญหาที่พบ (เลือกหัวข้อที่ตรงกับปัญหา):
//                                             </label>
//                                             <div className="space-y-2 bg-white p-3 rounded-xl border border-slate-200">
//                                                 {reportIssueList.map((item) => (
//                                                     <label
//                                                         key={item.id}
//                                                         className="flex items-center gap-2.5 text-xs cursor-pointer hover:bg-slate-50 p-2 rounded-lg transition"
//                                                     >
//                                                         <input
//                                                             type="checkbox"
//                                                             checked={selectedReportIssues.includes(item.id)}
//                                                             onChange={() => toggleReportIssue(item.id)}
//                                                             className="rounded border-slate-300 text-red-600 focus:ring-red-500 w-4 h-4"
//                                                         />
//                                                         <span className="text-slate-700 font-medium">{item.label}</span>
//                                                     </label>
//                                                 ))}
//                                             </div>
//                                         </div>
//                                         <div className="border-2 border-dashed border-slate-300 rounded-xl p-4 text-center bg-white hover:bg-slate-50 transition cursor-pointer relative">
//                                             <input
//                                                 type="file"
//                                                 accept="image/*"
//                                                 onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
//                                                     if (e.target.files && e.target.files[0]) {
//                                                         setReportImageUrl(e.target.files[0].name);
//                                                     }
//                                                 }}
//                                                 className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
//                                             />
//                                             <div className="flex flex-col items-center justify-center space-y-1">
//                                                 <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-red-500">
//                                                     <Upload className="w-5 h-5" />
//                                                 </div>
//                                                 <p className="text-xs font-medium text-slate-600">
//                                                     {reportImageUrl ? `📎 แนบรูปหลักฐาน: ${reportImageUrl}` : 'คลิกเพื่ออัปโหลดรูปภาพหลักฐานปัญหา'}
//                                                 </p>
//                                                 <span className="text-[10px] text-slate-400">PNG, JPG หรืออื่นๆ</span>
//                                             </div>
//                                         </div>
//                                         <div>
//                                             <textarea
//                                                 rows={3}
//                                                 placeholder="อธิบายรายละเอียดปัญหาเพิ่มเติม..."
//                                                 value={reportComment}
//                                                 onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setReportComment(e.target.value)}
//                                                 className="w-full p-3 rounded-xl bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-red-500 text-xs text-slate-800 resize-none placeholder-slate-400"
//                                             ></textarea>
//                                         </div>
//                                         <button
//                                             type="button"
//                                             onClick={handleSubmitReport}
//                                             disabled={submittingReport}
//                                             className="w-full py-3.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-md transition flex items-center justify-center gap-2 text-sm"
//                                         >
//                                             {submittingReport ? 'กำลังส่งรายงาน...' : 'ยืนยันรายงานปัญหา'}
//                                         </button>
//                                         {reportSuccess && (
//                                             <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-red-700 text-xs">
//                                                 <CheckCircle className="w-4 h-4 flex-shrink-0" />
//                                                 <span>ส่งรายงานปัญหาเรียบร้อยแล้ว ทีมงานจะตรวจสอบโดยเร็วที่สุด</span>
//                                             </div>
//                                         )}
//                                     </div>
//                                 )}
//                             </div>
//                         </div>
//                     </>
//                 )}
//             </main>
//         </div>
//     );
// }
'use client';
;
;
;
;
// ==============================
// Supabase Client
// ==============================
const supabaseUrl = ("TURBOPACK compile-time value", "https://bhypxtuezgawvnluktvn.supabase.co") || '';
const supabaseAnonKey = ("TURBOPACK compile-time value", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJoeXB4dHVlemdhd3ZubHVrdHZuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ1NDA2NzIsImV4cCI6MjEwMDExNjY3Mn0.17LOlvG_tUv_s68jXn0eeyEMDWuI7uaQtt1sGMELCJk") || '';
const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$user$2d$frontend$2d$next$2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createClient"])(supabaseUrl, supabaseAnonKey);
function OrderReviewPage() {
    _s();
    // Order ID ที่ต้องการดึง
    const targetId = '0d8dd81e-16e0-4f70-8802-41dc1d97ac7c';
    const [activeOrderId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$user$2d$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(targetId);
    // ==============================
    // Database State
    // ==============================
    const [orderData, setOrderData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$user$2d$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [shopData, setShopData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$user$2d$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [orderItems, setOrderItems] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$user$2d$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$user$2d$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [dbError, setDbError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$user$2d$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    // ==============================
    // Form Tab
    // ==============================
    const [formTab, setFormTab] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$user$2d$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('review');
    // ==============================
    // Review State
    // ==============================
    const [rating, setRating] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$user$2d$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const [hoverRating, setHoverRating] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$user$2d$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const [comment, setComment] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$user$2d$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    // ชื่อไฟล์
    const [imageUrl, setImageUrl] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$user$2d$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    // URL สำหรับ Preview รูป
    const [imagePreview, setImagePreview] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$user$2d$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [submitting, setSubmitting] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$user$2d$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [success, setSuccess] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$user$2d$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [copied, setCopied] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$user$2d$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // ==============================
    // Review Topics
    // ==============================
    const serviceReviewList = [
        {
            id: 'speed',
            label: 'ความรวดเร็วในการจัดทำและจัดส่ง'
        },
        {
            id: 'quality',
            label: 'คุณภาพงานพิมพ์และสีสันคมชัด'
        },
        {
            id: 'service',
            label: 'การให้บริการและการตอบแชทของร้าน'
        },
        {
            id: 'accuracy',
            label: 'ความถูกต้องตรงตามไฟล์ที่สั่งพิมพ์'
        }
    ];
    const [selectedServiceReviews, setSelectedServiceReviews] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$user$2d$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const toggleServiceReview = (id)=>{
        if (selectedServiceReviews.includes(id)) {
            setSelectedServiceReviews(selectedServiceReviews.filter((item)=>item !== id));
        } else {
            setSelectedServiceReviews([
                ...selectedServiceReviews,
                id
            ]);
        }
    };
    // ==============================
    // Report State
    // ==============================
    const [reportRating, setReportRating] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$user$2d$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const [reportHoverRating, setReportHoverRating] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$user$2d$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const [reportComment, setReportComment] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$user$2d$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    // ชื่อไฟล์หลักฐาน
    const [reportImageUrl, setReportImageUrl] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$user$2d$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    // Preview รูปหลักฐาน
    const [reportImagePreview, setReportImagePreview] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$user$2d$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [submittingReport, setSubmittingReport] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$user$2d$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [reportSuccess, setReportSuccess] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$user$2d$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // ==============================
    // Report Issues
    // ==============================
    const reportIssueList = [
        {
            id: 'wrong_color',
            label: 'สีเพี้ยนหรือไม่ตรงกับไฟล์ต้นฉบับ'
        },
        {
            id: 'incomplete',
            label: 'ได้รับสินค้าไม่ครบตามจำนวน'
        },
        {
            id: 'damaged',
            label: 'สินค้าชำรุด เสียหาย หรือยับย่น'
        },
        {
            id: 'late',
            label: 'ได้รับสินค้าล่าช้ากว่ากำหนด'
        }
    ];
    const [selectedReportIssues, setSelectedReportIssues] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$user$2d$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const toggleReportIssue = (id)=>{
        if (selectedReportIssues.includes(id)) {
            setSelectedReportIssues(selectedReportIssues.filter((item)=>item !== id));
        } else {
            setSelectedReportIssues([
                ...selectedReportIssues,
                id
            ]);
        }
    };
    // ==============================
    // Format Order Code
    // ==============================
    const formatOrderCode = (orderNo)=>{
        if (!orderNo) {
            return '#ORD-001';
        }
        const padded = String(orderNo).padStart(3, '0');
        return `#ORD-${padded}`;
    };
    // ==============================
    // Copy UUID
    // ==============================
    const handleCopyUuid = ()=>{
        if (orderData?.id) {
            navigator.clipboard.writeText(orderData.id);
            setCopied(true);
            setTimeout(()=>{
                setCopied(false);
            }, 2000);
        }
    };
    // ==============================
    // Fetch Order Data
    // ==============================
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$user$2d$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "OrderReviewPage.useEffect": ()=>{
            if (activeOrderId) {
                fetchDataInstantly(activeOrderId);
            }
        }
    }["OrderReviewPage.useEffect"], [
        activeOrderId
    ]);
    const fetchDataInstantly = async (id)=>{
        setLoading(true);
        setDbError('');
        try {
            // ดึง Order จาก print_order
            const { data: order, error: orderError } = await supabase.from('print_order').select('*').eq('id', id).single();
            if (orderError) {
                throw orderError;
            }
            setOrderData(order);
            // ดึงร้าน + รายการสินค้า
            const [shopResponse, itemsResponse] = await Promise.all([
                order?.shop_id ? supabase.from('print_shop').select('*').eq('id', order.shop_id).single() : Promise.resolve({
                    data: null,
                    error: null
                }),
                supabase.from('order_item').select('*').eq('order_id', id)
            ]);
            if (shopResponse.error) {
                console.error('Error fetching shop:', shopResponse.error);
            }
            if (itemsResponse.error) {
                console.error('Error fetching order items:', itemsResponse.error);
            }
            setShopData(shopResponse.data || null);
            setOrderItems(itemsResponse.data || []);
        } catch (err) {
            console.error('Error fetching:', err.message);
            setDbError(`ไม่พบข้อมูลออร์เดอร์นี้ (${err.message})`);
            setOrderData(null);
        } finally{
            setLoading(false);
        }
    };
    // ==============================
    // Submit Review
    // ==============================
    const handleSubmitReview = async (e)=>{
        e.preventDefault();
        if (rating === 0) {
            alert('กรุณาให้คะแนนดาวก่อนยืนยันครับ');
            return;
        }
        setSubmitting(true);
        setSuccess(false);
        try {
            const { error } = await supabase.from('review').insert([
                {
                    order_id: activeOrderId,
                    shop_id: orderData?.shop_id || null,
                    customer_id: orderData?.customer_id || null,
                    score: rating,
                    comment: comment,
                    // ตอนนี้เก็บชื่อไฟล์
                    // ยังไม่ได้ Upload ไป Supabase Storage
                    image_url: imageUrl || null
                }
            ]);
            if (error) {
                throw error;
            }
            setSuccess(true);
            alert('บันทึกรีวิวลงตาราง review สำเร็จเรียบร้อย!');
            // Reset Form
            setRating(0);
            setComment('');
            setImageUrl('');
            setImagePreview('');
            setSelectedServiceReviews([]);
        } catch (error) {
            console.error('Error submitting review:', error);
            alert('เกิดข้อผิดพลาดในการบันทึกรีวิว: ' + error.message);
        } finally{
            setSubmitting(false);
        }
    };
    // ==============================
    // Submit Report
    // ==============================
    const handleSubmitReport = async (e)=>{
        e.preventDefault();
        if (reportRating === 0) {
            alert('กรุณาระบุระดับความรุนแรงของปัญหาก่อนยืนยันครับ');
            return;
        }
        setSubmittingReport(true);
        setReportSuccess(false);
        try {
            const { error } = await supabase.from('report').insert([
                {
                    order_id: activeOrderId,
                    shop_id: orderData?.shop_id || null,
                    customer_id: orderData?.customer_id || null,
                    severity: reportRating,
                    comment: reportComment,
                    // ตอนนี้เก็บชื่อไฟล์
                    image_url: reportImageUrl || null
                }
            ]);
            if (error) {
                throw error;
            }
            setReportSuccess(true);
            alert('ส่งรายงานปัญหาเรียบร้อยแล้ว ทีมงานจะตรวจสอบโดยเร็วที่สุด');
            // Reset Form
            setReportRating(0);
            setReportComment('');
            setReportImageUrl('');
            setReportImagePreview('');
            setSelectedReportIssues([]);
        } catch (error) {
            console.error('Error submitting report:', error);
            alert('เกิดข้อผิดพลาดในการส่งรายงาน: ' + error.message);
        } finally{
            setSubmittingReport(false);
        }
    };
    // ==============================
    // UI
    // ==============================
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$user$2d$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen bg-white font-sans text-slate-800",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$user$2d$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                className: "bg-white h-20 flex items-center px-10 border-b border-slate-200 sticky top-0 z-50",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$user$2d$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-2.5",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$user$2d$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "w-9 h-9 rounded-lg bg-[#0F2942] flex items-center justify-center",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$user$2d$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$user$2d$frontend$2d$next$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$printer$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Printer$3e$__["Printer"], {
                                    size: 18,
                                    className: "text-white"
                                }, void 0, false, {
                                    fileName: "[project]/user-frontend-next/app/order/review/page.tsx",
                                    lineNumber: 1214,
                                    columnNumber: 25
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/user-frontend-next/app/order/review/page.tsx",
                                lineNumber: 1212,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$user$2d$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-[#0F2942] font-bold text-2xl tracking-tight",
                                children: "PrintHub"
                            }, void 0, false, {
                                fileName: "[project]/user-frontend-next/app/order/review/page.tsx",
                                lineNumber: 1221,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/user-frontend-next/app/order/review/page.tsx",
                        lineNumber: 1210,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$user$2d$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex gap-10 mx-auto text-[15px] font-medium",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$user$2d$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$user$2d$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                href: "/shop",
                                className: "text-slate-500 hover:text-[#0F2942] transition-colors",
                                children: "Home"
                            }, void 0, false, {
                                fileName: "[project]/user-frontend-next/app/order/review/page.tsx",
                                lineNumber: 1233,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$user$2d$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$user$2d$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                href: orderData?.shop_id ? `/shop/order/${orderData.shop_id}` : '/shop',
                                className: "text-[#0F2942] font-semibold transition-colors",
                                children: "Order"
                            }, void 0, false, {
                                fileName: "[project]/user-frontend-next/app/order/review/page.tsx",
                                lineNumber: 1240,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$user$2d$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$user$2d$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                href: "/shop/chat",
                                className: "text-slate-500 hover:text-[#0F2942] transition-colors",
                                children: "Chat"
                            }, void 0, false, {
                                fileName: "[project]/user-frontend-next/app/order/review/page.tsx",
                                lineNumber: 1251,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/user-frontend-next/app/order/review/page.tsx",
                        lineNumber: 1231,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$user$2d$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$user$2d$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$user$2d$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$user$2d$frontend$2d$next$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$user$2d$round$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CircleUserRound$3e$__["CircleUserRound"], {
                                size: 20,
                                className: "text-slate-500"
                            }, void 0, false, {
                                fileName: "[project]/user-frontend-next/app/order/review/page.tsx",
                                lineNumber: 1266,
                                columnNumber: 25
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/user-frontend-next/app/order/review/page.tsx",
                            lineNumber: 1264,
                            columnNumber: 21
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/user-frontend-next/app/order/review/page.tsx",
                        lineNumber: 1262,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/user-frontend-next/app/order/review/page.tsx",
                lineNumber: 1206,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$user$2d$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                className: "max-w-6xl mx-auto px-6 py-8",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$user$2d$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                        className: "text-2xl font-bold text-slate-800 mb-6",
                        children: "รายละเอียดคำสั่งพิมพ์"
                    }, void 0, false, {
                        fileName: "[project]/user-frontend-next/app/order/review/page.tsx",
                        lineNumber: 1281,
                        columnNumber: 17
                    }, this),
                    loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$user$2d$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "py-12 text-center text-blue-600 font-medium flex flex-col items-center justify-center gap-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$user$2d$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"
                            }, void 0, false, {
                                fileName: "[project]/user-frontend-next/app/order/review/page.tsx",
                                lineNumber: 1293,
                                columnNumber: 25
                            }, this),
                            "กำลังดึงข้อมูล..."
                        ]
                    }, void 0, true, {
                        fileName: "[project]/user-frontend-next/app/order/review/page.tsx",
                        lineNumber: 1291,
                        columnNumber: 21
                    }, this) : dbError ? /* Error */ /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$user$2d$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "p-6 bg-red-50 border border-red-200 rounded-2xl text-red-700 flex items-center gap-3 shadow-sm",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$user$2d$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$user$2d$frontend$2d$next$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$alert$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertCircle$3e$__["AlertCircle"], {
                                className: "w-6 h-6 flex-shrink-0"
                            }, void 0, false, {
                                fileName: "[project]/user-frontend-next/app/order/review/page.tsx",
                                lineNumber: 1305,
                                columnNumber: 25
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$user$2d$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$user$2d$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "font-bold",
                                        children: "เกิดข้อผิดพลาด:"
                                    }, void 0, false, {
                                        fileName: "[project]/user-frontend-next/app/order/review/page.tsx",
                                        lineNumber: 1309,
                                        columnNumber: 29
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$user$2d$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-sm mt-1",
                                        children: dbError
                                    }, void 0, false, {
                                        fileName: "[project]/user-frontend-next/app/order/review/page.tsx",
                                        lineNumber: 1315,
                                        columnNumber: 29
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/user-frontend-next/app/order/review/page.tsx",
                                lineNumber: 1307,
                                columnNumber: 25
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/user-frontend-next/app/order/review/page.tsx",
                        lineNumber: 1303,
                        columnNumber: 21
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$user$2d$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$user$2d$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$user$2d$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mb-6",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$user$2d$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                        className: "text-lg font-semibold text-slate-700 mb-3",
                                        children: shopData?.shop_name || 'กำลังโหลดชื่อร้าน...'
                                    }, void 0, false, {
                                        fileName: "[project]/user-frontend-next/app/order/review/page.tsx",
                                        lineNumber: 1333,
                                        columnNumber: 29
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$user$2d$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "w-full h-64 rounded-2xl overflow-hidden shadow-sm border border-slate-200 bg-slate-100",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$user$2d$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                            src: shopData?.profile_image || 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80',
                                            alt: "Shop",
                                            className: "w-full h-full object-cover"
                                        }, void 0, false, {
                                            fileName: "[project]/user-frontend-next/app/order/review/page.tsx",
                                            lineNumber: 1342,
                                            columnNumber: 33
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/user-frontend-next/app/order/review/page.tsx",
                                        lineNumber: 1340,
                                        columnNumber: 29
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/user-frontend-next/app/order/review/page.tsx",
                                lineNumber: 1331,
                                columnNumber: 25
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$user$2d$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "grid grid-cols-1 md:grid-cols-2 gap-8 items-start",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$user$2d$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "bg-white p-6 rounded-2xl border border-slate-300 shadow-sm space-y-4",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$user$2d$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex justify-between items-center border-b border-slate-100 pb-3",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$user$2d$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$user$2d$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex items-center gap-2",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$user$2d$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "text-lg font-extrabold text-blue-600 tracking-wide font-mono",
                                                                    children: formatOrderCode(orderData?.order_no)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/user-frontend-next/app/order/review/page.tsx",
                                                                    lineNumber: 1369,
                                                                    columnNumber: 45
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$user$2d$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                    onClick: handleCopyUuid,
                                                                    title: "คัดลอกรหัส UUID เต็ม",
                                                                    className: "p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition flex items-center gap-1 text-[10px]",
                                                                    children: [
                                                                        copied ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$user$2d$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$user$2d$frontend$2d$next$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__["Check"], {
                                                                            className: "w-3.5 h-3.5 text-emerald-600"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/user-frontend-next/app/order/review/page.tsx",
                                                                            lineNumber: 1385,
                                                                            columnNumber: 53
                                                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$user$2d$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$user$2d$frontend$2d$next$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$copy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Copy$3e$__["Copy"], {
                                                                            className: "w-3.5 h-3.5"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/user-frontend-next/app/order/review/page.tsx",
                                                                            lineNumber: 1389,
                                                                            columnNumber: 53
                                                                        }, this),
                                                                        copied ? 'คัดลอกแล้ว' : ''
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/user-frontend-next/app/order/review/page.tsx",
                                                                    lineNumber: 1377,
                                                                    columnNumber: 45
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/user-frontend-next/app/order/review/page.tsx",
                                                            lineNumber: 1367,
                                                            columnNumber: 41
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$user$2d$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-xs text-slate-400 block mt-0.5",
                                                            children: orderData?.order_date ? new Date(orderData.order_date).toLocaleString('th-TH') : '-'
                                                        }, void 0, false, {
                                                            fileName: "[project]/user-frontend-next/app/order/review/page.tsx",
                                                            lineNumber: 1401,
                                                            columnNumber: 41
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/user-frontend-next/app/order/review/page.tsx",
                                                    lineNumber: 1365,
                                                    columnNumber: 37
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/user-frontend-next/app/order/review/page.tsx",
                                                lineNumber: 1363,
                                                columnNumber: 33
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$user$2d$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "space-y-3 text-sm",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$user$2d$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "font-semibold text-slate-800",
                                                        children: "รายละเอียดคำสั่งซื้อ"
                                                    }, void 0, false, {
                                                        fileName: "[project]/user-frontend-next/app/order/review/page.tsx",
                                                        lineNumber: 1421,
                                                        columnNumber: 37
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$user$2d$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "space-y-2 text-slate-600 text-xs bg-slate-50 p-3.5 rounded-xl border border-slate-100",
                                                        children: orderItems.length > 0 ? orderItems.map((item, idx)=>{
                                                            const unitPrice = item.quantity && item.quantity > 0 ? (Number(item.subtotal) / Number(item.quantity)).toFixed(2) : '0.00';
                                                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$user$2d$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex justify-between items-center border-b border-slate-200/60 pb-2.5 mb-2.5 last:border-b-0 last:pb-0 last:mb-0",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$user$2d$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$user$2d$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                className: "font-bold text-slate-800 block text-xs",
                                                                                children: [
                                                                                    "รายการที่",
                                                                                    ' ',
                                                                                    idx + 1
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/user-frontend-next/app/order/review/page.tsx",
                                                                                lineNumber: 1458,
                                                                                columnNumber: 65
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$user$2d$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                className: "text-[11px] text-slate-500",
                                                                                children: [
                                                                                    "จำนวน:",
                                                                                    ' ',
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$user$2d$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                                        className: "text-slate-700",
                                                                                        children: item.quantity
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/user-frontend-next/app/order/review/page.tsx",
                                                                                        lineNumber: 1469,
                                                                                        columnNumber: 69
                                                                                    }, this),
                                                                                    ' ',
                                                                                    "หน่วย",
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$user$2d$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                        className: "mx-1 text-slate-300",
                                                                                        children: "|"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/user-frontend-next/app/order/review/page.tsx",
                                                                                        lineNumber: 1479,
                                                                                        columnNumber: 69
                                                                                    }, this),
                                                                                    "ราคาต่อหน่วย:",
                                                                                    ' ',
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$user$2d$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                                        className: "text-slate-700",
                                                                                        children: [
                                                                                            "฿",
                                                                                            unitPrice
                                                                                        ]
                                                                                    }, void 0, true, {
                                                                                        fileName: "[project]/user-frontend-next/app/order/review/page.tsx",
                                                                                        lineNumber: 1487,
                                                                                        columnNumber: 69
                                                                                    }, this)
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/user-frontend-next/app/order/review/page.tsx",
                                                                                lineNumber: 1465,
                                                                                columnNumber: 65
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/user-frontend-next/app/order/review/page.tsx",
                                                                        lineNumber: 1456,
                                                                        columnNumber: 61
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$user$2d$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "text-right",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$user$2d$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                className: "text-[10px] text-slate-400 block",
                                                                                children: "ราคารวม"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/user-frontend-next/app/order/review/page.tsx",
                                                                                lineNumber: 1499,
                                                                                columnNumber: 65
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$user$2d$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                className: "font-bold text-slate-900 text-sm",
                                                                                children: [
                                                                                    "฿ ",
                                                                                    item.subtotal
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/user-frontend-next/app/order/review/page.tsx",
                                                                                lineNumber: 1505,
                                                                                columnNumber: 65
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/user-frontend-next/app/order/review/page.tsx",
                                                                        lineNumber: 1497,
                                                                        columnNumber: 61
                                                                    }, this)
                                                                ]
                                                            }, item.id || idx, true, {
                                                                fileName: "[project]/user-frontend-next/app/order/review/page.tsx",
                                                                lineNumber: 1449,
                                                                columnNumber: 57
                                                            }, this);
                                                        }) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$user$2d$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-center text-slate-400 py-2",
                                                            children: "ไม่มีรายการสินค้าใน order_item"
                                                        }, void 0, false, {
                                                            fileName: "[project]/user-frontend-next/app/order/review/page.tsx",
                                                            lineNumber: 1521,
                                                            columnNumber: 45
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/user-frontend-next/app/order/review/page.tsx",
                                                        lineNumber: 1427,
                                                        columnNumber: 37
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$user$2d$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-xs text-slate-600 pt-1",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$user$2d$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "font-medium",
                                                                children: "หมายเหตุ / Description:"
                                                            }, void 0, false, {
                                                                fileName: "[project]/user-frontend-next/app/order/review/page.tsx",
                                                                lineNumber: 1534,
                                                                columnNumber: 41
                                                            }, this),
                                                            ' ',
                                                            orderData?.description || '-'
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/user-frontend-next/app/order/review/page.tsx",
                                                        lineNumber: 1532,
                                                        columnNumber: 37
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/user-frontend-next/app/order/review/page.tsx",
                                                lineNumber: 1419,
                                                columnNumber: 33
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$user$2d$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "mt-6 pt-4 border-t border-slate-100 flex justify-between items-center",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$user$2d$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$user$2d$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-xs text-slate-500 block",
                                                            children: "ยอดรวมทั้งสิ้น"
                                                        }, void 0, false, {
                                                            fileName: "[project]/user-frontend-next/app/order/review/page.tsx",
                                                            lineNumber: 1554,
                                                            columnNumber: 41
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$user$2d$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-base font-bold text-slate-900",
                                                            children: [
                                                                "฿",
                                                                ' ',
                                                                orderData?.total_price || '0.00'
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/user-frontend-next/app/order/review/page.tsx",
                                                            lineNumber: 1560,
                                                            columnNumber: 41
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/user-frontend-next/app/order/review/page.tsx",
                                                    lineNumber: 1552,
                                                    columnNumber: 37
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/user-frontend-next/app/order/review/page.tsx",
                                                lineNumber: 1550,
                                                columnNumber: 33
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/user-frontend-next/app/order/review/page.tsx",
                                        lineNumber: 1361,
                                        columnNumber: 29
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$user$2d$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "space-y-4 bg-slate-50/50 p-6 rounded-2xl border border-slate-200 shadow-sm",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$user$2d$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex bg-slate-200/80 p-1 rounded-xl",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$user$2d$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        type: "button",
                                                        onClick: ()=>setFormTab('review'),
                                                        className: `flex-1 py-2 text-xs font-semibold rounded-lg transition flex items-center justify-center gap-1.5 ${formTab === 'review' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`,
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$user$2d$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$user$2d$frontend$2d$next$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$star$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Star$3e$__["Star"], {
                                                                className: "w-3.5 h-3.5"
                                                            }, void 0, false, {
                                                                fileName: "[project]/user-frontend-next/app/order/review/page.tsx",
                                                                lineNumber: 1594,
                                                                columnNumber: 41
                                                            }, this),
                                                            "รีวิวสินค้า"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/user-frontend-next/app/order/review/page.tsx",
                                                        lineNumber: 1583,
                                                        columnNumber: 37
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$user$2d$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        type: "button",
                                                        onClick: ()=>setFormTab('report'),
                                                        className: `flex-1 py-2 text-xs font-semibold rounded-lg transition flex items-center justify-center gap-1.5 ${formTab === 'report' ? 'bg-white text-red-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`,
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$user$2d$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$user$2d$frontend$2d$next$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__["AlertTriangle"], {
                                                                className: "w-3.5 h-3.5"
                                                            }, void 0, false, {
                                                                fileName: "[project]/user-frontend-next/app/order/review/page.tsx",
                                                                lineNumber: 1611,
                                                                columnNumber: 41
                                                            }, this),
                                                            "รายงานปัญหา"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/user-frontend-next/app/order/review/page.tsx",
                                                        lineNumber: 1600,
                                                        columnNumber: 37
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/user-frontend-next/app/order/review/page.tsx",
                                                lineNumber: 1581,
                                                columnNumber: 33
                                            }, this),
                                            formTab === 'review' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$user$2d$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "space-y-4 pt-1",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$user$2d$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                        className: "text-xs font-bold text-slate-700",
                                                        children: "ให้คะแนนและความคิดเห็น"
                                                    }, void 0, false, {
                                                        fileName: "[project]/user-frontend-next/app/order/review/page.tsx",
                                                        lineNumber: 1627,
                                                        columnNumber: 41
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$user$2d$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "bg-white p-4 rounded-xl border border-slate-200 flex justify-center items-center gap-3",
                                                        children: [
                                                            1,
                                                            2,
                                                            3,
                                                            4,
                                                            5
                                                        ].map((star)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$user$2d$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                type: "button",
                                                                onClick: ()=>setRating(star),
                                                                onMouseEnter: ()=>setHoverRating(star),
                                                                onMouseLeave: ()=>setHoverRating(0),
                                                                className: "focus:outline-none transition transform hover:scale-110",
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$user$2d$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$user$2d$frontend$2d$next$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$star$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Star$3e$__["Star"], {
                                                                    className: `w-9 h-9 ${(hoverRating || rating) >= star ? 'text-amber-400 fill-amber-400 drop-shadow-sm' : 'text-slate-300'}`
                                                                }, void 0, false, {
                                                                    fileName: "[project]/user-frontend-next/app/order/review/page.tsx",
                                                                    lineNumber: 1657,
                                                                    columnNumber: 57
                                                                }, this)
                                                            }, star, false, {
                                                                fileName: "[project]/user-frontend-next/app/order/review/page.tsx",
                                                                lineNumber: 1640,
                                                                columnNumber: 53
                                                            }, this))
                                                    }, void 0, false, {
                                                        fileName: "[project]/user-frontend-next/app/order/review/page.tsx",
                                                        lineNumber: 1635,
                                                        columnNumber: 41
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$user$2d$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$user$2d$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                className: "text-xs font-semibold text-slate-700 block mb-2",
                                                                children: "การให้บริการ (เลือกหัวข้อที่ประทับใจ) :"
                                                            }, void 0, false, {
                                                                fileName: "[project]/user-frontend-next/app/order/review/page.tsx",
                                                                lineNumber: 1677,
                                                                columnNumber: 45
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$user$2d$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "space-y-2 bg-white p-3 rounded-xl border border-slate-200",
                                                                children: serviceReviewList.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$user$2d$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                        className: "flex items-center gap-2.5 text-xs cursor-pointer hover:bg-slate-50 p-2 rounded-lg transition",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$user$2d$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                                type: "checkbox",
                                                                                checked: selectedServiceReviews.includes(item.id),
                                                                                onChange: ()=>toggleServiceReview(item.id),
                                                                                className: "rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/user-frontend-next/app/order/review/page.tsx",
                                                                                lineNumber: 1694,
                                                                                columnNumber: 61
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$user$2d$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                className: "text-slate-700 font-medium",
                                                                                children: item.label
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/user-frontend-next/app/order/review/page.tsx",
                                                                                lineNumber: 1707,
                                                                                columnNumber: 61
                                                                            }, this)
                                                                        ]
                                                                    }, item.id, true, {
                                                                        fileName: "[project]/user-frontend-next/app/order/review/page.tsx",
                                                                        lineNumber: 1689,
                                                                        columnNumber: 57
                                                                    }, this))
                                                            }, void 0, false, {
                                                                fileName: "[project]/user-frontend-next/app/order/review/page.tsx",
                                                                lineNumber: 1684,
                                                                columnNumber: 45
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/user-frontend-next/app/order/review/page.tsx",
                                                        lineNumber: 1675,
                                                        columnNumber: 41
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$user$2d$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "border-2 border-dashed border-slate-300 rounded-xl p-4 text-center bg-white hover:bg-slate-50 transition cursor-pointer relative",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$user$2d$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                type: "file",
                                                                accept: "image/*",
                                                                onChange: (e)=>{
                                                                    const file = e.target.files?.[0];
                                                                    if (file) {
                                                                        // เก็บชื่อไฟล์
                                                                        setImageUrl(file.name);
                                                                        // สร้าง Preview
                                                                        const previewUrl = URL.createObjectURL(file);
                                                                        setImagePreview(previewUrl);
                                                                    }
                                                                },
                                                                className: "absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                            }, void 0, false, {
                                                                fileName: "[project]/user-frontend-next/app/order/review/page.tsx",
                                                                lineNumber: 1728,
                                                                columnNumber: 45
                                                            }, this),
                                                            imagePreview ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$user$2d$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex flex-col items-center gap-3",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$user$2d$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                                        src: imagePreview,
                                                                        alt: "ตัวอย่างรูปภาพรีวิว",
                                                                        className: "w-full max-h-64 object-contain rounded-lg border border-slate-200"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/user-frontend-next/app/order/review/page.tsx",
                                                                        lineNumber: 1763,
                                                                        columnNumber: 53
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$user$2d$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        className: "text-xs font-medium text-slate-600",
                                                                        children: [
                                                                            "📎 ",
                                                                            imageUrl
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/user-frontend-next/app/order/review/page.tsx",
                                                                        lineNumber: 1769,
                                                                        columnNumber: 53
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$user$2d$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "text-[10px] text-slate-400",
                                                                        children: "คลิกที่รูปเพื่อเปลี่ยนรูปภาพ"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/user-frontend-next/app/order/review/page.tsx",
                                                                        lineNumber: 1775,
                                                                        columnNumber: 53
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/user-frontend-next/app/order/review/page.tsx",
                                                                lineNumber: 1761,
                                                                columnNumber: 49
                                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$user$2d$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex flex-col items-center justify-center space-y-1",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$user$2d$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500",
                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$user$2d$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$user$2d$frontend$2d$next$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$upload$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Upload$3e$__["Upload"], {
                                                                            className: "w-5 h-5"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/user-frontend-next/app/order/review/page.tsx",
                                                                            lineNumber: 1789,
                                                                            columnNumber: 57
                                                                        }, this)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/user-frontend-next/app/order/review/page.tsx",
                                                                        lineNumber: 1787,
                                                                        columnNumber: 53
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$user$2d$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        className: "text-xs font-medium text-slate-600",
                                                                        children: "คลิกเพื่ออัปโหลดรูปภาพรีวิวสินค้า"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/user-frontend-next/app/order/review/page.tsx",
                                                                        lineNumber: 1793,
                                                                        columnNumber: 53
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$user$2d$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "text-[10px] text-slate-400",
                                                                        children: "PNG, JPG หรืออื่นๆ"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/user-frontend-next/app/order/review/page.tsx",
                                                                        lineNumber: 1799,
                                                                        columnNumber: 53
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/user-frontend-next/app/order/review/page.tsx",
                                                                lineNumber: 1785,
                                                                columnNumber: 49
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/user-frontend-next/app/order/review/page.tsx",
                                                        lineNumber: 1726,
                                                        columnNumber: 41
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$user$2d$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$user$2d$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                                            rows: 3,
                                                            placeholder: "แสดงความคิดเห็นเพิ่มเติม...",
                                                            value: comment,
                                                            onChange: (e)=>setComment(e.target.value),
                                                            className: "w-full p-3 rounded-xl bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs text-slate-800 resize-none placeholder-slate-400"
                                                        }, void 0, false, {
                                                            fileName: "[project]/user-frontend-next/app/order/review/page.tsx",
                                                            lineNumber: 1815,
                                                            columnNumber: 45
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/user-frontend-next/app/order/review/page.tsx",
                                                        lineNumber: 1813,
                                                        columnNumber: 41
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$user$2d$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        type: "button",
                                                        onClick: handleSubmitReview,
                                                        disabled: submitting,
                                                        className: "w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md transition flex items-center justify-center gap-2 text-sm disabled:opacity-60",
                                                        children: submitting ? 'กำลังบันทึกข้อมูล...' : 'ยืนยันรีวิว'
                                                    }, void 0, false, {
                                                        fileName: "[project]/user-frontend-next/app/order/review/page.tsx",
                                                        lineNumber: 1833,
                                                        columnNumber: 41
                                                    }, this),
                                                    success && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$user$2d$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-emerald-700 text-xs",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$user$2d$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$user$2d$frontend$2d$next$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2d$big$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle$3e$__["CheckCircle"], {
                                                                className: "w-4 h-4 flex-shrink-0"
                                                            }, void 0, false, {
                                                                fileName: "[project]/user-frontend-next/app/order/review/page.tsx",
                                                                lineNumber: 1850,
                                                                columnNumber: 49
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$user$2d$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                children: "บันทึกรีวิวของคุณลงตาราง review สำเร็จเรียบร้อย!"
                                                            }, void 0, false, {
                                                                fileName: "[project]/user-frontend-next/app/order/review/page.tsx",
                                                                lineNumber: 1852,
                                                                columnNumber: 49
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/user-frontend-next/app/order/review/page.tsx",
                                                        lineNumber: 1848,
                                                        columnNumber: 45
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/user-frontend-next/app/order/review/page.tsx",
                                                lineNumber: 1625,
                                                columnNumber: 37
                                            }, this),
                                            formTab === 'report' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$user$2d$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "space-y-4 pt-1",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$user$2d$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                        className: "text-xs font-bold text-red-600 flex items-center gap-1",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$user$2d$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$user$2d$frontend$2d$next$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__["AlertTriangle"], {
                                                                className: "w-4 h-4"
                                                            }, void 0, false, {
                                                                fileName: "[project]/user-frontend-next/app/order/review/page.tsx",
                                                                lineNumber: 1877,
                                                                columnNumber: 45
                                                            }, this),
                                                            "ระบุรายละเอียดของปัญหา"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/user-frontend-next/app/order/review/page.tsx",
                                                        lineNumber: 1875,
                                                        columnNumber: 41
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$user$2d$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "bg-white p-4 rounded-xl border border-slate-200 flex justify-center items-center gap-3",
                                                        children: [
                                                            1,
                                                            2,
                                                            3,
                                                            4,
                                                            5
                                                        ].map((star)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$user$2d$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                type: "button",
                                                                onClick: ()=>setReportRating(star),
                                                                onMouseEnter: ()=>setReportHoverRating(star),
                                                                onMouseLeave: ()=>setReportHoverRating(0),
                                                                className: "focus:outline-none transition transform hover:scale-110",
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$user$2d$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$user$2d$frontend$2d$next$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$star$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Star$3e$__["Star"], {
                                                                    className: `w-9 h-9 ${(reportHoverRating || reportRating) >= star ? 'text-red-500 fill-red-500 drop-shadow-sm' : 'text-slate-300'}`
                                                                }, void 0, false, {
                                                                    fileName: "[project]/user-frontend-next/app/order/review/page.tsx",
                                                                    lineNumber: 1911,
                                                                    columnNumber: 57
                                                                }, this)
                                                            }, star, false, {
                                                                fileName: "[project]/user-frontend-next/app/order/review/page.tsx",
                                                                lineNumber: 1890,
                                                                columnNumber: 53
                                                            }, this))
                                                    }, void 0, false, {
                                                        fileName: "[project]/user-frontend-next/app/order/review/page.tsx",
                                                        lineNumber: 1885,
                                                        columnNumber: 41
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$user$2d$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$user$2d$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                className: "text-xs font-semibold text-slate-700 block mb-2",
                                                                children: "หัวข้อปัญหาที่พบ (เลือกหัวข้อที่ตรงกับปัญหา):"
                                                            }, void 0, false, {
                                                                fileName: "[project]/user-frontend-next/app/order/review/page.tsx",
                                                                lineNumber: 1931,
                                                                columnNumber: 45
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$user$2d$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "space-y-2 bg-white p-3 rounded-xl border border-slate-200",
                                                                children: reportIssueList.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$user$2d$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                        className: "flex items-center gap-2.5 text-xs cursor-pointer hover:bg-slate-50 p-2 rounded-lg transition",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$user$2d$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                                type: "checkbox",
                                                                                checked: selectedReportIssues.includes(item.id),
                                                                                onChange: ()=>toggleReportIssue(item.id),
                                                                                className: "rounded border-slate-300 text-red-600 focus:ring-red-500 w-4 h-4"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/user-frontend-next/app/order/review/page.tsx",
                                                                                lineNumber: 1948,
                                                                                columnNumber: 61
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$user$2d$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                className: "text-slate-700 font-medium",
                                                                                children: item.label
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/user-frontend-next/app/order/review/page.tsx",
                                                                                lineNumber: 1961,
                                                                                columnNumber: 61
                                                                            }, this)
                                                                        ]
                                                                    }, item.id, true, {
                                                                        fileName: "[project]/user-frontend-next/app/order/review/page.tsx",
                                                                        lineNumber: 1943,
                                                                        columnNumber: 57
                                                                    }, this))
                                                            }, void 0, false, {
                                                                fileName: "[project]/user-frontend-next/app/order/review/page.tsx",
                                                                lineNumber: 1938,
                                                                columnNumber: 45
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/user-frontend-next/app/order/review/page.tsx",
                                                        lineNumber: 1929,
                                                        columnNumber: 41
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$user$2d$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "border-2 border-dashed border-slate-300 rounded-xl p-4 text-center bg-white hover:bg-slate-50 transition cursor-pointer relative",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$user$2d$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                type: "file",
                                                                accept: "image/*",
                                                                onChange: (e)=>{
                                                                    const file = e.target.files?.[0];
                                                                    if (file) {
                                                                        // เก็บชื่อไฟล์
                                                                        setReportImageUrl(file.name);
                                                                        // สร้าง Preview
                                                                        const previewUrl = URL.createObjectURL(file);
                                                                        setReportImagePreview(previewUrl);
                                                                    }
                                                                },
                                                                className: "absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                            }, void 0, false, {
                                                                fileName: "[project]/user-frontend-next/app/order/review/page.tsx",
                                                                lineNumber: 1982,
                                                                columnNumber: 45
                                                            }, this),
                                                            reportImagePreview ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$user$2d$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex flex-col items-center gap-3",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$user$2d$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                                        src: reportImagePreview,
                                                                        alt: "ตัวอย่างหลักฐานปัญหา",
                                                                        className: "w-full max-h-64 object-contain rounded-lg border border-red-100"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/user-frontend-next/app/order/review/page.tsx",
                                                                        lineNumber: 2017,
                                                                        columnNumber: 53
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$user$2d$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        className: "text-xs font-medium text-slate-600",
                                                                        children: [
                                                                            "📎",
                                                                            ' ',
                                                                            reportImageUrl
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/user-frontend-next/app/order/review/page.tsx",
                                                                        lineNumber: 2025,
                                                                        columnNumber: 53
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$user$2d$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "text-[10px] text-slate-400",
                                                                        children: "คลิกที่รูปเพื่อเปลี่ยนรูปภาพ"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/user-frontend-next/app/order/review/page.tsx",
                                                                        lineNumber: 2035,
                                                                        columnNumber: 53
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/user-frontend-next/app/order/review/page.tsx",
                                                                lineNumber: 2015,
                                                                columnNumber: 49
                                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$user$2d$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex flex-col items-center justify-center space-y-1",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$user$2d$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-red-500",
                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$user$2d$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$user$2d$frontend$2d$next$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$upload$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Upload$3e$__["Upload"], {
                                                                            className: "w-5 h-5"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/user-frontend-next/app/order/review/page.tsx",
                                                                            lineNumber: 2049,
                                                                            columnNumber: 57
                                                                        }, this)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/user-frontend-next/app/order/review/page.tsx",
                                                                        lineNumber: 2047,
                                                                        columnNumber: 53
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$user$2d$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        className: "text-xs font-medium text-slate-600",
                                                                        children: "คลิกเพื่ออัปโหลดรูปภาพหลักฐานปัญหา"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/user-frontend-next/app/order/review/page.tsx",
                                                                        lineNumber: 2053,
                                                                        columnNumber: 53
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$user$2d$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "text-[10px] text-slate-400",
                                                                        children: "PNG, JPG หรืออื่นๆ"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/user-frontend-next/app/order/review/page.tsx",
                                                                        lineNumber: 2059,
                                                                        columnNumber: 53
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/user-frontend-next/app/order/review/page.tsx",
                                                                lineNumber: 2045,
                                                                columnNumber: 49
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/user-frontend-next/app/order/review/page.tsx",
                                                        lineNumber: 1980,
                                                        columnNumber: 41
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$user$2d$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$user$2d$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                                            rows: 3,
                                                            placeholder: "อธิบายรายละเอียดปัญหาเพิ่มเติม...",
                                                            value: reportComment,
                                                            onChange: (e)=>setReportComment(e.target.value),
                                                            className: "w-full p-3 rounded-xl bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-red-500 text-xs text-slate-800 resize-none placeholder-slate-400"
                                                        }, void 0, false, {
                                                            fileName: "[project]/user-frontend-next/app/order/review/page.tsx",
                                                            lineNumber: 2075,
                                                            columnNumber: 45
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/user-frontend-next/app/order/review/page.tsx",
                                                        lineNumber: 2073,
                                                        columnNumber: 41
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$user$2d$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        type: "button",
                                                        onClick: handleSubmitReport,
                                                        disabled: submittingReport,
                                                        className: "w-full py-3.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-md transition flex items-center justify-center gap-2 text-sm disabled:opacity-60",
                                                        children: submittingReport ? 'กำลังส่งรายงาน...' : 'ยืนยันรายงานปัญหา'
                                                    }, void 0, false, {
                                                        fileName: "[project]/user-frontend-next/app/order/review/page.tsx",
                                                        lineNumber: 2093,
                                                        columnNumber: 41
                                                    }, this),
                                                    reportSuccess && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$user$2d$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-red-700 text-xs",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$user$2d$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$user$2d$frontend$2d$next$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2d$big$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle$3e$__["CheckCircle"], {
                                                                className: "w-4 h-4 flex-shrink-0"
                                                            }, void 0, false, {
                                                                fileName: "[project]/user-frontend-next/app/order/review/page.tsx",
                                                                lineNumber: 2110,
                                                                columnNumber: 49
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$user$2d$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                children: "ส่งรายงานปัญหาเรียบร้อยแล้ว ทีมงานจะตรวจสอบโดยเร็วที่สุด"
                                                            }, void 0, false, {
                                                                fileName: "[project]/user-frontend-next/app/order/review/page.tsx",
                                                                lineNumber: 2112,
                                                                columnNumber: 49
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/user-frontend-next/app/order/review/page.tsx",
                                                        lineNumber: 2108,
                                                        columnNumber: 45
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/user-frontend-next/app/order/review/page.tsx",
                                                lineNumber: 1873,
                                                columnNumber: 37
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/user-frontend-next/app/order/review/page.tsx",
                                        lineNumber: 1577,
                                        columnNumber: 29
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/user-frontend-next/app/order/review/page.tsx",
                                lineNumber: 1357,
                                columnNumber: 25
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/user-frontend-next/app/order/review/page.tsx",
                        lineNumber: 1327,
                        columnNumber: 21
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/user-frontend-next/app/order/review/page.tsx",
                lineNumber: 1279,
                columnNumber: 13
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/user-frontend-next/app/order/review/page.tsx",
        lineNumber: 1202,
        columnNumber: 9
    }, this);
}
_s(OrderReviewPage, "/yaQ0VrbJ3jkbj517cO6Xj1jHwE=");
_c = OrderReviewPage;
var _c;
__turbopack_context__.k.register(_c, "OrderReviewPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=user-frontend-next_app_order_review_page_tsx_07rjk0c._.js.map