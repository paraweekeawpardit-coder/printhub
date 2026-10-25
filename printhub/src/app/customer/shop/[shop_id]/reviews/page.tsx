"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { Star, Loader2, ArrowLeft, MessageSquare, AlertCircle, User, Printer } from "lucide-react";

interface OrderItem {
    id?: string | number;
    category?: string;
    describe?: string;
    quantity?: number;
    unit_price?: number;
    subtotal?: number;
}

interface ReviewItem {
    id: string;
    score: number;
    rating?: number;
    comment: string | null;
    shop_reply?: string | null; // 🟢 เพิ่ม field ข้อความตอบกลับจากร้านค้า
    reply_at?: string | null;   // 🟢 เพิ่ม field เวลาตอบกลับ
    image_url: string | null;
    created_at?: string;
    customer_name?: string;
    customer?: {
        first_name: string;
        last_name: string;
    };
    print_order?: {
        id?: string;
        description?: string | null;
        print_order_item?: OrderItem[];
    };
}

export default function ShopReviewsPage() {
    const params = useParams();
    const router = useRouter();

    const rawShopId = params?.shop_id || params?.id;
    const shopId = Array.isArray(rawShopId) ? rawShopId[0] : (rawShopId as string);

    const [reviews, setReviews] = useState<ReviewItem[]>([]);
    const [summary, setSummary] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedStar, setSelectedStar] = useState<number | "all">("all");

    useEffect(() => {
        if (!shopId || shopId === "undefined") {
            setLoading(false);
            setError("ไม่พบรหัสร้านค้า (Shop ID)");
            return;
        }

        const fetchShopReviews = async () => {
            try {
                setLoading(true);
                setError("");

                const res = await fetch(`http://localhost:5000/api/customer/shops/${shopId}/reviews`);
                const text = await res.text();
                let json;

                try {
                    json = JSON.parse(text);
                } catch {
                    throw new Error("เซิร์ฟเวอร์ส่งการตอบรับที่ไม่ถูกต้องกลับมา");
                }

                if (res.ok && json.success) {
                    setReviews(json.data || []);
                    setSummary(json.summary || null);
                } else {
                    setError(json.message || `ไม่สามารถโหลดข้อมูลรีวิวได้ (HTTP ${res.status})`);
                }
            } catch (err: any) {
                console.error("Fetch shop reviews error:", err);
                setError(err.message || "เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์");
            } finally {
                setLoading(false);
            }
        };

        fetchShopReviews();
    }, [shopId]);

    const getRatingValue = (r: ReviewItem) => Number(r.rating ?? r.score ?? 0);

    const totalReviews = summary?.total_reviews ?? reviews.length;
    const avgRating = useMemo(() => {
        if (summary?.average_rating) return Number(summary.average_rating).toFixed(1);
        if (totalReviews === 0) return "0.0";
        const sum = reviews.reduce((acc, r) => acc + getRatingValue(r), 0);
        return (sum / totalReviews).toFixed(1);
    }, [reviews, totalReviews, summary]);

    const counts = useMemo(() => {
        const c: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
        reviews.forEach((r) => {
            const val = Math.round(getRatingValue(r));
            if (c[val] !== undefined) {
                c[val] += 1;
            }
        });
        return c;
    }, [reviews]);

    const filteredReviews = useMemo(() => {
        if (selectedStar === "all") return reviews;
        return reviews.filter((r) => Math.round(getRatingValue(r)) === selectedStar);
    }, [reviews, selectedStar]);

    const formatDate = (dateStr?: string) => {
        if (!dateStr) return "";
        const d = new Date(dateStr);
        if (isNaN(d.getTime())) return dateStr;
        return d.toLocaleDateString("th-TH", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });
    };

    const formatCustomerName = (rev: ReviewItem) => {
        let fullName = rev.customer_name || "";
        if (!fullName && rev.customer) {
            fullName = `${rev.customer.first_name || ""} ${rev.customer.last_name || ""}`.trim();
        }
        if (!fullName) return "ลูกค้าผู้ใช้บริการ";

        const parts = fullName.split(" ");
        if (parts.length > 1) {
            const firstName = parts[0];
            const lastInitial = parts[parts.length - 1].charAt(0);
            return `${firstName} ${lastInitial}.`;
        }
        return fullName;
    };

    const cleanDescription = (text?: string) => {
        if (!text) return "";
        return text
            .replace(/\|\s*(SINGLE|ไม่มี)/gi, "")
            .replace(/(SINGLE|ไม่มี)/gi, "")
            .replace(/\|\s*$/g, "")
            .trim();
    };

    const renderOrderItemsDetail = (rev: ReviewItem) => {
        const itemsList = rev.print_order?.print_order_item || [];

        if (itemsList.length > 0) {
            return (
                <div className="space-y-1.5">
                    {itemsList.map((item, idx) => {
                        const cleanedDesc = cleanDescription(item.describe);
                        return (
                            <div key={item.id || idx} className="text-xs text-slate-700 bg-white p-2.5 rounded-lg border border-emerald-100 flex justify-between items-center">
                                <div className="flex flex-col">
                                    <span className="font-semibold text-slate-900">
                                        • {item.category || "งานพิมพ์"} {item.quantity ? <span className="text-slate-500 font-normal">(จำนวน {item.quantity} ชิ้น)</span> : ""}
                                    </span>
                                    {cleanedDesc && (
                                        <p className="text-[11px] text-slate-500 pl-3 pt-0.5">
                                            {cleanedDesc}
                                        </p>
                                    )}
                                </div>
                                {item.subtotal !== undefined && (
                                    <span className="font-semibold text-emerald-800 text-xs shrink-0 pl-2">
                                        ฿{Number(item.subtotal).toFixed(2)}
                                    </span>
                                )}
                            </div>
                        );
                    })}
                </div>
            );
        }

        if (rev.print_order?.description) {
            const cleanedDesc = cleanDescription(rev.print_order.description);
            if (cleanedDesc) {
                return <p className="text-xs text-slate-700">{cleanedDesc}</p>;
            }
        }

        return null;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 font-sans pb-12">
            <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
                <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="flex items-center gap-2 text-slate-600 hover:text-slate-900 font-semibold text-xs bg-slate-100 hover:bg-slate-200 px-3.5 py-2 rounded-xl transition cursor-pointer"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        ย้อนกลับ
                    </button>
                    <h1 className="font-bold text-base text-slate-900">รีวิวจากลูกค้า</h1>
                    <div className="w-20" />
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-6 py-6 space-y-6">
                {error ? (
                    <div className="p-4 bg-rose-50 border border-rose-200 text-rose-600 rounded-2xl text-center text-xs flex items-center justify-center gap-2">
                        <AlertCircle className="w-4 h-4 text-rose-500" />
                        <span>{error}</span>
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-xs space-y-6">
                        <div className="border-b border-slate-100 pb-4">
                            <h3 className="text-base font-bold text-[#0F2942]">
                                ความคิดเห็น
                            </h3>
                            <p className="text-xs text-slate-500">
                                รีวิวและความคิดเห็นจากลูกค้าผู้ใช้บริการ
                            </p>
                        </div>

                        <div className="grid grid-cols-1 gap-6 rounded-xl border border-slate-100 bg-slate-50/50 p-4 md:grid-cols-3">
                            <div className="flex flex-col items-center justify-center border-b border-slate-200/60 pb-4 md:border-b-0 md:border-r md:pb-0">
                                <span className="text-4xl font-extrabold text-slate-800">
                                    {avgRating}
                                </span>
                                <div className="my-1.5 flex gap-1">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <Star
                                            key={star}
                                            className={`h-4 w-4 ${star <= Math.round(Number(avgRating))
                                                ? "fill-amber-400 text-amber-400"
                                                : "text-slate-300"
                                                }`}
                                        />
                                    ))}
                                </div>
                                <span className="text-xs text-slate-500">
                                    จากทั้งหมด {totalReviews} รีวิว
                                </span>
                            </div>

                            <div className="col-span-2 space-y-1.5">
                                {[5, 4, 3, 2, 1].map((star) => {
                                    const breakdownItem = summary?.rating_breakdown?.find(
                                        (b: any) => b.stars === star
                                    );
                                    const count = breakdownItem?.count ?? counts[star] ?? 0;
                                    const percentage =
                                        breakdownItem?.percentage ??
                                        (totalReviews > 0 ? (count / totalReviews) * 100 : 0);

                                    return (
                                        <div key={star} className="flex items-center gap-2 text-xs">
                                            <span className="flex w-12 items-center gap-1 font-semibold text-slate-600">
                                                {star} <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                                            </span>
                                            <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-200">
                                                <div
                                                    style={{ width: `${percentage}%` }}
                                                    className="h-full rounded-full bg-amber-400 transition-all duration-300"
                                                />
                                            </div>
                                            <span className="w-16 text-right text-slate-400 font-mono">
                                                {count} ({Math.round(percentage)}%)
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 border-b border-slate-100 pb-3">
                            <span className="text-xs font-semibold text-slate-500">กรองดาว:</span>
                            <button
                                type="button"
                                onClick={() => setSelectedStar("all")}
                                className={`rounded-lg px-3 py-1 text-xs font-medium transition-all cursor-pointer ${selectedStar === "all"
                                    ? "bg-slate-800 text-white shadow-sm"
                                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                    }`}
                            >
                                ทั้งหมด
                            </button>
                            {[5, 4, 3, 2, 1].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setSelectedStar(star)}
                                    className={`flex items-center gap-1 rounded-lg px-3 py-1 text-xs font-medium transition-all cursor-pointer ${selectedStar === star
                                        ? "bg-amber-500 text-white shadow-sm"
                                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                        }`}
                                >
                                    <span>{star}</span>
                                    <Star
                                        className={`h-3 w-3 ${selectedStar === star ? "fill-white text-white" : "fill-amber-400 text-amber-400"
                                            }`}
                                    />
                                    <span className="text-[10px] opacity-80">({counts[star] || 0})</span>
                                </button>
                            ))}
                        </div>

                        {filteredReviews.length === 0 ? (
                            <div className="py-12 text-center space-y-3">
                                <MessageSquare className="w-12 h-12 text-slate-300 mx-auto" />
                                <p className="text-sm font-bold text-slate-700">ไม่พบรีวิวในระดับดาวนี้</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {filteredReviews.map((rev) => {
                                    const scoreVal = getRatingValue(rev);
                                    const customerName = formatCustomerName(rev);
                                    const orderDetailsNode = renderOrderItemsDetail(rev);

                                    return (
                                        <div
                                            key={rev.id}
                                            className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs transition-all hover:border-slate-300 space-y-3"
                                        >
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-50 text-amber-600 font-bold border border-amber-100 text-sm">
                                                        {customerName ? customerName.charAt(0) : <User className="h-4 w-4" />}
                                                    </div>
                                                    <div>
                                                        <h4 className="text-xs font-bold text-slate-800">{customerName}</h4>
                                                        <div className="flex items-center gap-0.5 mt-0.5">
                                                            {[1, 2, 3, 4, 5].map((s) => (
                                                                <Star
                                                                    key={s}
                                                                    className={`h-3.5 w-3.5 ${s <= scoreVal ? "fill-amber-400 text-amber-400" : "text-slate-200"
                                                                        }`}
                                                                />
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                                <span className="text-xs text-slate-400">{formatDate(rev.created_at)}</span>
                                            </div>

                                            {orderDetailsNode && (
                                                <div className="rounded-xl bg-emerald-50/50 p-3 border border-emerald-100 text-emerald-900">
                                                    <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 mb-1">
                                                        <Printer className="h-4 w-4 text-emerald-600 shrink-0" />
                                                        <span>รายการสินค้าที่สั่งซื้อ</span>
                                                    </div>
                                                    {orderDetailsNode}
                                                </div>
                                            )}

                                            {rev.comment && (
                                                <p className="text-xs text-slate-700 leading-relaxed bg-slate-50/60 p-3 rounded-xl border border-slate-100">
                                                    {rev.comment}
                                                </p>
                                            )}

                                            {rev.image_url && (
                                                <div className="w-32 h-32 rounded-xl overflow-hidden border border-slate-200">
                                                    <img
                                                        src={rev.image_url}
                                                        alt="รูปรีวิวจากลูกค้า"
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                            )}

                                            {/* 🟢 แสดงคำตอบรับจากร้านค้า (ถ้ามี) */}
                                            {rev.shop_reply && (
                                                <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-3 text-xs text-blue-900 space-y-1">
                                                    <div className="flex items-center justify-between font-bold text-blue-700">
                                                        <span className="flex items-center gap-1.5">
                                                            <MessageSquare className="h-3.5 w-3.5 text-blue-600" />
                                                            คำตอบรับจากร้านค้า
                                                        </span>
                                                        {rev.reply_at && (
                                                            <span className="text-[10px] text-blue-400 font-normal">
                                                                {formatDate(rev.reply_at)}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="text-slate-700 leading-relaxed pl-5">
                                                        {rev.shop_reply}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
}