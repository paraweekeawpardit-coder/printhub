"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useSearchParams } from "next/navigation";
import axios from "axios";
import { Store, Printer, Landmark, Loader2 } from "lucide-react";

import ShopNavbar from "../../../../component/shop/navbar";
import ShopProfileTab from "../../../../component/shop/ShopProfileTab";
import ShopServicesTab from "../../../../component/shop/ShopServiceTab";
import ShopBankTab from "../../../../component/shop/ShopBankTab";

const API_BASE = "http://localhost:5000/shop";

// 🛠️ ตรงนี้ต้องตรงกับ key ที่ใช้ตอน login แล้วเก็บ shop_id ลง localStorage จริงๆ
const SHOP_ID_STORAGE_KEY = "shop_id";

type AddressData = {
  detail: string;
  subdistrict: string;
  district: string;
  province: string;
  postcode: string;
};

type ServiceItem = {
  id?: string;
  detail: string;
  group_type: string;
  price: string;
};

type ServiceTypeGroup = {
  id?: string;
  type: string;
  items: ServiceItem[];
};

// shop_id เป็น uuid (string) ไม่ใช่เลข ห้าม parseInt/Number เด็ดขาด
// รองรับกรณี localStorage เก็บเป็น id ดิบๆ ("cd04a0a0-...")
// หรือเก็บเป็น JSON object ทั้งก้อน (เช่น '{"id":"cd04a0a0-...", ...}')
function resolveShopId(raw: string | null): string | null {
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw);
    if (typeof parsed === "string") return parsed;
    if (parsed && typeof parsed === "object" && parsed.id != null) {
      return String(parsed.id);
    }
  } catch {
    // raw ไม่ใช่ JSON แปลว่าเป็น id ดิบๆ อยู่แล้ว
  }

  return raw;
}

export default function ShopSettingsPage() {
  // 🛠️ ถ้าโฟลเดอร์จริงไม่ได้ชื่อ [shop_id] (เช่นเป็น [shopId] แทน)
  // ต้องเปลี่ยน params?.shop_id ตรงนี้ให้ตรงชื่อโฟลเดอร์ด้วย
  const params = useParams();
  const searchParams = useSearchParams();

  const [shopId, setShopId] = useState<string | null>(null);

  useEffect(() => {
    const fromPath = params?.shop_id as string | undefined;
    const fromQuery = searchParams.get("shopId");
    const fromStorage =
      typeof window !== "undefined"
        ? window.localStorage.getItem(SHOP_ID_STORAGE_KEY)
        : null;

    const resolved = fromPath || fromQuery || resolveShopId(fromStorage);

    if (!resolved) {
      console.warn(
        `ไม่พบ shop_id ทั้งใน URL path, query (?shopId=..) และ localStorage (key: "${SHOP_ID_STORAGE_KEY}")`
      );
    }

    setShopId(resolved ?? null);
  }, [params, searchParams]);

  const [tab, setTab] = useState<string>("profile");
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);

  // Verification State
  const [isVerified, setIsVerified] = useState<boolean>(false);

  // Shop Open/Closed State (ปิดร้านชั่วคราว)
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const [togglingOpen, setTogglingOpen] = useState<boolean>(false);

  // Mode States
  const [isEditingProfile, setIsEditingProfile] = useState<boolean>(false);
  const [isEditingBank, setIsEditingBank] = useState<boolean>(false);

  const [hasProfileData, setHasProfileData] = useState<boolean>(false);
  const [hasBankData, setHasBankData] = useState<boolean>(false);

  // Shop Profile States
  const [shopName, setShopName] = useState<string>("");
  const [ownerName, setOwnerName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [openTime, setOpenTime] = useState<string>("09:00");
  const [closeTime, setCloseTime] = useState<string>("18:00");
  const [addressId, setAddressId] = useState<string | null>(null);
  const [address, setAddress] = useState<AddressData>({
    detail: "",
    subdistrict: "",
    district: "",
    province: "",
    postcode: "",
  });

  // Services State
  const [services, setServices] = useState<ServiceTypeGroup[]>([]);

  // Bank Account States
  const [bankAccountId, setBankAccountId] = useState<string | null>(null);
  const [bankName, setBankName] = useState<string>("");
  const [accountName, setAccountName] = useState<string>("");
  const [accountNumber, setAccountNumber] = useState<string>("");

  const fetchShopSettings = useCallback(async () => {
    if (!shopId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const [profileRes, bankRes, servicesRes, verifyRes] = await Promise.allSettled([
        axios.get(`${API_BASE}/profile/${shopId}`),
        axios.get(`${API_BASE}/bank-account/${shopId}`),
        axios.get(`${API_BASE}/services/${shopId}`),
        axios.get(`${API_BASE}/verify-status/${shopId}`),
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

      const shop =
        profileRes.status === "fulfilled" ? profileRes.value.data?.data : null;
      const bankAccount =
        bankRes.status === "fulfilled" ? bankRes.value.data?.data : null;
      const shopServices =
        servicesRes.status === "fulfilled" ? servicesRes.value.data?.data : null;
      const verifyStatus =
        verifyRes.status === "fulfilled" ? verifyRes.value.data?.data : null;

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
            postcode: shop.address.postcode ?? "",
          });
        }

        setHasProfileData(Boolean(shop.shop_name));
      }

      // Verification Status (เช็คค่าทั้งกรณี boolean และ string/number)
      const verified = Boolean(
        verifyStatus?.is_verify ??
          verifyStatus?.is_verified ??
          shop?.is_verified ??
          shop?.is_verify
      );
      setIsVerified(verified);

      // Services Data
      if (shopServices) {
        const normalizedServices: ServiceTypeGroup[] = shopServices.map((group: any) => ({
          id: group.id,
          type: group.type ?? "",
          items: (group.service_detail ?? []).map((d: any) => ({
            id: d.id,
            detail: d.detail ?? "",
            group_type: d.group_type ?? "",
            price: d.price != null ? String(d.price) : "",
          })),
        }));
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
    } finally {
      setLoading(false);
    }
  }, [shopId]);

  useEffect(() => {
    fetchShopSettings();
  }, [fetchShopSettings]);

  const handleSaveProfile = async () => {
    if (!shopId) return;
    try {
      setSaving(true);
      await axios.put(`${API_BASE}/profile/${shopId}`, {
        shop_name: shopName,
        owner_name: ownerName,
        phone,
        open_time: openTime,
        close_time: closeTime,
        address: {
          id: addressId,
          ...address,
        },
      });
      setHasProfileData(true);
      setIsEditingProfile(false);
      await fetchShopSettings();
    } catch (err) {
      console.error("Save profile error:", err);
    } finally {
      setSaving(false);
    }
  };

  // เปิด/ปิดร้านชั่วคราว
  const handleToggleOpen = async () => {
    if (!shopId) return;
    const nextValue = !isOpen;
    try {
      setTogglingOpen(true);
      await axios.patch(`${API_BASE}/profile/${shopId}/open-status`, {
        is_open: nextValue,
      });
      setIsOpen(nextValue);
    } catch (err) {
      console.error("Toggle shop open status error:", err);
    } finally {
      setTogglingOpen(false);
    }
  };

  const handleSaveServices = async () => {
    if (!shopId) return;
    try {
      setSaving(true);

      const payloadServices = services.map((s) => ({
        type: s.type,
        service_detail: s.items.map((item) => ({
          detail: item.detail,
          group_type: item.group_type,
          price: item.price,
        })),
      }));

      await axios.post(
        `${API_BASE}/services`,
        { services: payloadServices },
        {
          headers: {
            shop_id: shopId,
          },
        }
      );

      await fetchShopSettings();
    } catch (err) {
      console.error("Save services error:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveBank = async () => {
    if (!shopId) return;
    try {
      setSaving(true);
      await axios.put(`${API_BASE}/bank-account/${shopId}`, {
        id: bankAccountId,
        bank_name: bankName,
        account_name: accountName,
        account_number: accountNumber,
      });
      setHasBankData(true);
      setIsEditingBank(false);
      await fetchShopSettings();
    } catch (err) {
      console.error("Save bank error:", err);
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { key: "profile", label: "ข้อมูลร้าน", icon: <Store size={16} />, locked: !isVerified },
    { key: "services", label: "บริการพิมพ์", icon: <Printer size={16} />, locked: !isVerified },
    { key: "bank", label: "บัญชีธนาคาร", icon: <Landmark size={16} />, locked: !isVerified },
  ];

  return (
    <div className="min-h-screen bg-white">
      <ShopNavbar />

      <div className="mx-auto max-w-7xl px-12 py-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[#0F2942]">ตั้งค่าร้านค้า</h1>
          <p className="mt-1 text-sm text-slate-500">
            จัดการข้อมูลทั่วไป บริการพิมพ์ และบัญชีธนาคารสำหรับการรับเงิน
          </p>
        </div>

        {/* Tabs Bar */}
        <div className="mb-8 border-b border-slate-200">
          <div className="flex gap-8">
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`flex items-center gap-2 pb-3.5 text-sm font-semibold transition-colors relative ${
                  tab === t.key
                    ? "text-[#2F6FED]"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {t.icon}
                {t.label}
                {tab === t.key && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#2F6FED] rounded-full" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        {loading ? (
          <div className="py-12 text-center text-slate-500 flex items-center justify-center gap-2">
            <Loader2 className="animate-spin" size={18} />
            กำลังโหลดข้อมูล...
          </div>
        ) : !shopId ? (
          <div className="py-12 text-center text-sm text-rose-500">
            ไม่พบ shop_id ของร้านค้า กรุณาเข้าสู่ระบบใหม่อีกครั้ง
          </div>
        ) : (
          <div className="max-w-3xl">
            {tab === "profile" && (
              <ShopProfileTab
                isVerified={isVerified}
                isOpen={isOpen}
                onToggleOpen={handleToggleOpen}
                togglingOpen={togglingOpen}
                shopName={shopName} setShopName={setShopName}
                ownerName={ownerName} setOwnerName={setOwnerName}
                phone={phone} setPhone={setPhone}
                email={email}
                openTime={openTime} setOpenTime={setOpenTime}
                closeTime={closeTime} setCloseTime={setCloseTime}
                address={address} setAddress={setAddress}
                onSave={handleSaveProfile} saving={saving}
                hasData={hasProfileData}
                isEditing={isEditingProfile}
                onToggleEdit={() => setIsEditingProfile((prev) => !prev)}
              />
            )}
            {tab === "services" && (
              <ShopServicesTab
                isVerified={isVerified}
                services={services} setServices={setServices}
                onSave={handleSaveServices} saving={saving}
              />
            )}
            {tab === "bank" && (
              <ShopBankTab
                isVerified={isVerified}
                bankName={bankName} setBankName={setBankName}
                accountName={accountName} setAccountName={setAccountName}
                accountNumber={accountNumber} setAccountNumber={setAccountNumber}
                onSave={handleSaveBank} saving={saving}
                hasData={hasBankData}
                isEditing={isEditingBank}
                onToggleEdit={() => setIsEditingBank((prev) => !prev)}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}