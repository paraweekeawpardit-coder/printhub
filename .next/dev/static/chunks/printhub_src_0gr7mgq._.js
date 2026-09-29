(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/printhub/src/app/shop/setting/[shop_id]/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ShopSettingsPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/printhub/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/printhub/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/printhub/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/printhub/node_modules/axios/lib/axios.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$store$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Store$3e$__ = __turbopack_context__.i("[project]/printhub/node_modules/lucide-react/dist/esm/icons/store.mjs [app-client] (ecmascript) <export default as Store>");
var __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$printer$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Printer$3e$__ = __turbopack_context__.i("[project]/printhub/node_modules/lucide-react/dist/esm/icons/printer.mjs [app-client] (ecmascript) <export default as Printer>");
var __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$landmark$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Landmark$3e$__ = __turbopack_context__.i("[project]/printhub/node_modules/lucide-react/dist/esm/icons/landmark.mjs [app-client] (ecmascript) <export default as Landmark>");
var __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__ = __turbopack_context__.i("[project]/printhub/node_modules/lucide-react/dist/esm/icons/loader-circle.mjs [app-client] (ecmascript) <export default as Loader2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$src$2f$component$2f$shop$2f$navbar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/printhub/src/component/shop/navbar.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$src$2f$component$2f$shop$2f$ShopProfileTab$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/printhub/src/component/shop/ShopProfileTab.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$src$2f$component$2f$shop$2f$ShopServiceTab$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/printhub/src/component/shop/ShopServiceTab.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$src$2f$component$2f$shop$2f$ShopBankTab$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/printhub/src/component/shop/ShopBankTab.tsx [app-client] (ecmascript)");
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
const API_BASE = "http://localhost:5000/shop";
// 🛠️ ตรงนี้ต้องตรงกับ key ที่ใช้ตอน login แล้วเก็บ shop_id ลง localStorage จริงๆ
const SHOP_ID_STORAGE_KEY = "shop_id";
// shop_id เป็น uuid (string) ไม่ใช่เลข ห้าม parseInt/Number เด็ดขาด
// รองรับกรณี localStorage เก็บเป็น id ดิบๆ ("cd04a0a0-...")
// หรือเก็บเป็น JSON object ทั้งก้อน (เช่น '{"id":"cd04a0a0-...", ...}')
function resolveShopId(raw) {
    if (!raw) return null;
    try {
        const parsed = JSON.parse(raw);
        if (typeof parsed === "string") return parsed;
        if (parsed && typeof parsed === "object" && parsed.id != null) {
            return String(parsed.id);
        }
    } catch  {
    // raw ไม่ใช่ JSON แปลว่าเป็น id ดิบๆ อยู่แล้ว
    }
    return raw;
}
function ShopSettingsPage() {
    _s();
    // 🛠️ ถ้าโฟลเดอร์จริงไม่ได้ชื่อ [shop_id] (เช่นเป็น [shopId] แทน)
    // ต้องเปลี่ยน params?.shop_id ตรงนี้ให้ตรงชื่อโฟลเดอร์ด้วย
    const params = (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useParams"])();
    const searchParams = (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"])();
    const [shopId, setShopId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ShopSettingsPage.useEffect": ()=>{
            const fromPath = params?.shop_id;
            const fromQuery = searchParams.get("shopId");
            const fromStorage = ("TURBOPACK compile-time truthy", 1) ? window.localStorage.getItem(SHOP_ID_STORAGE_KEY) : "TURBOPACK unreachable";
            const resolved = fromPath || fromQuery || resolveShopId(fromStorage);
            if (!resolved) {
                console.warn(`ไม่พบ shop_id ทั้งใน URL path, query (?shopId=..) และ localStorage (key: "${SHOP_ID_STORAGE_KEY}")`);
            }
            setShopId(resolved ?? null);
        }
    }["ShopSettingsPage.useEffect"], [
        params,
        searchParams
    ]);
    const [tab, setTab] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("profile");
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [saving, setSaving] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // Verification State
    const [isVerified, setIsVerified] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // Shop Open/Closed State (ปิดร้านชั่วคราว)
    const [isOpen, setIsOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [togglingOpen, setTogglingOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // Mode States
    const [isEditingProfile, setIsEditingProfile] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isEditingBank, setIsEditingBank] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [hasProfileData, setHasProfileData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [hasBankData, setHasBankData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // Shop Profile States
    const [shopName, setShopName] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [ownerName, setOwnerName] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [phone, setPhone] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [email, setEmail] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [openTime, setOpenTime] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("09:00");
    const [closeTime, setCloseTime] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("18:00");
    const [addressId, setAddressId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [address, setAddress] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        detail: "",
        subdistrict: "",
        district: "",
        province: "",
        postcode: ""
    });
    // Services State
    const [services, setServices] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    // Bank Account States
    const [bankAccountId, setBankAccountId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [bankName, setBankName] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [accountName, setAccountName] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [accountNumber, setAccountNumber] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const fetchShopSettings = (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ShopSettingsPage.useCallback[fetchShopSettings]": async ()=>{
            if (!shopId) {
                setLoading(false);
                return;
            }
            try {
                setLoading(true);
                const [profileRes, bankRes, servicesRes, verifyRes] = await Promise.allSettled([
                    __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get(`${API_BASE}/profile/${shopId}`),
                    __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get(`${API_BASE}/bank-account/${shopId}`),
                    __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get(`${API_BASE}/services/${shopId}`),
                    __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get(`${API_BASE}/verify-status/${shopId}`)
                ]);
                if (profileRes.status === "rejected") {
                    console.error("Fetch profile failed:", profileRes.reason);
                }
                if (bankRes.status === "rejected") {
                    console.error("Fetch bank-account failed:", bankRes.reason);
                }
                if (servicesRes.status === "rejected") {
                    console.error("Fetch services failed:", servicesRes.reason);
                }
                if (verifyRes.status === "rejected") {
                    console.error("Fetch verify-status failed:", verifyRes.reason);
                }
                const shop = profileRes.status === "fulfilled" ? profileRes.value.data?.data : null;
                const bankAccount = bankRes.status === "fulfilled" ? bankRes.value.data?.data : null;
                const shopServices = servicesRes.status === "fulfilled" ? servicesRes.value.data?.data : null;
                const verifyStatus = verifyRes.status === "fulfilled" ? verifyRes.value.data?.data : null;
                // Profile Data
                if (shop) {
                    setShopName(shop.shop_name ?? "");
                    setOwnerName(shop.owner_name ?? "");
                    setPhone(shop.phone ?? "");
                    setEmail(shop.email ?? "");
                    setOpenTime(shop.open_time ?? "09:00");
                    setCloseTime(shop.close_time ?? "18:00");
                    setIsOpen(shop.is_open ?? true);
                    if (shop.address) {
                        setAddressId(shop.address.id ?? null);
                        setAddress({
                            detail: shop.address.detail ?? "",
                            subdistrict: shop.address.subdistrict ?? "",
                            district: shop.address.district ?? "",
                            province: shop.address.province ?? "",
                            postcode: shop.address.postcode ?? ""
                        });
                    }
                    setHasProfileData(Boolean(shop.shop_name));
                }
                // Verification Status
                setIsVerified(Boolean(verifyStatus?.is_verify));
                // Services Data
                if (shopServices) {
                    const normalizedServices = shopServices.map({
                        "ShopSettingsPage.useCallback[fetchShopSettings].normalizedServices": (group)=>({
                                id: group.id,
                                type: group.type ?? "",
                                items: (group.service_detail ?? []).map({
                                    "ShopSettingsPage.useCallback[fetchShopSettings].normalizedServices": (d)=>({
                                            id: d.id,
                                            detail: d.detail ?? "",
                                            group_type: d.group_type ?? "",
                                            price: d.price != null ? String(d.price) : ""
                                        })
                                }["ShopSettingsPage.useCallback[fetchShopSettings].normalizedServices"])
                            })
                    }["ShopSettingsPage.useCallback[fetchShopSettings].normalizedServices"]);
                    setServices(normalizedServices);
                }
                // Bank Account Data
                if (bankAccount) {
                    setBankAccountId(bankAccount.id ?? null);
                    setBankName(bankAccount.bank_name ?? "");
                    setAccountName(bankAccount.account_name ?? "");
                    setAccountNumber(bankAccount.account_number ?? "");
                    setHasBankData(Boolean(bankAccount.bank_name || bankAccount.account_number));
                } else {
                    setHasBankData(false);
                }
            } catch (err) {
                console.error("Fetch shop settings error:", err);
            } finally{
                setLoading(false);
            }
        }
    }["ShopSettingsPage.useCallback[fetchShopSettings]"], [
        shopId
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ShopSettingsPage.useEffect": ()=>{
            fetchShopSettings();
        }
    }["ShopSettingsPage.useEffect"], [
        fetchShopSettings
    ]);
    const handleSaveProfile = async ()=>{
        if (!shopId) return;
        try {
            setSaving(true);
            await __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].put(`${API_BASE}/profile/${shopId}`, {
                shop_name: shopName,
                owner_name: ownerName,
                phone,
                open_time: openTime,
                close_time: closeTime,
                address: {
                    id: addressId,
                    ...address
                }
            });
            setHasProfileData(true);
            setIsEditingProfile(false);
            await fetchShopSettings();
        } catch (err) {
            console.error("Save profile error:", err);
        } finally{
            setSaving(false);
        }
    };
    // เปิด/ปิดร้านชั่วคราว
    const handleToggleOpen = async ()=>{
        if (!shopId) return;
        const nextValue = !isOpen;
        try {
            setTogglingOpen(true);
            await __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].patch(`${API_BASE}/profile/${shopId}/open-status`, {
                is_open: nextValue
            });
            setIsOpen(nextValue);
        } catch (err) {
            console.error("Toggle shop open status error:", err);
        } finally{
            setTogglingOpen(false);
        }
    };
    const handleSaveServices = async ()=>{
        if (!shopId) return;
        try {
            setSaving(true);
            const payloadServices = services.map((s)=>({
                    type: s.type,
                    service_detail: s.items.map((item)=>({
                            detail: item.detail,
                            group_type: item.group_type,
                            price: item.price
                        }))
                }));
            await __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post(`${API_BASE}/services`, {
                services: payloadServices
            }, {
                headers: {
                    shop_id: shopId
                }
            });
            await fetchShopSettings();
        } catch (err) {
            console.error("Save services error:", err);
        } finally{
            setSaving(false);
        }
    };
    const handleSaveBank = async ()=>{
        if (!shopId) return;
        try {
            setSaving(true);
            await __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].put(`${API_BASE}/bank-account/${shopId}`, {
                id: bankAccountId,
                bank_name: bankName,
                account_name: accountName,
                account_number: accountNumber
            });
            setHasBankData(true);
            setIsEditingBank(false);
            await fetchShopSettings();
        } catch (err) {
            console.error("Save bank error:", err);
        } finally{
            setSaving(false);
        }
    };
    const tabs = [
        {
            key: "profile",
            label: "ข้อมูลร้าน",
            icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$store$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Store$3e$__["Store"], {
                size: 16
            }, void 0, false, {
                fileName: "[project]/printhub/src/app/shop/setting/[shop_id]/page.tsx",
                lineNumber: 324,
                columnNumber: 50
            }, this),
            locked: !isVerified
        },
        {
            key: "services",
            label: "บริการพิมพ์",
            icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$printer$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Printer$3e$__["Printer"], {
                size: 16
            }, void 0, false, {
                fileName: "[project]/printhub/src/app/shop/setting/[shop_id]/page.tsx",
                lineNumber: 325,
                columnNumber: 52
            }, this),
            locked: !isVerified
        },
        {
            key: "bank",
            label: "บัญชีธนาคาร",
            icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$landmark$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Landmark$3e$__["Landmark"], {
                size: 16
            }, void 0, false, {
                fileName: "[project]/printhub/src/app/shop/setting/[shop_id]/page.tsx",
                lineNumber: 326,
                columnNumber: 48
            }, this),
            locked: !isVerified
        }
    ];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen bg-white",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$src$2f$component$2f$shop$2f$navbar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                fileName: "[project]/printhub/src/app/shop/setting/[shop_id]/page.tsx",
                lineNumber: 331,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mx-auto max-w-7xl px-12 py-10",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mb-8",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                className: "text-2xl font-bold text-[#0F2942]",
                                children: "ตั้งค่าร้านค้า"
                            }, void 0, false, {
                                fileName: "[project]/printhub/src/app/shop/setting/[shop_id]/page.tsx",
                                lineNumber: 336,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "mt-1 text-sm text-slate-500",
                                children: "จัดการข้อมูลทั่วไป บริการพิมพ์ และบัญชีธนาคารสำหรับการรับเงิน"
                            }, void 0, false, {
                                fileName: "[project]/printhub/src/app/shop/setting/[shop_id]/page.tsx",
                                lineNumber: 337,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/printhub/src/app/shop/setting/[shop_id]/page.tsx",
                        lineNumber: 335,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mb-8 border-b border-slate-200",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex gap-8",
                            children: tabs.map((t)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>setTab(t.key),
                                    className: `flex items-center gap-2 pb-3.5 text-sm font-semibold transition-colors relative ${tab === t.key ? "text-[#2F6FED]" : "text-slate-500 hover:text-slate-700"}`,
                                    children: [
                                        t.icon,
                                        t.label,
                                        tab === t.key && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "absolute bottom-0 left-0 right-0 h-0.5 bg-[#2F6FED] rounded-full"
                                        }, void 0, false, {
                                            fileName: "[project]/printhub/src/app/shop/setting/[shop_id]/page.tsx",
                                            lineNumber: 358,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, t.key, true, {
                                    fileName: "[project]/printhub/src/app/shop/setting/[shop_id]/page.tsx",
                                    lineNumber: 346,
                                    columnNumber: 15
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/printhub/src/app/shop/setting/[shop_id]/page.tsx",
                            lineNumber: 344,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/printhub/src/app/shop/setting/[shop_id]/page.tsx",
                        lineNumber: 343,
                        columnNumber: 9
                    }, this),
                    loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "py-12 text-center text-slate-500 flex items-center justify-center gap-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                                className: "animate-spin",
                                size: 18
                            }, void 0, false, {
                                fileName: "[project]/printhub/src/app/shop/setting/[shop_id]/page.tsx",
                                lineNumber: 368,
                                columnNumber: 13
                            }, this),
                            "กำลังโหลดข้อมูล..."
                        ]
                    }, void 0, true, {
                        fileName: "[project]/printhub/src/app/shop/setting/[shop_id]/page.tsx",
                        lineNumber: 367,
                        columnNumber: 11
                    }, this) : !shopId ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "py-12 text-center text-sm text-rose-500",
                        children: "ไม่พบ shop_id ของร้านค้า กรุณาเข้าสู่ระบบใหม่อีกครั้ง"
                    }, void 0, false, {
                        fileName: "[project]/printhub/src/app/shop/setting/[shop_id]/page.tsx",
                        lineNumber: 372,
                        columnNumber: 11
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "max-w-3xl",
                        children: [
                            tab === "profile" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$src$2f$component$2f$shop$2f$ShopProfileTab$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                isVerified: isVerified,
                                isOpen: isOpen,
                                onToggleOpen: handleToggleOpen,
                                togglingOpen: togglingOpen,
                                shopName: shopName,
                                setShopName: setShopName,
                                ownerName: ownerName,
                                setOwnerName: setOwnerName,
                                phone: phone,
                                setPhone: setPhone,
                                email: email,
                                openTime: openTime,
                                setOpenTime: setOpenTime,
                                closeTime: closeTime,
                                setCloseTime: setCloseTime,
                                address: address,
                                setAddress: setAddress,
                                onSave: handleSaveProfile,
                                saving: saving,
                                hasData: hasProfileData,
                                isEditing: isEditingProfile,
                                onToggleEdit: ()=>setIsEditingProfile((prev)=>!prev)
                            }, void 0, false, {
                                fileName: "[project]/printhub/src/app/shop/setting/[shop_id]/page.tsx",
                                lineNumber: 378,
                                columnNumber: 15
                            }, this),
                            tab === "services" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$src$2f$component$2f$shop$2f$ShopServiceTab$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                isVerified: isVerified,
                                services: services,
                                setServices: setServices,
                                onSave: handleSaveServices,
                                saving: saving
                            }, void 0, false, {
                                fileName: "[project]/printhub/src/app/shop/setting/[shop_id]/page.tsx",
                                lineNumber: 397,
                                columnNumber: 15
                            }, this),
                            tab === "bank" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$src$2f$component$2f$shop$2f$ShopBankTab$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                isVerified: isVerified,
                                bankName: bankName,
                                setBankName: setBankName,
                                accountName: accountName,
                                setAccountName: setAccountName,
                                accountNumber: accountNumber,
                                setAccountNumber: setAccountNumber,
                                onSave: handleSaveBank,
                                saving: saving,
                                hasData: hasBankData,
                                isEditing: isEditingBank,
                                onToggleEdit: ()=>setIsEditingBank((prev)=>!prev)
                            }, void 0, false, {
                                fileName: "[project]/printhub/src/app/shop/setting/[shop_id]/page.tsx",
                                lineNumber: 404,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/printhub/src/app/shop/setting/[shop_id]/page.tsx",
                        lineNumber: 376,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/printhub/src/app/shop/setting/[shop_id]/page.tsx",
                lineNumber: 333,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/printhub/src/app/shop/setting/[shop_id]/page.tsx",
        lineNumber: 330,
        columnNumber: 5
    }, this);
}
_s(ShopSettingsPage, "ISEwkkM2fQ2okxGUQ3xRJIM4FCc=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useParams"],
        __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"]
    ];
});
_c = ShopSettingsPage;
var _c;
__turbopack_context__.k.register(_c, "ShopSettingsPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/printhub/src/component/shop/ShopBankTab.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ShopBankTab
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/printhub/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/printhub/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pencil$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Pencil$3e$__ = __turbopack_context__.i("[project]/printhub/node_modules/lucide-react/dist/esm/icons/pencil.mjs [app-client] (ecmascript) <export default as Pencil>");
var __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$landmark$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Landmark$3e$__ = __turbopack_context__.i("[project]/printhub/node_modules/lucide-react/dist/esm/icons/landmark.mjs [app-client] (ecmascript) <export default as Landmark>");
var __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__ = __turbopack_context__.i("[project]/printhub/node_modules/lucide-react/dist/esm/icons/user.mjs [app-client] (ecmascript) <export default as User>");
var __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$hash$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Hash$3e$__ = __turbopack_context__.i("[project]/printhub/node_modules/lucide-react/dist/esm/icons/hash.mjs [app-client] (ecmascript) <export default as Hash>");
var __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__ = __turbopack_context__.i("[project]/printhub/node_modules/lucide-react/dist/esm/icons/check.mjs [app-client] (ecmascript) <export default as Check>");
var __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$copy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Copy$3e$__ = __turbopack_context__.i("[project]/printhub/node_modules/lucide-react/dist/esm/icons/copy.mjs [app-client] (ecmascript) <export default as Copy>");
var __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__ = __turbopack_context__.i("[project]/printhub/node_modules/lucide-react/dist/esm/icons/loader-circle.mjs [app-client] (ecmascript) <export default as Loader2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$lock$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Lock$3e$__ = __turbopack_context__.i("[project]/printhub/node_modules/lucide-react/dist/esm/icons/lock.mjs [app-client] (ecmascript) <export default as Lock>");
var __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__ = __turbopack_context__.i("[project]/printhub/node_modules/lucide-react/dist/esm/icons/chevron-down.mjs [app-client] (ecmascript) <export default as ChevronDown>");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
// ==========================================
// รายชื่อธนาคารในไทยสำหรับ dropdown
// ==========================================
const BANK_OPTIONS = [
    {
        code: "BBL",
        name: "ธนาคารกรุงเทพ (BBL)"
    },
    {
        code: "KBANK",
        name: "ธนาคารกสิกรไทย (KBANK)"
    },
    {
        code: "KTB",
        name: "ธนาคารกรุงไทย (KTB)"
    },
    {
        code: "SCB",
        name: "ธนาคารไทยพาณิชย์ (SCB)"
    },
    {
        code: "BAY",
        name: "ธนาคารกรุงศรีอยุธยา (BAY)"
    },
    {
        code: "TTB",
        name: "ธนาคารทหารไทยธนชาต (ttb)"
    },
    {
        code: "CIMBT",
        name: "ธนาคารซีไอเอ็มบี ไทย (CIMBT)"
    },
    {
        code: "UOB",
        name: "ธนาคารยูโอบี (UOB)"
    },
    {
        code: "KKP",
        name: "ธนาคารเกียรตินาคินภัทร (KKP)"
    },
    {
        code: "TISCO",
        name: "ธนาคารทิสโก้ (TISCO)"
    },
    {
        code: "LHFG",
        name: "ธนาคารแลนด์ แอนด์ เฮ้าส์ (LH Bank)"
    },
    {
        code: "ICBC",
        name: "ธนาคารไอซีบีซี (ไทย) (ICBC)"
    },
    {
        code: "BOC",
        name: "ธนาคารแห่งประเทศจีน (ไทย) (BOC)"
    },
    {
        code: "SMBC",
        name: "ธนาคารซูมิโตโม มิตซุย แบงกิ้ง คอร์ปอเรชั่น (SMBC)"
    },
    {
        code: "GSB",
        name: "ธนาคารออมสิน (GSB)"
    },
    {
        code: "BAAC",
        name: "ธนาคารเพื่อการเกษตรและสหกรณ์การเกษตร (ธ.ก.ส.)"
    },
    {
        code: "GHB",
        name: "ธนาคารอาคารสงเคราะห์ (ธอส.)"
    },
    {
        code: "EXIM",
        name: "ธนาคารเพื่อการส่งออกและนำเข้าแห่งประเทศไทย (EXIM)"
    },
    {
        code: "SME",
        name: "ธนาคารพัฒนาวิสาหกิจขนาดกลางและขนาดย่อม (SME Bank)"
    },
    {
        code: "IBANK",
        name: "ธนาคารอิสลามแห่งประเทศไทย (iBank)"
    }
];
function ShopBankTab({ isVerified, bankName, setBankName, accountName, setAccountName, accountNumber, setAccountNumber, onSave, saving, hasData, isEditing, onToggleEdit }) {
    _s();
    const [copied, setCopied] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isBankMenuOpen, setIsBankMenuOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const bankMenuRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const handleCopy = async ()=>{
        if (!accountNumber) return;
        try {
            await navigator.clipboard.writeText(accountNumber);
            setCopied(true);
            setTimeout(()=>setCopied(false), 1500);
        } catch (err) {
            console.log(err);
        }
    };
    // ปิด dropdown เมื่อคลิกข้างนอก
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ShopBankTab.useEffect": ()=>{
            if (!isBankMenuOpen) return;
            const handleClickOutside = {
                "ShopBankTab.useEffect.handleClickOutside": (e)=>{
                    if (bankMenuRef.current && !bankMenuRef.current.contains(e.target)) {
                        setIsBankMenuOpen(false);
                    }
                }
            }["ShopBankTab.useEffect.handleClickOutside"];
            document.addEventListener("mousedown", handleClickOutside);
            return ({
                "ShopBankTab.useEffect": ()=>document.removeEventListener("mousedown", handleClickOutside)
            })["ShopBankTab.useEffect"];
        }
    }["ShopBankTab.useEffect"], [
        isBankMenuOpen
    ]);
    // เผื่อค่าเดิมที่เคยบันทึกไว้ไม่ตรงกับตัวเลือกในลิสต์ (เช่นพิมพ์เอง
    // มาก่อนตอนยังเป็น input ธรรมดา) ให้โชว์เป็นตัวเลือกพิเศษไว้ก่อน
    // จะได้ไม่หายไปเงียบๆ จน dropdown ว่าง
    const isKnownBank = BANK_OPTIONS.some((b)=>b.name === bankName);
    const bankListWithFallback = bankName && !isKnownBank ? [
        {
            code: "__current__",
            name: bankName
        },
        ...BANK_OPTIONS
    ] : BANK_OPTIONS;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "relative",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: `rounded-2xl border border-slate-200 bg-white shadow-sm ${!isVerified ? "pointer-events-none blur-[2px] select-none" : ""}`,
                children: !isEditing ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center justify-between gap-4 p-6",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center gap-3.5 min-w-0",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#EAF1FF] text-[#2F6FED] ring-1 ring-[#2F6FED]/15",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$landmark$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Landmark$3e$__["Landmark"], {
                                                size: 20,
                                                strokeWidth: 2
                                            }, void 0, false, {
                                                fileName: "[project]/printhub/src/component/shop/ShopBankTab.tsx",
                                                lineNumber: 120,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/printhub/src/component/shop/ShopBankTab.tsx",
                                            lineNumber: 119,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "min-w-0",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "truncate text-sm font-bold text-[#0F2942]",
                                                    children: bankName || "-"
                                                }, void 0, false, {
                                                    fileName: "[project]/printhub/src/component/shop/ShopBankTab.tsx",
                                                    lineNumber: 123,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "truncate text-xs text-slate-400",
                                                    children: accountName || "-"
                                                }, void 0, false, {
                                                    fileName: "[project]/printhub/src/component/shop/ShopBankTab.tsx",
                                                    lineNumber: 126,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/printhub/src/component/shop/ShopBankTab.tsx",
                                            lineNumber: 122,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/printhub/src/component/shop/ShopBankTab.tsx",
                                    lineNumber: 118,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "button",
                                    onClick: onToggleEdit,
                                    className: "flex shrink-0 items-center gap-1.5 rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-[#0F2942] transition-colors hover:border-[#0F2942]",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pencil$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Pencil$3e$__["Pencil"], {
                                            size: 14
                                        }, void 0, false, {
                                            fileName: "[project]/printhub/src/component/shop/ShopBankTab.tsx",
                                            lineNumber: 136,
                                            columnNumber: 17
                                        }, this),
                                        " แก้ไขข้อมูล"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/printhub/src/component/shop/ShopBankTab.tsx",
                                    lineNumber: 131,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/printhub/src/component/shop/ShopBankTab.tsx",
                            lineNumber: 117,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "border-t border-slate-100 px-6 py-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-xs font-semibold text-slate-400",
                                    children: "เลขที่บัญชี"
                                }, void 0, false, {
                                    fileName: "[project]/printhub/src/component/shop/ShopBankTab.tsx",
                                    lineNumber: 141,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "mt-1.5 flex items-center justify-between gap-3",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-base font-semibold tabular-nums tracking-wide text-[#0F2942]",
                                            children: accountNumber || "-"
                                        }, void 0, false, {
                                            fileName: "[project]/printhub/src/component/shop/ShopBankTab.tsx",
                                            lineNumber: 143,
                                            columnNumber: 17
                                        }, this),
                                        accountNumber && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            type: "button",
                                            onClick: handleCopy,
                                            className: "flex shrink-0 items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-slate-400 transition-colors hover:bg-slate-50 hover:text-[#2F6FED]",
                                            children: copied ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__["Check"], {
                                                        size: 13
                                                    }, void 0, false, {
                                                        fileName: "[project]/printhub/src/component/shop/ShopBankTab.tsx",
                                                        lineNumber: 154,
                                                        columnNumber: 25
                                                    }, this),
                                                    " คัดลอกแล้ว"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/printhub/src/component/shop/ShopBankTab.tsx",
                                                lineNumber: 153,
                                                columnNumber: 23
                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$copy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Copy$3e$__["Copy"], {
                                                        size: 13
                                                    }, void 0, false, {
                                                        fileName: "[project]/printhub/src/component/shop/ShopBankTab.tsx",
                                                        lineNumber: 158,
                                                        columnNumber: 25
                                                    }, this),
                                                    " คัดลอก"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/printhub/src/component/shop/ShopBankTab.tsx",
                                                lineNumber: 157,
                                                columnNumber: 23
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/printhub/src/component/shop/ShopBankTab.tsx",
                                            lineNumber: 147,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/printhub/src/component/shop/ShopBankTab.tsx",
                                    lineNumber: 142,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/printhub/src/component/shop/ShopBankTab.tsx",
                            lineNumber: 140,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/printhub/src/component/shop/ShopBankTab.tsx",
                    lineNumber: 116,
                    columnNumber: 11
                }, this) : /* Edit / Form mode */ /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "space-y-5 p-6",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-xs leading-relaxed text-slate-400",
                                    children: "ข้อมูลบัญชีนี้จะถูกใช้เป็นช่องทางหลักสำหรับการโอนเงินรายได้จากคำสั่งพิมพ์เข้าสู่ร้านค้าของคุณ"
                                }, void 0, false, {
                                    fileName: "[project]/printhub/src/component/shop/ShopBankTab.tsx",
                                    lineNumber: 170,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "grid grid-cols-1 gap-4 sm:grid-cols-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    className: "text-xs font-semibold text-slate-600",
                                                    children: "ธนาคาร"
                                                }, void 0, false, {
                                                    fileName: "[project]/printhub/src/component/shop/ShopBankTab.tsx",
                                                    lineNumber: 177,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "relative mt-1.5",
                                                    ref: bankMenuRef,
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$landmark$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Landmark$3e$__["Landmark"], {
                                                            size: 16,
                                                            className: "pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 z-10 text-slate-300"
                                                        }, void 0, false, {
                                                            fileName: "[project]/printhub/src/component/shop/ShopBankTab.tsx",
                                                            lineNumber: 181,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            type: "button",
                                                            onClick: ()=>setIsBankMenuOpen((prev)=>!prev),
                                                            className: `flex w-full items-center justify-between rounded-xl border bg-white py-2 pl-9 pr-3 text-sm outline-none transition-colors ${isBankMenuOpen ? "border-[#2F6FED] ring-2 ring-[#2F6FED]/15" : "border-slate-200 hover:border-slate-300"}`,
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: `truncate text-left ${bankName ? "text-[#0F2942]" : "text-slate-300"}`,
                                                                    children: bankName || "เลือกธนาคาร"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/printhub/src/component/shop/ShopBankTab.tsx",
                                                                    lineNumber: 195,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__["ChevronDown"], {
                                                                    size: 15,
                                                                    className: `shrink-0 text-slate-400 transition-transform ${isBankMenuOpen ? "rotate-180" : ""}`
                                                                }, void 0, false, {
                                                                    fileName: "[project]/printhub/src/component/shop/ShopBankTab.tsx",
                                                                    lineNumber: 202,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/printhub/src/component/shop/ShopBankTab.tsx",
                                                            lineNumber: 186,
                                                            columnNumber: 21
                                                        }, this),
                                                        isBankMenuOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "absolute left-0 right-0 top-full z-20 mt-1.5 max-h-60 overflow-y-auto rounded-xl border border-slate-200 bg-white py-1.5 shadow-lg shadow-slate-900/10",
                                                            children: bankListWithFallback.map((b)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                    type: "button",
                                                                    onClick: ()=>{
                                                                        setBankName(b.name);
                                                                        setIsBankMenuOpen(false);
                                                                    },
                                                                    className: `flex w-full items-center justify-between px-3.5 py-2 text-left text-sm transition-colors hover:bg-slate-50 ${bankName === b.name ? "font-semibold text-[#2F6FED]" : "text-slate-700"}`,
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: "truncate",
                                                                            children: b.name
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/printhub/src/component/shop/ShopBankTab.tsx",
                                                                            lineNumber: 227,
                                                                            columnNumber: 29
                                                                        }, this),
                                                                        bankName === b.name && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__["Check"], {
                                                                            size: 14,
                                                                            className: "shrink-0"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/printhub/src/component/shop/ShopBankTab.tsx",
                                                                            lineNumber: 229,
                                                                            columnNumber: 31
                                                                        }, this)
                                                                    ]
                                                                }, b.code, true, {
                                                                    fileName: "[project]/printhub/src/component/shop/ShopBankTab.tsx",
                                                                    lineNumber: 214,
                                                                    columnNumber: 27
                                                                }, this))
                                                        }, void 0, false, {
                                                            fileName: "[project]/printhub/src/component/shop/ShopBankTab.tsx",
                                                            lineNumber: 212,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/printhub/src/component/shop/ShopBankTab.tsx",
                                                    lineNumber: 180,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/printhub/src/component/shop/ShopBankTab.tsx",
                                            lineNumber: 176,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    className: "text-xs font-semibold text-slate-600",
                                                    children: "ชื่อบัญชี"
                                                }, void 0, false, {
                                                    fileName: "[project]/printhub/src/component/shop/ShopBankTab.tsx",
                                                    lineNumber: 239,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "relative mt-1.5",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__["User"], {
                                                            size: 16,
                                                            className: "pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-300"
                                                        }, void 0, false, {
                                                            fileName: "[project]/printhub/src/component/shop/ShopBankTab.tsx",
                                                            lineNumber: 243,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                            type: "text",
                                                            value: accountName,
                                                            onChange: (e)=>setAccountName(e.target.value),
                                                            placeholder: "ชื่อ-นามสกุลเจ้าของบัญชี",
                                                            className: "w-full rounded-xl border border-slate-200 py-2 pl-9 pr-3.5 text-sm text-[#0F2942] outline-none transition-colors placeholder:text-slate-300 focus:border-[#2F6FED] focus:ring-2 focus:ring-[#2F6FED]/15"
                                                        }, void 0, false, {
                                                            fileName: "[project]/printhub/src/component/shop/ShopBankTab.tsx",
                                                            lineNumber: 247,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/printhub/src/component/shop/ShopBankTab.tsx",
                                                    lineNumber: 242,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/printhub/src/component/shop/ShopBankTab.tsx",
                                            lineNumber: 238,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "sm:col-span-2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    className: "text-xs font-semibold text-slate-600",
                                                    children: "เลขที่บัญชี"
                                                }, void 0, false, {
                                                    fileName: "[project]/printhub/src/component/shop/ShopBankTab.tsx",
                                                    lineNumber: 258,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "relative mt-1.5",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$hash$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Hash$3e$__["Hash"], {
                                                            size: 16,
                                                            className: "pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-300"
                                                        }, void 0, false, {
                                                            fileName: "[project]/printhub/src/component/shop/ShopBankTab.tsx",
                                                            lineNumber: 262,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                            type: "text",
                                                            value: accountNumber,
                                                            onChange: (e)=>setAccountNumber(e.target.value),
                                                            placeholder: "xxx-x-xxxxx-x",
                                                            className: "w-full rounded-xl border border-slate-200 py-2 pl-9 pr-3.5 text-sm tabular-nums text-[#0F2942] outline-none transition-colors placeholder:text-slate-300 focus:border-[#2F6FED] focus:ring-2 focus:ring-[#2F6FED]/15"
                                                        }, void 0, false, {
                                                            fileName: "[project]/printhub/src/component/shop/ShopBankTab.tsx",
                                                            lineNumber: 266,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/printhub/src/component/shop/ShopBankTab.tsx",
                                                    lineNumber: 261,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/printhub/src/component/shop/ShopBankTab.tsx",
                                            lineNumber: 257,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/printhub/src/component/shop/ShopBankTab.tsx",
                                    lineNumber: 174,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/printhub/src/component/shop/ShopBankTab.tsx",
                            lineNumber: 169,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex justify-end gap-3 border-t border-slate-100 px-6 py-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "button",
                                    onClick: onToggleEdit,
                                    disabled: saving,
                                    className: "rounded-xl border border-slate-200 px-6 py-2.5 text-sm font-semibold text-slate-500 transition-colors hover:border-slate-300 hover:text-slate-700 disabled:opacity-50",
                                    children: "ยกเลิก"
                                }, void 0, false, {
                                    fileName: "[project]/printhub/src/component/shop/ShopBankTab.tsx",
                                    lineNumber: 279,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: onSave,
                                    disabled: saving,
                                    className: "flex items-center gap-2 rounded-xl bg-[#0F2942] px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#16385c] disabled:opacity-50",
                                    children: [
                                        saving && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                                            size: 15,
                                            className: "animate-spin"
                                        }, void 0, false, {
                                            fileName: "[project]/printhub/src/component/shop/ShopBankTab.tsx",
                                            lineNumber: 292,
                                            columnNumber: 28
                                        }, this),
                                        saving ? "กำลังบันทึก..." : "บันทึกบัญชีธนาคาร"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/printhub/src/component/shop/ShopBankTab.tsx",
                                    lineNumber: 287,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/printhub/src/component/shop/ShopBankTab.tsx",
                            lineNumber: 278,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/printhub/src/component/shop/ShopBankTab.tsx",
                    lineNumber: 168,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/printhub/src/component/shop/ShopBankTab.tsx",
                lineNumber: 109,
                columnNumber: 7
            }, this),
            !isVerified && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-2xl bg-white/70 backdrop-blur-xs",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-400",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$lock$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Lock$3e$__["Lock"], {
                            size: 20
                        }, void 0, false, {
                            fileName: "[project]/printhub/src/component/shop/ShopBankTab.tsx",
                            lineNumber: 304,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/printhub/src/component/shop/ShopBankTab.tsx",
                        lineNumber: 303,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-center px-6 text-sm font-semibold text-gray-900",
                        children: "คุณจะสามารถแก้ไขบัญชีธนาคารได้ เมื่อผ่านการยืนยันตัวตนจากผู้ดูแลระบบแล้ว"
                    }, void 0, false, {
                        fileName: "[project]/printhub/src/component/shop/ShopBankTab.tsx",
                        lineNumber: 306,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/printhub/src/component/shop/ShopBankTab.tsx",
                lineNumber: 302,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/printhub/src/component/shop/ShopBankTab.tsx",
        lineNumber: 108,
        columnNumber: 5
    }, this);
}
_s(ShopBankTab, "0KupFZhM5l4jOJdYHTm0Oij8spU=");
_c = ShopBankTab;
var _c;
__turbopack_context__.k.register(_c, "ShopBankTab");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/printhub/src/component/shop/ShopProfileTab.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ShopProfileTab
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/printhub/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$camera$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Camera$3e$__ = __turbopack_context__.i("[project]/printhub/node_modules/lucide-react/dist/esm/icons/camera.mjs [app-client] (ecmascript) <export default as Camera>");
var __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__ = __turbopack_context__.i("[project]/printhub/node_modules/lucide-react/dist/esm/icons/clock.mjs [app-client] (ecmascript) <export default as Clock>");
var __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pencil$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Pencil$3e$__ = __turbopack_context__.i("[project]/printhub/node_modules/lucide-react/dist/esm/icons/pencil.mjs [app-client] (ecmascript) <export default as Pencil>");
var __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$lock$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Lock$3e$__ = __turbopack_context__.i("[project]/printhub/node_modules/lucide-react/dist/esm/icons/lock.mjs [app-client] (ecmascript) <export default as Lock>");
"use client";
;
;
function ShopProfileTab({ isVerified, isOpen, onToggleOpen, togglingOpen, shopName, setShopName, ownerName, setOwnerName, phone, setPhone, email, openTime, setOpenTime, closeTime, setCloseTime, address, setAddress, onSave, saving, hasData, isEditing, onToggleEdit }) {
    const addressText = [
        address.detail,
        address.subdistrict,
        address.district,
        address.province,
        address.postcode
    ].filter(Boolean).join(" ");
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "relative",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: `space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm ${!isVerified ? "pointer-events-none blur-[2px] select-none" : ""}`,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/70 px-4 py-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: `h-2 w-2 rounded-full ${isOpen ? "bg-emerald-500" : "bg-slate-400"}`
                                    }, void 0, false, {
                                        fileName: "[project]/printhub/src/component/shop/ShopProfileTab.tsx",
                                        lineNumber: 82,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-sm font-bold text-[#0F2942]",
                                                children: isOpen ? "ร้านเปิดให้บริการ" : "ปิดร้านชั่วคราว"
                                            }, void 0, false, {
                                                fileName: "[project]/printhub/src/component/shop/ShopProfileTab.tsx",
                                                lineNumber: 88,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-xs text-slate-400",
                                                children: isOpen ? "ลูกค้าสามารถสั่งพิมพ์กับร้านคุณได้ตามปกติ" : "ลูกค้าจะไม่สามารถสั่งพิมพ์กับร้านคุณได้ชั่วคราว"
                                            }, void 0, false, {
                                                fileName: "[project]/printhub/src/component/shop/ShopProfileTab.tsx",
                                                lineNumber: 91,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/printhub/src/component/shop/ShopProfileTab.tsx",
                                        lineNumber: 87,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/printhub/src/component/shop/ShopProfileTab.tsx",
                                lineNumber: 81,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                onClick: onToggleOpen,
                                disabled: togglingOpen,
                                "aria-pressed": isOpen,
                                className: `relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors disabled:opacity-50 ${isOpen ? "bg-emerald-500" : "bg-slate-300"}`,
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: `inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${isOpen ? "translate-x-6" : "translate-x-1"}`
                                }, void 0, false, {
                                    fileName: "[project]/printhub/src/component/shop/ShopProfileTab.tsx",
                                    lineNumber: 108,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/printhub/src/component/shop/ShopProfileTab.tsx",
                                lineNumber: 99,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/printhub/src/component/shop/ShopProfileTab.tsx",
                        lineNumber: 80,
                        columnNumber: 9
                    }, this),
                    !isEditing ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-6",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center justify-between pb-4 border-b border-slate-100",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center gap-4",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex h-16 w-16 items-center justify-center rounded-full bg-[#EAF1FF] text-xl font-bold text-[#2F6FED]",
                                                children: shopName ? shopName.charAt(0) : "S"
                                            }, void 0, false, {
                                                fileName: "[project]/printhub/src/component/shop/ShopProfileTab.tsx",
                                                lineNumber: 121,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-sm font-bold text-[#0F2942]",
                                                        children: shopName || "-"
                                                    }, void 0, false, {
                                                        fileName: "[project]/printhub/src/component/shop/ShopProfileTab.tsx",
                                                        lineNumber: 125,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-xs text-slate-400",
                                                        children: [
                                                            "เจ้าของร้าน: ",
                                                            ownerName || "-"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/printhub/src/component/shop/ShopProfileTab.tsx",
                                                        lineNumber: 126,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/printhub/src/component/shop/ShopProfileTab.tsx",
                                                lineNumber: 124,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/printhub/src/component/shop/ShopProfileTab.tsx",
                                        lineNumber: 120,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        onClick: onToggleEdit,
                                        className: "flex items-center gap-1.5 rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-[#0F2942] hover:border-[#0F2942] transition-colors",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pencil$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Pencil$3e$__["Pencil"], {
                                                size: 14
                                            }, void 0, false, {
                                                fileName: "[project]/printhub/src/component/shop/ShopProfileTab.tsx",
                                                lineNumber: 134,
                                                columnNumber: 17
                                            }, this),
                                            " แก้ไขข้อมูล"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/printhub/src/component/shop/ShopProfileTab.tsx",
                                        lineNumber: 129,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/printhub/src/component/shop/ShopProfileTab.tsx",
                                lineNumber: 119,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "grid grid-cols-1 sm:grid-cols-2 gap-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-xs font-semibold text-slate-400",
                                                children: "เบอร์โทรศัพท์"
                                            }, void 0, false, {
                                                fileName: "[project]/printhub/src/component/shop/ShopProfileTab.tsx",
                                                lineNumber: 140,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "mt-1 text-sm text-[#0F2942]",
                                                children: phone || "-"
                                            }, void 0, false, {
                                                fileName: "[project]/printhub/src/component/shop/ShopProfileTab.tsx",
                                                lineNumber: 141,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/printhub/src/component/shop/ShopProfileTab.tsx",
                                        lineNumber: 139,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-xs font-semibold text-slate-400",
                                                children: "อีเมล"
                                            }, void 0, false, {
                                                fileName: "[project]/printhub/src/component/shop/ShopProfileTab.tsx",
                                                lineNumber: 144,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "mt-1 text-sm text-[#0F2942]",
                                                children: email || "-"
                                            }, void 0, false, {
                                                fileName: "[project]/printhub/src/component/shop/ShopProfileTab.tsx",
                                                lineNumber: 145,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/printhub/src/component/shop/ShopProfileTab.tsx",
                                        lineNumber: 143,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-xs font-semibold text-slate-400",
                                                children: "เวลาทำการ"
                                            }, void 0, false, {
                                                fileName: "[project]/printhub/src/component/shop/ShopProfileTab.tsx",
                                                lineNumber: 148,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "mt-1 text-sm text-[#0F2942] flex items-center gap-1.5",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__["Clock"], {
                                                        size: 14,
                                                        className: "text-slate-400"
                                                    }, void 0, false, {
                                                        fileName: "[project]/printhub/src/component/shop/ShopProfileTab.tsx",
                                                        lineNumber: 150,
                                                        columnNumber: 19
                                                    }, this),
                                                    openTime,
                                                    " — ",
                                                    closeTime
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/printhub/src/component/shop/ShopProfileTab.tsx",
                                                lineNumber: 149,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/printhub/src/component/shop/ShopProfileTab.tsx",
                                        lineNumber: 147,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/printhub/src/component/shop/ShopProfileTab.tsx",
                                lineNumber: 138,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-xs font-semibold text-slate-400",
                                        children: "ที่อยู่ร้านค้า"
                                    }, void 0, false, {
                                        fileName: "[project]/printhub/src/component/shop/ShopProfileTab.tsx",
                                        lineNumber: 157,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "mt-1 text-sm text-[#0F2942]",
                                        children: addressText || "-"
                                    }, void 0, false, {
                                        fileName: "[project]/printhub/src/component/shop/ShopProfileTab.tsx",
                                        lineNumber: 158,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/printhub/src/component/shop/ShopProfileTab.tsx",
                                lineNumber: 156,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/printhub/src/component/shop/ShopProfileTab.tsx",
                        lineNumber: 118,
                        columnNumber: 11
                    }, this) : /* Edit Mode Form */ /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-6",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-4 pb-4 border-b border-slate-100",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "relative",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex h-16 w-16 items-center justify-center rounded-full bg-[#EAF1FF] text-xl font-bold text-[#2F6FED]",
                                                children: shopName ? shopName.charAt(0) : "S"
                                            }, void 0, false, {
                                                fileName: "[project]/printhub/src/component/shop/ShopProfileTab.tsx",
                                                lineNumber: 167,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                type: "button",
                                                className: "absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-[#0F2942] text-white hover:bg-[#16385c] transition-colors",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$camera$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Camera$3e$__["Camera"], {
                                                    size: 12
                                                }, void 0, false, {
                                                    fileName: "[project]/printhub/src/component/shop/ShopProfileTab.tsx",
                                                    lineNumber: 174,
                                                    columnNumber: 19
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/printhub/src/component/shop/ShopProfileTab.tsx",
                                                lineNumber: 170,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/printhub/src/component/shop/ShopProfileTab.tsx",
                                        lineNumber: 166,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-sm font-bold text-[#0F2942]",
                                                children: "รูปโปรไฟล์ร้านค้า"
                                            }, void 0, false, {
                                                fileName: "[project]/printhub/src/component/shop/ShopProfileTab.tsx",
                                                lineNumber: 178,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-xs text-slate-400",
                                                children: "แนะนำขนาด 400 x 400 px"
                                            }, void 0, false, {
                                                fileName: "[project]/printhub/src/component/shop/ShopProfileTab.tsx",
                                                lineNumber: 179,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/printhub/src/component/shop/ShopProfileTab.tsx",
                                        lineNumber: 177,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/printhub/src/component/shop/ShopProfileTab.tsx",
                                lineNumber: 165,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "grid grid-cols-1 sm:grid-cols-2 gap-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                className: "text-xs font-semibold text-slate-600",
                                                children: "ชื่อร้านค้า"
                                            }, void 0, false, {
                                                fileName: "[project]/printhub/src/component/shop/ShopProfileTab.tsx",
                                                lineNumber: 186,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "text",
                                                value: shopName,
                                                onChange: (e)=>setShopName(e.target.value),
                                                placeholder: "เช่น ตั๋วปริ้น ลาดกระบัง",
                                                className: "mt-1.5 w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm text-[#0F2942] outline-none focus:border-[#2F6FED]"
                                            }, void 0, false, {
                                                fileName: "[project]/printhub/src/component/shop/ShopProfileTab.tsx",
                                                lineNumber: 187,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/printhub/src/component/shop/ShopProfileTab.tsx",
                                        lineNumber: 185,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                className: "text-xs font-semibold text-slate-600",
                                                children: "ชื่อเจ้าของร้าน"
                                            }, void 0, false, {
                                                fileName: "[project]/printhub/src/component/shop/ShopProfileTab.tsx",
                                                lineNumber: 196,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "text",
                                                value: ownerName,
                                                onChange: (e)=>setOwnerName(e.target.value),
                                                placeholder: "ชื่อ-นามสกุล",
                                                className: "mt-1.5 w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm text-[#0F2942] outline-none focus:border-[#2F6FED]"
                                            }, void 0, false, {
                                                fileName: "[project]/printhub/src/component/shop/ShopProfileTab.tsx",
                                                lineNumber: 197,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/printhub/src/component/shop/ShopProfileTab.tsx",
                                        lineNumber: 195,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                className: "text-xs font-semibold text-slate-600",
                                                children: "เบอร์โทรศัพท์"
                                            }, void 0, false, {
                                                fileName: "[project]/printhub/src/component/shop/ShopProfileTab.tsx",
                                                lineNumber: 206,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "text",
                                                value: phone,
                                                onChange: (e)=>setPhone(e.target.value),
                                                placeholder: "08x-xxx-xxxx",
                                                className: "mt-1.5 w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm text-[#0F2942] outline-none focus:border-[#2F6FED]"
                                            }, void 0, false, {
                                                fileName: "[project]/printhub/src/component/shop/ShopProfileTab.tsx",
                                                lineNumber: 207,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/printhub/src/component/shop/ShopProfileTab.tsx",
                                        lineNumber: 205,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                className: "text-xs font-semibold text-slate-600",
                                                children: "อีเมล"
                                            }, void 0, false, {
                                                fileName: "[project]/printhub/src/component/shop/ShopProfileTab.tsx",
                                                lineNumber: 216,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "text",
                                                value: email,
                                                disabled: true,
                                                className: "mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm text-slate-400 cursor-not-allowed"
                                            }, void 0, false, {
                                                fileName: "[project]/printhub/src/component/shop/ShopProfileTab.tsx",
                                                lineNumber: 217,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/printhub/src/component/shop/ShopProfileTab.tsx",
                                        lineNumber: 215,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/printhub/src/component/shop/ShopProfileTab.tsx",
                                lineNumber: 184,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "text-xs font-semibold text-slate-600 mb-2 block",
                                        children: "เวลาทำการ"
                                    }, void 0, false, {
                                        fileName: "[project]/printhub/src/component/shop/ShopProfileTab.tsx",
                                        lineNumber: 228,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center gap-3",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center gap-2 flex-1 rounded-xl border border-slate-200 px-3.5 py-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__["Clock"], {
                                                        size: 16,
                                                        className: "text-slate-400"
                                                    }, void 0, false, {
                                                        fileName: "[project]/printhub/src/component/shop/ShopProfileTab.tsx",
                                                        lineNumber: 231,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        type: "time",
                                                        value: openTime,
                                                        onChange: (e)=>setOpenTime(e.target.value),
                                                        className: "w-full text-sm text-[#0F2942] outline-none bg-transparent"
                                                    }, void 0, false, {
                                                        fileName: "[project]/printhub/src/component/shop/ShopProfileTab.tsx",
                                                        lineNumber: 232,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/printhub/src/component/shop/ShopProfileTab.tsx",
                                                lineNumber: 230,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-slate-400",
                                                children: "—"
                                            }, void 0, false, {
                                                fileName: "[project]/printhub/src/component/shop/ShopProfileTab.tsx",
                                                lineNumber: 239,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center gap-2 flex-1 rounded-xl border border-slate-200 px-3.5 py-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__["Clock"], {
                                                        size: 16,
                                                        className: "text-slate-400"
                                                    }, void 0, false, {
                                                        fileName: "[project]/printhub/src/component/shop/ShopProfileTab.tsx",
                                                        lineNumber: 241,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        type: "time",
                                                        value: closeTime,
                                                        onChange: (e)=>setCloseTime(e.target.value),
                                                        className: "w-full text-sm text-[#0F2942] outline-none bg-transparent"
                                                    }, void 0, false, {
                                                        fileName: "[project]/printhub/src/component/shop/ShopProfileTab.tsx",
                                                        lineNumber: 242,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/printhub/src/component/shop/ShopProfileTab.tsx",
                                                lineNumber: 240,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/printhub/src/component/shop/ShopProfileTab.tsx",
                                        lineNumber: 229,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/printhub/src/component/shop/ShopProfileTab.tsx",
                                lineNumber: 227,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "text-xs font-semibold text-slate-600 mb-2 block",
                                        children: "ที่อยู่ร้านค้า"
                                    }, void 0, false, {
                                        fileName: "[project]/printhub/src/component/shop/ShopProfileTab.tsx",
                                        lineNumber: 254,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "space-y-3",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                                value: address.detail,
                                                onChange: (e)=>setAddress((prev)=>({
                                                            ...prev,
                                                            detail: e.target.value
                                                        })),
                                                placeholder: "เลขที่ อาคาร ซอย ถนน",
                                                rows: 2,
                                                className: "w-full rounded-xl border border-slate-200 p-3 text-sm text-[#0F2942] outline-none focus:border-[#2F6FED] resize-none"
                                            }, void 0, false, {
                                                fileName: "[project]/printhub/src/component/shop/ShopProfileTab.tsx",
                                                lineNumber: 256,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "grid grid-cols-2 gap-3",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        type: "text",
                                                        value: address.subdistrict,
                                                        onChange: (e)=>setAddress((prev)=>({
                                                                    ...prev,
                                                                    subdistrict: e.target.value
                                                                })),
                                                        placeholder: "ตำบล / แขวง",
                                                        className: "rounded-xl border border-slate-200 px-3.5 py-2 text-sm text-[#0F2942] outline-none focus:border-[#2F6FED]"
                                                    }, void 0, false, {
                                                        fileName: "[project]/printhub/src/component/shop/ShopProfileTab.tsx",
                                                        lineNumber: 264,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        type: "text",
                                                        value: address.district,
                                                        onChange: (e)=>setAddress((prev)=>({
                                                                    ...prev,
                                                                    district: e.target.value
                                                                })),
                                                        placeholder: "อำเภอ / เขต",
                                                        className: "rounded-xl border border-slate-200 px-3.5 py-2 text-sm text-[#0F2942] outline-none focus:border-[#2F6FED]"
                                                    }, void 0, false, {
                                                        fileName: "[project]/printhub/src/component/shop/ShopProfileTab.tsx",
                                                        lineNumber: 271,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        type: "text",
                                                        value: address.province,
                                                        onChange: (e)=>setAddress((prev)=>({
                                                                    ...prev,
                                                                    province: e.target.value
                                                                })),
                                                        placeholder: "จังหวัด",
                                                        className: "rounded-xl border border-slate-200 px-3.5 py-2 text-sm text-[#0F2942] outline-none focus:border-[#2F6FED]"
                                                    }, void 0, false, {
                                                        fileName: "[project]/printhub/src/component/shop/ShopProfileTab.tsx",
                                                        lineNumber: 278,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        type: "text",
                                                        value: address.postcode,
                                                        onChange: (e)=>setAddress((prev)=>({
                                                                    ...prev,
                                                                    postcode: e.target.value
                                                                })),
                                                        placeholder: "รหัสไปรษณีย์",
                                                        className: "rounded-xl border border-slate-200 px-3.5 py-2 text-sm text-[#0F2942] outline-none focus:border-[#2F6FED]"
                                                    }, void 0, false, {
                                                        fileName: "[project]/printhub/src/component/shop/ShopProfileTab.tsx",
                                                        lineNumber: 285,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/printhub/src/component/shop/ShopProfileTab.tsx",
                                                lineNumber: 263,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/printhub/src/component/shop/ShopProfileTab.tsx",
                                        lineNumber: 255,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/printhub/src/component/shop/ShopProfileTab.tsx",
                                lineNumber: 253,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex justify-end gap-3 pt-4 border-t border-slate-100",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        onClick: onToggleEdit,
                                        disabled: saving,
                                        className: "rounded-xl border border-slate-200 px-6 py-2.5 text-sm font-semibold text-slate-500 hover:border-slate-300 transition-colors disabled:opacity-50",
                                        children: "ยกเลิก"
                                    }, void 0, false, {
                                        fileName: "[project]/printhub/src/component/shop/ShopProfileTab.tsx",
                                        lineNumber: 297,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: onSave,
                                        disabled: saving,
                                        className: "rounded-xl bg-[#0F2942] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#16385c] transition-colors disabled:opacity-50",
                                        children: saving ? "กำลังบันทึก..." : "บันทึกข้อมูลร้าน"
                                    }, void 0, false, {
                                        fileName: "[project]/printhub/src/component/shop/ShopProfileTab.tsx",
                                        lineNumber: 305,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/printhub/src/component/shop/ShopProfileTab.tsx",
                                lineNumber: 296,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/printhub/src/component/shop/ShopProfileTab.tsx",
                        lineNumber: 163,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/printhub/src/component/shop/ShopProfileTab.tsx",
                lineNumber: 74,
                columnNumber: 7
            }, this),
            !isVerified && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-2xl bg-white/70 backdrop-blur-xs",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-400",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$lock$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Lock$3e$__["Lock"], {
                            size: 20
                        }, void 0, false, {
                            fileName: "[project]/printhub/src/component/shop/ShopProfileTab.tsx",
                            lineNumber: 321,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/printhub/src/component/shop/ShopProfileTab.tsx",
                        lineNumber: 320,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-center px-6 text-sm font-semibold text-gray-900",
                        children: "คุณจะสามารถแก้ไขข้อมูลร้านได้ เมื่อผ่านการยืนยันตัวตนจากผู้ดูแลระบบแล้ว"
                    }, void 0, false, {
                        fileName: "[project]/printhub/src/component/shop/ShopProfileTab.tsx",
                        lineNumber: 323,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/printhub/src/component/shop/ShopProfileTab.tsx",
                lineNumber: 319,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/printhub/src/component/shop/ShopProfileTab.tsx",
        lineNumber: 73,
        columnNumber: 5
    }, this);
}
_c = ShopProfileTab;
var _c;
__turbopack_context__.k.register(_c, "ShopProfileTab");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/printhub/src/component/shop/ShopServiceTab.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ShopServicesTab
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/printhub/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/printhub/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__ = __turbopack_context__.i("[project]/printhub/node_modules/lucide-react/dist/esm/icons/plus.mjs [app-client] (ecmascript) <export default as Plus>");
var __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__ = __turbopack_context__.i("[project]/printhub/node_modules/lucide-react/dist/esm/icons/trash-2.mjs [app-client] (ecmascript) <export default as Trash2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$lock$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Lock$3e$__ = __turbopack_context__.i("[project]/printhub/node_modules/lucide-react/dist/esm/icons/lock.mjs [app-client] (ecmascript) <export default as Lock>");
var __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$tag$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Tag$3e$__ = __turbopack_context__.i("[project]/printhub/node_modules/lucide-react/dist/esm/icons/tag.mjs [app-client] (ecmascript) <export default as Tag>");
var __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pen$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Edit2$3e$__ = __turbopack_context__.i("[project]/printhub/node_modules/lucide-react/dist/esm/icons/pen.mjs [app-client] (ecmascript) <export default as Edit2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__ = __turbopack_context__.i("[project]/printhub/node_modules/lucide-react/dist/esm/icons/check.mjs [app-client] (ecmascript) <export default as Check>");
var __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/printhub/node_modules/lucide-react/dist/esm/icons/x.mjs [app-client] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$printer$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Printer$3e$__ = __turbopack_context__.i("[project]/printhub/node_modules/lucide-react/dist/esm/icons/printer.mjs [app-client] (ecmascript) <export default as Printer>");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
// ==========================================
// เทมเพลตประเภทบริการ + รายการตัวเลือกเริ่มต้น
// ==========================================
const SERVICE_TEMPLATES = {
    "พิมพ์เอกสาร / รายงาน": [
        {
            group_type: "ขนาดกระดาษ",
            detail: "A4 ขาวดำ (หน้าเดียว)",
            price: "1.5"
        },
        {
            group_type: "ขนาดกระดาษ",
            detail: "A4 ขาวดำ (หน้า-หลัง)",
            price: "2"
        },
        {
            group_type: "ขนาดกระดาษ",
            detail: "A4 สี (หน้าเดียว)",
            price: "5"
        },
        {
            group_type: "ชนิดกระดาษ",
            detail: "กระดาษปอนด์ 80 แกรม",
            price: "0"
        },
        {
            group_type: "ชนิดกระดาษ",
            detail: "กระดาษถนอมสายตา 75 แกรม",
            price: "1"
        }
    ],
    "งานเข้าเล่ม": [
        {
            group_type: "รูปแบบการเข้าเล่ม",
            detail: "เข้าเล่มกระดูกงู / ห่วงพลาสติก",
            price: "30"
        },
        {
            group_type: "รูปแบบการเข้าเล่ม",
            detail: "เข้าเล่มสันเกลียว",
            price: "40"
        },
        {
            group_type: "รูปแบบการเข้าเล่ม",
            detail: "เข้าเล่มกาวร้อน / สันกาว",
            price: "50"
        },
        {
            group_type: "ปกรายงาน",
            detail: "ปกใส + กระดาษแข็ง",
            price: "10"
        }
    ],
    "พิมพ์โปสเตอร์": [
        {
            group_type: "ขนาดโปสเตอร์",
            detail: "A3 (Art Paper 160g)",
            price: "40"
        },
        {
            group_type: "ขนาดโปสเตอร์",
            detail: "A2 (Photo Paper)",
            price: "150"
        },
        {
            group_type: "ขนาดโปสเตอร์",
            detail: "A1 (Photo Paper)",
            price: "250"
        },
        {
            group_type: "การเคลือบ",
            detail: "เคลือบเงา / เคลือบด้าน",
            price: "20"
        }
    ],
    "นามบัตร": [
        {
            group_type: "จำนวนและวัสดุ",
            detail: "กระดาษอาร์ตการ์ด 300g (100 ใบ)",
            price: "150"
        },
        {
            group_type: "จำนวนและวัสดุ",
            detail: "กระดาษอาร์ตการ์ด เคลือบด้าน (100 ใบ)",
            price: "200"
        },
        {
            group_type: "ตัวเลือกเสริม",
            detail: "ตัดมุมมน",
            price: "30"
        }
    ],
    "สติกเกอร์": [
        {
            group_type: "ชนิดสติกเกอร์",
            detail: "สติกเกอร์กระดาษ (A4)",
            price: "35"
        },
        {
            group_type: "ชนิดสติกเกอร์",
            detail: "สติกเกอร์ PP กันน้ำ (A4)",
            price: "50"
        },
        {
            group_type: "ชนิดสติกเกอร์",
            detail: "สติกเกอร์ใส (A4)",
            price: "55"
        },
        {
            group_type: "งานไดคัท",
            detail: "ไดคัทพร้อมลอกแปะ",
            price: "15"
        }
    ],
    "พิมพ์ภาพถ่าย": [
        {
            group_type: "ขนาดรูปภาพ",
            detail: "4x6 นิ้ว (4R)",
            price: "5"
        },
        {
            group_type: "ขนาดรูปภาพ",
            detail: "5x7 นิ้ว (5R)",
            price: "15"
        },
        {
            group_type: "ขนาดรูปภาพ",
            detail: "8x10 นิ้ว (8R)",
            price: "40"
        }
    ],
    "ป้ายไวนิล": [
        {
            group_type: "ความหนาไวนิล",
            detail: "ไวนิลหนา 360gsm (ตร.ม.)",
            price: "120"
        },
        {
            group_type: "ความหนาไวนิล",
            detail: "ไวนิลหนา 440gsm (ตร.ม.)",
            price: "150"
        },
        {
            group_type: "การพับขอบ",
            detail: "พับขอบ เจาะรูตาไก่",
            price: "0"
        }
    ],
    "งานเสื้อ / ของพรีเมียม": [
        {
            group_type: "สกรีนเสื้อ",
            detail: "สกรีน DTF ขนาด A4 (หน้าเดียว)",
            price: "120"
        },
        {
            group_type: "สกรีนเสื้อ",
            detail: "สกรีน DTF ขนาด A3 (หน้าเดียว)",
            price: "180"
        }
    ]
};
const SERVICE_TYPE_TEMPLATES = Object.keys(SERVICE_TEMPLATES);
_c = SERVICE_TYPE_TEMPLATES;
const OTHER_OPTION = "__other__";
const groupItems = (items)=>{
    const groups = [];
    items.forEach((row, idx)=>{
        const name = row.group_type || "";
        let group = groups.find((g)=>g.name === name);
        if (!group) {
            group = {
                name,
                rows: []
            };
            groups.push(group);
        }
        group.rows.push({
            row,
            idx
        });
    });
    return groups;
};
function ShopServicesTab({ isVerified, services, setServices, onSave, saving }) {
    _s();
    const [isEditing, setIsEditing] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // 🔹 State สำหรับเก็บดรรชนีของบริการที่เลือกโหมด "อื่นๆ (กำหนดเอง)"
    const [customTypeIndexes, setCustomTypeIndexes] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({});
    const addServiceType = ()=>{
        setServices((prev)=>[
                ...prev,
                {
                    type: "",
                    items: [
                        {
                            detail: "",
                            group_type: "",
                            price: ""
                        }
                    ]
                }
            ]);
    };
    const removeServiceType = (index)=>{
        setServices((prev)=>prev.filter((_, i)=>i !== index));
        setCustomTypeIndexes((prev)=>{
            const next = {
                ...prev
            };
            delete next[index];
            return next;
        });
    };
    // 🔹 อัปเดตการเลือกประเภทบริการ
    const updateServiceType = (index, selectedValue)=>{
        if (selectedValue === OTHER_OPTION) {
            // เมื่อเลือก "อื่นๆ" ให้เปิดโหมด Custom
            setCustomTypeIndexes((prev)=>({
                    ...prev,
                    [index]: true
                }));
            setServices((prev)=>prev.map((g, i)=>i === index ? {
                        ...g,
                        type: "",
                        items: g.items.length > 0 ? g.items : [
                            {
                                detail: "",
                                group_type: "",
                                price: ""
                            }
                        ]
                    } : g));
        } else if (SERVICE_TEMPLATES[selectedValue]) {
            // เมื่อเลือก Preset Template ให้ดึงข้อมูล Template มาใส่
            setCustomTypeIndexes((prev)=>({
                    ...prev,
                    [index]: false
                }));
            const templateItems = SERVICE_TEMPLATES[selectedValue].map((item)=>({
                    detail: item.detail,
                    group_type: item.group_type,
                    price: item.price
                }));
            setServices((prev)=>prev.map((g, i)=>i === index ? {
                        ...g,
                        type: selectedValue,
                        items: templateItems
                    } : g));
        } else {
            setServices((prev)=>prev.map((g, i)=>i === index ? {
                        ...g,
                        type: selectedValue
                    } : g));
        }
    };
    const renameGroup = (groupIndex, oldName, newName)=>{
        setServices((prev)=>prev.map((g, i)=>i === groupIndex ? {
                    ...g,
                    items: g.items.map((r)=>r.group_type === oldName ? {
                            ...r,
                            group_type: newName
                        } : r)
                } : g));
    };
    const addRowToGroup = (groupIndex, groupName)=>{
        setServices((prev)=>prev.map((g, i)=>i === groupIndex ? {
                    ...g,
                    items: [
                        ...g.items,
                        {
                            detail: "",
                            group_type: groupName,
                            price: ""
                        }
                    ]
                } : g));
    };
    const addNewGroup = (groupIndex)=>{
        setServices((prev)=>prev.map((g, i)=>i === groupIndex ? {
                    ...g,
                    items: [
                        ...g.items,
                        {
                            detail: "",
                            group_type: "",
                            price: ""
                        }
                    ]
                } : g));
    };
    const removeGroup = (groupIndex, groupName)=>{
        setServices((prev)=>prev.map((g, i)=>i === groupIndex ? {
                    ...g,
                    items: g.items.filter((r)=>r.group_type !== groupName)
                } : g));
    };
    const removeRow = (groupIndex, rowIdx)=>{
        setServices((prev)=>prev.map((g, i)=>i === groupIndex ? {
                    ...g,
                    items: g.items.filter((_, rI)=>rI !== rowIdx)
                } : g));
    };
    const updateRow = (groupIndex, rowIdx, field, value)=>{
        setServices((prev)=>prev.map((g, i)=>i === groupIndex ? {
                    ...g,
                    items: g.items.map((r, rI)=>rI === rowIdx ? {
                            ...r,
                            [field]: value
                        } : r)
                } : g));
    };
    const handleSave = async ()=>{
        await onSave();
        setIsEditing(false);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "relative",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: `space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs ${!isVerified ? "pointer-events-none blur-[2px] select-none" : ""}`,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center justify-between border-b border-slate-100 pb-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                        className: "text-base font-bold text-[#0F2942]",
                                        children: "บริการพิมพ์และราคา"
                                    }, void 0, false, {
                                        fileName: "[project]/printhub/src/component/shop/ShopServiceTab.tsx",
                                        lineNumber: 252,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-xs text-slate-500",
                                        children: "กำหนดประเภทการพิมพ์ ขนาดกระดาษ ตัวเลือกเสริม และราคาสำหรับผู้ใช้งาน"
                                    }, void 0, false, {
                                        fileName: "[project]/printhub/src/component/shop/ShopServiceTab.tsx",
                                        lineNumber: 253,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/printhub/src/component/shop/ShopServiceTab.tsx",
                                lineNumber: 251,
                                columnNumber: 11
                            }, this),
                            isVerified && !isEditing && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                onClick: ()=>setIsEditing(true),
                                className: "flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pen$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Edit2$3e$__["Edit2"], {
                                        size: 13
                                    }, void 0, false, {
                                        fileName: "[project]/printhub/src/component/shop/ShopServiceTab.tsx",
                                        lineNumber: 263,
                                        columnNumber: 15
                                    }, this),
                                    "แก้ไขบริการ"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/printhub/src/component/shop/ShopServiceTab.tsx",
                                lineNumber: 258,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/printhub/src/component/shop/ShopServiceTab.tsx",
                        lineNumber: 250,
                        columnNumber: 9
                    }, this),
                    !isEditing ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-6",
                        children: services.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "py-8 text-center text-sm text-slate-400",
                            children: "ยังไม่มีข้อมูลบริการพิมพ์"
                        }, void 0, false, {
                            fileName: "[project]/printhub/src/component/shop/ShopServiceTab.tsx",
                            lineNumber: 273,
                            columnNumber: 15
                        }, this) : services.map((group, gIdx)=>{
                            const groupedRows = groupItems(group.items);
                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "rounded-xl border border-slate-200 overflow-hidden bg-white",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center gap-2 bg-slate-50 px-4 py-3 border-b border-slate-200",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$printer$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Printer$3e$__["Printer"], {
                                                size: 16,
                                                className: "text-[#2F6FED]"
                                            }, void 0, false, {
                                                fileName: "[project]/printhub/src/component/shop/ShopServiceTab.tsx",
                                                lineNumber: 285,
                                                columnNumber: 23
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-sm font-bold text-[#0F2942]",
                                                children: group.type || "ไม่ระบุประเภทบริการ"
                                            }, void 0, false, {
                                                fileName: "[project]/printhub/src/component/shop/ShopServiceTab.tsx",
                                                lineNumber: 286,
                                                columnNumber: 23
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/printhub/src/component/shop/ShopServiceTab.tsx",
                                        lineNumber: 284,
                                        columnNumber: 21
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "p-4 space-y-4",
                                        children: groupedRows.map((grp)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "rounded-lg border border-slate-100 bg-slate-50/50 p-3 space-y-2",
                                                children: [
                                                    grp.name && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex items-center gap-1.5 text-xs font-semibold text-slate-600",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$tag$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Tag$3e$__["Tag"], {
                                                                size: 12,
                                                                className: "text-slate-400"
                                                            }, void 0, false, {
                                                                fileName: "[project]/printhub/src/component/shop/ShopServiceTab.tsx",
                                                                lineNumber: 299,
                                                                columnNumber: 31
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                children: grp.name
                                                            }, void 0, false, {
                                                                fileName: "[project]/printhub/src/component/shop/ShopServiceTab.tsx",
                                                                lineNumber: 300,
                                                                columnNumber: 31
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/printhub/src/component/shop/ShopServiceTab.tsx",
                                                        lineNumber: 298,
                                                        columnNumber: 29
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "grid grid-cols-1 sm:grid-cols-2 gap-2",
                                                        children: grp.rows.map(({ row, idx })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex items-center justify-between rounded-md border border-slate-200 bg-white px-3 py-2 text-sm",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "text-slate-700",
                                                                        children: row.detail || "-"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/printhub/src/component/shop/ShopServiceTab.tsx",
                                                                        lineNumber: 310,
                                                                        columnNumber: 33
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "font-semibold text-[#0F2942]",
                                                                        children: row.price ? `${row.price} บาท` : "-"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/printhub/src/component/shop/ShopServiceTab.tsx",
                                                                        lineNumber: 311,
                                                                        columnNumber: 33
                                                                    }, this)
                                                                ]
                                                            }, row.id || idx, true, {
                                                                fileName: "[project]/printhub/src/component/shop/ShopServiceTab.tsx",
                                                                lineNumber: 306,
                                                                columnNumber: 31
                                                            }, this))
                                                    }, void 0, false, {
                                                        fileName: "[project]/printhub/src/component/shop/ShopServiceTab.tsx",
                                                        lineNumber: 304,
                                                        columnNumber: 27
                                                    }, this)
                                                ]
                                            }, grp.name || `group-${grp.rows[0]?.idx}`, true, {
                                                fileName: "[project]/printhub/src/component/shop/ShopServiceTab.tsx",
                                                lineNumber: 293,
                                                columnNumber: 25
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/printhub/src/component/shop/ShopServiceTab.tsx",
                                        lineNumber: 291,
                                        columnNumber: 21
                                    }, this)
                                ]
                            }, group.id || gIdx, true, {
                                fileName: "[project]/printhub/src/component/shop/ShopServiceTab.tsx",
                                lineNumber: 280,
                                columnNumber: 19
                            }, this);
                        })
                    }, void 0, false, {
                        fileName: "[project]/printhub/src/component/shop/ShopServiceTab.tsx",
                        lineNumber: 271,
                        columnNumber: 11
                    }, this) : /* Edit Mode */ /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-6",
                        children: [
                            services.map((group, gIdx)=>{
                                const groupedRows = groupItems(group.items);
                                const isPreset = SERVICE_TYPE_TEMPLATES.includes(group.type);
                                const isCustomMode = customTypeIndexes[gIdx] || !isPreset && group.type !== "";
                                const selectValue = isCustomMode ? OTHER_OPTION : group.type;
                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "rounded-xl border border-slate-200 overflow-hidden",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex flex-col gap-2 bg-slate-50 px-4 py-3 border-b border-slate-200 sm:flex-row sm:items-center",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex flex-1 items-center gap-2",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                            value: selectValue,
                                                            onChange: (e)=>updateServiceType(gIdx, e.target.value),
                                                            className: "flex-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-sm font-semibold text-slate-900 outline-none focus:border-[#2F6FED]",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                    value: "",
                                                                    disabled: true,
                                                                    children: "เลือกประเภทบริการ"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/printhub/src/component/shop/ShopServiceTab.tsx",
                                                                    lineNumber: 346,
                                                                    columnNumber: 25
                                                                }, this),
                                                                SERVICE_TYPE_TEMPLATES.map((t)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                        value: t,
                                                                        children: t
                                                                    }, t, false, {
                                                                        fileName: "[project]/printhub/src/component/shop/ShopServiceTab.tsx",
                                                                        lineNumber: 350,
                                                                        columnNumber: 27
                                                                    }, this)),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                    value: OTHER_OPTION,
                                                                    children: "อื่นๆ (กำหนดเอง)"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/printhub/src/component/shop/ShopServiceTab.tsx",
                                                                    lineNumber: 354,
                                                                    columnNumber: 25
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/printhub/src/component/shop/ShopServiceTab.tsx",
                                                            lineNumber: 341,
                                                            columnNumber: 23
                                                        }, this),
                                                        isCustomMode && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                            value: group.type,
                                                            onChange: (e)=>setServices((prev)=>prev.map((g, i)=>i === gIdx ? {
                                                                            ...g,
                                                                            type: e.target.value
                                                                        } : g)),
                                                            placeholder: "พิมพ์ระบุประเภทบริการเอง...",
                                                            autoFocus: true,
                                                            className: "flex-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-[#2F6FED]"
                                                        }, void 0, false, {
                                                            fileName: "[project]/printhub/src/component/shop/ShopServiceTab.tsx",
                                                            lineNumber: 359,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/printhub/src/component/shop/ShopServiceTab.tsx",
                                                    lineNumber: 340,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    type: "button",
                                                    onClick: ()=>removeServiceType(gIdx),
                                                    className: "self-end text-slate-300 hover:text-rose-500 transition-colors sm:self-auto",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__["Trash2"], {
                                                        size: 16
                                                    }, void 0, false, {
                                                        fileName: "[project]/printhub/src/component/shop/ShopServiceTab.tsx",
                                                        lineNumber: 378,
                                                        columnNumber: 23
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/printhub/src/component/shop/ShopServiceTab.tsx",
                                                    lineNumber: 373,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/printhub/src/component/shop/ShopServiceTab.tsx",
                                            lineNumber: 339,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "p-4 space-y-3",
                                            children: [
                                                groupedRows.map((grp)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "rounded-lg border border-slate-200 bg-slate-50/40 overflow-hidden",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex items-center gap-2 bg-white px-3 py-2 border-b border-slate-100",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$tag$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Tag$3e$__["Tag"], {
                                                                        size: 13,
                                                                        className: "text-slate-300 shrink-0"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/printhub/src/component/shop/ShopServiceTab.tsx",
                                                                        lineNumber: 389,
                                                                        columnNumber: 27
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                        value: grp.name,
                                                                        onChange: (e)=>renameGroup(gIdx, grp.name, e.target.value),
                                                                        placeholder: "ชื่อกลุ่ม เช่น ขนาดกระดาษ",
                                                                        className: "flex-1 bg-transparent text-xs font-semibold text-slate-700 placeholder:text-slate-300 outline-none"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/printhub/src/component/shop/ShopServiceTab.tsx",
                                                                        lineNumber: 390,
                                                                        columnNumber: 27
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                        type: "button",
                                                                        onClick: ()=>removeGroup(gIdx, grp.name),
                                                                        className: "text-slate-300 hover:text-rose-500 transition-colors",
                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__["Trash2"], {
                                                                            size: 13
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/printhub/src/component/shop/ShopServiceTab.tsx",
                                                                            lineNumber: 401,
                                                                            columnNumber: 29
                                                                        }, this)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/printhub/src/component/shop/ShopServiceTab.tsx",
                                                                        lineNumber: 396,
                                                                        columnNumber: 27
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/printhub/src/component/shop/ShopServiceTab.tsx",
                                                                lineNumber: 388,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "divide-y divide-slate-100",
                                                                children: grp.rows.map(({ row, idx })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "flex items-center gap-2 px-3 py-2",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                                value: row.detail,
                                                                                onChange: (e)=>updateRow(gIdx, idx, "detail", e.target.value),
                                                                                placeholder: "เช่น A4",
                                                                                className: "flex-1 rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-sm text-slate-900 outline-none focus:border-[#2F6FED]"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/printhub/src/component/shop/ShopServiceTab.tsx",
                                                                                lineNumber: 408,
                                                                                columnNumber: 31
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: "flex w-28 shrink-0 items-center gap-1 rounded-md border border-slate-200 bg-white px-2.5 py-1.5",
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                                        value: row.price,
                                                                                        onChange: (e)=>updateRow(gIdx, idx, "price", e.target.value),
                                                                                        placeholder: "0",
                                                                                        className: "w-full bg-transparent text-right text-sm font-semibold text-slate-900 outline-none"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/printhub/src/component/shop/ShopServiceTab.tsx",
                                                                                        lineNumber: 415,
                                                                                        columnNumber: 33
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                        className: "text-xs text-slate-400",
                                                                                        children: "บาท"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/printhub/src/component/shop/ShopServiceTab.tsx",
                                                                                        lineNumber: 421,
                                                                                        columnNumber: 33
                                                                                    }, this)
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/printhub/src/component/shop/ShopServiceTab.tsx",
                                                                                lineNumber: 414,
                                                                                columnNumber: 31
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                                type: "button",
                                                                                onClick: ()=>removeRow(gIdx, idx),
                                                                                className: "shrink-0 p-1 text-slate-300 hover:text-rose-500 transition-colors",
                                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__["Trash2"], {
                                                                                    size: 13
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/printhub/src/component/shop/ShopServiceTab.tsx",
                                                                                    lineNumber: 428,
                                                                                    columnNumber: 33
                                                                                }, this)
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/printhub/src/component/shop/ShopServiceTab.tsx",
                                                                                lineNumber: 423,
                                                                                columnNumber: 31
                                                                            }, this)
                                                                        ]
                                                                    }, row.id || idx, true, {
                                                                        fileName: "[project]/printhub/src/component/shop/ShopServiceTab.tsx",
                                                                        lineNumber: 407,
                                                                        columnNumber: 29
                                                                    }, this))
                                                            }, void 0, false, {
                                                                fileName: "[project]/printhub/src/component/shop/ShopServiceTab.tsx",
                                                                lineNumber: 405,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                type: "button",
                                                                onClick: ()=>addRowToGroup(gIdx, grp.name),
                                                                className: "flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-[#2F6FED] hover:underline",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                                                                        size: 12
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/printhub/src/component/shop/ShopServiceTab.tsx",
                                                                        lineNumber: 439,
                                                                        columnNumber: 27
                                                                    }, this),
                                                                    " เพิ่มตัวเลือกในกลุ่มนี้"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/printhub/src/component/shop/ShopServiceTab.tsx",
                                                                lineNumber: 434,
                                                                columnNumber: 25
                                                            }, this)
                                                        ]
                                                    }, grp.name || `group-${grp.rows[0]?.idx}`, true, {
                                                        fileName: "[project]/printhub/src/component/shop/ShopServiceTab.tsx",
                                                        lineNumber: 384,
                                                        columnNumber: 23
                                                    }, this)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    type: "button",
                                                    onClick: ()=>addNewGroup(gIdx),
                                                    className: "flex w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-slate-300 py-2.5 text-xs font-semibold text-slate-500 hover:border-[#2F6FED] hover:text-[#2F6FED] transition-colors",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                                                            size: 14
                                                        }, void 0, false, {
                                                            fileName: "[project]/printhub/src/component/shop/ShopServiceTab.tsx",
                                                            lineNumber: 449,
                                                            columnNumber: 23
                                                        }, this),
                                                        " เพิ่มกลุ่มตัวเลือกใหม่"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/printhub/src/component/shop/ShopServiceTab.tsx",
                                                    lineNumber: 444,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/printhub/src/component/shop/ShopServiceTab.tsx",
                                            lineNumber: 382,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, group.id || gIdx, true, {
                                    fileName: "[project]/printhub/src/component/shop/ShopServiceTab.tsx",
                                    lineNumber: 335,
                                    columnNumber: 17
                                }, this);
                            }),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                onClick: addServiceType,
                                className: "flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 py-3 text-sm font-semibold text-slate-700 hover:border-slate-900 transition-colors",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                                        size: 16
                                    }, void 0, false, {
                                        fileName: "[project]/printhub/src/component/shop/ShopServiceTab.tsx",
                                        lineNumber: 461,
                                        columnNumber: 15
                                    }, this),
                                    " เพิ่มประเภทบริการ"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/printhub/src/component/shop/ShopServiceTab.tsx",
                                lineNumber: 456,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex justify-end gap-3 border-t border-slate-100 pt-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        onClick: ()=>setIsEditing(false),
                                        className: "flex items-center gap-1.5 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                                size: 15
                                            }, void 0, false, {
                                                fileName: "[project]/printhub/src/component/shop/ShopServiceTab.tsx",
                                                lineNumber: 471,
                                                columnNumber: 17
                                            }, this),
                                            " ยกเลิก"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/printhub/src/component/shop/ShopServiceTab.tsx",
                                        lineNumber: 466,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        onClick: handleSave,
                                        disabled: saving,
                                        className: "flex items-center gap-1.5 rounded-lg bg-[#2F6FED] px-5 py-2 text-sm font-medium text-white hover:bg-blue-600 disabled:opacity-50 transition-colors",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__["Check"], {
                                                size: 15
                                            }, void 0, false, {
                                                fileName: "[project]/printhub/src/component/shop/ShopServiceTab.tsx",
                                                lineNumber: 479,
                                                columnNumber: 17
                                            }, this),
                                            saving ? "กำลังบันทึก..." : "บันทึกบริการพิมพ์"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/printhub/src/component/shop/ShopServiceTab.tsx",
                                        lineNumber: 473,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/printhub/src/component/shop/ShopServiceTab.tsx",
                                lineNumber: 465,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/printhub/src/component/shop/ShopServiceTab.tsx",
                        lineNumber: 327,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/printhub/src/component/shop/ShopServiceTab.tsx",
                lineNumber: 244,
                columnNumber: 7
            }, this),
            !isVerified && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-2xl bg-white/70 backdrop-blur-xs",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$lock$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Lock$3e$__["Lock"], {
                            size: 20
                        }, void 0, false, {
                            fileName: "[project]/printhub/src/component/shop/ShopServiceTab.tsx",
                            lineNumber: 491,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/printhub/src/component/shop/ShopServiceTab.tsx",
                        lineNumber: 490,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-center px-6 text-sm font-semibold text-slate-900",
                        children: "คุณจะสามารถแก้ไขบริการพิมพ์ได้ เมื่อผ่านการยืนยันตัวตนจากผู้ดูแลระบบแล้ว"
                    }, void 0, false, {
                        fileName: "[project]/printhub/src/component/shop/ShopServiceTab.tsx",
                        lineNumber: 493,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/printhub/src/component/shop/ShopServiceTab.tsx",
                lineNumber: 489,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/printhub/src/component/shop/ShopServiceTab.tsx",
        lineNumber: 243,
        columnNumber: 5
    }, this);
}
_s(ShopServicesTab, "bGhox6DhTQA6pyh4kkHN4fiqtEk=");
_c1 = ShopServicesTab;
var _c, _c1;
__turbopack_context__.k.register(_c, "SERVICE_TYPE_TEMPLATES");
__turbopack_context__.k.register(_c1, "ShopServicesTab");
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
function ShopNavbar() {
    _s();
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"])();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const [shopId, setShopId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [shopName, setShopName] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
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
                                lineNumber: 66,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/printhub/src/component/shop/navbar.tsx",
                            lineNumber: 65,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "hidden sm:block text-[#0F2942] font-bold text-xl tracking-tight",
                            children: "PrintHub"
                        }, void 0, false, {
                            fileName: "[project]/printhub/src/component/shop/navbar.tsx",
                            lineNumber: 68,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/printhub/src/component/shop/navbar.tsx",
                    lineNumber: 61,
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
                                    lineNumber: 85,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: isHomeActive ? "inline" : "hidden md:inline",
                                    children: "หน้าหลัก"
                                }, void 0, false, {
                                    fileName: "[project]/printhub/src/component/shop/navbar.tsx",
                                    lineNumber: 86,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/printhub/src/component/shop/navbar.tsx",
                            lineNumber: 76,
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
                                    lineNumber: 101,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: isOrderActive ? "inline" : "hidden md:inline",
                                    children: "รายการคำสั่งพิมพ์"
                                }, void 0, false, {
                                    fileName: "[project]/printhub/src/component/shop/navbar.tsx",
                                    lineNumber: 102,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/printhub/src/component/shop/navbar.tsx",
                            lineNumber: 92,
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
                                    lineNumber: 117,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: isChatActive ? "inline" : "hidden md:inline",
                                    children: "แชท"
                                }, void 0, false, {
                                    fileName: "[project]/printhub/src/component/shop/navbar.tsx",
                                    lineNumber: 118,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/printhub/src/component/shop/navbar.tsx",
                            lineNumber: 108,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/printhub/src/component/shop/navbar.tsx",
                    lineNumber: 74,
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
                                    lineNumber: 132,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "w-9 h-9 rounded-full bg-gradient-to-br from-[#0F2942] to-[#1d5d9b] flex items-center justify-center text-white font-bold relative shrink-0",
                                    children: [
                                        shopName?.charAt(0) || "S",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "absolute -bottom-0.5 -right-0.5 bg-white rounded-full p-0.5 shadow-xs",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings$3e$__["Settings"], {
                                                size: 12,
                                                className: isSettingActive ? "text-[#0F2942]" : "text-slate-500"
                                            }, void 0, false, {
                                                fileName: "[project]/printhub/src/component/shop/navbar.tsx",
                                                lineNumber: 138,
                                                columnNumber: 17
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/printhub/src/component/shop/navbar.tsx",
                                            lineNumber: 137,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/printhub/src/component/shop/navbar.tsx",
                                    lineNumber: 135,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/printhub/src/component/shop/navbar.tsx",
                            lineNumber: 127,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "h-5 w-[1px] bg-slate-200 my-auto"
                        }, void 0, false, {
                            fileName: "[project]/printhub/src/component/shop/navbar.tsx",
                            lineNumber: 149,
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
                                    lineNumber: 157,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "hidden sm:inline",
                                    children: "ออกจากระบบ"
                                }, void 0, false, {
                                    fileName: "[project]/printhub/src/component/shop/navbar.tsx",
                                    lineNumber: 158,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/printhub/src/component/shop/navbar.tsx",
                            lineNumber: 152,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/printhub/src/component/shop/navbar.tsx",
                    lineNumber: 125,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/printhub/src/component/shop/navbar.tsx",
            lineNumber: 59,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/printhub/src/component/shop/navbar.tsx",
        lineNumber: 58,
        columnNumber: 5
    }, this);
}
_s(ShopNavbar, "fn5GwfAweCNfgYNr8VmtOuu3XVk=", false, function() {
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
]);

//# sourceMappingURL=printhub_src_0gr7mgq._.js.map