(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/printhub/src/app/shop/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ShopPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/printhub/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/printhub/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/printhub/node_modules/axios/lib/axios.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/printhub/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__ = __turbopack_context__.i("[project]/printhub/node_modules/lucide-react/dist/esm/icons/clock.mjs [app-client] (ecmascript) <export default as Clock>");
var __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$dollar$2d$sign$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__DollarSign$3e$__ = __turbopack_context__.i("[project]/printhub/node_modules/lucide-react/dist/esm/icons/dollar-sign.mjs [app-client] (ecmascript) <export default as DollarSign>");
var __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$star$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Star$3e$__ = __turbopack_context__.i("[project]/printhub/node_modules/lucide-react/dist/esm/icons/star.mjs [app-client] (ecmascript) <export default as Star>");
var __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$src$2f$component$2f$shop$2f$dashboard$2d$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/printhub/src/component/shop/dashboard-card.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$src$2f$component$2f$shop$2f$order$2d$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/printhub/src/component/shop/order-card.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$src$2f$component$2f$shop$2f$navbar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/printhub/src/component/shop/navbar.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$src$2f$component$2f$shop$2f$financial$2d$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/printhub/src/component/shop/financial-table.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$src$2f$component$2f$shop$2f$order$2d$breakdown$2d$modal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/printhub/src/component/shop/order-breakdown-modal.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$src$2f$component$2f$shop$2f$review$2d$complaint$2d$modal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/printhub/src/component/shop/review-complaint-modal.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
;
;
;
;
function ShopPage() {
    _s();
    const [num, setNum] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("0 รายการ");
    const [score, setScore] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("0.0 / 5.0");
    const [income, setIncome] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("0.00 บาท");
    const [todayOrdersCount, setTodayOrdersCount] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const [totalReviewsCount, setTotalReviewsCount] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const [orders, setOrders] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [shopId, setShopId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [activeView, setActiveView] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [financialData, setFinancialData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        totalGross: 0,
        totalFee: 0,
        totalNet: 0,
        transactions: [],
        financialTrend: {
            daily: [],
            weekly: [],
            monthly: [],
            yearly: []
        }
    });
    const [breakdownData, setBreakdownData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        total: 0,
        counts: {},
        orders: [],
        trendData: {
            daily: [],
            weekly: [],
            monthly: [],
            yearly: []
        }
    });
    const [reviewData, setReviewData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        reviews: [],
        complaints: []
    });
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const isFetchingRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ShopPage.useEffect": ()=>{
            const id = localStorage.getItem("shop_id");
            if (id) {
                setShopId(id);
            } else {
                console.error("shop_id not found in localStorage");
            }
        }
    }["ShopPage.useEffect"], []);
    const fetchDashboardData = (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ShopPage.useCallback[fetchDashboardData]": async (opts)=>{
            if (!shopId) return;
            if (isFetchingRef.current) return;
            isFetchingRef.current = true;
            try {
                if (!opts?.silent) setLoading(true);
                const headers = {
                    shop_id: shopId
                };
                const [numRes, scoreRes, incomeRes, ordersRes, financeRes, breakdownRes, reviewRes] = await Promise.all([
                    __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get("http://localhost:5000/shop/numWork", {
                        headers
                    }),
                    __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get("http://localhost:5000/shop/getScore", {
                        headers
                    }),
                    __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get("http://localhost:5000/shop/getIncome", {
                        headers
                    }),
                    __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get("http://localhost:5000/shop/getTopOrder", {
                        headers
                    }),
                    __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get("http://localhost:5000/shop/getFinancialOverview", {
                        headers
                    }),
                    __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get("http://localhost:5000/shop/getOrderStatusBreakdown", {
                        headers
                    }),
                    __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get("http://localhost:5000/shop/getComplaintsAndReviews", {
                        headers
                    })
                ]);
                setNum(`${numRes.data.numWork ?? 0} รายการ`);
                setScore(`${scoreRes.data.score ?? 0.0} / 5.0`);
                setIncome(`${incomeRes.data.income ?? 0} บาท`);
                setTodayOrdersCount(incomeRes.data.orderCount ?? 0);
                setTotalReviewsCount(scoreRes.data.totalReviews ?? 0);
                setOrders(ordersRes.data ?? []);
                setFinancialData(financeRes.data ?? {
                    totalGross: 0,
                    totalFee: 0,
                    totalNet: 0,
                    transactions: [],
                    financialTrend: {
                        daily: [],
                        weekly: [],
                        monthly: [],
                        yearly: []
                    }
                });
                setBreakdownData(breakdownRes.data ?? {
                    total: 0,
                    counts: {},
                    orders: [],
                    trendData: {
                        daily: [],
                        weekly: [],
                        monthly: [],
                        yearly: []
                    }
                });
                setReviewData(reviewRes.data ?? {
                    reviews: [],
                    complaints: []
                });
            } catch (err) {
                console.error("Fetch dashboard data error:", err);
            } finally{
                setLoading(false);
                isFetchingRef.current = false;
            }
        }
    }["ShopPage.useCallback[fetchDashboardData]"], [
        shopId
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ShopPage.useEffect": ()=>{
            fetchDashboardData();
        }
    }["ShopPage.useEffect"], [
        fetchDashboardData
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ShopPage.useEffect": ()=>{
            const handleFocus = {
                "ShopPage.useEffect.handleFocus": ()=>fetchDashboardData({
                        silent: true
                    })
            }["ShopPage.useEffect.handleFocus"];
            const handleVisibility = {
                "ShopPage.useEffect.handleVisibility": ()=>{
                    if (document.visibilityState === "visible") {
                        fetchDashboardData({
                            silent: true
                        });
                    }
                }
            }["ShopPage.useEffect.handleVisibility"];
            window.addEventListener("focus", handleFocus);
            document.addEventListener("visibilitychange", handleVisibility);
            return ({
                "ShopPage.useEffect": ()=>{
                    window.removeEventListener("focus", handleFocus);
                    document.removeEventListener("visibilitychange", handleVisibility);
                }
            })["ShopPage.useEffect"];
        }
    }["ShopPage.useEffect"], [
        fetchDashboardData
    ]);
    // ส่ง orderId (UUID) ในการนำทาง
    const handleOrderClick = (orderId)=>{
        router.push(`/shop/detail/${orderId}`);
    };
    const handleStatusUpdated = ()=>{
        fetchDashboardData({
            silent: true
        });
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen bg-slate-50/50",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$src$2f$component$2f$shop$2f$navbar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                fileName: "[project]/printhub/src/app/shop/page.tsx",
                lineNumber: 206,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mx-auto max-w-7xl px-6 py-8 md:px-12",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: "mb-6 text-lg font-bold text-[#0F2942]",
                        children: "ผลการดำเนินงานด้านคำสั่งพิมพ์"
                    }, void 0, false, {
                        fileName: "[project]/printhub/src/app/shop/page.tsx",
                        lineNumber: 209,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mb-10 grid grid-cols-1 gap-5 md:grid-cols-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$src$2f$component$2f$shop$2f$dashboard$2d$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                title: "รายการที่รอการดำเนินการ",
                                value: num,
                                subtitle: "รอการดำเนินการ / รอพิมพ์",
                                icon: __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__["Clock"],
                                active: activeView === "orders",
                                onClick: ()=>setActiveView(activeView === "orders" ? null : "orders")
                            }, void 0, false, {
                                fileName: "[project]/printhub/src/app/shop/page.tsx",
                                lineNumber: 215,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$src$2f$component$2f$shop$2f$dashboard$2d$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                title: "รายได้ทั้งหมด",
                                value: income,
                                subtitle: `${todayOrdersCount} คำสั่งพิมพ์วันนี้`,
                                icon: __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$dollar$2d$sign$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__DollarSign$3e$__["DollarSign"],
                                active: activeView === "financial",
                                onClick: ()=>setActiveView(activeView === "financial" ? null : "financial")
                            }, void 0, false, {
                                fileName: "[project]/printhub/src/app/shop/page.tsx",
                                lineNumber: 224,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$src$2f$component$2f$shop$2f$dashboard$2d$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                title: "คะแนนรีวิวเฉลี่ย",
                                value: score,
                                subtitle: `${totalReviewsCount} รีวิวทั้งหมด`,
                                icon: __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$star$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Star$3e$__["Star"],
                                active: activeView === "reviews",
                                onClick: ()=>setActiveView(activeView === "reviews" ? null : "reviews")
                            }, void 0, false, {
                                fileName: "[project]/printhub/src/app/shop/page.tsx",
                                lineNumber: 233,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/printhub/src/app/shop/page.tsx",
                        lineNumber: 214,
                        columnNumber: 9
                    }, this),
                    activeView === "orders" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mb-10",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$src$2f$component$2f$shop$2f$order$2d$breakdown$2d$modal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            counts: breakdownData.counts,
                            total: breakdownData.total,
                            orders: breakdownData.orders,
                            trendData: breakdownData.trendData,
                            onOrderClick: handleOrderClick
                        }, void 0, false, {
                            fileName: "[project]/printhub/src/app/shop/page.tsx",
                            lineNumber: 246,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/printhub/src/app/shop/page.tsx",
                        lineNumber: 245,
                        columnNumber: 11
                    }, this),
                    activeView === "financial" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mb-10",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$src$2f$component$2f$shop$2f$financial$2d$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            totalGross: financialData.totalGross,
                            totalFee: financialData.totalFee,
                            totalNet: financialData.totalNet,
                            transactions: financialData.transactions,
                            financialTrend: financialData.financialTrend,
                            onOrderClick: handleOrderClick
                        }, void 0, false, {
                            fileName: "[project]/printhub/src/app/shop/page.tsx",
                            lineNumber: 258,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/printhub/src/app/shop/page.tsx",
                        lineNumber: 257,
                        columnNumber: 11
                    }, this),
                    activeView === "reviews" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mb-10",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$src$2f$component$2f$shop$2f$review$2d$complaint$2d$modal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            reviews: reviewData.reviews,
                            complaints: reviewData.complaints,
                            onOrderClick: handleOrderClick
                        }, void 0, false, {
                            fileName: "[project]/printhub/src/app/shop/page.tsx",
                            lineNumber: 271,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/printhub/src/app/shop/page.tsx",
                        lineNumber: 270,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: "mb-6 text-lg font-bold text-[#0F2942]",
                        children: "รายการคำสั่งพิมพ์วันนี้"
                    }, void 0, false, {
                        fileName: "[project]/printhub/src/app/shop/page.tsx",
                        lineNumber: 280,
                        columnNumber: 9
                    }, this),
                    loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "py-12 text-center text-slate-500",
                        children: "กำลังโหลดข้อมูล..."
                    }, void 0, false, {
                        fileName: "[project]/printhub/src/app/shop/page.tsx",
                        lineNumber: 285,
                        columnNumber: 11
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3",
                        children: orders.length > 0 ? orders.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$src$2f$component$2f$shop$2f$order$2d$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                order: item,
                                onClick: ()=>handleOrderClick(item.id),
                                onUpdateStatus: handleStatusUpdated
                            }, item.id, false, {
                                fileName: "[project]/printhub/src/app/shop/page.tsx",
                                lineNumber: 292,
                                columnNumber: 17
                            }, this)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "col-span-full py-8 text-center text-slate-500",
                            children: "ไม่มีรายการคำสั่งพิมพ์วันนี้"
                        }, void 0, false, {
                            fileName: "[project]/printhub/src/app/shop/page.tsx",
                            lineNumber: 300,
                            columnNumber: 15
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/printhub/src/app/shop/page.tsx",
                        lineNumber: 289,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/printhub/src/app/shop/page.tsx",
                lineNumber: 208,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/printhub/src/app/shop/page.tsx",
        lineNumber: 205,
        columnNumber: 5
    }, this);
}
_s(ShopPage, "yYFjOD6oNXwq52vDjQZo7FaEDaM=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = ShopPage;
var _c;
__turbopack_context__.k.register(_c, "ShopPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/printhub/src/component/shop/dashboard-card.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>DashboardCard
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/printhub/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__ = __turbopack_context__.i("[project]/printhub/node_modules/lucide-react/dist/esm/icons/chevron-right.mjs [app-client] (ecmascript) <export default as ChevronRight>");
;
;
function DashboardCard({ title, value, subtitle, icon: Icon, onClick, active }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        onClick: onClick,
        className: `group relative w-full cursor-pointer rounded-2xl border p-5 transition-all duration-200 ${active ? "border-sky-500 bg-sky-100/60 shadow-sm" : "border-sky-100 bg-sky-50/70 hover:border-sky-300 hover:bg-sky-100/40 hover:shadow-sm"}`,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-between",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-2",
                        children: [
                            Icon && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Icon, {
                                className: "h-4 w-4 text-sky-600"
                            }, void 0, false, {
                                fileName: "[project]/printhub/src/component/shop/dashboard-card.tsx",
                                lineNumber: 31,
                                columnNumber: 20
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: "text-sm font-semibold text-slate-700",
                                children: title
                            }, void 0, false, {
                                fileName: "[project]/printhub/src/component/shop/dashboard-card.tsx",
                                lineNumber: 32,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/printhub/src/component/shop/dashboard-card.tsx",
                        lineNumber: 30,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__["ChevronRight"], {
                        size: 16,
                        className: "text-slate-400 transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-sky-600"
                    }, void 0, false, {
                        fileName: "[project]/printhub/src/component/shop/dashboard-card.tsx",
                        lineNumber: 34,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/printhub/src/component/shop/dashboard-card.tsx",
                lineNumber: 29,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "mt-4 text-2xl font-bold tracking-tight text-[#0F2942]",
                children: value
            }, void 0, false, {
                fileName: "[project]/printhub/src/component/shop/dashboard-card.tsx",
                lineNumber: 40,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "mt-2 text-xs text-slate-500",
                children: subtitle
            }, void 0, false, {
                fileName: "[project]/printhub/src/component/shop/dashboard-card.tsx",
                lineNumber: 44,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/printhub/src/component/shop/dashboard-card.tsx",
        lineNumber: 21,
        columnNumber: 5
    }, this);
}
_c = DashboardCard;
var _c;
__turbopack_context__.k.register(_c, "DashboardCard");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/printhub/src/component/shop/financial-table.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>FinancialTable
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/printhub/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/printhub/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trending$2d$up$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TrendingUp$3e$__ = __turbopack_context__.i("[project]/printhub/node_modules/lucide-react/dist/esm/icons/trending-up.mjs [app-client] (ecmascript) <export default as TrendingUp>");
var __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$dollar$2d$sign$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__DollarSign$3e$__ = __turbopack_context__.i("[project]/printhub/node_modules/lucide-react/dist/esm/icons/dollar-sign.mjs [app-client] (ecmascript) <export default as DollarSign>");
var __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Calendar$3e$__ = __turbopack_context__.i("[project]/printhub/node_modules/lucide-react/dist/esm/icons/calendar.mjs [app-client] (ecmascript) <export default as Calendar>");
var __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__ = __turbopack_context__.i("[project]/printhub/node_modules/lucide-react/dist/esm/icons/search.mjs [app-client] (ecmascript) <export default as Search>");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
function FinancialTable({ totalGross, totalFee, totalNet, transactions, financialTrend, onOrderClick }) {
    _s();
    const [timeframe, setTimeframe] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("monthly");
    const [searchTerm, setSearchTerm] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const defaultLayout = {
        daily: [
            "จ.",
            "อ.",
            "พ.",
            "พฤ.",
            "ศ.",
            "ส.",
            "อา."
        ].map((l)=>({
                label: l,
                amount: 0
            })),
        weekly: [
            "สัปดาห์ 1",
            "สัปดาห์ 2",
            "สัปดาห์ 3",
            "สัปดาห์ 4"
        ].map((l)=>({
                label: l,
                amount: 0
            })),
        monthly: [
            "ม.ค.",
            "ก.พ.",
            "มี.ค.",
            "เม.ย.",
            "พ.ค.",
            "มิ.ย.",
            "ก.ค.",
            "ส.ค.",
            "ก.ย.",
            "ต.ค.",
            "พ.ย.",
            "ธ.ค."
        ].map((l)=>({
                label: l,
                amount: 0
            }))
    };
    const currentChartData = financialTrend?.[timeframe] && financialTrend[timeframe].length > 0 ? financialTrend[timeframe] : defaultLayout[timeframe];
    const maxAmount = Math.max(...currentChartData.map((d)=>d.amount), 1);
    const filteredTransactions = transactions.filter((t)=>{
        const orderNoStr = t.order_no ? String(t.order_no) : t.id;
        const matchId = orderNoStr.toLowerCase().includes(searchTerm.toLowerCase());
        const matchCustomer = t.customer_name.toLowerCase().includes(searchTerm.toLowerCase());
        return matchId || matchCustomer;
    });
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "rounded-2xl border border-slate-100 bg-white p-6 shadow-sm",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mb-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                        className: "text-base font-bold text-[#0F2942]",
                        children: "สรุปการเงินและค่าธรรมเนียม"
                    }, void 0, false, {
                        fileName: "[project]/printhub/src/component/shop/financial-table.tsx",
                        lineNumber: 65,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-xs text-slate-500",
                        children: "รายละเอียดรายได้ ยอดหักค่าธรรมเนียมแพลตฟอร์ม และยอดรับสุทธิ"
                    }, void 0, false, {
                        fileName: "[project]/printhub/src/component/shop/financial-table.tsx",
                        lineNumber: 68,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/printhub/src/component/shop/financial-table.tsx",
                lineNumber: 64,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mb-6 grid grid-cols-1 gap-4 md:grid-cols-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "rounded-xl border border-slate-100 bg-slate-50/50 p-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-2 text-slate-500",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$dollar$2d$sign$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__DollarSign$3e$__["DollarSign"], {
                                        className: "h-4 w-4"
                                    }, void 0, false, {
                                        fileName: "[project]/printhub/src/component/shop/financial-table.tsx",
                                        lineNumber: 76,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-xs font-semibold",
                                        children: "ยอดขายรวม (Gross)"
                                    }, void 0, false, {
                                        fileName: "[project]/printhub/src/component/shop/financial-table.tsx",
                                        lineNumber: 77,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/printhub/src/component/shop/financial-table.tsx",
                                lineNumber: 75,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "mt-2 text-xl font-bold text-slate-800",
                                children: [
                                    "฿",
                                    totalGross.toLocaleString("th-TH", {
                                        minimumFractionDigits: 2
                                    })
                                ]
                            }, void 0, true, {
                                fileName: "[project]/printhub/src/component/shop/financial-table.tsx",
                                lineNumber: 79,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/printhub/src/component/shop/financial-table.tsx",
                        lineNumber: 74,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "rounded-xl border border-amber-100 bg-amber-50/30 p-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-2 text-amber-700",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$dollar$2d$sign$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__DollarSign$3e$__["DollarSign"], {
                                        className: "h-4 w-4"
                                    }, void 0, false, {
                                        fileName: "[project]/printhub/src/component/shop/financial-table.tsx",
                                        lineNumber: 86,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-xs font-semibold",
                                        children: "หักค่าธรรมเนียม"
                                    }, void 0, false, {
                                        fileName: "[project]/printhub/src/component/shop/financial-table.tsx",
                                        lineNumber: 87,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/printhub/src/component/shop/financial-table.tsx",
                                lineNumber: 85,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "mt-2 text-xl font-bold text-amber-600",
                                children: [
                                    "-฿",
                                    totalFee.toLocaleString("th-TH", {
                                        minimumFractionDigits: 2
                                    })
                                ]
                            }, void 0, true, {
                                fileName: "[project]/printhub/src/component/shop/financial-table.tsx",
                                lineNumber: 89,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/printhub/src/component/shop/financial-table.tsx",
                        lineNumber: 84,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "rounded-xl border border-emerald-100 bg-emerald-50/30 p-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-2 text-emerald-700",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trending$2d$up$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TrendingUp$3e$__["TrendingUp"], {
                                        className: "h-4 w-4"
                                    }, void 0, false, {
                                        fileName: "[project]/printhub/src/component/shop/financial-table.tsx",
                                        lineNumber: 96,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-xs font-semibold",
                                        children: "รายได้สุทธิที่ได้รับ"
                                    }, void 0, false, {
                                        fileName: "[project]/printhub/src/component/shop/financial-table.tsx",
                                        lineNumber: 97,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/printhub/src/component/shop/financial-table.tsx",
                                lineNumber: 95,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "mt-2 text-xl font-bold text-emerald-600",
                                children: [
                                    "฿",
                                    totalNet.toLocaleString("th-TH", {
                                        minimumFractionDigits: 2
                                    })
                                ]
                            }, void 0, true, {
                                fileName: "[project]/printhub/src/component/shop/financial-table.tsx",
                                lineNumber: 99,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/printhub/src/component/shop/financial-table.tsx",
                        lineNumber: 94,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/printhub/src/component/shop/financial-table.tsx",
                lineNumber: 73,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "relative mb-6 rounded-xl border border-slate-100 bg-slate-50/50 p-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mb-4 flex flex-wrap items-center justify-between gap-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Calendar$3e$__["Calendar"], {
                                        className: "h-4 w-4 text-emerald-600"
                                    }, void 0, false, {
                                        fileName: "[project]/printhub/src/component/shop/financial-table.tsx",
                                        lineNumber: 108,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-xs font-semibold text-slate-700",
                                        children: "กราฟแนวโน้มรายได้สุทธิ (บาท)"
                                    }, void 0, false, {
                                        fileName: "[project]/printhub/src/component/shop/financial-table.tsx",
                                        lineNumber: 109,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/printhub/src/component/shop/financial-table.tsx",
                                lineNumber: 107,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex rounded-lg bg-slate-200/60 p-0.5 text-[11px] font-medium",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>setTimeframe("daily"),
                                        className: `rounded-md px-2.5 py-1 transition-all ${timeframe === "daily" ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700"}`,
                                        children: "รายวัน"
                                    }, void 0, false, {
                                        fileName: "[project]/printhub/src/component/shop/financial-table.tsx",
                                        lineNumber: 115,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>setTimeframe("weekly"),
                                        className: `rounded-md px-2.5 py-1 transition-all ${timeframe === "weekly" ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700"}`,
                                        children: "รายสัปดาห์"
                                    }, void 0, false, {
                                        fileName: "[project]/printhub/src/component/shop/financial-table.tsx",
                                        lineNumber: 123,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>setTimeframe("monthly"),
                                        className: `rounded-md px-2.5 py-1 transition-all ${timeframe === "monthly" ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700"}`,
                                        children: "รายเดือน"
                                    }, void 0, false, {
                                        fileName: "[project]/printhub/src/component/shop/financial-table.tsx",
                                        lineNumber: 131,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/printhub/src/component/shop/financial-table.tsx",
                                lineNumber: 114,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/printhub/src/component/shop/financial-table.tsx",
                        lineNumber: 106,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex h-36 items-end justify-between gap-1.5 overflow-x-auto pt-4 pb-1",
                        children: currentChartData.map((item, idx)=>{
                            const heightPercent = Math.round(item.amount / maxAmount * 100);
                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex flex-1 min-w-[32px] flex-col items-center gap-1.5",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: `text-[9px] font-bold ${item.amount > 0 ? "text-emerald-600" : "text-slate-400"}`,
                                        children: item.amount > 0 ? `฿${item.amount.toLocaleString()}` : "0"
                                    }, void 0, false, {
                                        fileName: "[project]/printhub/src/component/shop/financial-table.tsx",
                                        lineNumber: 148,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex h-24 w-full items-end justify-center rounded-lg bg-slate-100/80 p-1",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                height: `${Math.max(heightPercent, item.amount > 0 ? 10 : 4)}%`
                                            },
                                            className: `w-full max-w-[20px] rounded-md transition-all duration-300 ${item.amount > 0 ? "bg-emerald-500 hover:bg-emerald-600 shadow-sm" : "bg-slate-200"}`
                                        }, void 0, false, {
                                            fileName: "[project]/printhub/src/component/shop/financial-table.tsx",
                                            lineNumber: 152,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/printhub/src/component/shop/financial-table.tsx",
                                        lineNumber: 151,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-[10px] text-slate-500 truncate max-w-[50px] text-center",
                                        title: item.label,
                                        children: item.label
                                    }, void 0, false, {
                                        fileName: "[project]/printhub/src/component/shop/financial-table.tsx",
                                        lineNumber: 159,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, idx, true, {
                                fileName: "[project]/printhub/src/component/shop/financial-table.tsx",
                                lineNumber: 147,
                                columnNumber: 15
                            }, this);
                        })
                    }, void 0, false, {
                        fileName: "[project]/printhub/src/component/shop/financial-table.tsx",
                        lineNumber: 142,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/printhub/src/component/shop/financial-table.tsx",
                lineNumber: 105,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "space-y-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "relative",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__["Search"], {
                                className: "absolute left-3 top-2.5 h-4 w-4 text-slate-400"
                            }, void 0, false, {
                                fileName: "[project]/printhub/src/component/shop/financial-table.tsx",
                                lineNumber: 171,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                type: "text",
                                placeholder: "ค้นหา Order ID หรือชื่อลูกค้า...",
                                value: searchTerm,
                                onChange: (e)=>setSearchTerm(e.target.value),
                                className: "w-full rounded-xl border border-slate-200 pl-9 pr-4 py-2 text-xs text-slate-700 outline-none focus:border-emerald-500"
                            }, void 0, false, {
                                fileName: "[project]/printhub/src/component/shop/financial-table.tsx",
                                lineNumber: 172,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/printhub/src/component/shop/financial-table.tsx",
                        lineNumber: 170,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "rounded-xl border border-slate-100 overflow-hidden",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                                className: "w-full text-left text-xs",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
                                    className: "bg-slate-50 text-slate-500 sticky top-0 z-10",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                className: "p-3",
                                                children: "ออเดอร์"
                                            }, void 0, false, {
                                                fileName: "[project]/printhub/src/component/shop/financial-table.tsx",
                                                lineNumber: 185,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                className: "p-3",
                                                children: "วันที่/เวลา"
                                            }, void 0, false, {
                                                fileName: "[project]/printhub/src/component/shop/financial-table.tsx",
                                                lineNumber: 186,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                className: "p-3",
                                                children: "ลูกค้า"
                                            }, void 0, false, {
                                                fileName: "[project]/printhub/src/component/shop/financial-table.tsx",
                                                lineNumber: 187,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                className: "p-3 text-right",
                                                children: "ยอดเต็ม"
                                            }, void 0, false, {
                                                fileName: "[project]/printhub/src/component/shop/financial-table.tsx",
                                                lineNumber: 188,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                className: "p-3 text-right",
                                                children: "ค่าธรรมเนียม"
                                            }, void 0, false, {
                                                fileName: "[project]/printhub/src/component/shop/financial-table.tsx",
                                                lineNumber: 189,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                className: "p-3 text-right",
                                                children: "รับสุทธิ"
                                            }, void 0, false, {
                                                fileName: "[project]/printhub/src/component/shop/financial-table.tsx",
                                                lineNumber: 190,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/printhub/src/component/shop/financial-table.tsx",
                                        lineNumber: 184,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/printhub/src/component/shop/financial-table.tsx",
                                    lineNumber: 183,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/printhub/src/component/shop/financial-table.tsx",
                                lineNumber: 182,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "max-h-[180px] overflow-y-auto",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                                    className: "w-full text-left text-xs",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                                        className: "divide-y divide-slate-100 bg-white text-slate-700",
                                        children: filteredTransactions.length > 0 ? filteredTransactions.map((t)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                onClick: ()=>onOrderClick(t.id),
                                                className: "cursor-pointer hover:bg-slate-50",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                        className: "p-3 font-semibold text-slate-800",
                                                        children: [
                                                            "#",
                                                            t.order_no || t.id.slice(0, 8)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/printhub/src/component/shop/financial-table.tsx",
                                                        lineNumber: 206,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                        className: "p-3 text-slate-400",
                                                        children: new Date(t.date).toLocaleDateString("th-TH")
                                                    }, void 0, false, {
                                                        fileName: "[project]/printhub/src/component/shop/financial-table.tsx",
                                                        lineNumber: 209,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                        className: "p-3",
                                                        children: t.customer_name
                                                    }, void 0, false, {
                                                        fileName: "[project]/printhub/src/component/shop/financial-table.tsx",
                                                        lineNumber: 210,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                        className: "p-3 text-right font-medium",
                                                        children: [
                                                            "฿",
                                                            t.gross.toFixed(2)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/printhub/src/component/shop/financial-table.tsx",
                                                        lineNumber: 211,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                        className: "p-3 text-right text-amber-600",
                                                        children: [
                                                            "-฿",
                                                            t.fee.toFixed(2)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/printhub/src/component/shop/financial-table.tsx",
                                                        lineNumber: 212,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                        className: "p-3 text-right font-bold text-emerald-600",
                                                        children: [
                                                            "฿",
                                                            t.net.toFixed(2)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/printhub/src/component/shop/financial-table.tsx",
                                                        lineNumber: 213,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, t.id, true, {
                                                fileName: "[project]/printhub/src/component/shop/financial-table.tsx",
                                                lineNumber: 201,
                                                columnNumber: 21
                                            }, this)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                colSpan: 6,
                                                className: "py-8 text-center text-slate-400",
                                                children: "ยังไม่มีประวัติรายการการเงิน"
                                            }, void 0, false, {
                                                fileName: "[project]/printhub/src/component/shop/financial-table.tsx",
                                                lineNumber: 218,
                                                columnNumber: 21
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/printhub/src/component/shop/financial-table.tsx",
                                            lineNumber: 217,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/printhub/src/component/shop/financial-table.tsx",
                                        lineNumber: 198,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/printhub/src/component/shop/financial-table.tsx",
                                    lineNumber: 197,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/printhub/src/component/shop/financial-table.tsx",
                                lineNumber: 196,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/printhub/src/component/shop/financial-table.tsx",
                        lineNumber: 181,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/printhub/src/component/shop/financial-table.tsx",
                lineNumber: 169,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/printhub/src/component/shop/financial-table.tsx",
        lineNumber: 63,
        columnNumber: 5
    }, this);
}
_s(FinancialTable, "toIPrhWhU+tjA3LqpFXnSHuWoo4=");
_c = FinancialTable;
var _c;
__turbopack_context__.k.register(_c, "FinancialTable");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/printhub/src/component/shop/navbar.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ShopNavbar
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/printhub/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/printhub/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/printhub/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/printhub/node_modules/axios/lib/axios.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$printer$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Printer$3e$__ = __turbopack_context__.i("[project]/printhub/node_modules/lucide-react/dist/esm/icons/printer.mjs [app-client] (ecmascript) <export default as Printer>");
var __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$house$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Home$3e$__ = __turbopack_context__.i("[project]/printhub/node_modules/lucide-react/dist/esm/icons/house.mjs [app-client] (ecmascript) <export default as Home>");
var __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clipboard$2d$list$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ClipboardList$3e$__ = __turbopack_context__.i("[project]/printhub/node_modules/lucide-react/dist/esm/icons/clipboard-list.mjs [app-client] (ecmascript) <export default as ClipboardList>");
var __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$message$2d$circle$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MessageCircle$3e$__ = __turbopack_context__.i("[project]/printhub/node_modules/lucide-react/dist/esm/icons/message-circle.mjs [app-client] (ecmascript) <export default as MessageCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings$3e$__ = __turbopack_context__.i("[project]/printhub/node_modules/lucide-react/dist/esm/icons/settings.mjs [app-client] (ecmascript) <export default as Settings>");
var __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$log$2d$out$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__LogOut$3e$__ = __turbopack_context__.i("[project]/printhub/node_modules/lucide-react/dist/esm/icons/log-out.mjs [app-client] (ecmascript) <export default as LogOut>");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
const API_BASE = "http://localhost:5000/shop";
// หน้าตั้งค่าร้านส่ง event นี้หลังเปลี่ยนรูปสำเร็จ เพื่อให้ navbar อัปเดตรูปทันที
const PROFILE_IMAGE_EVENT = "shop-profile-image-updated";
function ShopNavbar() {
    _s();
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"])();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const [shopId, setShopId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [shopName, setShopName] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [profileImage, setProfileImage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [imageFailed, setImageFailed] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ShopNavbar.useEffect": ()=>{
            const storedShopId = localStorage.getItem("shop_id");
            const storedShopName = localStorage.getItem("shop_name");
            if (storedShopId) {
                setShopId(storedShopId);
            }
            if (storedShopName) {
                setShopName(storedShopName);
            }
        }
    }["ShopNavbar.useEffect"], []);
    // ดึงรูปโปรไฟล์ร้านมาแสดง (ถ้าไม่มีรูปหรือโหลดไม่ได้ จะแสดงตัวอักษรแรกของร้านเหมือนเดิม)
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ShopNavbar.useEffect": ()=>{
            if (!shopId) return;
            let cancelled = false;
            const fetchProfileImage = {
                "ShopNavbar.useEffect.fetchProfileImage": async ()=>{
                    try {
                        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get(`${API_BASE}/profile/${shopId}`);
                        if (!cancelled) {
                            setProfileImage(res.data?.data?.profile_image ?? null);
                            setImageFailed(false);
                        }
                    } catch (err) {
                        console.error("Fetch shop profile image error:", err);
                    }
                }
            }["ShopNavbar.useEffect.fetchProfileImage"];
            fetchProfileImage();
            // เปลี่ยนรูปจากหน้าตั้งค่า -> อัปเดตทันทีโดยไม่ต้องรีเฟรช
            const handleImageUpdated = {
                "ShopNavbar.useEffect.handleImageUpdated": (e)=>{
                    const url = e.detail?.profile_image;
                    setProfileImage(url ?? null);
                    setImageFailed(false);
                }
            }["ShopNavbar.useEffect.handleImageUpdated"];
            window.addEventListener(PROFILE_IMAGE_EVENT, handleImageUpdated);
            return ({
                "ShopNavbar.useEffect": ()=>{
                    cancelled = true;
                    window.removeEventListener(PROFILE_IMAGE_EVENT, handleImageUpdated);
                }
            })["ShopNavbar.useEffect"];
        }
    }["ShopNavbar.useEffect"], [
        shopId
    ]);
    const showProfileImage = !!profileImage && !imageFailed;
    const isHomeActive = pathname === "/shop";
    const isOrderActive = pathname.startsWith("/shop/order");
    const isChatActive = pathname.startsWith("/shop/chat");
    const isSettingActive = pathname.startsWith("/shop/setting");
    const goTo = (path)=>{
        if (!shopId) {
            console.warn("shopId not found in localStorage");
            alert("ไม่พบข้อมูลร้านค้า กรุณาล็อกอินใหม่อีกครั้ง");
            return;
        }
        router.push(`/shop/${path}/${shopId}`);
    };
    const handleLogout = ()=>{
        localStorage.removeItem("shop_id");
        localStorage.removeItem("shop_name");
        localStorage.removeItem("token");
        localStorage.clear();
        router.push("/auth");
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
        className: "sticky top-0 z-50 w-full border-b border-slate-200 bg-white/90 backdrop-blur shadow-xs",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "mx-auto max-w-6xl h-16 flex items-center justify-between gap-2 px-4",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    onClick: ()=>router.push("/shop"),
                    className: "flex items-center gap-2 pl-1 cursor-pointer text-left focus:outline-none",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "w-10 h-10 rounded-full bg-[#0F2942] flex items-center justify-center",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$printer$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Printer$3e$__["Printer"], {
                                size: 18,
                                className: "text-white"
                            }, void 0, false, {
                                fileName: "[project]/printhub/src/component/shop/navbar.tsx",
                                lineNumber: 108,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/printhub/src/component/shop/navbar.tsx",
                            lineNumber: 107,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "hidden sm:block text-[#0F2942] font-bold text-xl tracking-tight",
                            children: "PrintHub"
                        }, void 0, false, {
                            fileName: "[project]/printhub/src/component/shop/navbar.tsx",
                            lineNumber: 110,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/printhub/src/component/shop/navbar.tsx",
                    lineNumber: 103,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center gap-1 text-sm font-medium",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: ()=>router.push("/shop"),
                            title: "หน้าหลัก",
                            className: `flex items-center gap-2 h-10 px-3 md:px-4 rounded-full transition-colors cursor-pointer focus:outline-none ${isHomeActive ? "bg-[#0F2942] text-white" : "text-slate-500 hover:text-[#0F2942] hover:bg-slate-100"}`,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$house$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Home$3e$__["Home"], {
                                    size: 15
                                }, void 0, false, {
                                    fileName: "[project]/printhub/src/component/shop/navbar.tsx",
                                    lineNumber: 127,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: isHomeActive ? "inline" : "hidden md:inline",
                                    children: "หน้าหลัก"
                                }, void 0, false, {
                                    fileName: "[project]/printhub/src/component/shop/navbar.tsx",
                                    lineNumber: 128,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/printhub/src/component/shop/navbar.tsx",
                            lineNumber: 118,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: ()=>goTo("order"),
                            title: "รายการคำสั่งพิมพ์",
                            className: `flex items-center gap-2 h-10 px-3 md:px-4 rounded-full transition-colors cursor-pointer focus:outline-none ${isOrderActive ? "bg-[#0F2942] text-white" : "text-slate-500 hover:text-[#0F2942] hover:bg-slate-100"}`,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clipboard$2d$list$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ClipboardList$3e$__["ClipboardList"], {
                                    size: 15
                                }, void 0, false, {
                                    fileName: "[project]/printhub/src/component/shop/navbar.tsx",
                                    lineNumber: 143,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: isOrderActive ? "inline" : "hidden md:inline",
                                    children: "รายการคำสั่งพิมพ์"
                                }, void 0, false, {
                                    fileName: "[project]/printhub/src/component/shop/navbar.tsx",
                                    lineNumber: 144,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/printhub/src/component/shop/navbar.tsx",
                            lineNumber: 134,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: ()=>goTo("chat"),
                            title: "แชท",
                            className: `flex items-center gap-2 h-10 px-3 md:px-4 rounded-full transition-colors cursor-pointer focus:outline-none ${isChatActive ? "bg-[#0F2942] text-white" : "text-slate-500 hover:text-[#0F2942] hover:bg-slate-100"}`,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$message$2d$circle$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MessageCircle$3e$__["MessageCircle"], {
                                    size: 15
                                }, void 0, false, {
                                    fileName: "[project]/printhub/src/component/shop/navbar.tsx",
                                    lineNumber: 159,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: isChatActive ? "inline" : "hidden md:inline",
                                    children: "แชท"
                                }, void 0, false, {
                                    fileName: "[project]/printhub/src/component/shop/navbar.tsx",
                                    lineNumber: 160,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/printhub/src/component/shop/navbar.tsx",
                            lineNumber: 150,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/printhub/src/component/shop/navbar.tsx",
                    lineNumber: 116,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center gap-2",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: ()=>goTo("setting"),
                            title: "ตั้งค่าร้านค้า",
                            className: "flex items-center gap-2.5 p-1 rounded-full hover:bg-slate-100 transition-colors cursor-pointer focus:outline-none",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "hidden lg:block text-sm font-semibold text-slate-700 pl-2",
                                    children: shopName || "ร้านค้า"
                                }, void 0, false, {
                                    fileName: "[project]/printhub/src/component/shop/navbar.tsx",
                                    lineNumber: 174,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "w-9 h-9 rounded-full bg-gradient-to-br from-[#0F2942] to-[#1d5d9b] flex items-center justify-center text-white font-bold relative shrink-0",
                                    children: [
                                        showProfileImage ? // eslint-disable-next-line @next/next/no-img-element
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                            src: profileImage,
                                            alt: shopName ? `รูปโปรไฟล์ ${shopName}` : "รูปโปรไฟล์ร้านค้า",
                                            onError: ()=>setImageFailed(true),
                                            className: "absolute inset-0 h-full w-full rounded-full object-cover"
                                        }, void 0, false, {
                                            fileName: "[project]/printhub/src/component/shop/navbar.tsx",
                                            lineNumber: 180,
                                            columnNumber: 17
                                        }, this) : shopName?.charAt(0) || "S",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "absolute -bottom-0.5 -right-0.5 bg-white rounded-full p-0.5 shadow-xs",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings$3e$__["Settings"], {
                                                size: 12,
                                                className: isSettingActive ? "text-[#0F2942]" : "text-slate-500"
                                            }, void 0, false, {
                                                fileName: "[project]/printhub/src/component/shop/navbar.tsx",
                                                lineNumber: 190,
                                                columnNumber: 17
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/printhub/src/component/shop/navbar.tsx",
                                            lineNumber: 189,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/printhub/src/component/shop/navbar.tsx",
                                    lineNumber: 177,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/printhub/src/component/shop/navbar.tsx",
                            lineNumber: 169,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "h-5 w-[1px] bg-slate-200 my-auto"
                        }, void 0, false, {
                            fileName: "[project]/printhub/src/component/shop/navbar.tsx",
                            lineNumber: 201,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: handleLogout,
                            title: "ออกจากระบบ",
                            className: "flex items-center gap-1.5 h-9 px-3 rounded-xl text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 hover:text-rose-700 transition-colors cursor-pointer focus:outline-none",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$log$2d$out$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__LogOut$3e$__["LogOut"], {
                                    size: 15
                                }, void 0, false, {
                                    fileName: "[project]/printhub/src/component/shop/navbar.tsx",
                                    lineNumber: 209,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "hidden sm:inline",
                                    children: "ออกจากระบบ"
                                }, void 0, false, {
                                    fileName: "[project]/printhub/src/component/shop/navbar.tsx",
                                    lineNumber: 210,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/printhub/src/component/shop/navbar.tsx",
                            lineNumber: 204,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/printhub/src/component/shop/navbar.tsx",
                    lineNumber: 167,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/printhub/src/component/shop/navbar.tsx",
            lineNumber: 101,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/printhub/src/component/shop/navbar.tsx",
        lineNumber: 100,
        columnNumber: 5
    }, this);
}
_s(ShopNavbar, "Gbe482K7dYCUTL5G/jGMJLDR8XA=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"],
        __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = ShopNavbar;
var _c;
__turbopack_context__.k.register(_c, "ShopNavbar");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/printhub/src/component/shop/order-breakdown-modal.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>OrderBreakdownModal
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/printhub/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/printhub/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__ = __turbopack_context__.i("[project]/printhub/node_modules/lucide-react/dist/esm/icons/chevron-right.mjs [app-client] (ecmascript) <export default as ChevronRight>");
var __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chart$2d$no$2d$axes$2d$column$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BarChart2$3e$__ = __turbopack_context__.i("[project]/printhub/node_modules/lucide-react/dist/esm/icons/chart-no-axes-column.mjs [app-client] (ecmascript) <export default as BarChart2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Calendar$3e$__ = __turbopack_context__.i("[project]/printhub/node_modules/lucide-react/dist/esm/icons/calendar.mjs [app-client] (ecmascript) <export default as Calendar>");
var __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__ = __turbopack_context__.i("[project]/printhub/node_modules/lucide-react/dist/esm/icons/search.mjs [app-client] (ecmascript) <export default as Search>");
var __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$left$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronLeft$3e$__ = __turbopack_context__.i("[project]/printhub/node_modules/lucide-react/dist/esm/icons/chevron-left.mjs [app-client] (ecmascript) <export default as ChevronLeft>");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
function OrderBreakdownModal({ counts, total, orders, trendData, onOrderClick }) {
    _s();
    const [selectedStatus, setSelectedStatus] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("ทั้งหมด");
    const [timeframe, setTimeframe] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("monthly");
    const [searchTerm, setSearchTerm] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [currentPage, setCurrentPage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(1);
    const itemsPerPage = 3;
    const getPercent = (count)=>{
        if (!total || total === 0) return 0;
        return Math.round(count / total * 100);
    };
    const statusConfig = [
        {
            label: "รอการดำเนินงาน",
            key: "รอการดำเนินงาน",
            color: "bg-amber-400",
            textColor: "text-amber-800",
            bgColor: "bg-amber-100"
        },
        {
            label: "กำลังพิมพ์",
            key: "กำลังพิมพ์",
            color: "bg-sky-500",
            textColor: "text-sky-800",
            bgColor: "bg-sky-100"
        },
        {
            label: "พิมพ์เสร็จสิ้น",
            key: "พิมพ์เสร็จสิ้น",
            color: "bg-blue-500",
            textColor: "text-blue-800",
            bgColor: "bg-blue-100"
        },
        {
            label: "รายการเสร็จสิ้น",
            key: "รายการเสร็จสิ้น",
            color: "bg-emerald-500",
            textColor: "text-emerald-800",
            bgColor: "bg-emerald-100"
        },
        {
            label: "ยกเลิกการพิมพ์",
            key: "ยกเลิกการพิมพ์",
            color: "bg-rose-400",
            textColor: "text-rose-800",
            bgColor: "bg-rose-100"
        }
    ];
    const statusTabs = [
        {
            label: "ทั้งหมด",
            count: total,
            percent: 100,
            color: "bg-slate-100 text-slate-700"
        },
        ...statusConfig.map((item)=>({
                label: item.label,
                count: counts[item.key] || 0,
                percent: getPercent(counts[item.key] || 0),
                color: `${item.bgColor} ${item.textColor}`
            }))
    ];
    const filteredOrders = orders.filter((o)=>{
        const matchStatus = selectedStatus === "ทั้งหมด" || o.latest_status === selectedStatus;
        const customerName = `${o.customer?.first_name || ""} ${o.customer?.last_name || ""}`.toLowerCase();
        const orderDisplayNo = (o.order_no ? String(o.order_no) : o.id || "").toLowerCase();
        const matchSearch = customerName.includes(searchTerm.toLowerCase()) || orderDisplayNo.includes(searchTerm.toLowerCase());
        return matchStatus && matchSearch;
    });
    const totalPages = Math.ceil(filteredOrders.length / itemsPerPage) || 1;
    const paginatedOrders = filteredOrders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    const defaultLayout = {
        daily: [
            "จ.",
            "อ.",
            "พ.",
            "พฤ.",
            "ศ.",
            "ส.",
            "อา."
        ].map((l)=>({
                label: l,
                count: 0
            })),
        weekly: [
            "สัปดาห์ 1",
            "สัปดาห์ 2",
            "สัปดาห์ 3",
            "สัปดาห์ 4"
        ].map((l)=>({
                label: l,
                count: 0
            })),
        monthly: [
            "ม.ค.",
            "ก.พ.",
            "มี.ค.",
            "เม.ย.",
            "พ.ค.",
            "มิ.ย.",
            "ก.ค.",
            "ส.ค.",
            "ก.ย.",
            "ต.ค.",
            "พ.ย.",
            "ธ.ค."
        ].map((l)=>({
                label: l,
                count: 0
            }))
    };
    const currentChartData = trendData?.[timeframe] && trendData[timeframe].length > 0 ? trendData[timeframe] : defaultLayout[timeframe];
    const maxChartCount = Math.max(...currentChartData.map((d)=>d.count), 1);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "rounded-2xl border border-slate-100 bg-white p-6 shadow-sm",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mb-4 flex items-center justify-between",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: "text-base font-bold text-[#0F2942]",
                                children: "สัดส่วนและแนวโน้มคำสั่งพิมพ์"
                            }, void 0, false, {
                                fileName: "[project]/printhub/src/component/shop/order-breakdown-modal.tsx",
                                lineNumber: 90,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-xs text-slate-500",
                                children: "สัดส่วนตามสถานะ และสถิติจำนวนออเดอร์ย้อนหลัง"
                            }, void 0, false, {
                                fileName: "[project]/printhub/src/component/shop/order-breakdown-modal.tsx",
                                lineNumber: 93,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/printhub/src/component/shop/order-breakdown-modal.tsx",
                        lineNumber: 89,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-1.5 rounded-lg bg-slate-50 px-3 py-1.5 text-xs text-slate-600",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chart$2d$no$2d$axes$2d$column$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BarChart2$3e$__["BarChart2"], {
                                className: "h-4 w-4 text-sky-600"
                            }, void 0, false, {
                                fileName: "[project]/printhub/src/component/shop/order-breakdown-modal.tsx",
                                lineNumber: 98,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: [
                                    "รวมทั้งหมด ",
                                    total,
                                    " รายการ"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/printhub/src/component/shop/order-breakdown-modal.tsx",
                                lineNumber: 99,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/printhub/src/component/shop/order-breakdown-modal.tsx",
                        lineNumber: 97,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/printhub/src/component/shop/order-breakdown-modal.tsx",
                lineNumber: 88,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "relative mb-2 flex h-6 w-full overflow-hidden rounded-xl bg-slate-100 p-1",
                children: total > 0 ? statusConfig.map((item)=>{
                    const pct = getPercent(counts[item.key] || 0);
                    if (pct === 0) return null;
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            width: `${pct}%`
                        },
                        className: `${item.color} flex items-center justify-center text-[10px] font-bold text-white transition-all duration-300 first:rounded-l-lg last:rounded-r-lg`,
                        title: `${item.label}: ${pct}%`,
                        children: pct >= 8 && `${pct}%`
                    }, item.key, false, {
                        fileName: "[project]/printhub/src/component/shop/order-breakdown-modal.tsx",
                        lineNumber: 110,
                        columnNumber: 15
                    }, this);
                }) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex w-full items-center justify-center text-[11px] font-medium text-slate-400",
                    children: "ยังไม่มีข้อมูลสัดส่วน"
                }, void 0, false, {
                    fileName: "[project]/printhub/src/component/shop/order-breakdown-modal.tsx",
                    lineNumber: 121,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/printhub/src/component/shop/order-breakdown-modal.tsx",
                lineNumber: 104,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mb-6 flex flex-wrap items-center justify-between gap-2 px-1",
                children: statusConfig.map((item)=>{
                    const pct = getPercent(counts[item.key] || 0);
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-1.5 text-xs",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: `h-2.5 w-2.5 rounded-full ${item.color}`
                            }, void 0, false, {
                                fileName: "[project]/printhub/src/component/shop/order-breakdown-modal.tsx",
                                lineNumber: 133,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-slate-500",
                                children: item.label
                            }, void 0, false, {
                                fileName: "[project]/printhub/src/component/shop/order-breakdown-modal.tsx",
                                lineNumber: 134,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "font-bold text-slate-700",
                                children: [
                                    pct,
                                    "%"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/printhub/src/component/shop/order-breakdown-modal.tsx",
                                lineNumber: 135,
                                columnNumber: 15
                            }, this)
                        ]
                    }, item.key, true, {
                        fileName: "[project]/printhub/src/component/shop/order-breakdown-modal.tsx",
                        lineNumber: 132,
                        columnNumber: 13
                    }, this);
                })
            }, void 0, false, {
                fileName: "[project]/printhub/src/component/shop/order-breakdown-modal.tsx",
                lineNumber: 128,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "relative mb-6 rounded-xl border border-slate-100 bg-slate-50/50 p-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mb-4 flex flex-wrap items-center justify-between gap-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Calendar$3e$__["Calendar"], {
                                        className: "h-4 w-4 text-sky-600"
                                    }, void 0, false, {
                                        fileName: "[project]/printhub/src/component/shop/order-breakdown-modal.tsx",
                                        lineNumber: 145,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-xs font-semibold text-slate-700",
                                        children: "กราฟจำนวนคำสั่งพิมพ์"
                                    }, void 0, false, {
                                        fileName: "[project]/printhub/src/component/shop/order-breakdown-modal.tsx",
                                        lineNumber: 146,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/printhub/src/component/shop/order-breakdown-modal.tsx",
                                lineNumber: 144,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex rounded-lg bg-slate-200/60 p-0.5 text-[11px] font-medium",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>setTimeframe("daily"),
                                        className: `rounded-md px-2.5 py-1 transition-all ${timeframe === "daily" ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700"}`,
                                        children: "วัน"
                                    }, void 0, false, {
                                        fileName: "[project]/printhub/src/component/shop/order-breakdown-modal.tsx",
                                        lineNumber: 152,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>setTimeframe("weekly"),
                                        className: `rounded-md px-2.5 py-1 transition-all ${timeframe === "weekly" ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700"}`,
                                        children: "สัปดาห์"
                                    }, void 0, false, {
                                        fileName: "[project]/printhub/src/component/shop/order-breakdown-modal.tsx",
                                        lineNumber: 160,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>setTimeframe("monthly"),
                                        className: `rounded-md px-2.5 py-1 transition-all ${timeframe === "monthly" ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700"}`,
                                        children: "เดือน"
                                    }, void 0, false, {
                                        fileName: "[project]/printhub/src/component/shop/order-breakdown-modal.tsx",
                                        lineNumber: 168,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/printhub/src/component/shop/order-breakdown-modal.tsx",
                                lineNumber: 151,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/printhub/src/component/shop/order-breakdown-modal.tsx",
                        lineNumber: 143,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex h-36 items-end justify-between gap-1.5 overflow-x-auto pt-4 pb-1",
                        children: currentChartData.map((item, idx)=>{
                            const heightPercent = Math.round(item.count / maxChartCount * 100);
                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex flex-1 min-w-[28px] flex-col items-center gap-1.5",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: `text-[10px] font-bold ${item.count > 0 ? "text-sky-600" : "text-slate-400"}`,
                                        children: item.count
                                    }, void 0, false, {
                                        fileName: "[project]/printhub/src/component/shop/order-breakdown-modal.tsx",
                                        lineNumber: 185,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex h-24 w-full items-end justify-center rounded-lg bg-slate-100/80 p-1",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                height: `${Math.max(heightPercent, item.count > 0 ? 10 : 4)}%`
                                            },
                                            className: `w-full max-w-[20px] rounded-md transition-all duration-300 ${item.count > 0 ? "bg-sky-500 hover:bg-sky-600 shadow-sm" : "bg-slate-200"}`
                                        }, void 0, false, {
                                            fileName: "[project]/printhub/src/component/shop/order-breakdown-modal.tsx",
                                            lineNumber: 189,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/printhub/src/component/shop/order-breakdown-modal.tsx",
                                        lineNumber: 188,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-[10px] text-slate-500 truncate max-w-[50px] text-center",
                                        title: item.label,
                                        children: item.label
                                    }, void 0, false, {
                                        fileName: "[project]/printhub/src/component/shop/order-breakdown-modal.tsx",
                                        lineNumber: 196,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, idx, true, {
                                fileName: "[project]/printhub/src/component/shop/order-breakdown-modal.tsx",
                                lineNumber: 184,
                                columnNumber: 15
                            }, this);
                        })
                    }, void 0, false, {
                        fileName: "[project]/printhub/src/component/shop/order-breakdown-modal.tsx",
                        lineNumber: 179,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/printhub/src/component/shop/order-breakdown-modal.tsx",
                lineNumber: 142,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mb-4 flex flex-wrap gap-2",
                children: statusTabs.map((tab)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>{
                            setSelectedStatus(tab.label);
                            setCurrentPage(1);
                        },
                        className: `flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold transition-all ${selectedStatus === tab.label ? "bg-[#0F2942] text-white shadow-sm" : "bg-slate-50 text-slate-600 hover:bg-slate-100"}`,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: tab.label
                            }, void 0, false, {
                                fileName: "[project]/printhub/src/component/shop/order-breakdown-modal.tsx",
                                lineNumber: 220,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: `rounded-full px-2 py-0.5 text-[10px] ${selectedStatus === tab.label ? "bg-white/20 text-white" : tab.color}`,
                                children: [
                                    tab.count,
                                    " (",
                                    tab.percent,
                                    "%)"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/printhub/src/component/shop/order-breakdown-modal.tsx",
                                lineNumber: 221,
                                columnNumber: 13
                            }, this)
                        ]
                    }, tab.label, true, {
                        fileName: "[project]/printhub/src/component/shop/order-breakdown-modal.tsx",
                        lineNumber: 208,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/printhub/src/component/shop/order-breakdown-modal.tsx",
                lineNumber: 206,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "space-y-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "relative",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__["Search"], {
                                className: "absolute left-3 top-2.5 h-4 w-4 text-slate-400"
                            }, void 0, false, {
                                fileName: "[project]/printhub/src/component/shop/order-breakdown-modal.tsx",
                                lineNumber: 237,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                type: "text",
                                placeholder: "ค้นหาหมายเลข Order หรือชื่อลูกค้า...",
                                value: searchTerm,
                                onChange: (e)=>{
                                    setSearchTerm(e.target.value);
                                    setCurrentPage(1);
                                },
                                className: "w-full rounded-xl border border-slate-200 pl-9 pr-4 py-2 text-xs text-slate-700 outline-none focus:border-sky-500"
                            }, void 0, false, {
                                fileName: "[project]/printhub/src/component/shop/order-breakdown-modal.tsx",
                                lineNumber: 238,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/printhub/src/component/shop/order-breakdown-modal.tsx",
                        lineNumber: 236,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "divide-y divide-slate-100 rounded-xl border border-slate-100 bg-white",
                        children: paginatedOrders.length > 0 ? paginatedOrders.map((o)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                onClick: ()=>onOrderClick(o.id),
                                className: "group flex cursor-pointer items-center justify-between p-3 transition-colors hover:bg-slate-50",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-sm font-bold text-slate-800",
                                                children: [
                                                    "Order #",
                                                    o.order_no || o.id?.slice(0, 8)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/printhub/src/component/shop/order-breakdown-modal.tsx",
                                                lineNumber: 260,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-xs text-slate-400 mt-0.5",
                                                children: [
                                                    o.customer?.first_name,
                                                    " ",
                                                    o.customer?.last_name,
                                                    " •",
                                                    " ",
                                                    new Date(o.order_date).toLocaleDateString("th-TH")
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/printhub/src/component/shop/order-breakdown-modal.tsx",
                                                lineNumber: 263,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/printhub/src/component/shop/order-breakdown-modal.tsx",
                                        lineNumber: 259,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center gap-3",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: `rounded-md px-2.5 py-1 text-xs font-semibold ${o.latest_status === "รายการเสร็จสิ้น" ? "bg-emerald-100 text-emerald-800" : o.latest_status === "พิมพ์เสร็จสิ้น" ? "bg-blue-100 text-blue-800" : o.latest_status === "กำลังพิมพ์" ? "bg-sky-100 text-sky-800" : o.latest_status === "รอการดำเนินงาน" ? "bg-amber-100 text-amber-800" : "bg-rose-100 text-rose-800"}`,
                                                children: o.latest_status
                                            }, void 0, false, {
                                                fileName: "[project]/printhub/src/component/shop/order-breakdown-modal.tsx",
                                                lineNumber: 270,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__["ChevronRight"], {
                                                className: "h-4 w-4 text-slate-400 transition-transform group-hover:translate-x-0.5"
                                            }, void 0, false, {
                                                fileName: "[project]/printhub/src/component/shop/order-breakdown-modal.tsx",
                                                lineNumber: 285,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/printhub/src/component/shop/order-breakdown-modal.tsx",
                                        lineNumber: 269,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, o.id, true, {
                                fileName: "[project]/printhub/src/component/shop/order-breakdown-modal.tsx",
                                lineNumber: 254,
                                columnNumber: 15
                            }, this)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "py-6 text-center text-xs text-slate-400",
                            children: "ไม่พบรายการออเดอร์"
                        }, void 0, false, {
                            fileName: "[project]/printhub/src/component/shop/order-breakdown-modal.tsx",
                            lineNumber: 290,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/printhub/src/component/shop/order-breakdown-modal.tsx",
                        lineNumber: 251,
                        columnNumber: 9
                    }, this),
                    filteredOrders.length > itemsPerPage && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center justify-between pt-1 text-xs text-slate-500",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: [
                                    "แสดง ",
                                    (currentPage - 1) * itemsPerPage + 1,
                                    " - ",
                                    Math.min(currentPage * itemsPerPage, filteredOrders.length),
                                    " จาก ",
                                    filteredOrders.length,
                                    " รายการ"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/printhub/src/component/shop/order-breakdown-modal.tsx",
                                lineNumber: 299,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-1",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        disabled: currentPage === 1,
                                        onClick: ()=>setCurrentPage((p)=>p - 1),
                                        className: "rounded-lg border border-slate-200 p-1 hover:bg-slate-50 disabled:opacity-40",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$left$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronLeft$3e$__["ChevronLeft"], {
                                            className: "h-4 w-4"
                                        }, void 0, false, {
                                            fileName: "[project]/printhub/src/component/shop/order-breakdown-modal.tsx",
                                            lineNumber: 308,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/printhub/src/component/shop/order-breakdown-modal.tsx",
                                        lineNumber: 303,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "px-2 font-medium text-slate-700",
                                        children: [
                                            currentPage,
                                            " / ",
                                            totalPages
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/printhub/src/component/shop/order-breakdown-modal.tsx",
                                        lineNumber: 310,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        disabled: currentPage === totalPages,
                                        onClick: ()=>setCurrentPage((p)=>p + 1),
                                        className: "rounded-lg border border-slate-200 p-1 hover:bg-slate-50 disabled:opacity-40",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__["ChevronRight"], {
                                            className: "h-4 w-4"
                                        }, void 0, false, {
                                            fileName: "[project]/printhub/src/component/shop/order-breakdown-modal.tsx",
                                            lineNumber: 318,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/printhub/src/component/shop/order-breakdown-modal.tsx",
                                        lineNumber: 313,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/printhub/src/component/shop/order-breakdown-modal.tsx",
                                lineNumber: 302,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/printhub/src/component/shop/order-breakdown-modal.tsx",
                        lineNumber: 298,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/printhub/src/component/shop/order-breakdown-modal.tsx",
                lineNumber: 235,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/printhub/src/component/shop/order-breakdown-modal.tsx",
        lineNumber: 87,
        columnNumber: 5
    }, this);
}
_s(OrderBreakdownModal, "Abaj2c6EOpFrw5xBRZWRMm7NHQk=");
_c = OrderBreakdownModal;
var _c;
__turbopack_context__.k.register(_c, "OrderBreakdownModal");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/printhub/src/component/shop/order-card.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>OrderCard
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/printhub/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__ = __turbopack_context__.i("[project]/printhub/node_modules/lucide-react/dist/esm/icons/check.mjs [app-client] (ecmascript) <export default as Check>");
var __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/printhub/node_modules/lucide-react/dist/esm/icons/x.mjs [app-client] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$printer$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Printer$3e$__ = __turbopack_context__.i("[project]/printhub/node_modules/lucide-react/dist/esm/icons/printer.mjs [app-client] (ecmascript) <export default as Printer>");
var __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__ = __turbopack_context__.i("[project]/printhub/node_modules/lucide-react/dist/esm/icons/loader-circle.mjs [app-client] (ecmascript) <export default as Loader2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Eye$3e$__ = __turbopack_context__.i("[project]/printhub/node_modules/lucide-react/dist/esm/icons/eye.mjs [app-client] (ecmascript) <export default as Eye>");
var __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__ = __turbopack_context__.i("[project]/printhub/node_modules/lucide-react/dist/esm/icons/clock.mjs [app-client] (ecmascript) <export default as Clock>");
var __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Calendar$3e$__ = __turbopack_context__.i("[project]/printhub/node_modules/lucide-react/dist/esm/icons/calendar.mjs [app-client] (ecmascript) <export default as Calendar>");
var __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/printhub/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/printhub/node_modules/axios/lib/axios.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
const API_BASE = "http://localhost:5000";
const STATUS = {
    PENDING: "รอการดำเนินงาน",
    PRINTING: "กำลังพิมพ์",
    DONE: "พิมพ์เสร็จสิ้น",
    COMPLETED: "รายการเสร็จสิ้น",
    CANCELLED: "ยกเลิกการพิมพ์",
    AWAITING_PAYMENT: "รอการชำระเงิน"
};
const STATUS_STYLE = {
    [STATUS.PENDING]: {
        badge: "bg-amber-50 text-amber-700 border-amber-200",
        dot: "bg-amber-500"
    },
    [STATUS.PRINTING]: {
        badge: "bg-blue-50 text-blue-700 border-blue-200",
        dot: "bg-blue-500"
    },
    [STATUS.DONE]: {
        badge: "bg-blue-100 text-blue-800 border-blue-300",
        dot: "bg-blue-700"
    },
    [STATUS.COMPLETED]: {
        badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
        dot: "bg-emerald-500"
    },
    [STATUS.CANCELLED]: {
        badge: "bg-rose-50 text-rose-700 border-rose-200",
        dot: "bg-rose-500"
    }
};
const FALLBACK_STYLE = {
    badge: "bg-slate-50 text-slate-600 border-slate-200",
    dot: "bg-slate-400"
};
function OrderCard({ order, onClick, onUpdateStatus, disabled = false }) {
    _s();
    const initialStatus = order.latest_status || order.current_status?.state || STATUS.PENDING;
    const [currentState, setCurrentState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(initialStatus);
    const [pendingAction, setPendingAction] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [errorMsg, setErrorMsg] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isVerified, setIsVerified] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(order.payment?.is_verified ?? null);
    const [verifyingSlip, setVerifyingSlip] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showSlipModal, setShowSlipModal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const updating = pendingAction !== null;
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "OrderCard.useEffect": ()=>{
            setCurrentState(order.latest_status || order.current_status?.state || STATUS.PENDING);
            setIsVerified(order.payment?.is_verified ?? null);
        }
    }["OrderCard.useEffect"], [
        order
    ]);
    async function updateState(newStatus) {
        if (updating || disabled) return;
        setPendingAction(newStatus);
        setErrorMsg(null);
        const url = `${API_BASE}/shop/orders/${order.id}/status`;
        try {
            await __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].patch(url, {
                status_name: newStatus
            }, {
                params: {
                    shop_id: order.shop_id
                }
            });
            setCurrentState(newStatus);
            onUpdateStatus?.(order.id, newStatus);
        } catch (err) {
            console.error("[OrderCard] request failed:", err);
            const backendMessage = err.response?.data?.error || "ไม่สามารถเปลี่ยนสถานะได้ กรุณาลองใหม่อีกครั้ง";
            setErrorMsg(backendMessage);
        } finally{
            setPendingAction(null);
        }
    }
    async function handleVerifySlip(isApproved) {
        if (verifyingSlip || updating || disabled) return;
        setVerifyingSlip(true);
        setErrorMsg(null);
        const newStatus = isApproved ? STATUS.PRINTING : STATUS.AWAITING_PAYMENT;
        const params = {
            params: {
                shop_id: order.shop_id
            }
        };
        try {
            await __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].patch(`${API_BASE}/shop/orders/${order.id}/verify-payment`, {
                is_verified: isApproved
            }, params);
            setIsVerified(isApproved);
            await __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].patch(`${API_BASE}/shop/orders/${order.id}/status`, {
                status_name: newStatus
            }, params);
            setCurrentState(newStatus);
            setShowSlipModal(false);
            onUpdateStatus?.(order.id, newStatus);
        } catch (err) {
            console.error("[OrderCard] slip verification failed:", err);
            const backendMessage = err.response?.data?.error || "ไม่สามารถตรวจสอบสลิปได้";
            setErrorMsg(backendMessage);
        } finally{
            setVerifyingSlip(false);
        }
    }
    const customerName = order.customer ? `${order.customer.first_name || ""} ${order.customer.last_name || ""}`.trim() : "ลูกค้าทั่วไป";
    const initialLetter = order.customer?.first_name?.charAt(0) || "U";
    const style = STATUS_STYLE[currentState] ?? FALLBACK_STYLE;
    // ฟังก์ชันจัดฟอร์แมตวันเวลาสั่งซื้อ
    const formatOrderDateTime = (dateStr)=>{
        if (!dateStr) return "-";
        const d = new Date(dateStr);
        if (isNaN(d.getTime())) return dateStr;
        const dateFormatted = d.toLocaleDateString("th-TH", {
            day: "numeric",
            month: "short",
            year: "2-digit"
        });
        const timeFormatted = d.toLocaleTimeString("th-TH", {
            hour: "2-digit",
            minute: "2-digit"
        });
        return `${dateFormatted} (${timeFormatted} น.)`;
    };
    // ฟังก์ชันจัดฟอร์แมตวันเวลานัดรับ
    const formatPickupDateTime = ()=>{
        const timeStr = order.appointment_time || order.receive_date;
        if (!timeStr) return null;
        const d = new Date(timeStr);
        if (isNaN(d.getTime())) return timeStr;
        const dateFormatted = d.toLocaleDateString("th-TH", {
            day: "numeric",
            month: "short",
            year: "2-digit"
        });
        const timeFormatted = d.toLocaleTimeString("th-TH", {
            hour: "2-digit",
            minute: "2-digit"
        });
        return `${dateFormatted} เวลา ${timeFormatted} น.`;
    };
    const pickupFormatted = formatPickupDateTime();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                onClick: ()=>{
                    if (!disabled) onClick?.();
                },
                className: "bg-white border border-slate-200 rounded-2xl p-6 hover:border-slate-300 hover:shadow-sm transition-all cursor-pointer flex flex-col justify-between",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex justify-between items-start gap-3",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "min-w-0",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                className: "font-semibold text-slate-900 text-base tracking-tight",
                                                children: [
                                                    "Order #",
                                                    order.order_no || order.id.slice(0, 8)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/printhub/src/component/shop/order-card.tsx",
                                                lineNumber: 228,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center gap-1.5 mt-1 text-xs text-slate-500",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Calendar$3e$__["Calendar"], {
                                                        size: 13,
                                                        className: "text-slate-400 shrink-0"
                                                    }, void 0, false, {
                                                        fileName: "[project]/printhub/src/component/shop/order-card.tsx",
                                                        lineNumber: 233,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        children: [
                                                            "สั่งเมื่อ: ",
                                                            formatOrderDateTime(order.order_date)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/printhub/src/component/shop/order-card.tsx",
                                                        lineNumber: 234,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/printhub/src/component/shop/order-card.tsx",
                                                lineNumber: 232,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/printhub/src/component/shop/order-card.tsx",
                                        lineNumber: 227,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: `inline-flex shrink-0 items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full border ${style.badge}`,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: `w-1.5 h-1.5 rounded-full ${style.dot}`
                                            }, void 0, false, {
                                                fileName: "[project]/printhub/src/component/shop/order-card.tsx",
                                                lineNumber: 241,
                                                columnNumber: 15
                                            }, this),
                                            currentState
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/printhub/src/component/shop/order-card.tsx",
                                        lineNumber: 238,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/printhub/src/component/shop/order-card.tsx",
                                lineNumber: 226,
                                columnNumber: 11
                            }, this),
                            pickupFormatted && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mt-3 flex items-center gap-1.5 text-xs font-medium text-amber-700 bg-amber-50/80 border border-amber-200/60 px-2.5 py-1.5 rounded-lg",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__["Clock"], {
                                        size: 14,
                                        className: "text-amber-600 shrink-0"
                                    }, void 0, false, {
                                        fileName: "[project]/printhub/src/component/shop/order-card.tsx",
                                        lineNumber: 249,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: [
                                            "เวลานัดรับ: ",
                                            pickupFormatted
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/printhub/src/component/shop/order-card.tsx",
                                        lineNumber: 250,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/printhub/src/component/shop/order-card.tsx",
                                lineNumber: 248,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mt-5 mb-6 flex items-center justify-between gap-3",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center gap-3 min-w-0",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center shrink-0 font-medium text-slate-600 text-sm",
                                                children: initialLetter
                                            }, void 0, false, {
                                                fileName: "[project]/printhub/src/component/shop/order-card.tsx",
                                                lineNumber: 257,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "min-w-0",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "font-medium text-slate-900 text-sm truncate",
                                                        children: customerName
                                                    }, void 0, false, {
                                                        fileName: "[project]/printhub/src/component/shop/order-card.tsx",
                                                        lineNumber: 262,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-xs text-slate-400 truncate mt-0.5",
                                                        children: order.description || "ไม่มีรายละเอียดเพิ่มเติม"
                                                    }, void 0, false, {
                                                        fileName: "[project]/printhub/src/component/shop/order-card.tsx",
                                                        lineNumber: 265,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/printhub/src/component/shop/order-card.tsx",
                                                lineNumber: 261,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/printhub/src/component/shop/order-card.tsx",
                                        lineNumber: 256,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "shrink-0 text-slate-900 font-semibold text-base tabular-nums",
                                        children: [
                                            Number(order.total_price || 0).toLocaleString(),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "ml-1 text-xs font-normal text-slate-400",
                                                children: "บาท"
                                            }, void 0, false, {
                                                fileName: "[project]/printhub/src/component/shop/order-card.tsx",
                                                lineNumber: 273,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/printhub/src/component/shop/order-card.tsx",
                                        lineNumber: 271,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/printhub/src/component/shop/order-card.tsx",
                                lineNumber: 255,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/printhub/src/component/shop/order-card.tsx",
                        lineNumber: 224,
                        columnNumber: 9
                    }, this),
                    errorMsg && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        role: "alert",
                        className: "mb-3 text-xs text-rose-600 font-medium",
                        children: errorMsg
                    }, void 0, false, {
                        fileName: "[project]/printhub/src/component/shop/order-card.tsx",
                        lineNumber: 280,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        onClick: (e)=>e.stopPropagation(),
                        children: [
                            currentState === STATUS.PENDING && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-3",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-slate-600 font-medium",
                                                children: [
                                                    "สลิปชำระเงิน:",
                                                    " ",
                                                    isVerified === true && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-emerald-600 font-semibold",
                                                        children: "ถูกต้องแล้ว"
                                                    }, void 0, false, {
                                                        fileName: "[project]/printhub/src/component/shop/order-card.tsx",
                                                        lineNumber: 293,
                                                        columnNumber: 21
                                                    }, this),
                                                    isVerified === false && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-rose-600 font-semibold",
                                                        children: "สลิปไม่ถูกต้อง"
                                                    }, void 0, false, {
                                                        fileName: "[project]/printhub/src/component/shop/order-card.tsx",
                                                        lineNumber: 296,
                                                        columnNumber: 21
                                                    }, this),
                                                    isVerified === null && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-amber-600 font-semibold",
                                                        children: "ยังไม่ได้ตรวจสอบ"
                                                    }, void 0, false, {
                                                        fileName: "[project]/printhub/src/component/shop/order-card.tsx",
                                                        lineNumber: 299,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/printhub/src/component/shop/order-card.tsx",
                                                lineNumber: 290,
                                                columnNumber: 17
                                            }, this),
                                            order.payment?.slip_url ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                type: "button",
                                                onClick: ()=>setShowSlipModal(true),
                                                className: "inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium hover:underline",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Eye$3e$__["Eye"], {
                                                        size: 14
                                                    }, void 0, false, {
                                                        fileName: "[project]/printhub/src/component/shop/order-card.tsx",
                                                        lineNumber: 309,
                                                        columnNumber: 21
                                                    }, this),
                                                    " ตรวจสอบสลิป"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/printhub/src/component/shop/order-card.tsx",
                                                lineNumber: 304,
                                                columnNumber: 19
                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-slate-400",
                                                children: "ไม่มีสลิป"
                                            }, void 0, false, {
                                                fileName: "[project]/printhub/src/component/shop/order-card.tsx",
                                                lineNumber: 312,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/printhub/src/component/shop/order-card.tsx",
                                        lineNumber: 289,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: isVerified === true ? "grid grid-cols-2 gap-2" : "",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                type: "button",
                                                onClick: ()=>updateState(STATUS.CANCELLED),
                                                disabled: updating || verifyingSlip,
                                                className: "flex w-full items-center justify-center gap-1.5 h-10 rounded-xl border border-rose-200 bg-white text-rose-600 text-sm font-medium hover:bg-rose-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
                                                children: [
                                                    pendingAction === STATUS.CANCELLED ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                                                        size: 15,
                                                        className: "animate-spin"
                                                    }, void 0, false, {
                                                        fileName: "[project]/printhub/src/component/shop/order-card.tsx",
                                                        lineNumber: 324,
                                                        columnNumber: 21
                                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                                        size: 15
                                                    }, void 0, false, {
                                                        fileName: "[project]/printhub/src/component/shop/order-card.tsx",
                                                        lineNumber: 326,
                                                        columnNumber: 21
                                                    }, this),
                                                    "ปฏิเสธ"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/printhub/src/component/shop/order-card.tsx",
                                                lineNumber: 317,
                                                columnNumber: 17
                                            }, this),
                                            isVerified === true && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                type: "button",
                                                onClick: ()=>updateState(STATUS.PRINTING),
                                                disabled: updating,
                                                className: "flex items-center justify-center gap-1.5 h-10 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed",
                                                children: [
                                                    pendingAction === STATUS.PRINTING ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                                                        size: 15,
                                                        className: "animate-spin"
                                                    }, void 0, false, {
                                                        fileName: "[project]/printhub/src/component/shop/order-card.tsx",
                                                        lineNumber: 339,
                                                        columnNumber: 23
                                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__["Check"], {
                                                        size: 15
                                                    }, void 0, false, {
                                                        fileName: "[project]/printhub/src/component/shop/order-card.tsx",
                                                        lineNumber: 341,
                                                        columnNumber: 23
                                                    }, this),
                                                    "ยืนยัน"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/printhub/src/component/shop/order-card.tsx",
                                                lineNumber: 332,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/printhub/src/component/shop/order-card.tsx",
                                        lineNumber: 316,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/printhub/src/component/shop/order-card.tsx",
                                lineNumber: 288,
                                columnNumber: 13
                            }, this),
                            currentState === STATUS.PRINTING && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                onClick: ()=>updateState(STATUS.DONE),
                                disabled: updating,
                                className: "w-full flex items-center justify-center gap-2 h-10 rounded-xl bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
                                children: [
                                    pendingAction === STATUS.DONE ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                                        size: 15,
                                        className: "animate-spin"
                                    }, void 0, false, {
                                        fileName: "[project]/printhub/src/component/shop/order-card.tsx",
                                        lineNumber: 358,
                                        columnNumber: 17
                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$printer$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Printer$3e$__["Printer"], {
                                        size: 15
                                    }, void 0, false, {
                                        fileName: "[project]/printhub/src/component/shop/order-card.tsx",
                                        lineNumber: 360,
                                        columnNumber: 17
                                    }, this),
                                    "พิมพ์เสร็จสิ้น"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/printhub/src/component/shop/order-card.tsx",
                                lineNumber: 351,
                                columnNumber: 13
                            }, this),
                            currentState === STATUS.DONE && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-sm text-blue-600 font-medium text-center",
                                children: "เสร็จสิ้นเรียบร้อยแล้ว"
                            }, void 0, false, {
                                fileName: "[project]/printhub/src/component/shop/order-card.tsx",
                                lineNumber: 367,
                                columnNumber: 13
                            }, this),
                            currentState === STATUS.COMPLETED && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-sm text-emerald-600 font-medium text-center",
                                children: "เสร็จสิ้นเรียบร้อยแล้ว"
                            }, void 0, false, {
                                fileName: "[project]/printhub/src/component/shop/order-card.tsx",
                                lineNumber: 373,
                                columnNumber: 13
                            }, this),
                            currentState === STATUS.CANCELLED && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-sm text-rose-500 font-medium text-center",
                                children: "ยกเลิกแล้ว"
                            }, void 0, false, {
                                fileName: "[project]/printhub/src/component/shop/order-card.tsx",
                                lineNumber: 379,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/printhub/src/component/shop/order-card.tsx",
                        lineNumber: 286,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/printhub/src/component/shop/order-card.tsx",
                lineNumber: 218,
                columnNumber: 7
            }, this),
            showSlipModal && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200",
                onClick: ()=>setShowSlipModal(false),
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl relative flex flex-col",
                    onClick: (e)=>e.stopPropagation(),
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center justify-between px-5 py-4 border-b border-slate-100",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                    className: "font-semibold text-slate-800 text-base",
                                    children: [
                                        "หลักฐานการชำระเงิน (Order #",
                                        order.order_no || order.id.slice(0, 8),
                                        ")"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/printhub/src/component/shop/order-card.tsx",
                                    lineNumber: 397,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "button",
                                    onClick: ()=>setShowSlipModal(false),
                                    className: "w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                        size: 18
                                    }, void 0, false, {
                                        fileName: "[project]/printhub/src/component/shop/order-card.tsx",
                                        lineNumber: 405,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/printhub/src/component/shop/order-card.tsx",
                                    lineNumber: 400,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/printhub/src/component/shop/order-card.tsx",
                            lineNumber: 396,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "p-4 flex items-center justify-center bg-slate-50 max-h-[60vh] overflow-auto",
                            children: order.payment?.slip_url ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                src: order.payment.slip_url,
                                alt: "สลิปชำระเงิน",
                                className: "max-h-[55vh] w-auto object-contain rounded-lg shadow-md"
                            }, void 0, false, {
                                fileName: "[project]/printhub/src/component/shop/order-card.tsx",
                                lineNumber: 411,
                                columnNumber: 17
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-slate-400 text-sm py-10",
                                children: "ไม่พบรูปภาพสลิป"
                            }, void 0, false, {
                                fileName: "[project]/printhub/src/component/shop/order-card.tsx",
                                lineNumber: 417,
                                columnNumber: 17
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/printhub/src/component/shop/order-card.tsx",
                            lineNumber: 409,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "p-4 border-t border-slate-100 flex items-center justify-between gap-3 bg-white",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "button",
                                    onClick: ()=>setShowSlipModal(false),
                                    className: "px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition-colors",
                                    children: "ปิด"
                                }, void 0, false, {
                                    fileName: "[project]/printhub/src/component/shop/order-card.tsx",
                                    lineNumber: 422,
                                    columnNumber: 15
                                }, this),
                                isVerified === null && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex gap-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            type: "button",
                                            onClick: ()=>handleVerifySlip(false),
                                            disabled: verifyingSlip,
                                            className: "px-3 py-2 text-sm font-medium text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-xl transition-colors disabled:opacity-50",
                                            children: "สลิปไม่ถูกต้อง"
                                        }, void 0, false, {
                                            fileName: "[project]/printhub/src/component/shop/order-card.tsx",
                                            lineNumber: 432,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            type: "button",
                                            onClick: ()=>handleVerifySlip(true),
                                            disabled: verifyingSlip,
                                            className: "inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors disabled:opacity-50",
                                            children: [
                                                verifyingSlip ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                                                    size: 16,
                                                    className: "animate-spin"
                                                }, void 0, false, {
                                                    fileName: "[project]/printhub/src/component/shop/order-card.tsx",
                                                    lineNumber: 447,
                                                    columnNumber: 23
                                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__["Check"], {
                                                    size: 16
                                                }, void 0, false, {
                                                    fileName: "[project]/printhub/src/component/shop/order-card.tsx",
                                                    lineNumber: 449,
                                                    columnNumber: 23
                                                }, this),
                                                "ยืนยันสลิปถูกต้อง"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/printhub/src/component/shop/order-card.tsx",
                                            lineNumber: 440,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/printhub/src/component/shop/order-card.tsx",
                                    lineNumber: 431,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/printhub/src/component/shop/order-card.tsx",
                            lineNumber: 421,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/printhub/src/component/shop/order-card.tsx",
                    lineNumber: 392,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/printhub/src/component/shop/order-card.tsx",
                lineNumber: 388,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/printhub/src/component/shop/order-card.tsx",
        lineNumber: 217,
        columnNumber: 5
    }, this);
}
_s(OrderCard, "8i5zDePvpiK2gNzJPP16CGgGv4M=");
_c = OrderCard;
var _c;
__turbopack_context__.k.register(_c, "OrderCard");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/printhub/src/component/shop/review-complaint-modal.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ReviewComplaintModal
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/printhub/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/printhub/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$star$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Star$3e$__ = __turbopack_context__.i("[project]/printhub/node_modules/lucide-react/dist/esm/icons/star.mjs [app-client] (ecmascript) <export default as Star>");
var __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__ = __turbopack_context__.i("[project]/printhub/node_modules/lucide-react/dist/esm/icons/triangle-alert.mjs [app-client] (ecmascript) <export default as AlertTriangle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$printer$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Printer$3e$__ = __turbopack_context__.i("[project]/printhub/node_modules/lucide-react/dist/esm/icons/printer.mjs [app-client] (ecmascript) <export default as Printer>");
var __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__ = __turbopack_context__.i("[project]/printhub/node_modules/lucide-react/dist/esm/icons/user.mjs [app-client] (ecmascript) <export default as User>");
var __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__ = __turbopack_context__.i("[project]/printhub/node_modules/lucide-react/dist/esm/icons/file-text.mjs [app-client] (ecmascript) <export default as FileText>");
var __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Calendar$3e$__ = __turbopack_context__.i("[project]/printhub/node_modules/lucide-react/dist/esm/icons/calendar.mjs [app-client] (ecmascript) <export default as Calendar>");
var __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$layers$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Layers$3e$__ = __turbopack_context__.i("[project]/printhub/node_modules/lucide-react/dist/esm/icons/layers.mjs [app-client] (ecmascript) <export default as Layers>");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
const REPORT_STATUS_MAP = {
    investigating: {
        label: "กำลังตรวจสอบ",
        className: "bg-amber-100 text-amber-700 border-amber-200",
        showDisputeNote: true
    },
    resolved_refund: {
        label: "คำร้องเรียนสำเร็จ",
        className: "bg-emerald-100 text-emerald-700 border-emerald-200"
    },
    resolved_payout: {
        label: "ปฏิเสธคำร้องเรียน",
        className: "bg-slate-200 text-slate-700 border-slate-300"
    },
    rejected: {
        label: "คำร้องเรียนถูกยกเลิก",
        className: "bg-rose-100 text-rose-700 border-rose-200"
    }
};
// pending / null / ค่าที่ไม่รู้จัก => คืน null (ไม่แสดง)
const getReportStatus = (status)=>{
    const key = (status ?? "").toLowerCase().trim();
    if (key === "investigation") return REPORT_STATUS_MAP.investigating;
    return REPORT_STATUS_MAP[key] ?? null;
};
function ReviewComplaintModal({ reviews = [], complaints = [], summary, ratingCounts, onOrderClick }) {
    _s();
    const [tab, setTab] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("reviews");
    const [selectedStar, setSelectedStar] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("all");
    const visibleComplaints = complaints.filter((c)=>getReportStatus(c.status));
    const getRatingValue = (r)=>Number(r.rating ?? r.score ?? 0);
    const counts = ratingCounts || {
        5: reviews.filter((r)=>Math.round(getRatingValue(r)) === 5).length,
        4: reviews.filter((r)=>Math.round(getRatingValue(r)) === 4).length,
        3: reviews.filter((r)=>Math.round(getRatingValue(r)) === 3).length,
        2: reviews.filter((r)=>Math.round(getRatingValue(r)) === 2).length,
        1: reviews.filter((r)=>Math.round(getRatingValue(r)) === 1).length
    };
    const totalReviews = summary?.total_reviews ?? reviews.length;
    const avgRating = summary?.average_rating?.toFixed(1) ?? (totalReviews > 0 ? (reviews.reduce((sum, r)=>sum + getRatingValue(r), 0) / totalReviews).toFixed(1) : "0.0");
    const filteredReviews = selectedStar === "all" ? reviews : reviews.filter((r)=>Math.round(getRatingValue(r)) === selectedStar);
    const formatDate = (dateStr)=>{
        const d = new Date(dateStr);
        if (isNaN(d.getTime())) return dateStr;
        return d.toLocaleDateString("th-TH", {
            day: "numeric",
            month: "short",
            year: "numeric"
        });
    };
    const renderOrderItemsDetail = (order)=>{
        if (!order) return null;
        if (order.items && order.items.length > 0) {
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-2 space-y-1",
                children: order.items.map((item, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-[11px] text-slate-600 bg-white p-2 rounded border border-slate-100",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "font-semibold text-slate-800",
                                children: [
                                    "• ",
                                    item.category || "สิ่งพิมพ์",
                                    " ",
                                    item.quantity ? `(จำนวน ${item.quantity} ชิ้น)` : ""
                                ]
                            }, void 0, true, {
                                fileName: "[project]/printhub/src/component/shop/review-complaint-modal.tsx",
                                lineNumber: 155,
                                columnNumber: 15
                            }, this),
                            item.describe && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-[10px] text-slate-500 pl-2 pt-0.5",
                                children: item.describe
                            }, void 0, false, {
                                fileName: "[project]/printhub/src/component/shop/review-complaint-modal.tsx",
                                lineNumber: 158,
                                columnNumber: 33
                            }, this)
                        ]
                    }, item.id || idx, true, {
                        fileName: "[project]/printhub/src/component/shop/review-complaint-modal.tsx",
                        lineNumber: 154,
                        columnNumber: 13
                    }, this))
            }, void 0, false, {
                fileName: "[project]/printhub/src/component/shop/review-complaint-modal.tsx",
                lineNumber: 152,
                columnNumber: 9
            }, this);
        }
        if (order.description) {
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-[11px] text-slate-600 mt-1 pl-1",
                children: order.description
            }, void 0, false, {
                fileName: "[project]/printhub/src/component/shop/review-complaint-modal.tsx",
                lineNumber: 166,
                columnNumber: 14
            }, this);
        }
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
            className: "text-[11px] text-slate-400 mt-1 italic pl-1",
            children: "ไม่พบข้อมูลสิ่งพิมพ์"
        }, void 0, false, {
            fileName: "[project]/printhub/src/component/shop/review-complaint-modal.tsx",
            lineNumber: 169,
            columnNumber: 12
        }, this);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "rounded-2xl border border-slate-100 bg-white p-6 shadow-sm",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: "text-base font-bold text-[#0F2942]",
                                children: "ความคิดเห็นและการร้องเรียน"
                            }, void 0, false, {
                                fileName: "[project]/printhub/src/component/shop/review-complaint-modal.tsx",
                                lineNumber: 177,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-xs text-slate-500",
                                children: "รีวิวจากลูกค้าและข้อเสนอแนะที่ต้องปรับปรุง"
                            }, void 0, false, {
                                fileName: "[project]/printhub/src/component/shop/review-complaint-modal.tsx",
                                lineNumber: 180,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/printhub/src/component/shop/review-complaint-modal.tsx",
                        lineNumber: 176,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex rounded-xl bg-slate-100/80 p-1 text-xs font-semibold",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                onClick: ()=>setTab("reviews"),
                                className: `flex items-center gap-1.5 rounded-lg px-3 py-1.5 transition-all ${tab === "reviews" ? "bg-white text-amber-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$star$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Star$3e$__["Star"], {
                                        className: "h-3.5 w-3.5 fill-amber-400 text-amber-400"
                                    }, void 0, false, {
                                        fileName: "[project]/printhub/src/component/shop/review-complaint-modal.tsx",
                                        lineNumber: 195,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: [
                                            "รีวิว (",
                                            totalReviews,
                                            ")"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/printhub/src/component/shop/review-complaint-modal.tsx",
                                        lineNumber: 196,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/printhub/src/component/shop/review-complaint-modal.tsx",
                                lineNumber: 186,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                onClick: ()=>setTab("complaints"),
                                className: `flex items-center gap-1.5 rounded-lg px-3 py-1.5 transition-all ${tab === "complaints" ? "bg-white text-rose-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__["AlertTriangle"], {
                                        className: "h-3.5 w-3.5 text-rose-500"
                                    }, void 0, false, {
                                        fileName: "[project]/printhub/src/component/shop/review-complaint-modal.tsx",
                                        lineNumber: 207,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: [
                                            "รายการร้องเรียน (",
                                            visibleComplaints.length,
                                            ")"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/printhub/src/component/shop/review-complaint-modal.tsx",
                                        lineNumber: 208,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/printhub/src/component/shop/review-complaint-modal.tsx",
                                lineNumber: 198,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/printhub/src/component/shop/review-complaint-modal.tsx",
                        lineNumber: 185,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/printhub/src/component/shop/review-complaint-modal.tsx",
                lineNumber: 175,
                columnNumber: 7
            }, this),
            tab === "reviews" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "space-y-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid grid-cols-1 gap-6 rounded-xl border border-slate-100 bg-slate-50/50 p-4 md:grid-cols-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex flex-col items-center justify-center border-b border-slate-200/60 pb-4 md:border-b-0 md:border-r md:pb-0",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-4xl font-extrabold text-slate-800",
                                        children: avgRating
                                    }, void 0, false, {
                                        fileName: "[project]/printhub/src/component/shop/review-complaint-modal.tsx",
                                        lineNumber: 218,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "my-1.5 flex gap-1",
                                        children: [
                                            1,
                                            2,
                                            3,
                                            4,
                                            5
                                        ].map((star)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$star$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Star$3e$__["Star"], {
                                                className: `h-4 w-4 ${star <= Math.round(Number(avgRating)) ? "fill-amber-400 text-amber-400" : "text-slate-300"}`
                                            }, star, false, {
                                                fileName: "[project]/printhub/src/component/shop/review-complaint-modal.tsx",
                                                lineNumber: 223,
                                                columnNumber: 19
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/printhub/src/component/shop/review-complaint-modal.tsx",
                                        lineNumber: 221,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-xs text-slate-500",
                                        children: [
                                            "จากทั้งหมด ",
                                            totalReviews,
                                            " รีวิว"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/printhub/src/component/shop/review-complaint-modal.tsx",
                                        lineNumber: 233,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/printhub/src/component/shop/review-complaint-modal.tsx",
                                lineNumber: 217,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "col-span-2 space-y-1.5",
                                children: [
                                    5,
                                    4,
                                    3,
                                    2,
                                    1
                                ].map((star)=>{
                                    const breakdownItem = summary?.rating_breakdown?.find((b)=>b.stars === star);
                                    const count = breakdownItem?.count ?? counts[star] ?? 0;
                                    const percentage = breakdownItem?.percentage ?? (totalReviews > 0 ? count / totalReviews * 100 : 0);
                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center gap-2 text-xs",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "flex w-12 items-center gap-1 font-semibold text-slate-600",
                                                children: [
                                                    star,
                                                    " ",
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$star$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Star$3e$__["Star"], {
                                                        className: "h-3 w-3 fill-amber-400 text-amber-400"
                                                    }, void 0, false, {
                                                        fileName: "[project]/printhub/src/component/shop/review-complaint-modal.tsx",
                                                        lineNumber: 252,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/printhub/src/component/shop/review-complaint-modal.tsx",
                                                lineNumber: 250,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "h-2 flex-1 overflow-hidden rounded-full bg-slate-200",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    style: {
                                                        width: `${percentage}%`
                                                    },
                                                    className: "h-full rounded-full bg-amber-400 transition-all duration-300"
                                                }, void 0, false, {
                                                    fileName: "[project]/printhub/src/component/shop/review-complaint-modal.tsx",
                                                    lineNumber: 255,
                                                    columnNumber: 23
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/printhub/src/component/shop/review-complaint-modal.tsx",
                                                lineNumber: 254,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "w-16 text-right text-slate-400 font-mono",
                                                children: [
                                                    count,
                                                    " (",
                                                    Math.round(percentage),
                                                    "%)"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/printhub/src/component/shop/review-complaint-modal.tsx",
                                                lineNumber: 260,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, star, true, {
                                        fileName: "[project]/printhub/src/component/shop/review-complaint-modal.tsx",
                                        lineNumber: 249,
                                        columnNumber: 19
                                    }, this);
                                })
                            }, void 0, false, {
                                fileName: "[project]/printhub/src/component/shop/review-complaint-modal.tsx",
                                lineNumber: 238,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/printhub/src/component/shop/review-complaint-modal.tsx",
                        lineNumber: 216,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-wrap items-center gap-2 border-b border-slate-100 pb-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-xs font-semibold text-slate-500",
                                children: "กรองดาว:"
                            }, void 0, false, {
                                fileName: "[project]/printhub/src/component/shop/review-complaint-modal.tsx",
                                lineNumber: 271,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                onClick: ()=>setSelectedStar("all"),
                                className: `rounded-lg px-3 py-1 text-xs font-medium transition-all ${selectedStar === "all" ? "bg-slate-800 text-white shadow-sm" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`,
                                children: "ทั้งหมด"
                            }, void 0, false, {
                                fileName: "[project]/printhub/src/component/shop/review-complaint-modal.tsx",
                                lineNumber: 272,
                                columnNumber: 13
                            }, this),
                            [
                                5,
                                4,
                                3,
                                2,
                                1
                            ].map((star)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "button",
                                    onClick: ()=>setSelectedStar(star),
                                    className: `flex items-center gap-1 rounded-lg px-3 py-1 text-xs font-medium transition-all ${selectedStar === star ? "bg-amber-500 text-white shadow-sm" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: star
                                        }, void 0, false, {
                                            fileName: "[project]/printhub/src/component/shop/review-complaint-modal.tsx",
                                            lineNumber: 294,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$star$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Star$3e$__["Star"], {
                                            className: `h-3 w-3 ${selectedStar === star ? "fill-white text-white" : "fill-amber-400 text-amber-400"}`
                                        }, void 0, false, {
                                            fileName: "[project]/printhub/src/component/shop/review-complaint-modal.tsx",
                                            lineNumber: 295,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-[10px] opacity-80",
                                            children: [
                                                "(",
                                                counts[star] || 0,
                                                ")"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/printhub/src/component/shop/review-complaint-modal.tsx",
                                            lineNumber: 302,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, star, true, {
                                    fileName: "[project]/printhub/src/component/shop/review-complaint-modal.tsx",
                                    lineNumber: 284,
                                    columnNumber: 15
                                }, this))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/printhub/src/component/shop/review-complaint-modal.tsx",
                        lineNumber: 270,
                        columnNumber: 11
                    }, this),
                    filteredReviews.length > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "max-h-[420px] space-y-3 overflow-y-auto pr-1",
                        children: filteredReviews.map((r)=>{
                            const scoreVal = getRatingValue(r);
                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "rounded-xl border border-slate-100 bg-white p-4 shadow-sm transition-all hover:border-slate-200",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-start justify-between gap-3",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center gap-3",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex h-8 w-8 items-center justify-center rounded-full bg-amber-50 text-amber-600 font-bold border border-amber-100",
                                                        children: r.customer?.first_name ? r.customer.first_name.charAt(0) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__["User"], {
                                                            className: "h-4 w-4"
                                                        }, void 0, false, {
                                                            fileName: "[project]/printhub/src/component/shop/review-complaint-modal.tsx",
                                                            lineNumber: 320,
                                                            columnNumber: 87
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/printhub/src/component/shop/review-complaint-modal.tsx",
                                                        lineNumber: 319,
                                                        columnNumber: 25
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                                className: "text-xs font-bold text-slate-800",
                                                                children: r.customer ? `${r.customer.first_name} ${r.customer.last_name}` : "ลูกค้าทั่วไป"
                                                            }, void 0, false, {
                                                                fileName: "[project]/printhub/src/component/shop/review-complaint-modal.tsx",
                                                                lineNumber: 323,
                                                                columnNumber: 27
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex items-center gap-0.5 mt-0.5",
                                                                children: [
                                                                    1,
                                                                    2,
                                                                    3,
                                                                    4,
                                                                    5
                                                                ].map((s)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$star$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Star$3e$__["Star"], {
                                                                        className: `h-3 w-3 ${s <= scoreVal ? "fill-amber-400 text-amber-400" : "text-slate-200"}`
                                                                    }, s, false, {
                                                                        fileName: "[project]/printhub/src/component/shop/review-complaint-modal.tsx",
                                                                        lineNumber: 328,
                                                                        columnNumber: 31
                                                                    }, this))
                                                            }, void 0, false, {
                                                                fileName: "[project]/printhub/src/component/shop/review-complaint-modal.tsx",
                                                                lineNumber: 326,
                                                                columnNumber: 27
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/printhub/src/component/shop/review-complaint-modal.tsx",
                                                        lineNumber: 322,
                                                        columnNumber: 25
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/printhub/src/component/shop/review-complaint-modal.tsx",
                                                lineNumber: 318,
                                                columnNumber: 23
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-[11px] text-slate-400",
                                                children: formatDate(r.created_at)
                                            }, void 0, false, {
                                                fileName: "[project]/printhub/src/component/shop/review-complaint-modal.tsx",
                                                lineNumber: 338,
                                                columnNumber: 23
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/printhub/src/component/shop/review-complaint-modal.tsx",
                                        lineNumber: 317,
                                        columnNumber: 21
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "mt-2.5 text-xs text-slate-700 leading-relaxed bg-slate-50/50 p-2.5 rounded-lg border border-slate-100/60",
                                        children: r.comment || "ไม่ได้ระบุความคิดเห็นเพิ่มเติม"
                                    }, void 0, false, {
                                        fileName: "[project]/printhub/src/component/shop/review-complaint-modal.tsx",
                                        lineNumber: 341,
                                        columnNumber: 21
                                    }, this),
                                    r.print_order && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        onClick: ()=>onOrderClick?.(r.print_order.id),
                                        className: "mt-2.5 rounded-lg bg-emerald-50/40 p-2.5 border border-emerald-100/70 text-emerald-900 cursor-pointer hover:bg-emerald-100/50 transition-colors",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center gap-1.5 text-xs font-semibold text-emerald-800",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$printer$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Printer$3e$__["Printer"], {
                                                        className: "h-3.5 w-3.5 text-emerald-600 shrink-0"
                                                    }, void 0, false, {
                                                        fileName: "[project]/printhub/src/component/shop/review-complaint-modal.tsx",
                                                        lineNumber: 351,
                                                        columnNumber: 27
                                                    }, this),
                                                    "Order ",
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                        className: "text-emerald-950",
                                                        children: [
                                                            "#",
                                                            r.print_order.order_no || r.print_order.id.slice(0, 8)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/printhub/src/component/shop/review-complaint-modal.tsx",
                                                        lineNumber: 352,
                                                        columnNumber: 33
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/printhub/src/component/shop/review-complaint-modal.tsx",
                                                lineNumber: 350,
                                                columnNumber: 25
                                            }, this),
                                            renderOrderItemsDetail(r.print_order)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/printhub/src/component/shop/review-complaint-modal.tsx",
                                        lineNumber: 346,
                                        columnNumber: 23
                                    }, this)
                                ]
                            }, r.id, true, {
                                fileName: "[project]/printhub/src/component/shop/review-complaint-modal.tsx",
                                lineNumber: 313,
                                columnNumber: 19
                            }, this);
                        })
                    }, void 0, false, {
                        fileName: "[project]/printhub/src/component/shop/review-complaint-modal.tsx",
                        lineNumber: 309,
                        columnNumber: 13
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "py-12 text-center text-slate-400 text-xs",
                        children: "ยังไม่มีรีวิวในระดับดาวนี้"
                    }, void 0, false, {
                        fileName: "[project]/printhub/src/component/shop/review-complaint-modal.tsx",
                        lineNumber: 362,
                        columnNumber: 13
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/printhub/src/component/shop/review-complaint-modal.tsx",
                lineNumber: 214,
                columnNumber: 9
            }, this) : /* 🟢 ข้อร้องเรียน Scroll แนวตั้ง */ /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "space-y-4",
                children: visibleComplaints.length > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "max-h-[420px] space-y-3 overflow-y-auto pr-1",
                    children: visibleComplaints.map((c)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "rounded-xl border border-rose-100 bg-rose-50/20 p-4 space-y-2.5",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center justify-between border-b border-rose-100/60 pb-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center gap-2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "rounded-md bg-rose-100 px-2 py-0.5 text-[10px] font-bold text-rose-700",
                                                    children: c.issue_type || "ข้อร้องเรียน/ปัญหา"
                                                }, void 0, false, {
                                                    fileName: "[project]/printhub/src/component/shop/review-complaint-modal.tsx",
                                                    lineNumber: 377,
                                                    columnNumber: 23
                                                }, this),
                                                (()=>{
                                                    const st = getReportStatus(c.status);
                                                    return st ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: `rounded-md border px-2 py-0.5 text-[10px] font-bold ${st.className}`,
                                                        children: st.label
                                                    }, void 0, false, {
                                                        fileName: "[project]/printhub/src/component/shop/review-complaint-modal.tsx",
                                                        lineNumber: 383,
                                                        columnNumber: 27
                                                    }, this) : null;
                                                })(),
                                                c.print_order && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    onClick: ()=>onOrderClick?.(c.print_order.id),
                                                    className: "text-xs font-bold text-slate-800 hover:text-blue-600 cursor-pointer underline underline-offset-2",
                                                    children: [
                                                        "Order #",
                                                        c.print_order.order_no || c.print_order.id.slice(0, 8)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/printhub/src/component/shop/review-complaint-modal.tsx",
                                                    lineNumber: 391,
                                                    columnNumber: 25
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/printhub/src/component/shop/review-complaint-modal.tsx",
                                            lineNumber: 376,
                                            columnNumber: 21
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-[11px] text-slate-400 flex items-center gap-1",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Calendar$3e$__["Calendar"], {
                                                    size: 12
                                                }, void 0, false, {
                                                    fileName: "[project]/printhub/src/component/shop/review-complaint-modal.tsx",
                                                    lineNumber: 400,
                                                    columnNumber: 23
                                                }, this),
                                                " ",
                                                formatDate(c.created_at)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/printhub/src/component/shop/review-complaint-modal.tsx",
                                            lineNumber: 399,
                                            columnNumber: 21
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/printhub/src/component/shop/review-complaint-modal.tsx",
                                    lineNumber: 375,
                                    columnNumber: 19
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-xs text-slate-700 space-y-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "font-semibold text-slate-800 flex items-center gap-1.5",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__["User"], {
                                                    size: 13,
                                                    className: "text-slate-500"
                                                }, void 0, false, {
                                                    fileName: "[project]/printhub/src/component/shop/review-complaint-modal.tsx",
                                                    lineNumber: 406,
                                                    columnNumber: 23
                                                }, this),
                                                "ผู้แจ้งเรื่อง:",
                                                " ",
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "font-normal text-slate-600",
                                                    children: c.customer ? `${c.customer.first_name} ${c.customer.last_name}` : "ไม่ระบุชื่อ"
                                                }, void 0, false, {
                                                    fileName: "[project]/printhub/src/component/shop/review-complaint-modal.tsx",
                                                    lineNumber: 408,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/printhub/src/component/shop/review-complaint-modal.tsx",
                                            lineNumber: 405,
                                            columnNumber: 21
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "font-semibold text-slate-800 flex items-center gap-1.5 mb-1",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__["FileText"], {
                                                            size: 13,
                                                            className: "text-slate-500"
                                                        }, void 0, false, {
                                                            fileName: "[project]/printhub/src/component/shop/review-complaint-modal.tsx",
                                                            lineNumber: 415,
                                                            columnNumber: 25
                                                        }, this),
                                                        "รายละเอียดปัญหาร้องเรียน:"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/printhub/src/component/shop/review-complaint-modal.tsx",
                                                    lineNumber: 414,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "bg-white p-2.5 rounded-lg border border-rose-100 text-slate-700 whitespace-pre-line leading-relaxed text-[11px]",
                                                    children: c.description || "ไม่มีรายละเอียดเพิ่มเติม"
                                                }, void 0, false, {
                                                    fileName: "[project]/printhub/src/component/shop/review-complaint-modal.tsx",
                                                    lineNumber: 418,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/printhub/src/component/shop/review-complaint-modal.tsx",
                                            lineNumber: 413,
                                            columnNumber: 21
                                        }, this),
                                        c.print_order && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "bg-white/80 p-2.5 rounded-lg border border-rose-100",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "font-semibold text-slate-800 flex items-center gap-1.5 text-[11px] text-rose-900 mb-1",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$layers$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Layers$3e$__["Layers"], {
                                                            size: 13,
                                                            className: "text-rose-600"
                                                        }, void 0, false, {
                                                            fileName: "[project]/printhub/src/component/shop/review-complaint-modal.tsx",
                                                            lineNumber: 426,
                                                            columnNumber: 27
                                                        }, this),
                                                        " รายการที่สั่งซื้อ:"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/printhub/src/component/shop/review-complaint-modal.tsx",
                                                    lineNumber: 425,
                                                    columnNumber: 25
                                                }, this),
                                                renderOrderItemsDetail(c.print_order)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/printhub/src/component/shop/review-complaint-modal.tsx",
                                            lineNumber: 424,
                                            columnNumber: 23
                                        }, this),
                                        getReportStatus(c.status)?.showDisputeNote && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-[11px] font-medium text-amber-700",
                                            children: "* หากท่านมีข้อโต้แย้งกรุณาติดต่อแอดมิน"
                                        }, void 0, false, {
                                            fileName: "[project]/printhub/src/component/shop/review-complaint-modal.tsx",
                                            lineNumber: 433,
                                            columnNumber: 23
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/printhub/src/component/shop/review-complaint-modal.tsx",
                                    lineNumber: 404,
                                    columnNumber: 19
                                }, this)
                            ]
                        }, c.id, true, {
                            fileName: "[project]/printhub/src/component/shop/review-complaint-modal.tsx",
                            lineNumber: 371,
                            columnNumber: 17
                        }, this))
                }, void 0, false, {
                    fileName: "[project]/printhub/src/component/shop/review-complaint-modal.tsx",
                    lineNumber: 369,
                    columnNumber: 13
                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "py-12 text-center text-slate-400 text-xs",
                    children: "ไม่มีรายการร้องเรียน"
                }, void 0, false, {
                    fileName: "[project]/printhub/src/component/shop/review-complaint-modal.tsx",
                    lineNumber: 442,
                    columnNumber: 13
                }, this)
            }, void 0, false, {
                fileName: "[project]/printhub/src/component/shop/review-complaint-modal.tsx",
                lineNumber: 367,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/printhub/src/component/shop/review-complaint-modal.tsx",
        lineNumber: 173,
        columnNumber: 5
    }, this);
}
_s(ReviewComplaintModal, "VBbXoHMU7uhQ3f8VUAynfxbZgZY=");
_c = ReviewComplaintModal;
var _c;
__turbopack_context__.k.register(_c, "ReviewComplaintModal");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=printhub_src_0swi4fh._.js.map