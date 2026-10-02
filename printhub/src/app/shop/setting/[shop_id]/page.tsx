"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useSearchParams } from "next/navigation";
import axios from "axios";
import { Store, Printer, Landmark, Loader2, Lock } from "lucide-react";

import ShopNavbar from "../../../../component/shop/navbar";
import ShopProfileTab from "../../../../component/shop/ShopProfileTab";
import ShopServicesTab, {
  ServiceTypeGroup,
} from "../../../../component/shop/ShopServiceTab";
import ShopBankTab from "../../../../component/shop/ShopBankTab";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/shop";

type AddressData = {
  detail: string;
  subdistrict: string;
  district: string;
  province: string;
  postcode: string;
};

export default function ShopSettingsPage() {
  const params = useParams();
  const searchParams = useSearchParams();

  // ดึง shopId และ Casting เป็น string
  const rawShopId = params?.shop_id || searchParams.get("shopId");
  const shopId = Array.isArray(rawShopId) ? rawShopId[0] : rawShopId || "";

  const [tab, setTab] = useState<string>("profile");
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);

  // Verification, Open Status & Suspension Status
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const [togglingOpen, setTogglingOpen] = useState<boolean>(false);
  const [isSuspended, setIsSuspended] = useState<boolean>(false);

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
  const [addressId, setAddressId] = useState<number | string | null>(null);
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
  const [bankAccountId, setBankAccountId] = useState<number | string | null>(null);
  const [bankName, setBankName] = useState<string>("");
  const [accountName, setAccountName] = useState<string>("");
  const [accountNumber, setAccountNumber] = useState<string>("");
  const [isBankPending, setIsBankPending] = useState<boolean>(false);
  const [bankPendingCreatedAt, setBankPendingCreatedAt] = useState<string>("");

  const fetchShopSettings = useCallback(async () => {
    if (!shopId) {
      console.warn("ไม่พบ shopId ใน URL Parameters หรือ Path");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;
      const headers = {
        shop_id: shopId,
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };

      const [profileRes, bankRes, servicesRes, verifyRes] =
        await Promise.allSettled([
          axios.get(`${API_BASE}/profile/${shopId}`, { headers }),
          axios.get(`${API_BASE}/bank-account/${shopId}`, { headers }),
          axios.get(`${API_BASE}/services/${shopId}`, { headers }),
          axios.get(`${API_BASE}/verify-status/${shopId}`, { headers }),
        ]);

      // ดึงข้อมูลจาก Axios Response
      const profileResData =
        profileRes.status === "fulfilled" ? profileRes.value.data : null;
      const bankResData =
        bankRes.status === "fulfilled" ? bankRes.value.data : null;
      const servicesResData =
        servicesRes.status === "fulfilled" ? servicesRes.value.data : null;
      const verifyResData =
        verifyRes.status === "fulfilled" ? verifyRes.value.data : null;

      // Extract ข้อมูล
      const shop = profileResData?.data ?? profileResData;
      const bankAccount = bankResData?.data ?? bankResData;
      const shopServices = servicesResData?.data ?? servicesResData;
      const verifyStatus = verifyResData?.data ?? verifyResData;

      // 1. Profile Data & Suspended Check
      if (shop) {
        if (shop.status === "suspended") {
          setIsSuspended(true);
        } else {
          setIsSuspended(false);
        }

        setShopName(shop.shop_name ?? shop.name ?? "");
        setOwnerName(shop.owner_name ?? shop.ownerName ?? "");
        setPhone(shop.phone ?? "");
        setEmail(shop.email ?? "");
        setOpenTime(shop.open_time ?? shop.openTime ?? "09:00");
        setCloseTime(shop.close_time ?? shop.closeTime ?? "18:00");
        setIsOpen(shop.is_open ?? true);

        // ดึงที่อยู่
        const addrObj = shop.address || shop.address_detail;
        if (addrObj) {
          if (typeof addrObj === "object") {
            setAddressId(addrObj.id ?? addrObj._id ?? null);
            setAddress({
              detail: addrObj.detail || addrObj.house_number || addrObj.address || "",
              subdistrict: addrObj.subdistrict || addrObj.sub_district || addrObj.tambon || "",
              district: addrObj.district || addrObj.amphoe || "",
              province: addrObj.province || addrObj.changwat || "",
              postcode: addrObj.postcode || addrObj.postal_code || addrObj.zipcode || "",
            });
          } else if (typeof addrObj === "string") {
            setAddress((prev) => ({ ...prev, detail: addrObj }));
          }
        }

        setHasProfileData(Boolean(shop.shop_name || shop.name));
      }

      // 2. ตรวจสอบการยืนยันตัวตน
      const verified = Boolean(
        verifyStatus?.is_verify ?? shop?.is_verify ?? false
      );
      setIsVerified(verified);

      // 3. Services Data
      if (Array.isArray(shopServices)) {
        const normalizedServices: ServiceTypeGroup[] = shopServices.map(
          (group: any) => ({
            id: group.id,
            type: group.type ?? "",
            items: (group.service_detail ?? []).map((d: any) => ({
              id: d.id,
              detail: d.detail ?? "",
              group_type: d.group_type ?? "",
              price: d.price != null ? String(d.price) : "",
            })),
          })
        );
        setServices(normalizedServices);
      } else {
        setServices([]);
      }

      // 4. Bank Account Data
      if (
        bankAccount &&
        typeof bankAccount === "object" &&
        (bankAccount.bank_name || bankAccount.account_number)
      ) {
        setBankAccountId(bankAccount.id ?? null);
        setBankName(bankAccount.bank_name ?? "");
        setAccountName(bankAccount.account_name ?? "");
        setAccountNumber(bankAccount.account_number ?? "");
        const pendingStatus = Boolean(bankAccount.is_pending);
        setIsBankPending(pendingStatus);

        setBankPendingCreatedAt(
          bankAccount.created_at || bankAccount.updated_at || ""
        );

        setHasBankData(true);

        if (pendingStatus) {
          setIsEditingBank(false);
        }
      } else {
        setBankAccountId(null);
        setBankName("");
        setAccountName("");
        setAccountNumber("");
        setIsBankPending(false);
        setBankPendingCreatedAt("");
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

  const handleToggleOpen = async () => {
    if (!shopId) return;
    if (isSuspended) {
      console.warn("[Action Blocked] Shop is suspended. Cannot toggle open status.");
      return;
    }

    const nextStatus = !isOpen;
    try {
      setTogglingOpen(true);
      await axios.patch(`${API_BASE}/open-status/${shopId}`, {
        is_open: nextStatus,
      });
      setIsOpen(nextStatus);
    } catch (err: any) {
      alert(err.response?.data?.error || "ไม่สามารถเปลี่ยนสถานะเปิด/ปิดร้านได้");
      console.error("Toggle shop open status error:", err);
    } finally {
      setTogglingOpen(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!shopId) return;
    if (isSuspended) {
      console.warn("[Action Blocked] Shop is suspended. Cannot update profile.");
      return;
    }

    try {
      setSaving(true);

      const fullAddrString = [
        address.detail,
        address.subdistrict,
        address.district,
        address.province,
        address.postcode,
      ]
        .filter(Boolean)
        .join(" ");

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
        address_detail: fullAddrString,
        full_address: fullAddrString,
      });

      setHasProfileData(true);
      setIsEditingProfile(false);
      await fetchShopSettings();
    } catch (err: any) {
      alert(err.response?.data?.error || "ไม่สามารถบันทึกข้อมูลร้านได้");
      console.error("Save profile error:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveServices = async () => {
    if (!shopId) return;
    if (isSuspended) {
      console.warn("[Action Blocked] Shop is suspended. Cannot update services.");
      return;
    }

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
    } catch (err: any) {
      alert(err.response?.data?.error || "ไม่สามารถบันทึกข้อมูลบริการได้");
      console.error("Save services error:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveBank = async () => {
    if (!shopId) return;
    if (isSuspended) {
      console.warn("[Action Blocked] Shop is suspended. Cannot update bank account.");
      return;
    }

    try {
      setSaving(true);

      await axios.put(`${API_BASE}/bank-account/${shopId}`, {
        id: bankAccountId,
        bank_name: bankName,
        account_name: accountName,
        account_number: accountNumber,
        status: "pending",
      });

      setIsEditingBank(false);
      await fetchShopSettings();
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.error ||
        err.response?.data?.message ||
        "ไม่สามารถบันทึกข้อมูลบัญชีธนาคารได้";
      alert(errorMsg);
      console.error("Save bank error:", errorMsg);
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    {
      key: "profile",
      label: "ข้อมูลร้าน",
      icon: <Store size={16} />,
      locked: !isVerified,
    },
    {
      key: "services",
      label: "บริการพิมพ์",
      icon: <Printer size={16} />,
      locked: !isVerified,
    },
    {
      key: "bank",
      label: "บัญชีธนาคาร",
      icon: <Landmark size={16} />,
      locked: !isVerified,
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <ShopNavbar />

      <div className="mx-auto max-w-7xl px-12 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[#0F2942]">ตั้งค่าร้านค้า</h1>
          <p className="mt-1 text-sm text-slate-500">
            จัดการข้อมูลทั่วไป บริการพิมพ์ และบัญชีธนาคารสำหรับการรับเงิน
          </p>
        </div>

        {/* แถบแจ้งเตือนเมื่อร้านถูกระงับ */}
        {isSuspended && (
          <div className="mb-8 flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50/80 p-4 text-amber-900 shadow-sm">
            <Lock className="h-5 w-5 shrink-0 text-amber-600" />
            <p className="text-sm font-medium">
              บัญชีถูกระงับการใช้งาน ระบบปิดการแก้ไขข้อมูลร้านค้า เวลาเปิด-ปิด บริการพิมพ์ และบัญชีธนาคารชั่วคราว
            </p>
          </div>
        )}

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

        {loading ? (
          <div className="py-12 text-center text-slate-500 flex items-center justify-center gap-2">
            <Loader2 className="animate-spin" size={18} />
            กำลังโหลดข้อมูล...
          </div>
        ) : (
          <div className="max-w-3xl">
            {tab === "profile" && (
              <ShopProfileTab
                isVerified={isVerified && !isSuspended}
                isOpen={isOpen}
                onToggleOpen={handleToggleOpen}
                togglingOpen={togglingOpen || isSuspended}
                shopName={shopName}
                setShopName={setShopName}
                ownerName={ownerName}
                setOwnerName={setOwnerName}
                phone={phone}
                setPhone={setPhone}
                email={email}
                openTime={openTime}
                setOpenTime={setOpenTime}
                closeTime={closeTime}
                setCloseTime={setCloseTime}
                address={address}
                setAddress={setAddress}
                onSave={handleSaveProfile}
                saving={saving}
                hasData={hasProfileData}
                isEditing={isEditingProfile && !isSuspended}
                onToggleEdit={() => {
                  if (isSuspended) return;
                  setIsEditingProfile((prev) => !prev);
                }}
              />
            )}
            {tab === "services" && (
              <ShopServicesTab
                isVerified={isVerified && !isSuspended}
                services={services}
                setServices={setServices}
                onSave={handleSaveServices}
                saving={saving}
              />
            )}
            {tab === "bank" && (
              <ShopBankTab
                isVerified={isVerified && !isSuspended}
                bankName={bankName}
                setBankName={setBankName}
                accountName={accountName}
                setAccountName={setAccountName}
                accountNumber={accountNumber}
                setAccountNumber={setAccountNumber}
                onSave={handleSaveBank}
                saving={saving}
                hasData={hasBankData}
                isEditing={isEditingBank && !isSuspended}
                isPending={isBankPending}
                pendingCreatedAt={bankPendingCreatedAt}
                onToggleEdit={() => {
                  if (isBankPending || isSuspended) return;
                  setIsEditingBank((prev) => !prev);
                }}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}