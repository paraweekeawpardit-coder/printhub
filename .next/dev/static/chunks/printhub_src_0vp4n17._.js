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
var __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$src$2f$component$2f$shop$2f$Shoplocationcomfirmmodal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/printhub/src/component/shop/Shoplocationcomfirmmodal.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$src$2f$component$2f$shop$2f$Shopbankconfirmmodal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/printhub/src/component/shop/Shopbankconfirmmodal.tsx [app-client] (ecmascript)");
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
const API_BASE = "http://localhost:5000/shop";
const SHOP_ID_STORAGE_KEY = "shop_id";
function resolveShopId(raw) {
    if (!raw) return null;
    try {
        const parsed = JSON.parse(raw);
        if (typeof parsed === "string") return parsed;
        if (parsed && typeof parsed === "object" && parsed.id != null) {
            return String(parsed.id);
        }
    } catch (err) {
        console.log(err);
    }
    return raw;
}
function ShopSettingsPage() {
    _s();
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
    // Shop Open/Closed State
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
    const [profileImage, setProfileImage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [uploadingImage, setUploadingImage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [addressId, setAddressId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [address, setAddress] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        detail: "",
        subdistrict: "",
        district: "",
        province: "",
        postcode: ""
    });
    // พิกัดร้านเดิม + ที่อยู่ที่บันทึกล่าสุด (ใช้เช็คว่ามีการแก้ที่อยู่หรือไม่)
    const [latitude, setLatitude] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [longitude, setLongitude] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [savedAddress, setSavedAddress] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        detail: "",
        subdistrict: "",
        district: "",
        province: "",
        postcode: ""
    });
    const [showLocationModal, setShowLocationModal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // Services State
    const [services, setServices] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    // Bank Account States
    const [bankAccountId, setBankAccountId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [bankName, setBankName] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [accountName, setAccountName] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [accountNumber, setAccountNumber] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    // ค่าบัญชีที่บันทึกอยู่ใน DB ใช้เทียบว่าผู้ใช้แก้ไขจริงหรือไม่
    const [originalBank, setOriginalBank] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [showBankConfirm, setShowBankConfirm] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
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
                    setOpenTime((shop.open_time ?? "09:00").slice(0, 5));
                    setCloseTime((shop.close_time ?? "18:00").slice(0, 5));
                    setIsOpen(shop.is_open ?? true);
                    setProfileImage(shop.profile_image ?? null);
                    if (shop.address) {
                        setAddressId(shop.address.id ?? null);
                        const loaded = {
                            detail: shop.address.detail ?? "",
                            subdistrict: shop.address.subdistrict ?? "",
                            district: shop.address.district ?? "",
                            province: shop.address.province ?? "",
                            postcode: shop.address.postcode ?? ""
                        };
                        setAddress(loaded);
                        setSavedAddress(loaded);
                        setLatitude(shop.address.latitude != null ? Number(shop.address.latitude) : null);
                        setLongitude(shop.address.longitude != null ? Number(shop.address.longitude) : null);
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
                                items: (group.items ?? []).map({
                                    "ShopSettingsPage.useCallback[fetchShopSettings].normalizedServices": (d)=>({
                                            id: d.id,
                                            category: d.category ?? "",
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
                    setOriginalBank({
                        bankName: bankAccount.bank_name ?? "",
                        accountName: bankAccount.account_name ?? "",
                        accountNumber: bankAccount.account_number ?? ""
                    });
                } else {
                    setHasBankData(false);
                    setOriginalBank(null);
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
    const isAddressChanged = ()=>Object.keys(address).some((k)=>(address[k] ?? "").trim() !== (savedAddress[k] ?? "").trim());
    const submitProfile = async (coords)=>{
        if (!shopId) return false;
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
                    ...address,
                    ...coords && {
                        latitude: coords.lat,
                        longitude: coords.lng
                    }
                }
            });
            setHasProfileData(true);
            setIsEditingProfile(false);
            await fetchShopSettings();
            return true;
        } catch (err) {
            console.error("Save profile error:", err);
            return false;
        } finally{
            setSaving(false);
        }
    };
    const handleSaveProfile = ()=>{
        if (!shopId) return;
        if (isAddressChanged()) {
            setShowLocationModal(true);
            return;
        }
        submitProfile();
    };
    const handleConfirmLocation = async (loc)=>{
        const ok = await submitProfile(loc);
        if (ok) setShowLocationModal(false);
    };
    const handleUploadProfileImage = async (file)=>{
        if (!shopId) return "ไม่พบ shop_id ของร้านค้า";
        try {
            setUploadingImage(true);
            const formData = new FormData();
            formData.append("image", file);
            const res = await __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].put(`${API_BASE}/profile/${shopId}/image`, formData);
            const newImage = res.data?.data?.profile_image ?? null;
            setProfileImage(newImage);
            window.dispatchEvent(new CustomEvent("shop-profile-image-updated", {
                detail: {
                    profile_image: newImage
                }
            }));
            return null;
        } catch (err) {
            const data = err?.response?.data;
            console.error("Upload profile image error:", err?.response?.status, data ?? err.message);
            return data?.error ?? "อัปโหลดรูปไม่สำเร็จ กรุณาลองใหม่อีกครั้ง";
        } finally{
            setUploadingImage(false);
        }
    };
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
        if (!shopId) return false;
        try {
            setSaving(true);
            const payloadServices = services.map((s)=>({
                    type: s.type,
                    items: s.items.map((item)=>({
                            category: item.category || s.type,
                            detail: item.detail,
                            group_type: item.group_type,
                            price: item.price
                        }))
                }));
            await __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post(`${API_BASE}/services`, {
                shop_id: shopId,
                services: payloadServices
            });
            await fetchShopSettings();
            return true;
        } catch (err) {
            const data = err?.response?.data;
            console.error("Save services error:", err?.response?.status, data ?? err.message);
            alert(`บันทึกบริการพิมพ์ไม่สำเร็จ\n${data?.detail ?? data?.error ?? err.message}\n[backend: ${data?.debug?.version ?? "ไม่พบ version = โค้ดเก่า/ยังไม่ restart?"}]`);
            return false;
        } finally{
            setSaving(false);
        }
    };
    const performSaveBank = async ()=>{
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
            const errorMsg = err?.response?.data?.error || err.message;
            console.error("Save bank error:", err?.response?.data ?? err);
            alert(`บันทึกบัญชีธนาคารไม่สำเร็จ: ${errorMsg}`);
        } finally{
            setSaving(false);
            setShowBankConfirm(false);
        }
    };
    const handleSaveBank = ()=>{
        if (!shopId) return;
        if (!bankName || !accountName || !accountNumber) {
            alert("กรุณากรอกข้อมูลธนาคาร ชื่อบัญชี และเลขที่บัญชีให้ครบถ้วน");
            return;
        }
        if (bankAccountId && originalBank) {
            const changed = originalBank.bankName !== bankName || originalBank.accountName !== accountName || originalBank.accountNumber !== accountNumber;
            if (!changed) {
                setIsEditingBank(false);
                return;
            }
            setShowBankConfirm(true);
            return;
        }
        performSaveBank();
    };
    const tabs = [
        {
            key: "profile",
            label: "ข้อมูลร้าน",
            icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$store$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Store$3e$__["Store"], {
                size: 16
            }, void 0, false, {
                fileName: "[project]/printhub/src/app/shop/setting/[shop_id]/page.tsx",
                lineNumber: 412,
                columnNumber: 50
            }, this),
            locked: false
        },
        {
            key: "services",
            label: "บริการพิมพ์",
            icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$printer$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Printer$3e$__["Printer"], {
                size: 16
            }, void 0, false, {
                fileName: "[project]/printhub/src/app/shop/setting/[shop_id]/page.tsx",
                lineNumber: 413,
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
                lineNumber: 414,
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
                lineNumber: 419,
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
                                lineNumber: 424,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "mt-1 text-sm text-slate-500",
                                children: "จัดการข้อมูลทั่วไป บริการพิมพ์ และบัญชีธนาคารสำหรับการรับเงิน"
                            }, void 0, false, {
                                fileName: "[project]/printhub/src/app/shop/setting/[shop_id]/page.tsx",
                                lineNumber: 425,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/printhub/src/app/shop/setting/[shop_id]/page.tsx",
                        lineNumber: 423,
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
                                            lineNumber: 446,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, t.key, true, {
                                    fileName: "[project]/printhub/src/app/shop/setting/[shop_id]/page.tsx",
                                    lineNumber: 434,
                                    columnNumber: 15
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/printhub/src/app/shop/setting/[shop_id]/page.tsx",
                            lineNumber: 432,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/printhub/src/app/shop/setting/[shop_id]/page.tsx",
                        lineNumber: 431,
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
                                lineNumber: 456,
                                columnNumber: 13
                            }, this),
                            "กำลังโหลดข้อมูล..."
                        ]
                    }, void 0, true, {
                        fileName: "[project]/printhub/src/app/shop/setting/[shop_id]/page.tsx",
                        lineNumber: 455,
                        columnNumber: 11
                    }, this) : !shopId ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "py-12 text-center text-sm text-rose-500",
                        children: "ไม่พบ shop_id ของร้านค้า กรุณาเข้าสู่ระบบใหม่อีกครั้ง"
                    }, void 0, false, {
                        fileName: "[project]/printhub/src/app/shop/setting/[shop_id]/page.tsx",
                        lineNumber: 460,
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
                                profileImage: profileImage,
                                onUploadImage: handleUploadProfileImage,
                                uploadingImage: uploadingImage,
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
                                lineNumber: 466,
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
                                lineNumber: 488,
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
                                lineNumber: 495,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/printhub/src/app/shop/setting/[shop_id]/page.tsx",
                        lineNumber: 464,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/printhub/src/app/shop/setting/[shop_id]/page.tsx",
                lineNumber: 421,
                columnNumber: 7
            }, this),
            showLocationModal && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$src$2f$component$2f$shop$2f$Shoplocationcomfirmmodal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                initialLocation: latitude != null && longitude != null ? {
                    lat: latitude,
                    lng: longitude
                } : null,
                saving: saving,
                onConfirm: handleConfirmLocation,
                onCancel: ()=>setShowLocationModal(false)
            }, void 0, false, {
                fileName: "[project]/printhub/src/app/shop/setting/[shop_id]/page.tsx",
                lineNumber: 511,
                columnNumber: 9
            }, this),
            showBankConfirm && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$src$2f$component$2f$shop$2f$Shopbankconfirmmodal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                saving: saving,
                onConfirm: performSaveBank,
                onCancel: ()=>setShowBankConfirm(false)
            }, void 0, false, {
                fileName: "[project]/printhub/src/app/shop/setting/[shop_id]/page.tsx",
                lineNumber: 524,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/printhub/src/app/shop/setting/[shop_id]/page.tsx",
        lineNumber: 418,
        columnNumber: 5
    }, this);
}
_s(ShopSettingsPage, "wxjc4pzTjcjTDhG6ny0IWr/7fMA=", false, function() {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/printhub/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$camera$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Camera$3e$__ = __turbopack_context__.i("[project]/printhub/node_modules/lucide-react/dist/esm/icons/camera.mjs [app-client] (ecmascript) <export default as Camera>");
var __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__ = __turbopack_context__.i("[project]/printhub/node_modules/lucide-react/dist/esm/icons/clock.mjs [app-client] (ecmascript) <export default as Clock>");
var __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pencil$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Pencil$3e$__ = __turbopack_context__.i("[project]/printhub/node_modules/lucide-react/dist/esm/icons/pencil.mjs [app-client] (ecmascript) <export default as Pencil>");
var __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$lock$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Lock$3e$__ = __turbopack_context__.i("[project]/printhub/node_modules/lucide-react/dist/esm/icons/lock.mjs [app-client] (ecmascript) <export default as Lock>");
var __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__ = __turbopack_context__.i("[project]/printhub/node_modules/lucide-react/dist/esm/icons/chevron-down.mjs [app-client] (ecmascript) <export default as ChevronDown>");
var __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__ = __turbopack_context__.i("[project]/printhub/node_modules/lucide-react/dist/esm/icons/check.mjs [app-client] (ecmascript) <export default as Check>");
var __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$alert$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertCircle$3e$__ = __turbopack_context__.i("[project]/printhub/node_modules/lucide-react/dist/esm/icons/circle-alert.mjs [app-client] (ecmascript) <export default as AlertCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__ = __turbopack_context__.i("[project]/printhub/node_modules/lucide-react/dist/esm/icons/loader-circle.mjs [app-client] (ecmascript) <export default as Loader2>");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature(), _s2 = __turbopack_context__.k.signature();
"use client";
;
;
// ==========================================
// รูปโปรไฟล์ร้าน: แสดงรูป + กดเพื่อเปลี่ยนรูปได้ (ไม่มีปุ่มลบ เพราะร้านต้องมีรูปเสมอ)
// ==========================================
const ACCEPTED_IMAGE_TYPES = [
    "image/jpeg",
    "image/png",
    "image/webp"
];
const MAX_IMAGE_MB = 5;
function ShopAvatar({ src, name, uploading, onSelectFile }) {
    _s();
    const inputRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [failed, setFailed] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // เปลี่ยนรูปใหม่แล้วให้ลองโหลดใหม่
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ShopAvatar.useEffect": ()=>{
            setFailed(false);
        }
    }["ShopAvatar.useEffect"], [
        src
    ]);
    const showImage = !!src && !failed;
    const openPicker = ()=>inputRef.current?.click();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "relative shrink-0",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                type: "button",
                onClick: openPicker,
                disabled: uploading,
                "aria-label": "เปลี่ยนรูปโปรไฟล์ร้านค้า",
                className: "relative flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-[#EAF1FF] text-xl font-bold text-[#2F6FED] ring-1 ring-slate-200 transition-shadow hover:ring-2 hover:ring-[#2F6FED]/40 disabled:cursor-wait",
                children: [
                    showImage ? // eslint-disable-next-line @next/next/no-img-element
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                        src: src,
                        alt: `รูปโปรไฟล์ ${name}`,
                        onError: ()=>setFailed(true),
                        className: "h-full w-full object-cover"
                    }, void 0, false, {
                        fileName: "[project]/printhub/src/component/shop/ShopProfileTab.tsx",
                        lineNumber: 90,
                        columnNumber: 11
                    }, this) : name ? name.charAt(0) : "S",
                    uploading && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "absolute inset-0 flex items-center justify-center bg-white/70",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                            size: 18,
                            className: "animate-spin text-[#2F6FED]"
                        }, void 0, false, {
                            fileName: "[project]/printhub/src/component/shop/ShopProfileTab.tsx",
                            lineNumber: 101,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/printhub/src/component/shop/ShopProfileTab.tsx",
                        lineNumber: 100,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/printhub/src/component/shop/ShopProfileTab.tsx",
                lineNumber: 81,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                type: "button",
                onClick: openPicker,
                disabled: uploading,
                "aria-label": "เลือกรูปใหม่",
                className: "absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-[#0F2942] text-white transition-colors hover:bg-[#16385c] disabled:opacity-50",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$camera$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Camera$3e$__["Camera"], {
                    size: 13
                }, void 0, false, {
                    fileName: "[project]/printhub/src/component/shop/ShopProfileTab.tsx",
                    lineNumber: 113,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/printhub/src/component/shop/ShopProfileTab.tsx",
                lineNumber: 106,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                ref: inputRef,
                type: "file",
                accept: "image/png,image/jpeg,image/webp",
                className: "hidden",
                onChange: (e)=>{
                    const file = e.target.files?.[0];
                    e.target.value = ""; // เลือกไฟล์เดิมซ้ำได้
                    if (file) onSelectFile(file);
                }
            }, void 0, false, {
                fileName: "[project]/printhub/src/component/shop/ShopProfileTab.tsx",
                lineNumber: 116,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/printhub/src/component/shop/ShopProfileTab.tsx",
        lineNumber: 80,
        columnNumber: 5
    }, this);
}
_s(ShopAvatar, "BZGuxlMVz5rR76tjhGmd3Ntbu40=");
_c = ShopAvatar;
// ==========================================
// TimePicker: เลือกเวลาแบบ 24 ชั่วโมง (00-23) ให้เข้ากับธีม
// value / onChange ใช้รูปแบบ "HH:mm" เหมือนที่เก็บในฐานข้อมูล
// ==========================================
const pad2 = (n)=>String(n).padStart(2, "0");
const parseTime = (value)=>{
    const [h, m] = (value || "").split(":");
    const hour = Math.min(23, Math.max(0, parseInt(h, 10) || 0));
    const minute = Math.min(59, Math.max(0, parseInt(m, 10) || 0));
    return {
        hour,
        minute
    };
};
const HOURS = Array.from({
    length: 24
}, (_, i)=>i);
const timeItemClass = (selected)=>`flex h-9 w-full items-center justify-center rounded-lg text-sm tabular-nums transition-colors ${selected ? "bg-[#2F6FED] font-semibold text-white" : "text-slate-700 hover:bg-slate-100"}`;
function TimePicker({ value, onChange, ariaLabel, align = "left" }) {
    _s1();
    const [open, setOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const rootRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const hourListRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const minuteListRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const { hour, minute } = parseTime(value);
    // นาทีทุก 5 นาที (ถ้าค่าเดิมในระบบไม่ลงตัว เช่น 09:07 ให้แสดงค่านั้นด้วย จะได้ไม่หาย)
    const minutes = (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "TimePicker.useMemo[minutes]": ()=>{
            const base = Array.from({
                length: 12
            }, {
                "TimePicker.useMemo[minutes].base": (_, i)=>i * 5
            }["TimePicker.useMemo[minutes].base"]);
            return base.includes(minute) ? base : [
                ...base,
                minute
            ].sort({
                "TimePicker.useMemo[minutes]": (a, b)=>a - b
            }["TimePicker.useMemo[minutes]"]);
        }
    }["TimePicker.useMemo[minutes]"], [
        minute
    ]);
    // ปิดเมื่อคลิกข้างนอก หรือกด Esc
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "TimePicker.useEffect": ()=>{
            if (!open) return;
            const handleMouseDown = {
                "TimePicker.useEffect.handleMouseDown": (e)=>{
                    if (rootRef.current && !rootRef.current.contains(e.target)) {
                        setOpen(false);
                    }
                }
            }["TimePicker.useEffect.handleMouseDown"];
            const handleKeyDown = {
                "TimePicker.useEffect.handleKeyDown": (e)=>{
                    if (e.key === "Escape") setOpen(false);
                }
            }["TimePicker.useEffect.handleKeyDown"];
            document.addEventListener("mousedown", handleMouseDown);
            document.addEventListener("keydown", handleKeyDown);
            return ({
                "TimePicker.useEffect": ()=>{
                    document.removeEventListener("mousedown", handleMouseDown);
                    document.removeEventListener("keydown", handleKeyDown);
                }
            })["TimePicker.useEffect"];
        }
    }["TimePicker.useEffect"], [
        open
    ]);
    // เปิดมาแล้วเลื่อนให้ค่าที่เลือกอยู่กลางรายการ
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "TimePicker.useEffect": ()=>{
            if (!open) return;
            [
                hourListRef.current,
                minuteListRef.current
            ].forEach({
                "TimePicker.useEffect": (list)=>{
                    const el = list?.querySelector('[aria-selected="true"]');
                    if (list && el) {
                        list.scrollTop = el.offsetTop - list.clientHeight / 2 + el.clientHeight / 2;
                    }
                }
            }["TimePicker.useEffect"]);
        }
    }["TimePicker.useEffect"], [
        open
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: rootRef,
        className: "relative flex-1",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                type: "button",
                onClick: ()=>setOpen((prev)=>!prev),
                "aria-label": ariaLabel,
                "aria-haspopup": "listbox",
                "aria-expanded": open,
                className: `flex w-full items-center gap-2 rounded-xl border bg-white px-3.5 py-2 text-left text-sm text-[#0F2942] outline-none transition-colors ${open ? "border-[#2F6FED] ring-2 ring-[#2F6FED]/15" : "border-slate-200 hover:border-slate-300"}`,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__["Clock"], {
                        size: 16,
                        className: "text-slate-400"
                    }, void 0, false, {
                        fileName: "[project]/printhub/src/component/shop/ShopProfileTab.tsx",
                        lineNumber: 223,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "flex-1 tabular-nums",
                        children: [
                            pad2(hour),
                            ":",
                            pad2(minute),
                            " น."
                        ]
                    }, void 0, true, {
                        fileName: "[project]/printhub/src/component/shop/ShopProfileTab.tsx",
                        lineNumber: 224,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__["ChevronDown"], {
                        size: 15,
                        className: `shrink-0 text-slate-400 transition-transform ${open ? "rotate-180" : ""}`
                    }, void 0, false, {
                        fileName: "[project]/printhub/src/component/shop/ShopProfileTab.tsx",
                        lineNumber: 227,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/printhub/src/component/shop/ShopProfileTab.tsx",
                lineNumber: 211,
                columnNumber: 7
            }, this),
            open && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: `absolute top-full z-20 mt-1.5 w-60 rounded-xl border border-slate-200 bg-white p-3 shadow-lg shadow-slate-900/10 ${align === "right" ? "right-0" : "left-0"}`,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid grid-cols-2 gap-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "mb-1.5 text-center text-xs font-semibold text-slate-400",
                                        children: "ชั่วโมง"
                                    }, void 0, false, {
                                        fileName: "[project]/printhub/src/component/shop/ShopProfileTab.tsx",
                                        lineNumber: 243,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        ref: hourListRef,
                                        role: "listbox",
                                        "aria-label": "ชั่วโมง",
                                        className: "relative max-h-48 space-y-1 overflow-y-auto rounded-lg border border-slate-100 p-1",
                                        children: HOURS.map((h)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                type: "button",
                                                role: "option",
                                                "aria-selected": h === hour,
                                                onClick: ()=>onChange(`${pad2(h)}:${pad2(minute)}`),
                                                className: timeItemClass(h === hour),
                                                children: pad2(h)
                                            }, h, false, {
                                                fileName: "[project]/printhub/src/component/shop/ShopProfileTab.tsx",
                                                lineNumber: 253,
                                                columnNumber: 19
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/printhub/src/component/shop/ShopProfileTab.tsx",
                                        lineNumber: 246,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/printhub/src/component/shop/ShopProfileTab.tsx",
                                lineNumber: 242,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "mb-1.5 text-center text-xs font-semibold text-slate-400",
                                        children: "นาที"
                                    }, void 0, false, {
                                        fileName: "[project]/printhub/src/component/shop/ShopProfileTab.tsx",
                                        lineNumber: 268,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        ref: minuteListRef,
                                        role: "listbox",
                                        "aria-label": "นาที",
                                        className: "relative max-h-48 space-y-1 overflow-y-auto rounded-lg border border-slate-100 p-1",
                                        children: minutes.map((m)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                type: "button",
                                                role: "option",
                                                "aria-selected": m === minute,
                                                onClick: ()=>onChange(`${pad2(hour)}:${pad2(m)}`),
                                                className: timeItemClass(m === minute),
                                                children: pad2(m)
                                            }, m, false, {
                                                fileName: "[project]/printhub/src/component/shop/ShopProfileTab.tsx",
                                                lineNumber: 278,
                                                columnNumber: 19
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/printhub/src/component/shop/ShopProfileTab.tsx",
                                        lineNumber: 271,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/printhub/src/component/shop/ShopProfileTab.tsx",
                                lineNumber: 267,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/printhub/src/component/shop/ShopProfileTab.tsx",
                        lineNumber: 241,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-3 flex items-center justify-between border-t border-slate-100 pt-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-sm font-semibold tabular-nums text-[#0F2942]",
                                children: [
                                    pad2(hour),
                                    ":",
                                    pad2(minute),
                                    " น."
                                ]
                            }, void 0, true, {
                                fileName: "[project]/printhub/src/component/shop/ShopProfileTab.tsx",
                                lineNumber: 294,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                onClick: ()=>setOpen(false),
                                className: "rounded-lg bg-[#0F2942] px-4 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-[#16385c]",
                                children: "ตกลง"
                            }, void 0, false, {
                                fileName: "[project]/printhub/src/component/shop/ShopProfileTab.tsx",
                                lineNumber: 297,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/printhub/src/component/shop/ShopProfileTab.tsx",
                        lineNumber: 293,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/printhub/src/component/shop/ShopProfileTab.tsx",
                lineNumber: 236,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/printhub/src/component/shop/ShopProfileTab.tsx",
        lineNumber: 210,
        columnNumber: 5
    }, this);
}
_s1(TimePicker, "QNR7+WMz4tV3akYyTMltv+C2zD0=");
_c1 = TimePicker;
function ShopProfileTab({ isVerified, isOpen, onToggleOpen, togglingOpen, shopName, setShopName, ownerName, setOwnerName, phone, setPhone, email, profileImage, onUploadImage, uploadingImage, openTime, setOpenTime, closeTime, setCloseTime, address, setAddress, onSave, saving, hasData, isEditing, onToggleEdit }) {
    _s2();
    const addressText = [
        address.detail,
        address.subdistrict,
        address.district,
        address.province,
        address.postcode
    ].filter(Boolean).join(" ");
    const [imageMessage, setImageMessage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    // ข้อความ "เปลี่ยนรูปแล้ว" หายเองหลัง 3 วินาที
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ShopProfileTab.useEffect": ()=>{
            if (imageMessage?.type !== "success") return;
            const timer = setTimeout({
                "ShopProfileTab.useEffect.timer": ()=>setImageMessage(null)
            }["ShopProfileTab.useEffect.timer"], 3000);
            return ({
                "ShopProfileTab.useEffect": ()=>clearTimeout(timer)
            })["ShopProfileTab.useEffect"];
        }
    }["ShopProfileTab.useEffect"], [
        imageMessage
    ]);
    const handleSelectImage = async (file)=>{
        setImageMessage(null);
        if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
            setImageMessage({
                type: "error",
                text: "รองรับเฉพาะไฟล์ JPG, PNG หรือ WebP"
            });
            return;
        }
        if (file.size > MAX_IMAGE_MB * 1024 * 1024) {
            setImageMessage({
                type: "error",
                text: `ไฟล์ต้องมีขนาดไม่เกิน ${MAX_IMAGE_MB} MB`
            });
            return;
        }
        const error = await onUploadImage(file);
        setImageMessage(error ? {
            type: "error",
            text: error
        } : {
            type: "success",
            text: "เปลี่ยนรูปร้านเรียบร้อยแล้ว"
        });
    };
    const imageFeedback = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            imageMessage && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                role: imageMessage.type === "error" ? "alert" : "status",
                className: `mt-1.5 flex items-center gap-1 text-xs font-medium ${imageMessage.type === "error" ? "text-rose-500" : "text-emerald-600"}`,
                children: [
                    imageMessage.type === "error" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$alert$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertCircle$3e$__["AlertCircle"], {
                        size: 12,
                        className: "shrink-0"
                    }, void 0, false, {
                        fileName: "[project]/printhub/src/component/shop/ShopProfileTab.tsx",
                        lineNumber: 390,
                        columnNumber: 13
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__["Check"], {
                        size: 12,
                        className: "shrink-0"
                    }, void 0, false, {
                        fileName: "[project]/printhub/src/component/shop/ShopProfileTab.tsx",
                        lineNumber: 392,
                        columnNumber: 13
                    }, this),
                    imageMessage.text
                ]
            }, void 0, true, {
                fileName: "[project]/printhub/src/component/shop/ShopProfileTab.tsx",
                lineNumber: 383,
                columnNumber: 9
            }, this),
            !profileImage && !imageMessage && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "mt-1.5 text-xs font-medium text-amber-600",
                children: "ร้านของคุณยังไม่มีรูปโปรไฟล์ กรุณากดที่รูปเพื่ออัปโหลด"
            }, void 0, false, {
                fileName: "[project]/printhub/src/component/shop/ShopProfileTab.tsx",
                lineNumber: 398,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/printhub/src/component/shop/ShopProfileTab.tsx",
        lineNumber: 381,
        columnNumber: 5
    }, this);
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
                                        lineNumber: 415,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-sm font-bold text-[#0F2942]",
                                                children: isOpen ? "ร้านเปิดให้บริการ" : "ปิดร้านชั่วคราว"
                                            }, void 0, false, {
                                                fileName: "[project]/printhub/src/component/shop/ShopProfileTab.tsx",
                                                lineNumber: 421,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-xs text-slate-400",
                                                children: isOpen ? "ลูกค้าสามารถสั่งพิมพ์กับร้านคุณได้ตามปกติ" : "ลูกค้าจะไม่สามารถสั่งพิมพ์กับร้านคุณได้ชั่วคราว"
                                            }, void 0, false, {
                                                fileName: "[project]/printhub/src/component/shop/ShopProfileTab.tsx",
                                                lineNumber: 424,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/printhub/src/component/shop/ShopProfileTab.tsx",
                                        lineNumber: 420,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/printhub/src/component/shop/ShopProfileTab.tsx",
                                lineNumber: 414,
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
                                    lineNumber: 441,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/printhub/src/component/shop/ShopProfileTab.tsx",
                                lineNumber: 432,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/printhub/src/component/shop/ShopProfileTab.tsx",
                        lineNumber: 413,
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
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ShopAvatar, {
                                                src: profileImage,
                                                name: shopName,
                                                uploading: uploadingImage,
                                                onSelectFile: handleSelectImage
                                            }, void 0, false, {
                                                fileName: "[project]/printhub/src/component/shop/ShopProfileTab.tsx",
                                                lineNumber: 454,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-sm font-bold text-[#0F2942]",
                                                        children: shopName || "-"
                                                    }, void 0, false, {
                                                        fileName: "[project]/printhub/src/component/shop/ShopProfileTab.tsx",
                                                        lineNumber: 461,
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
                                                        lineNumber: 462,
                                                        columnNumber: 19
                                                    }, this),
                                                    imageFeedback
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/printhub/src/component/shop/ShopProfileTab.tsx",
                                                lineNumber: 460,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/printhub/src/component/shop/ShopProfileTab.tsx",
                                        lineNumber: 453,
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
                                                lineNumber: 471,
                                                columnNumber: 17
                                            }, this),
                                            " แก้ไขข้อมูล"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/printhub/src/component/shop/ShopProfileTab.tsx",
                                        lineNumber: 466,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/printhub/src/component/shop/ShopProfileTab.tsx",
                                lineNumber: 452,
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
                                                lineNumber: 477,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "mt-1 text-sm text-[#0F2942]",
                                                children: phone || "-"
                                            }, void 0, false, {
                                                fileName: "[project]/printhub/src/component/shop/ShopProfileTab.tsx",
                                                lineNumber: 478,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/printhub/src/component/shop/ShopProfileTab.tsx",
                                        lineNumber: 476,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-xs font-semibold text-slate-400",
                                                children: "อีเมล"
                                            }, void 0, false, {
                                                fileName: "[project]/printhub/src/component/shop/ShopProfileTab.tsx",
                                                lineNumber: 481,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "mt-1 text-sm text-[#0F2942]",
                                                children: email || "-"
                                            }, void 0, false, {
                                                fileName: "[project]/printhub/src/component/shop/ShopProfileTab.tsx",
                                                lineNumber: 482,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/printhub/src/component/shop/ShopProfileTab.tsx",
                                        lineNumber: 480,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-xs font-semibold text-slate-400",
                                                children: "เวลาทำการ"
                                            }, void 0, false, {
                                                fileName: "[project]/printhub/src/component/shop/ShopProfileTab.tsx",
                                                lineNumber: 485,
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
                                                        lineNumber: 487,
                                                        columnNumber: 19
                                                    }, this),
                                                    openTime,
                                                    " — ",
                                                    closeTime,
                                                    " น."
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/printhub/src/component/shop/ShopProfileTab.tsx",
                                                lineNumber: 486,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/printhub/src/component/shop/ShopProfileTab.tsx",
                                        lineNumber: 484,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/printhub/src/component/shop/ShopProfileTab.tsx",
                                lineNumber: 475,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-xs font-semibold text-slate-400",
                                        children: "ที่อยู่ร้านค้า"
                                    }, void 0, false, {
                                        fileName: "[project]/printhub/src/component/shop/ShopProfileTab.tsx",
                                        lineNumber: 494,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "mt-1 text-sm text-[#0F2942]",
                                        children: addressText || "-"
                                    }, void 0, false, {
                                        fileName: "[project]/printhub/src/component/shop/ShopProfileTab.tsx",
                                        lineNumber: 495,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/printhub/src/component/shop/ShopProfileTab.tsx",
                                lineNumber: 493,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/printhub/src/component/shop/ShopProfileTab.tsx",
                        lineNumber: 451,
                        columnNumber: 11
                    }, this) : /* Edit Mode Form */ /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-6",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-4 pb-4 border-b border-slate-100",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ShopAvatar, {
                                        src: profileImage,
                                        name: shopName,
                                        uploading: uploadingImage,
                                        onSelectFile: handleSelectImage
                                    }, void 0, false, {
                                        fileName: "[project]/printhub/src/component/shop/ShopProfileTab.tsx",
                                        lineNumber: 503,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-sm font-bold text-[#0F2942]",
                                                children: "รูปโปรไฟล์ร้านค้า"
                                            }, void 0, false, {
                                                fileName: "[project]/printhub/src/component/shop/ShopProfileTab.tsx",
                                                lineNumber: 510,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-xs text-slate-400",
                                                children: [
                                                    "JPG, PNG, WebP ไม่เกิน ",
                                                    MAX_IMAGE_MB,
                                                    " MB"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/printhub/src/component/shop/ShopProfileTab.tsx",
                                                lineNumber: 511,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "mt-0.5 text-xs text-slate-400",
                                                children: "กดที่รูปเพื่อเปลี่ยน (รูปจะถูกบันทึกทันที ไม่ต้องกดบันทึกข้อมูลร้าน)"
                                            }, void 0, false, {
                                                fileName: "[project]/printhub/src/component/shop/ShopProfileTab.tsx",
                                                lineNumber: 514,
                                                columnNumber: 17
                                            }, this),
                                            imageFeedback
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/printhub/src/component/shop/ShopProfileTab.tsx",
                                        lineNumber: 509,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/printhub/src/component/shop/ShopProfileTab.tsx",
                                lineNumber: 502,
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
                                                lineNumber: 524,
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
                                                lineNumber: 525,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/printhub/src/component/shop/ShopProfileTab.tsx",
                                        lineNumber: 523,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                className: "text-xs font-semibold text-slate-600",
                                                children: "ชื่อเจ้าของร้าน"
                                            }, void 0, false, {
                                                fileName: "[project]/printhub/src/component/shop/ShopProfileTab.tsx",
                                                lineNumber: 534,
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
                                                lineNumber: 535,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/printhub/src/component/shop/ShopProfileTab.tsx",
                                        lineNumber: 533,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                className: "text-xs font-semibold text-slate-600",
                                                children: "เบอร์โทรศัพท์"
                                            }, void 0, false, {
                                                fileName: "[project]/printhub/src/component/shop/ShopProfileTab.tsx",
                                                lineNumber: 544,
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
                                                lineNumber: 545,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/printhub/src/component/shop/ShopProfileTab.tsx",
                                        lineNumber: 543,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                className: "text-xs font-semibold text-slate-600",
                                                children: "อีเมล"
                                            }, void 0, false, {
                                                fileName: "[project]/printhub/src/component/shop/ShopProfileTab.tsx",
                                                lineNumber: 554,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "text",
                                                value: email,
                                                disabled: true,
                                                className: "mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm text-slate-400 cursor-not-allowed"
                                            }, void 0, false, {
                                                fileName: "[project]/printhub/src/component/shop/ShopProfileTab.tsx",
                                                lineNumber: 555,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/printhub/src/component/shop/ShopProfileTab.tsx",
                                        lineNumber: 553,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/printhub/src/component/shop/ShopProfileTab.tsx",
                                lineNumber: 522,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "text-xs font-semibold text-slate-600 mb-2 block",
                                        children: "เวลาทำการ"
                                    }, void 0, false, {
                                        fileName: "[project]/printhub/src/component/shop/ShopProfileTab.tsx",
                                        lineNumber: 566,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center gap-3",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(TimePicker, {
                                                value: openTime,
                                                onChange: setOpenTime,
                                                ariaLabel: "เวลาเปิดร้าน"
                                            }, void 0, false, {
                                                fileName: "[project]/printhub/src/component/shop/ShopProfileTab.tsx",
                                                lineNumber: 568,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-slate-400",
                                                children: "—"
                                            }, void 0, false, {
                                                fileName: "[project]/printhub/src/component/shop/ShopProfileTab.tsx",
                                                lineNumber: 573,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(TimePicker, {
                                                value: closeTime,
                                                onChange: setCloseTime,
                                                ariaLabel: "เวลาปิดร้าน",
                                                align: "right"
                                            }, void 0, false, {
                                                fileName: "[project]/printhub/src/component/shop/ShopProfileTab.tsx",
                                                lineNumber: 574,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/printhub/src/component/shop/ShopProfileTab.tsx",
                                        lineNumber: 567,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/printhub/src/component/shop/ShopProfileTab.tsx",
                                lineNumber: 565,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "text-xs font-semibold text-slate-600 mb-2 block",
                                        children: "ที่อยู่ร้านค้า"
                                    }, void 0, false, {
                                        fileName: "[project]/printhub/src/component/shop/ShopProfileTab.tsx",
                                        lineNumber: 585,
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
                                                lineNumber: 587,
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
                                                        lineNumber: 595,
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
                                                        lineNumber: 602,
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
                                                        lineNumber: 609,
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
                                                        lineNumber: 616,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/printhub/src/component/shop/ShopProfileTab.tsx",
                                                lineNumber: 594,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/printhub/src/component/shop/ShopProfileTab.tsx",
                                        lineNumber: 586,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/printhub/src/component/shop/ShopProfileTab.tsx",
                                lineNumber: 584,
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
                                        lineNumber: 628,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: onSave,
                                        disabled: saving,
                                        className: "rounded-xl bg-[#0F2942] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#16385c] transition-colors disabled:opacity-50",
                                        children: saving ? "กำลังบันทึก..." : "บันทึกข้อมูลร้าน"
                                    }, void 0, false, {
                                        fileName: "[project]/printhub/src/component/shop/ShopProfileTab.tsx",
                                        lineNumber: 636,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/printhub/src/component/shop/ShopProfileTab.tsx",
                                lineNumber: 627,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/printhub/src/component/shop/ShopProfileTab.tsx",
                        lineNumber: 500,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/printhub/src/component/shop/ShopProfileTab.tsx",
                lineNumber: 407,
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
                            lineNumber: 652,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/printhub/src/component/shop/ShopProfileTab.tsx",
                        lineNumber: 651,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-center px-6 text-sm font-semibold text-gray-900",
                        children: "คุณจะสามารถแก้ไขข้อมูลร้านได้ เมื่อผ่านการยืนยันตัวตนจากผู้ดูแลระบบแล้ว"
                    }, void 0, false, {
                        fileName: "[project]/printhub/src/component/shop/ShopProfileTab.tsx",
                        lineNumber: 654,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/printhub/src/component/shop/ShopProfileTab.tsx",
                lineNumber: 650,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/printhub/src/component/shop/ShopProfileTab.tsx",
        lineNumber: 406,
        columnNumber: 5
    }, this);
}
_s2(ShopProfileTab, "Ci/tSD6mqUw9smCrIhY0aUBa91Y=");
_c2 = ShopProfileTab;
var _c, _c1, _c2;
__turbopack_context__.k.register(_c, "ShopAvatar");
__turbopack_context__.k.register(_c1, "TimePicker");
__turbopack_context__.k.register(_c2, "ShopProfileTab");
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
var __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$alert$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertCircle$3e$__ = __turbopack_context__.i("[project]/printhub/node_modules/lucide-react/dist/esm/icons/circle-alert.mjs [app-client] (ecmascript) <export default as AlertCircle>");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
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
// 🟢 แก้ไข: จัดกลุ่มข้อมูลให้ถูกต้องเพื่อรองรับการแสดงผลทุกรายการ
// includeEmpty = true (โหมดแก้ไข): แสดงแถวที่ยังว่างด้วย ไม่งั้นแถวที่เพิ่งกด "เพิ่ม" จะถูกซ่อนทันที
// includeEmpty = false (โหมดดู): ซ่อนแถวว่าง
const groupItems = (items, includeEmpty = false)=>{
    if (!items || items.length === 0) return [];
    const groups = [];
    items.forEach((row, idx)=>{
        if (!includeEmpty && !row.detail && !row.price && !row.group_type) return;
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
const emptyErrors = {
    groupName: {},
    row: {},
    count: 0
};
const validateService = (group)=>{
    const errors = {
        groupName: {},
        row: {},
        count: 0
    };
    if (!group.type.trim()) {
        errors.type = "กรุณาเลือกหรือกรอกประเภทบริการ";
        errors.count++;
    }
    if (group.items.length === 0) {
        errors.noItems = "กรุณาเพิ่มตัวเลือกอย่างน้อย 1 รายการ";
        errors.count++;
    }
    for (const grp of groupItems(group.items, true)){
        if (!grp.name.trim()) {
            errors.groupName[grp.rows[0].idx] = "กรุณากรอกชื่อกลุ่มตัวเลือก เช่น ขนาดกระดาษ";
            errors.count++;
        }
        const seen = new Set();
        for (const { row, idx } of grp.rows){
            const rowErr = {};
            const detail = row.detail.trim();
            if (!detail) rowErr.detail = "กรุณากรอกรายละเอียด เช่น A4 ขาวดำ";
            else if (seen.has(detail)) rowErr.detail = "รายการนี้ซ้ำในกลุ่มเดียวกัน";
            else seen.add(detail);
            const priceStr = String(row.price ?? "").trim();
            if (!priceStr) rowErr.price = "กรุณากรอกราคา";
            else if (!Number.isFinite(Number(priceStr)) || Number(priceStr) < 0) rowErr.price = "ราคาต้องเป็นตัวเลขตั้งแต่ 0 ขึ้นไป";
            if (rowErr.detail || rowErr.price) {
                errors.row[idx] = rowErr;
                errors.count += (rowErr.detail ? 1 : 0) + (rowErr.price ? 1 : 0);
            }
        }
    }
    return errors;
};
const validateAll = (services)=>{
    const seenTypes = new Set();
    return services.map((s)=>{
        const errors = validateService(s);
        const type = s.type.trim();
        if (type) {
            if (seenTypes.has(type) && !errors.type) {
                errors.type = "ประเภทบริการนี้ถูกเพิ่มไว้แล้ว";
                errors.count++;
            }
            seenTypes.add(type);
        }
        return errors;
    });
};
// มีข้อผิดพลาดที่ต้องแก้ก่อนเพิ่มแถว/กลุ่มต่อหรือไม่ (ไม่นับ noItems เพราะต้องเพิ่มแถวถึงจะแก้ได้)
const hasFieldErrors = (e)=>!!e.type || Object.keys(e.groupName).length > 0 || Object.keys(e.row).length > 0;
// เลื่อน index ของ state ที่ key ด้วยตำแหน่ง เมื่อมีการลบรายการออก
const shiftIndexMap = (prev, removed)=>{
    const next = {};
    Object.entries(prev).forEach(([k, v])=>{
        const n = Number(k);
        if (n < removed) next[n] = v;
        else if (n > removed) next[n - 1] = v;
    });
    return next;
};
const FieldError = ({ message })=>message ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
        "data-field-error": true,
        className: "mt-1 flex items-center gap-1 text-xs font-medium text-rose-500",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$alert$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertCircle$3e$__["AlertCircle"], {
                size: 12,
                className: "shrink-0"
            }, void 0, false, {
                fileName: "[project]/printhub/src/component/shop/ShopServiceTab.tsx",
                lineNumber: 214,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            message
        ]
    }, void 0, true, {
        fileName: "[project]/printhub/src/component/shop/ShopServiceTab.tsx",
        lineNumber: 210,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0)) : null;
_c1 = FieldError;
function ShopServicesTab({ isVerified, services, setServices, onSave, saving }) {
    _s();
    const [isEditing, setIsEditing] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [customTypeIndexes, setCustomTypeIndexes] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({});
    // แสดง error หลังผู้ใช้พยายามบันทึกแล้ว หรือหลังกดเพิ่มแถว/กลุ่มทั้งที่ยังกรอกไม่ครบ (แยกตามประเภทบริการ)
    const [attemptedSave, setAttemptedSave] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [errorScope, setErrorScope] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({});
    const editRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const allErrors = (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "ShopServicesTab.useMemo[allErrors]": ()=>validateAll(services)
    }["ShopServicesTab.useMemo[allErrors]"], [
        services
    ]);
    const totalErrors = allErrors.reduce((sum, e)=>sum + e.count, 0);
    // โฟกัส + เลื่อนหน้าจอไปที่ช่องแรกที่ยังไม่ถูกต้อง
    const focusFirstInvalid = (serviceIndex)=>{
        setTimeout(()=>{
            const scope = serviceIndex !== undefined ? `[data-service="${serviceIndex}"] ` : "";
            const el = editRef.current?.querySelector(`${scope}[aria-invalid="true"]`) ?? editRef.current?.querySelector(`${scope}[data-field-error]`);
            el?.focus?.();
            el?.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });
        }, 50);
    };
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
        setCustomTypeIndexes((prev)=>shiftIndexMap(prev, index));
        setErrorScope((prev)=>shiftIndexMap(prev, index));
    };
    const updateServiceType = (index, selectedValue)=>{
        if (selectedValue === OTHER_OPTION) {
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
    const renameGroup = (groupIndex, grpRows, newName)=>{
        const targetIndices = new Set(grpRows.map((item)=>item.idx));
        setServices((prev)=>prev.map((g, i)=>{
                if (i !== groupIndex) return g;
                return {
                    ...g,
                    items: g.items.map((r, rIdx)=>targetIndices.has(rIdx) ? {
                            ...r,
                            group_type: newName
                        } : r)
                };
            }));
    };
    // เพิ่มตัวเลือกในกลุ่มเดียวกัน: ต้องตั้งชื่อกลุ่มและกรอกแถวที่มีอยู่ให้ครบก่อน
    const addRowToGroup = (groupIndex, grp)=>{
        const err = allErrors[groupIndex] ?? emptyErrors;
        const groupHasError = !!err.groupName[grp.rows[0].idx] || grp.rows.some((r)=>!!err.row[r.idx]);
        if (groupHasError) {
            setErrorScope((prev)=>({
                    ...prev,
                    [groupIndex]: true
                }));
            focusFirstInvalid(groupIndex);
            return;
        }
        setServices((prev)=>prev.map((g, i)=>i === groupIndex ? {
                    ...g,
                    items: [
                        ...g.items,
                        {
                            detail: "",
                            group_type: grp.name,
                            price: ""
                        }
                    ]
                } : g));
    };
    // เพิ่มกลุ่มตัวเลือกใหม่: ต้องเลือกประเภทบริการและกรอกกลุ่ม/รายการเดิมให้ครบก่อน
    const addNewGroup = (groupIndex)=>{
        const err = allErrors[groupIndex] ?? emptyErrors;
        if (hasFieldErrors(err)) {
            setErrorScope((prev)=>({
                    ...prev,
                    [groupIndex]: true
                }));
            focusFirstInvalid(groupIndex);
            return;
        }
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
    const removeGroup = (groupIndex, grpRows)=>{
        const targetIndices = new Set(grpRows.map((item)=>item.idx));
        setServices((prev)=>prev.map((g, i)=>{
                if (i !== groupIndex) return g;
                return {
                    ...g,
                    items: g.items.filter((_, rIdx)=>!targetIndices.has(rIdx))
                };
            }));
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
    const resetValidation = ()=>{
        setAttemptedSave(false);
        setErrorScope({});
    };
    const handleSave = async ()=>{
        if (totalErrors > 0) {
            setAttemptedSave(true);
            focusFirstInvalid();
            return;
        }
        const ok = await onSave();
        if (ok) {
            setIsEditing(false); // บันทึกไม่สำเร็จ -> อยู่โหมดแก้ไขต่อ ข้อมูลที่กรอกไม่หาย
            resetValidation();
        }
    };
    const handleCancel = ()=>{
        setIsEditing(false);
        resetValidation();
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
                                        lineNumber: 437,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-xs text-slate-500",
                                        children: "กำหนดประเภทการพิมพ์ ขนาดกระดาษ ตัวเลือกเสริม และราคาสำหรับผู้ใช้งาน"
                                    }, void 0, false, {
                                        fileName: "[project]/printhub/src/component/shop/ShopServiceTab.tsx",
                                        lineNumber: 438,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/printhub/src/component/shop/ShopServiceTab.tsx",
                                lineNumber: 436,
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
                                        lineNumber: 448,
                                        columnNumber: 15
                                    }, this),
                                    "แก้ไขบริการ"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/printhub/src/component/shop/ShopServiceTab.tsx",
                                lineNumber: 443,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/printhub/src/component/shop/ShopServiceTab.tsx",
                        lineNumber: 435,
                        columnNumber: 9
                    }, this),
                    !isEditing ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-6",
                        children: services.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "py-8 text-center text-sm text-slate-400",
                            children: "ยังไม่มีข้อมูลบริการพิมพ์"
                        }, void 0, false, {
                            fileName: "[project]/printhub/src/component/shop/ShopServiceTab.tsx",
                            lineNumber: 458,
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
                                                lineNumber: 470,
                                                columnNumber: 23
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-sm font-bold text-[#0F2942]",
                                                children: group.type || "ไม่ระบุประเภทบริการ"
                                            }, void 0, false, {
                                                fileName: "[project]/printhub/src/component/shop/ShopServiceTab.tsx",
                                                lineNumber: 471,
                                                columnNumber: 23
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/printhub/src/component/shop/ShopServiceTab.tsx",
                                        lineNumber: 469,
                                        columnNumber: 21
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "p-4 space-y-4",
                                        children: groupedRows.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "py-3 text-center text-xs text-slate-400",
                                            children: "ไม่มีตัวเลือกย่อยในบริการนี้"
                                        }, void 0, false, {
                                            fileName: "[project]/printhub/src/component/shop/ShopServiceTab.tsx",
                                            lineNumber: 478,
                                            columnNumber: 25
                                        }, this) : groupedRows.map((grp, grpIdx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "rounded-lg border border-slate-100 bg-slate-50/50 p-3 space-y-2",
                                                children: [
                                                    grp.name ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex items-center gap-1.5 text-xs font-semibold text-slate-600",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$tag$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Tag$3e$__["Tag"], {
                                                                size: 12,
                                                                className: "text-slate-400"
                                                            }, void 0, false, {
                                                                fileName: "[project]/printhub/src/component/shop/ShopServiceTab.tsx",
                                                                lineNumber: 489,
                                                                columnNumber: 33
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                children: grp.name
                                                            }, void 0, false, {
                                                                fileName: "[project]/printhub/src/component/shop/ShopServiceTab.tsx",
                                                                lineNumber: 490,
                                                                columnNumber: 33
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/printhub/src/component/shop/ShopServiceTab.tsx",
                                                        lineNumber: 488,
                                                        columnNumber: 31
                                                    }, this) : null,
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
                                                                        lineNumber: 500,
                                                                        columnNumber: 35
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "font-semibold text-[#0F2942]",
                                                                        children: row.price ? `${row.price} บาท` : "0 บาท"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/printhub/src/component/shop/ShopServiceTab.tsx",
                                                                        lineNumber: 501,
                                                                        columnNumber: 35
                                                                    }, this)
                                                                ]
                                                            }, row.id || `row-${idx}`, true, {
                                                                fileName: "[project]/printhub/src/component/shop/ShopServiceTab.tsx",
                                                                lineNumber: 496,
                                                                columnNumber: 33
                                                            }, this))
                                                    }, void 0, false, {
                                                        fileName: "[project]/printhub/src/component/shop/ShopServiceTab.tsx",
                                                        lineNumber: 494,
                                                        columnNumber: 29
                                                    }, this)
                                                ]
                                            }, `view-group-${grpIdx}`, true, {
                                                fileName: "[project]/printhub/src/component/shop/ShopServiceTab.tsx",
                                                lineNumber: 483,
                                                columnNumber: 27
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/printhub/src/component/shop/ShopServiceTab.tsx",
                                        lineNumber: 476,
                                        columnNumber: 21
                                    }, this)
                                ]
                            }, group.id || `service-${gIdx}`, true, {
                                fileName: "[project]/printhub/src/component/shop/ShopServiceTab.tsx",
                                lineNumber: 465,
                                columnNumber: 19
                            }, this);
                        })
                    }, void 0, false, {
                        fileName: "[project]/printhub/src/component/shop/ShopServiceTab.tsx",
                        lineNumber: 456,
                        columnNumber: 11
                    }, this) : /* Edit Mode */ /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        ref: editRef,
                        className: "space-y-6",
                        children: [
                            services.map((group, gIdx)=>{
                                const groupedRows = groupItems(group.items, true);
                                const isPreset = SERVICE_TYPE_TEMPLATES.includes(group.type);
                                const isCustomMode = customTypeIndexes[gIdx] || !isPreset && group.type !== "";
                                const selectValue = isCustomMode ? OTHER_OPTION : group.type;
                                const err = allErrors[gIdx] ?? emptyErrors;
                                const showErr = attemptedSave || !!errorScope[gIdx];
                                const typeErr = showErr ? err.type : undefined;
                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    "data-service": gIdx,
                                    className: `rounded-xl border overflow-hidden ${showErr && err.count > 0 ? "border-rose-200" : "border-slate-200"}`,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex flex-col gap-2 bg-slate-50 px-4 py-3 border-b border-slate-200 sm:flex-row sm:items-start",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex-1",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex items-center gap-2",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                                    value: selectValue,
                                                                    onChange: (e)=>updateServiceType(gIdx, e.target.value),
                                                                    "aria-invalid": !!typeErr,
                                                                    className: `flex-1 rounded-lg border bg-white px-2.5 py-1.5 text-sm font-semibold text-slate-900 outline-none ${typeErr ? "border-rose-400 focus:border-rose-500" : "border-slate-200 focus:border-[#2F6FED]"}`,
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                            value: "",
                                                                            disabled: true,
                                                                            children: "เลือกประเภทบริการ"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/printhub/src/component/shop/ShopServiceTab.tsx",
                                                                            lineNumber: 550,
                                                                            columnNumber: 27
                                                                        }, this),
                                                                        SERVICE_TYPE_TEMPLATES.map((t)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                                value: t,
                                                                                children: t
                                                                            }, t, false, {
                                                                                fileName: "[project]/printhub/src/component/shop/ShopServiceTab.tsx",
                                                                                lineNumber: 554,
                                                                                columnNumber: 29
                                                                            }, this)),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                            value: OTHER_OPTION,
                                                                            children: "อื่นๆ (กำหนดเอง)"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/printhub/src/component/shop/ShopServiceTab.tsx",
                                                                            lineNumber: 558,
                                                                            columnNumber: 27
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/printhub/src/component/shop/ShopServiceTab.tsx",
                                                                    lineNumber: 540,
                                                                    columnNumber: 25
                                                                }, this),
                                                                isCustomMode && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                    value: group.type,
                                                                    onChange: (e)=>setServices((prev)=>prev.map((g, i)=>i === gIdx ? {
                                                                                    ...g,
                                                                                    type: e.target.value
                                                                                } : g)),
                                                                    placeholder: "พิมพ์ระบุประเภทบริการเอง...",
                                                                    autoFocus: true,
                                                                    "aria-invalid": !!typeErr,
                                                                    className: `flex-1 rounded-lg border bg-white px-2.5 py-1.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none ${typeErr ? "border-rose-400 focus:border-rose-500" : "border-slate-200 focus:border-[#2F6FED]"}`
                                                                }, void 0, false, {
                                                                    fileName: "[project]/printhub/src/component/shop/ShopServiceTab.tsx",
                                                                    lineNumber: 562,
                                                                    columnNumber: 27
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/printhub/src/component/shop/ShopServiceTab.tsx",
                                                            lineNumber: 539,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(FieldError, {
                                                            message: typeErr
                                                        }, void 0, false, {
                                                            fileName: "[project]/printhub/src/component/shop/ShopServiceTab.tsx",
                                                            lineNumber: 580,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/printhub/src/component/shop/ShopServiceTab.tsx",
                                                    lineNumber: 538,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    type: "button",
                                                    onClick: ()=>removeServiceType(gIdx),
                                                    className: "self-end text-slate-300 hover:text-rose-500 transition-colors sm:mt-2 sm:self-start",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__["Trash2"], {
                                                        size: 16
                                                    }, void 0, false, {
                                                        fileName: "[project]/printhub/src/component/shop/ShopServiceTab.tsx",
                                                        lineNumber: 588,
                                                        columnNumber: 23
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/printhub/src/component/shop/ShopServiceTab.tsx",
                                                    lineNumber: 583,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/printhub/src/component/shop/ShopServiceTab.tsx",
                                            lineNumber: 537,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "p-4 space-y-3",
                                            children: [
                                                groupedRows.map((grp, grpIdx)=>{
                                                    const nameErr = showErr ? err.groupName[grp.rows[0].idx] : undefined;
                                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: `rounded-lg border bg-slate-50/40 overflow-hidden ${nameErr ? "border-rose-300" : "border-slate-200"}`,
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "bg-white px-3 py-2 border-b border-slate-100",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "flex items-center gap-2",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$tag$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Tag$3e$__["Tag"], {
                                                                                size: 13,
                                                                                className: "text-slate-300 shrink-0"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/printhub/src/component/shop/ShopServiceTab.tsx",
                                                                                lineNumber: 605,
                                                                                columnNumber: 31
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                                value: grp.name,
                                                                                onChange: (e)=>renameGroup(gIdx, grp.rows, e.target.value),
                                                                                placeholder: "ชื่อกลุ่ม เช่น ขนาดกระดาษ",
                                                                                "aria-invalid": !!nameErr,
                                                                                className: `flex-1 bg-transparent text-xs font-semibold outline-none ${nameErr ? "text-rose-600 placeholder:text-rose-300" : "text-slate-700 placeholder:text-slate-300"}`
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/printhub/src/component/shop/ShopServiceTab.tsx",
                                                                                lineNumber: 606,
                                                                                columnNumber: 31
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                                type: "button",
                                                                                onClick: ()=>removeGroup(gIdx, grp.rows),
                                                                                className: "text-slate-300 hover:text-rose-500 transition-colors",
                                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__["Trash2"], {
                                                                                    size: 13
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/printhub/src/component/shop/ShopServiceTab.tsx",
                                                                                    lineNumber: 622,
                                                                                    columnNumber: 33
                                                                                }, this)
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/printhub/src/component/shop/ShopServiceTab.tsx",
                                                                                lineNumber: 617,
                                                                                columnNumber: 31
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/printhub/src/component/shop/ShopServiceTab.tsx",
                                                                        lineNumber: 604,
                                                                        columnNumber: 29
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(FieldError, {
                                                                        message: nameErr
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/printhub/src/component/shop/ShopServiceTab.tsx",
                                                                        lineNumber: 625,
                                                                        columnNumber: 29
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/printhub/src/component/shop/ShopServiceTab.tsx",
                                                                lineNumber: 603,
                                                                columnNumber: 27
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "divide-y divide-slate-100",
                                                                children: grp.rows.map(({ row, idx })=>{
                                                                    const rowErr = showErr ? err.row[idx] : undefined;
                                                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "px-3 py-2",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: "flex items-center gap-2",
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                                        value: row.detail,
                                                                                        onChange: (e)=>updateRow(gIdx, idx, "detail", e.target.value),
                                                                                        placeholder: "เช่น A4 ขาวดำ",
                                                                                        "aria-invalid": !!rowErr?.detail,
                                                                                        className: `flex-1 rounded-md border bg-white px-2.5 py-1.5 text-sm text-slate-900 outline-none ${rowErr?.detail ? "border-rose-400 focus:border-rose-500" : "border-slate-200 focus:border-[#2F6FED]"}`
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/printhub/src/component/shop/ShopServiceTab.tsx",
                                                                                        lineNumber: 635,
                                                                                        columnNumber: 37
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                        className: `flex w-28 shrink-0 items-center gap-1 rounded-md border bg-white px-2.5 py-1.5 ${rowErr?.price ? "border-rose-400" : "border-slate-200"}`,
                                                                                        children: [
                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                                                value: row.price,
                                                                                                onChange: (e)=>updateRow(gIdx, idx, "price", e.target.value),
                                                                                                placeholder: "0",
                                                                                                inputMode: "decimal",
                                                                                                "aria-invalid": !!rowErr?.price,
                                                                                                className: "w-full bg-transparent text-right text-sm font-semibold text-slate-900 outline-none"
                                                                                            }, void 0, false, {
                                                                                                fileName: "[project]/printhub/src/component/shop/ShopServiceTab.tsx",
                                                                                                lineNumber: 651,
                                                                                                columnNumber: 39
                                                                                            }, this),
                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                className: "text-xs text-slate-400",
                                                                                                children: "บาท"
                                                                                            }, void 0, false, {
                                                                                                fileName: "[project]/printhub/src/component/shop/ShopServiceTab.tsx",
                                                                                                lineNumber: 659,
                                                                                                columnNumber: 39
                                                                                            }, this)
                                                                                        ]
                                                                                    }, void 0, true, {
                                                                                        fileName: "[project]/printhub/src/component/shop/ShopServiceTab.tsx",
                                                                                        lineNumber: 646,
                                                                                        columnNumber: 37
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                                        type: "button",
                                                                                        onClick: ()=>removeRow(gIdx, idx),
                                                                                        className: "shrink-0 p-1 text-slate-300 hover:text-rose-500 transition-colors",
                                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__["Trash2"], {
                                                                                            size: 13
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/printhub/src/component/shop/ShopServiceTab.tsx",
                                                                                            lineNumber: 666,
                                                                                            columnNumber: 39
                                                                                        }, this)
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/printhub/src/component/shop/ShopServiceTab.tsx",
                                                                                        lineNumber: 661,
                                                                                        columnNumber: 37
                                                                                    }, this)
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/printhub/src/component/shop/ShopServiceTab.tsx",
                                                                                lineNumber: 634,
                                                                                columnNumber: 35
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(FieldError, {
                                                                                message: rowErr?.detail
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/printhub/src/component/shop/ShopServiceTab.tsx",
                                                                                lineNumber: 669,
                                                                                columnNumber: 35
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(FieldError, {
                                                                                message: rowErr?.price
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/printhub/src/component/shop/ShopServiceTab.tsx",
                                                                                lineNumber: 670,
                                                                                columnNumber: 35
                                                                            }, this)
                                                                        ]
                                                                    }, row.id || `item-${idx}`, true, {
                                                                        fileName: "[project]/printhub/src/component/shop/ShopServiceTab.tsx",
                                                                        lineNumber: 633,
                                                                        columnNumber: 33
                                                                    }, this);
                                                                })
                                                            }, void 0, false, {
                                                                fileName: "[project]/printhub/src/component/shop/ShopServiceTab.tsx",
                                                                lineNumber: 628,
                                                                columnNumber: 27
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                type: "button",
                                                                onClick: ()=>addRowToGroup(gIdx, grp),
                                                                className: "flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-[#2F6FED] hover:underline",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                                                                        size: 12
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/printhub/src/component/shop/ShopServiceTab.tsx",
                                                                        lineNumber: 681,
                                                                        columnNumber: 29
                                                                    }, this),
                                                                    " เพิ่มตัวเลือกในกลุ่มนี้"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/printhub/src/component/shop/ShopServiceTab.tsx",
                                                                lineNumber: 676,
                                                                columnNumber: 27
                                                            }, this)
                                                        ]
                                                    }, `edit-group-${grpIdx}`, true, {
                                                        fileName: "[project]/printhub/src/component/shop/ShopServiceTab.tsx",
                                                        lineNumber: 597,
                                                        columnNumber: 25
                                                    }, this);
                                                }),
                                                showErr && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(FieldError, {
                                                    message: err.noItems
                                                }, void 0, false, {
                                                    fileName: "[project]/printhub/src/component/shop/ShopServiceTab.tsx",
                                                    lineNumber: 687,
                                                    columnNumber: 33
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    type: "button",
                                                    onClick: ()=>addNewGroup(gIdx),
                                                    className: "flex w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-slate-300 py-2.5 text-xs font-semibold text-slate-500 hover:border-[#2F6FED] hover:text-[#2F6FED] transition-colors",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                                                            size: 14
                                                        }, void 0, false, {
                                                            fileName: "[project]/printhub/src/component/shop/ShopServiceTab.tsx",
                                                            lineNumber: 694,
                                                            columnNumber: 23
                                                        }, this),
                                                        " เพิ่มกลุ่มตัวเลือกใหม่"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/printhub/src/component/shop/ShopServiceTab.tsx",
                                                    lineNumber: 689,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/printhub/src/component/shop/ShopServiceTab.tsx",
                                            lineNumber: 592,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, group.id || `edit-service-${gIdx}`, true, {
                                    fileName: "[project]/printhub/src/component/shop/ShopServiceTab.tsx",
                                    lineNumber: 530,
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
                                        lineNumber: 706,
                                        columnNumber: 15
                                    }, this),
                                    " เพิ่มประเภทบริการ"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/printhub/src/component/shop/ShopServiceTab.tsx",
                                lineNumber: 701,
                                columnNumber: 13
                            }, this),
                            attemptedSave && totalErrors > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                role: "alert",
                                className: "flex items-start gap-2 rounded-lg border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-sm text-rose-600",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$alert$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertCircle$3e$__["AlertCircle"], {
                                        size: 16,
                                        className: "mt-0.5 shrink-0"
                                    }, void 0, false, {
                                        fileName: "[project]/printhub/src/component/shop/ShopServiceTab.tsx",
                                        lineNumber: 714,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: [
                                            "กรุณากรอกข้อมูลให้ครบถ้วนก่อนบันทึก (เหลือ ",
                                            totalErrors,
                                            " จุดที่ต้องแก้ไข)"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/printhub/src/component/shop/ShopServiceTab.tsx",
                                        lineNumber: 715,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/printhub/src/component/shop/ShopServiceTab.tsx",
                                lineNumber: 710,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex justify-end gap-3 border-t border-slate-100 pt-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        onClick: handleCancel,
                                        className: "flex items-center gap-1.5 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                                size: 15
                                            }, void 0, false, {
                                                fileName: "[project]/printhub/src/component/shop/ShopServiceTab.tsx",
                                                lineNumber: 728,
                                                columnNumber: 17
                                            }, this),
                                            " ยกเลิก"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/printhub/src/component/shop/ShopServiceTab.tsx",
                                        lineNumber: 723,
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
                                                lineNumber: 736,
                                                columnNumber: 17
                                            }, this),
                                            saving ? "กำลังบันทึก..." : "บันทึกบริการพิมพ์"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/printhub/src/component/shop/ShopServiceTab.tsx",
                                        lineNumber: 730,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/printhub/src/component/shop/ShopServiceTab.tsx",
                                lineNumber: 722,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/printhub/src/component/shop/ShopServiceTab.tsx",
                        lineNumber: 518,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/printhub/src/component/shop/ShopServiceTab.tsx",
                lineNumber: 429,
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
                            lineNumber: 748,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/printhub/src/component/shop/ShopServiceTab.tsx",
                        lineNumber: 747,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-center px-6 text-sm font-semibold text-slate-900",
                        children: "คุณจะสามารถแก้ไขบริการพิมพ์ได้ เมื่อผ่านการยืนยันตัวตนจากผู้ดูแลระบบแล้ว"
                    }, void 0, false, {
                        fileName: "[project]/printhub/src/component/shop/ShopServiceTab.tsx",
                        lineNumber: 750,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/printhub/src/component/shop/ShopServiceTab.tsx",
                lineNumber: 746,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/printhub/src/component/shop/ShopServiceTab.tsx",
        lineNumber: 428,
        columnNumber: 5
    }, this);
}
_s(ShopServicesTab, "eEg40Mk08aRozQqa0zHQfk5FOoU=");
_c2 = ShopServicesTab;
var _c, _c1, _c2;
__turbopack_context__.k.register(_c, "SERVICE_TYPE_TEMPLATES");
__turbopack_context__.k.register(_c1, "FieldError");
__turbopack_context__.k.register(_c2, "ShopServicesTab");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/printhub/src/component/shop/Shopbankconfirmmodal.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ShopBankConfirmModal
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/printhub/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__ = __turbopack_context__.i("[project]/printhub/node_modules/lucide-react/dist/esm/icons/loader-circle.mjs [app-client] (ecmascript) <export default as Loader2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__ = __turbopack_context__.i("[project]/printhub/node_modules/lucide-react/dist/esm/icons/triangle-alert.mjs [app-client] (ecmascript) <export default as AlertTriangle>");
"use client";
;
;
function ShopBankConfirmModal({ saving, onConfirm, onCancel }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "w-full max-w-md rounded-2xl bg-white p-6 shadow-xl",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center gap-3.5 mb-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-amber-50 text-amber-600 ring-1 ring-amber-600/20",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__["AlertTriangle"], {
                                size: 24
                            }, void 0, false, {
                                fileName: "[project]/printhub/src/component/shop/Shopbankconfirmmodal.tsx",
                                lineNumber: 21,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/printhub/src/component/shop/Shopbankconfirmmodal.tsx",
                            lineNumber: 20,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    className: "text-base font-bold text-[#0F2942]",
                                    children: "ยืนยันการเปลี่ยนข้อมูลบัญชีธนาคาร"
                                }, void 0, false, {
                                    fileName: "[project]/printhub/src/component/shop/Shopbankconfirmmodal.tsx",
                                    lineNumber: 24,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-xs text-slate-400",
                                    children: "การเปลี่ยนแปลงข้อมูลธุรกรรมทางการเงิน"
                                }, void 0, false, {
                                    fileName: "[project]/printhub/src/component/shop/Shopbankconfirmmodal.tsx",
                                    lineNumber: 27,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/printhub/src/component/shop/Shopbankconfirmmodal.tsx",
                            lineNumber: 23,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/printhub/src/component/shop/Shopbankconfirmmodal.tsx",
                    lineNumber: 19,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-sm leading-relaxed text-slate-600 mb-6 bg-slate-50 p-4 rounded-xl border border-slate-100",
                    children: "คุณยืนยันที่จะเปลี่ยนข้อมูลธุรกรรมทางการเงินใช่หรือไม่ หากยืนยันคุณจะไม่สามารถแก้ไขข้อมูลอะไรได้จนกว่าจะได้รับการยืนยันจากแอดมิน"
                }, void 0, false, {
                    fileName: "[project]/printhub/src/component/shop/Shopbankconfirmmodal.tsx",
                    lineNumber: 33,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex justify-end gap-3",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            type: "button",
                            onClick: onCancel,
                            disabled: saving,
                            className: "rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-500 transition-colors hover:border-slate-300 hover:text-slate-700 disabled:opacity-50",
                            children: "ยกเลิก"
                        }, void 0, false, {
                            fileName: "[project]/printhub/src/component/shop/Shopbankconfirmmodal.tsx",
                            lineNumber: 38,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            type: "button",
                            onClick: onConfirm,
                            disabled: saving,
                            className: "flex items-center gap-2 rounded-xl bg-amber-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-amber-700 disabled:opacity-50",
                            children: [
                                saving && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                                    size: 16,
                                    className: "animate-spin"
                                }, void 0, false, {
                                    fileName: "[project]/printhub/src/component/shop/Shopbankconfirmmodal.tsx",
                                    lineNumber: 52,
                                    columnNumber: 24
                                }, this),
                                saving ? "กำลังบันทึก..." : "ยืนยันการเปลี่ยนแปลง"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/printhub/src/component/shop/Shopbankconfirmmodal.tsx",
                            lineNumber: 46,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/printhub/src/component/shop/Shopbankconfirmmodal.tsx",
                    lineNumber: 37,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/printhub/src/component/shop/Shopbankconfirmmodal.tsx",
            lineNumber: 18,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/printhub/src/component/shop/Shopbankconfirmmodal.tsx",
        lineNumber: 17,
        columnNumber: 5
    }, this);
}
_c = ShopBankConfirmModal;
var _c;
__turbopack_context__.k.register(_c, "ShopBankConfirmModal");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/printhub/src/component/shop/Shoplocationcomfirmmodal.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ShopLocationConfirmModal
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/printhub/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/printhub/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$shared$2f$lib$2f$app$2d$dynamic$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/printhub/node_modules/next/dist/shared/lib/app-dynamic.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2d$pin$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MapPin$3e$__ = __turbopack_context__.i("[project]/printhub/node_modules/lucide-react/dist/esm/icons/map-pin.mjs [app-client] (ecmascript) <export default as MapPin>");
var __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__ = __turbopack_context__.i("[project]/printhub/node_modules/lucide-react/dist/esm/icons/loader-circle.mjs [app-client] (ecmascript) <export default as Loader2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/printhub/node_modules/lucide-react/dist/esm/icons/x.mjs [app-client] (ecmascript) <export default as X>");
;
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
// Leaflet ใช้ window → ต้องปิด SSR
const LocationPicker = (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$shared$2f$lib$2f$app$2d$dynamic$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(()=>__turbopack_context__.A("[project]/printhub/src/component/shop/Shoploactionpicker.tsx [app-client] (ecmascript, next/dynamic entry, async loader)"), {
    loadableGenerated: {
        modules: [
            "[project]/printhub/src/component/shop/Shoploactionpicker.tsx [app-client] (ecmascript, next/dynamic entry)"
        ]
    },
    ssr: false,
    loading: ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            style: {
                height: 380
            },
            className: "flex items-center justify-center bg-slate-50 text-sm text-slate-400",
            children: "กำลังโหลดแผนที่..."
        }, void 0, false, {
            fileName: "[project]/printhub/src/component/shop/Shoplocationcomfirmmodal.tsx",
            lineNumber: 11,
            columnNumber: 5
        }, ("TURBOPACK compile-time value", void 0))
});
_c = LocationPicker;
function ShopLocationConfirmModal({ initialLocation, saving, onConfirm, onCancel }) {
    _s();
    // ask  = ถามว่าบริเวณนี้ใช่ที่อยู่ร้านไหม (หมุดอยู่ที่พิกัดเดิม)
    // pick = ให้ปักหมุดใหม่ (ลาก / แตะ / ค้นหา)
    const [stage, setStage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(initialLocation ? "ask" : "pick");
    const [selected, setSelected] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(initialLocation);
    // ผู้ใช้ลาก/แตะ/ค้นหา = กำลังปักหมุดใหม่ → สลับเป็นโหมด pick อัตโนมัติ
    const handleChange = (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ShopLocationConfirmModal.useCallback[handleChange]": (pos)=>{
            setSelected(pos);
            setStage("pick");
        }
    }["ShopLocationConfirmModal.useCallback[handleChange]"], []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "fixed inset-0 z-[2000] flex items-center justify-center bg-slate-900/50 p-4",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-start justify-between gap-4 border-b border-slate-100 px-6 py-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-start gap-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#EAF1FF] text-[#2F6FED]",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2d$pin$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MapPin$3e$__["MapPin"], {
                                        size: 18
                                    }, void 0, false, {
                                        fileName: "[project]/printhub/src/component/shop/Shoplocationcomfirmmodal.tsx",
                                        lineNumber: 55,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/printhub/src/component/shop/Shoplocationcomfirmmodal.tsx",
                                    lineNumber: 54,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-sm font-bold text-[#0F2942]",
                                            children: stage === "ask" ? "บริเวณนี้คือที่อยู่ร้านของคุณใช่หรือไม่?" : "ปักหมุดตำแหน่งร้านของคุณ"
                                        }, void 0, false, {
                                            fileName: "[project]/printhub/src/component/shop/Shoplocationcomfirmmodal.tsx",
                                            lineNumber: 58,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "mt-0.5 text-xs text-slate-400",
                                            children: stage === "ask" ? "คุณเพิ่งแก้ไขที่อยู่ ตรวจสอบว่าหมุดอยู่ตรงกับร้านของคุณ" : "ลากหมุด แตะบนแผนที่ หรือค้นหาสถานที่ แล้วกดยืนยัน"
                                        }, void 0, false, {
                                            fileName: "[project]/printhub/src/component/shop/Shoplocationcomfirmmodal.tsx",
                                            lineNumber: 63,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/printhub/src/component/shop/Shoplocationcomfirmmodal.tsx",
                                    lineNumber: 57,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/printhub/src/component/shop/Shoplocationcomfirmmodal.tsx",
                            lineNumber: 53,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            type: "button",
                            onClick: onCancel,
                            disabled: saving,
                            "aria-label": "ปิด",
                            className: "rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-50 hover:text-slate-600 disabled:opacity-50",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                size: 18
                            }, void 0, false, {
                                fileName: "[project]/printhub/src/component/shop/Shoplocationcomfirmmodal.tsx",
                                lineNumber: 77,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/printhub/src/component/shop/Shoplocationcomfirmmodal.tsx",
                            lineNumber: 70,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/printhub/src/component/shop/Shoplocationcomfirmmodal.tsx",
                    lineNumber: 52,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(LocationPicker, {
                    initialPosition: initialLocation,
                    onChange: handleChange,
                    height: 380
                }, void 0, false, {
                    fileName: "[project]/printhub/src/component/shop/Shoplocationcomfirmmodal.tsx",
                    lineNumber: 81,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex justify-end gap-3 border-t border-slate-100 px-6 py-4",
                    children: stage === "ask" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                onClick: ()=>setStage("pick"),
                                disabled: saving,
                                className: "rounded-xl border border-slate-200 px-6 py-2.5 text-sm font-semibold text-slate-600 transition-colors hover:border-slate-300 disabled:opacity-50",
                                children: "ไม่ใช่ ปักหมุดใหม่"
                            }, void 0, false, {
                                fileName: "[project]/printhub/src/component/shop/Shoplocationcomfirmmodal.tsx",
                                lineNumber: 90,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                onClick: ()=>selected && onConfirm(selected),
                                disabled: saving || !selected,
                                className: "flex items-center gap-2 rounded-xl bg-[#0F2942] px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#16385c] disabled:opacity-50",
                                children: [
                                    saving && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                                        size: 15,
                                        className: "animate-spin"
                                    }, void 0, false, {
                                        fileName: "[project]/printhub/src/component/shop/Shoplocationcomfirmmodal.tsx",
                                        lineNumber: 104,
                                        columnNumber: 28
                                    }, this),
                                    saving ? "กำลังบันทึก..." : "ใช่ ใช้ตำแหน่งนี้"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/printhub/src/component/shop/Shoplocationcomfirmmodal.tsx",
                                lineNumber: 98,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/printhub/src/component/shop/Shoplocationcomfirmmodal.tsx",
                        lineNumber: 89,
                        columnNumber: 13
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                onClick: onCancel,
                                disabled: saving,
                                className: "rounded-xl border border-slate-200 px-6 py-2.5 text-sm font-semibold text-slate-500 transition-colors hover:border-slate-300 disabled:opacity-50",
                                children: "ยกเลิก"
                            }, void 0, false, {
                                fileName: "[project]/printhub/src/component/shop/Shoplocationcomfirmmodal.tsx",
                                lineNumber: 110,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                onClick: ()=>selected && onConfirm(selected),
                                disabled: saving || !selected,
                                className: "flex items-center gap-2 rounded-xl bg-[#0F2942] px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#16385c] disabled:opacity-50",
                                children: [
                                    saving && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$printhub$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                                        size: 15,
                                        className: "animate-spin"
                                    }, void 0, false, {
                                        fileName: "[project]/printhub/src/component/shop/Shoplocationcomfirmmodal.tsx",
                                        lineNumber: 124,
                                        columnNumber: 28
                                    }, this),
                                    saving ? "กำลังบันทึก..." : "ยืนยันตำแหน่งนี้และบันทึก"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/printhub/src/component/shop/Shoplocationcomfirmmodal.tsx",
                                lineNumber: 118,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/printhub/src/component/shop/Shoplocationcomfirmmodal.tsx",
                        lineNumber: 109,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/printhub/src/component/shop/Shoplocationcomfirmmodal.tsx",
                    lineNumber: 87,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/printhub/src/component/shop/Shoplocationcomfirmmodal.tsx",
            lineNumber: 51,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/printhub/src/component/shop/Shoplocationcomfirmmodal.tsx",
        lineNumber: 50,
        columnNumber: 5
    }, this);
}
_s(ShopLocationConfirmModal, "xj6GXB6hjvRUENworVrpYAE2YTw=");
_c1 = ShopLocationConfirmModal;
var _c, _c1;
__turbopack_context__.k.register(_c, "LocationPicker");
__turbopack_context__.k.register(_c1, "ShopLocationConfirmModal");
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
]);

//# sourceMappingURL=printhub_src_0vp4n17._.js.map