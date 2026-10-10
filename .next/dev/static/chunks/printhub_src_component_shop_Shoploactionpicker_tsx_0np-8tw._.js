(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/printhub/src/component/shop/Shoploactionpicker.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ShopLocationPicker
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/printhub/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$react$2d$leaflet$2f$lib$2f$MapContainer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/printhub/node_modules/react-leaflet/lib/MapContainer.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$react$2d$leaflet$2f$lib$2f$TileLayer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/printhub/node_modules/react-leaflet/lib/TileLayer.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$react$2d$leaflet$2f$lib$2f$Marker$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/printhub/node_modules/react-leaflet/lib/Marker.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$react$2d$leaflet$2f$lib$2f$hooks$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/printhub/node_modules/react-leaflet/lib/hooks.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/printhub/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$leaflet$2f$dist$2f$leaflet$2d$src$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/printhub/node_modules/leaflet/dist/leaflet-src.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/printhub/node_modules/axios/lib/axios.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature(), _s2 = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
const THAILAND_BOUNDS = [
    [
        5.61,
        97.34
    ],
    [
        20.46,
        105.64
    ]
];
const DEFAULT_CENTER = [
    13.7563,
    100.5018
];
const pinIcon = __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$leaflet$2f$dist$2f$leaflet$2d$src$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].divIcon({
    className: "custom-google-pin",
    html: `
    <div style="position: relative; display: flex; flex-direction: column; align-items: center; transform: translate(-50%, -100%); cursor: grab;">
      <svg width="34" height="46" viewBox="0 0 34 46" fill="none" xmlns="http://www.w3.org/2000/svg" style="filter: drop-shadow(0 4px 6px rgba(0,0,0,0.3));">
        <path d="M17 0C7.61116 0 0 7.61116 0 17C0 29.75 17 46 17 46C17 46 34 29.75 34 17C34 7.61116 26.3888 0 17 0Z" fill="#EA4335"/>
        <circle cx="17" cy="17" r="7" fill="white"/>
      </svg>
      <div style="width: 14px; height: 5px; background-color: rgba(0,0,0,0.3); border-radius: 50%; filter: blur(1.5px); margin-top: -3px;"></div>
    </div>
  `,
    iconSize: [
        0,
        0
    ],
    iconAnchor: [
        0,
        0
    ]
});
const nominatimApi = __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].create({
    baseURL: "https://nominatim.openstreetmap.org",
    headers: {
        "Accept-Language": "th,en"
    }
});
function MapClickHandler({ onClick }) {
    _s();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$react$2d$leaflet$2f$lib$2f$hooks$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMapEvents"])({
        click (e) {
            onClick(e.latlng.lat, e.latlng.lng);
        }
    });
    return null;
}
_s(MapClickHandler, "Ld/tk8Iz8AdZhC1l7acENaOEoCo=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$react$2d$leaflet$2f$lib$2f$hooks$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMapEvents"]
    ];
});
_c = MapClickHandler;
function MapFlyController({ position, bounds }) {
    _s1();
    const map = (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$react$2d$leaflet$2f$lib$2f$hooks$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMap"])();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "MapFlyController.useEffect": ()=>{
            if (bounds) {
                map.flyToBounds(bounds, {
                    duration: 1.2,
                    maxZoom: 16,
                    padding: [
                        50,
                        50
                    ]
                });
            } else {
                map.flyTo(position, Math.max(map.getZoom(), 16), {
                    duration: 1
                });
            }
        }
    }["MapFlyController.useEffect"], [
        position,
        bounds,
        map
    ]);
    return null;
}
_s1(MapFlyController, "IoceErwr5KVGS9kN4RQ1bOkYMAg=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$react$2d$leaflet$2f$lib$2f$hooks$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMap"]
    ];
});
_c1 = MapFlyController;
function ShopLocationPicker({ initialPosition, onChange, height = 380 }) {
    _s2();
    const [position, setPosition] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(initialPosition ? [
        initialPosition.lat,
        initialPosition.lng
    ] : DEFAULT_CENTER);
    const [targetBounds, setTargetBounds] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [locating, setLocating] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [searchQuery, setSearchQuery] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [searchResults, setSearchResults] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [isSearching, setIsSearching] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showDropdown, setShowDropdown] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const searchContainerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    // ถ้าร้านยังไม่มีพิกัด ให้ลองขอตำแหน่งปัจจุบันตอนเปิด
    // (ถ้ามีพิกัดเดิมอยู่แล้วจะไม่ขอ และไม่แจ้ง onChange เพื่อให้ "ใช้ตำแหน่งเดิม" ได้เลย)
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ShopLocationPicker.useEffect": ()=>{
            if (initialPosition) return;
            goToCurrentLocation();
        // eslint-disable-next-line react-hooks/exhaustive-deps
        }
    }["ShopLocationPicker.useEffect"], []);
    const moveTo = (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ShopLocationPicker.useCallback[moveTo]": (lat, lng, bounds = null)=>{
            setTargetBounds(bounds);
            setPosition([
                lat,
                lng
            ]);
            onChange({
                lat,
                lng
            });
        }
    }["ShopLocationPicker.useCallback[moveTo]"], [
        onChange
    ]);
    const goToCurrentLocation = ()=>{
        if (!navigator.geolocation) return;
        setLocating(true);
        navigator.geolocation.getCurrentPosition((pos)=>{
            setLocating(false);
            moveTo(pos.coords.latitude, pos.coords.longitude);
        }, ()=>setLocating(false), {
            enableHighAccuracy: true,
            timeout: 8000
        });
    };
    const applySearchResult = (item)=>{
        const lat = parseFloat(item.lat);
        const lng = parseFloat(item.lon);
        let bounds = null;
        if (item.boundingbox?.length === 4) {
            const [south, north, west, east] = item.boundingbox.map(parseFloat);
            bounds = [
                [
                    south,
                    west
                ],
                [
                    north,
                    east
                ]
            ];
        }
        moveTo(lat, lng, bounds);
        setShowDropdown(false);
    };
    const handleSearchSubmit = async ()=>{
        if (!searchQuery.trim()) return;
        setIsSearching(true);
        try {
            const { data } = await nominatimApi.get("/search", {
                params: {
                    format: "json",
                    q: searchQuery,
                    countrycodes: "th",
                    limit: 5
                }
            });
            setSearchResults(data);
            if (data?.length > 0) {
                setShowDropdown(true);
                applySearchResult(data[0]);
            } else {
                setShowDropdown(false);
            }
        } catch (err) {
            console.error("Search location error:", err);
        } finally{
            setIsSearching(false);
        }
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ShopLocationPicker.useEffect": ()=>{
            const handleClickOutside = {
                "ShopLocationPicker.useEffect.handleClickOutside": (e)=>{
                    if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
                        setShowDropdown(false);
                    }
                }
            }["ShopLocationPicker.useEffect.handleClickOutside"];
            document.addEventListener("mousedown", handleClickOutside);
            return ({
                "ShopLocationPicker.useEffect": ()=>document.removeEventListener("mousedown", handleClickOutside)
            })["ShopLocationPicker.useEffect"];
        }
    }["ShopLocationPicker.useEffect"], []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "relative z-0 w-full overflow-hidden font-sans",
        style: {
            height
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute left-3.5 right-3.5 top-3.5 z-[1000] max-w-sm",
                ref: searchContainerRef,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "relative flex items-center rounded-xl border border-slate-200 bg-white px-3.5 py-1 shadow-md",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                type: "text",
                                placeholder: "พิมพ์สถานที่แล้วกดค้นหา...",
                                value: searchQuery,
                                onChange: (e)=>setSearchQuery(e.target.value),
                                onFocus: ()=>searchResults.length > 0 && setShowDropdown(true),
                                onKeyDown: (e)=>{
                                    if (e.key === "Enter") {
                                        e.preventDefault();
                                        handleSearchSubmit();
                                    }
                                },
                                className: "w-full bg-transparent py-2 text-xs text-slate-800 outline-none placeholder:text-slate-400"
                            }, void 0, false, {
                                fileName: "[project]/printhub/src/component/shop/Shoploactionpicker.tsx",
                                lineNumber: 182,
                                columnNumber: 11
                            }, this),
                            searchQuery && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                className: "cursor-pointer border-none bg-transparent px-2 text-sm text-slate-400 hover:text-slate-600",
                                onClick: ()=>{
                                    setSearchQuery("");
                                    setSearchResults([]);
                                    setShowDropdown(false);
                                },
                                children: "✕"
                            }, void 0, false, {
                                fileName: "[project]/printhub/src/component/shop/Shoploactionpicker.tsx",
                                lineNumber: 197,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                className: "flex shrink-0 cursor-pointer items-center justify-center rounded-lg bg-blue-600 p-2 text-white transition-colors hover:bg-blue-700",
                                onClick: handleSearchSubmit,
                                title: "ค้นหา",
                                children: isSearching ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent"
                                }, void 0, false, {
                                    fileName: "[project]/printhub/src/component/shop/Shoploactionpicker.tsx",
                                    lineNumber: 216,
                                    columnNumber: 15
                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                    width: "18",
                                    height: "18",
                                    viewBox: "0 0 24 24",
                                    fill: "none",
                                    stroke: "currentColor",
                                    strokeWidth: "2.5",
                                    strokeLinecap: "round",
                                    strokeLinejoin: "round",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                                            cx: "11",
                                            cy: "11",
                                            r: "8"
                                        }, void 0, false, {
                                            fileName: "[project]/printhub/src/component/shop/Shoploactionpicker.tsx",
                                            lineNumber: 219,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                            x1: "21",
                                            y1: "21",
                                            x2: "16.65",
                                            y2: "16.65"
                                        }, void 0, false, {
                                            fileName: "[project]/printhub/src/component/shop/Shoploactionpicker.tsx",
                                            lineNumber: 220,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/printhub/src/component/shop/Shoploactionpicker.tsx",
                                    lineNumber: 218,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/printhub/src/component/shop/Shoploactionpicker.tsx",
                                lineNumber: 209,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/printhub/src/component/shop/Shoploactionpicker.tsx",
                        lineNumber: 181,
                        columnNumber: 9
                    }, this),
                    showDropdown && searchResults.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "absolute left-0 right-0 top-[calc(100%+6px)] z-[1001] max-h-56 overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-xl",
                        children: searchResults.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "cursor-pointer border-b border-slate-100 p-3 px-3.5 text-xs text-slate-700 transition-colors last:border-b-0 hover:bg-slate-50 hover:text-blue-600",
                                onClick: ()=>{
                                    setSearchQuery(item.display_name.split(",")[0]);
                                    applySearchResult(item);
                                },
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "line-clamp-2 font-medium",
                                    children: item.display_name
                                }, void 0, false, {
                                    fileName: "[project]/printhub/src/component/shop/Shoploactionpicker.tsx",
                                    lineNumber: 237,
                                    columnNumber: 17
                                }, this)
                            }, item.place_id, false, {
                                fileName: "[project]/printhub/src/component/shop/Shoploactionpicker.tsx",
                                lineNumber: 229,
                                columnNumber: 15
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/printhub/src/component/shop/Shoploactionpicker.tsx",
                        lineNumber: 227,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/printhub/src/component/shop/Shoploactionpicker.tsx",
                lineNumber: 180,
                columnNumber: 7
            }, this),
            locating && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "pointer-events-none absolute bottom-6 left-5 z-[1000] flex items-center gap-2 rounded-full bg-white/95 px-4 py-2 text-xs font-medium text-slate-800 shadow-md",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "h-3 w-3 animate-spin rounded-full border-2 border-blue-200 border-t-blue-600"
                    }, void 0, false, {
                        fileName: "[project]/printhub/src/component/shop/Shoploactionpicker.tsx",
                        lineNumber: 246,
                        columnNumber: 11
                    }, this),
                    "กำลังค้นหาตำแหน่งของคุณ..."
                ]
            }, void 0, true, {
                fileName: "[project]/printhub/src/component/shop/Shoploactionpicker.tsx",
                lineNumber: 245,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                type: "button",
                className: "absolute bottom-6 right-5 z-[1000] flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border-none bg-white text-blue-600 shadow-lg transition-all hover:-translate-y-0.5 hover:bg-blue-600 hover:text-white",
                onClick: goToCurrentLocation,
                title: "ไปที่ตำแหน่งปัจจุบันของคุณ",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                    width: "22",
                    height: "22",
                    viewBox: "0 0 24 24",
                    fill: "none",
                    stroke: "currentColor",
                    strokeWidth: "2.5",
                    strokeLinecap: "round",
                    strokeLinejoin: "round",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                            cx: "12",
                            cy: "12",
                            r: "8"
                        }, void 0, false, {
                            fileName: "[project]/printhub/src/component/shop/Shoploactionpicker.tsx",
                            lineNumber: 259,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                            x1: "12",
                            y1: "2",
                            x2: "12",
                            y2: "4"
                        }, void 0, false, {
                            fileName: "[project]/printhub/src/component/shop/Shoploactionpicker.tsx",
                            lineNumber: 260,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                            x1: "12",
                            y1: "20",
                            x2: "12",
                            y2: "22"
                        }, void 0, false, {
                            fileName: "[project]/printhub/src/component/shop/Shoploactionpicker.tsx",
                            lineNumber: 261,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                            x1: "2",
                            y1: "12",
                            x2: "4",
                            y2: "12"
                        }, void 0, false, {
                            fileName: "[project]/printhub/src/component/shop/Shoploactionpicker.tsx",
                            lineNumber: 262,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                            x1: "20",
                            y1: "12",
                            x2: "22",
                            y2: "12"
                        }, void 0, false, {
                            fileName: "[project]/printhub/src/component/shop/Shoploactionpicker.tsx",
                            lineNumber: 263,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/printhub/src/component/shop/Shoploactionpicker.tsx",
                    lineNumber: 258,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/printhub/src/component/shop/Shoploactionpicker.tsx",
                lineNumber: 252,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$react$2d$leaflet$2f$lib$2f$MapContainer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MapContainer"], {
                center: position,
                zoom: 16,
                minZoom: 5,
                maxZoom: 20,
                maxBounds: THAILAND_BOUNDS,
                maxBoundsViscosity: 1.0,
                zoomControl: false,
                style: {
                    height,
                    width: "100%"
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$react$2d$leaflet$2f$lib$2f$TileLayer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TileLayer"], {
                        attribution: '© <a href="https://maps.google.com">Google Maps</a>',
                        url: "https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}&hl=th",
                        maxZoom: 20,
                        subdomains: [
                            "mt0",
                            "mt1",
                            "mt2",
                            "mt3"
                        ]
                    }, void 0, false, {
                        fileName: "[project]/printhub/src/component/shop/Shoploactionpicker.tsx",
                        lineNumber: 277,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$react$2d$leaflet$2f$lib$2f$Marker$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Marker"], {
                        position: position,
                        icon: pinIcon,
                        draggable: true,
                        eventHandlers: {
                            dragend: (e)=>{
                                const p = e.target.getLatLng();
                                moveTo(p.lat, p.lng);
                            }
                        }
                    }, void 0, false, {
                        fileName: "[project]/printhub/src/component/shop/Shoploactionpicker.tsx",
                        lineNumber: 283,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(MapClickHandler, {
                        onClick: (lat, lng)=>moveTo(lat, lng)
                    }, void 0, false, {
                        fileName: "[project]/printhub/src/component/shop/Shoploactionpicker.tsx",
                        lineNumber: 294,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(MapFlyController, {
                        position: position,
                        bounds: targetBounds
                    }, void 0, false, {
                        fileName: "[project]/printhub/src/component/shop/Shoploactionpicker.tsx",
                        lineNumber: 295,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/printhub/src/component/shop/Shoploactionpicker.tsx",
                lineNumber: 267,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/printhub/src/component/shop/Shoploactionpicker.tsx",
        lineNumber: 175,
        columnNumber: 5
    }, this);
}
_s2(ShopLocationPicker, "ekronhwkYdZqTYKGCcrLqrZU5DM=");
_c2 = ShopLocationPicker;
var _c, _c1, _c2;
__turbopack_context__.k.register(_c, "MapClickHandler");
__turbopack_context__.k.register(_c1, "MapFlyController");
__turbopack_context__.k.register(_c2, "ShopLocationPicker");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/printhub/src/component/shop/Shoploactionpicker.tsx [app-client] (ecmascript, next/dynamic entry)", (function(__turbopack_context__){

__turbopack_context__.n(__turbopack_context__.i("[project]/printhub/src/component/shop/Shoploactionpicker.tsx [app-client] (ecmascript)"));
}),
]);

//# sourceMappingURL=printhub_src_component_shop_Shoploactionpicker_tsx_0np-8tw._.js.map