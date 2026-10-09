"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useSearchParams } from "next/navigation";
import axios from "axios";
import { Store, Printer, Landmark, Loader2, Lock } from "lucide-react";

import ShopNavbar from "../../../../component/shop/navbar";
import ShopProfileTab from "../../../../component/shop/ShopProfileTab";
import ShopServicesTab, {
  type ServiceTypeGroup,
} from "../../../../component/shop/ShopServiceTab";
import ShopBankTab from "../../../../component/shop/ShopBankTab";
import ShopLocationConfirmModal from "../../../../component/shop/Shoplocationcomfirmmodal";


const SHOP_ID_STORAGE_KEY = "shop_id";
const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/shop";

type AddressData = {
  detail: string;
  subdistrict: string;
  district: string;
  province: string;
  postcode: string;
};

function resolveShopId(raw: string | null): string | null {
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw);
    if (typeof parsed === "string") return parsed;
    if (parsed && typeof parsed === "object" && parsed.id != null) {
      return String(parsed.id);
    }
  } catch (err) {
    console.log(err)
  }

  return raw;
}

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

  // Shop Open/Closed State
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
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState<boolean>(false);
  const [addressId, setAddressId] = useState<string | null>(null);
  const [address, setAddress] = useState<AddressData>({
    detail: "",
    subdistrict: "",
    district: "",
    province: "",
    postcode: "",
  });

  // พิกัดร้านเดิม + ที่อยู่ที่บันทึกล่าสุด (ใช้เช็คว่ามีการแก้ที่อยู่หรือไม่)
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [savedAddress, setSavedAddress] = useState<AddressData>({
    detail: "",
    subdistrict: "",
    district: "",
    province: "",
    postcode: "",
  });
  const [showLocationModal, setShowLocationModal] = useState<boolean>(false);

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

      const [profileRes, bankRes, servicesRes, verifyRes] = await Promise.allSettled([
        axios.get(`${API_BASE}/profile/${shopId}`),
        axios.get(`${API_BASE}/bank-account/${shopId}`),
        axios.get(`${API_BASE}/services/${shopId}`),
        axios.get(`${API_BASE}/verify-status/${shopId}`),
      ]);

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
        if (shop.status === "suspended") {
          setIsSuspended(true);
        } else {
          setIsSuspended(false);
        }

        setShopName(shop.shop_name ?? shop.name ?? "");
        setOwnerName(shop.owner_name ?? shop.ownerName ?? "");
        setPhone(shop.phone ?? "");
        setEmail(shop.email ?? "");
        // Postgres ส่ง time เป็น "09:00:00" แต่ <input type="time"> ใช้ "09:00"
        setOpenTime((shop.open_time ?? "09:00").slice(0, 5));
        setCloseTime((shop.close_time ?? "18:00").slice(0, 5));
        setIsOpen(shop.is_open ?? true);
        setProfileImage(shop.profile_image ?? null);

        if (shop.address) {
          setAddressId(shop.address.id ?? null);
          const loaded: AddressData = {
            detail: shop.address.detail ?? "",
            subdistrict: shop.address.subdistrict ?? "",
            district: shop.address.district ?? "",
            province: shop.address.province ?? "",
            postcode: shop.address.postcode ?? "",
          };
          setAddress(loaded);
          setSavedAddress(loaded);
          setLatitude(
            shop.address.latitude != null ? Number(shop.address.latitude) : null
          );
          setLongitude(
            shop.address.longitude != null ? Number(shop.address.longitude) : null
          );
        }

        setHasProfileData(Boolean(shop.shop_name || shop.name));
      }

      // Verification Status
      setIsVerified(Boolean(verifyStatus?.is_verify));

      // Services Data
      if (shopServices) {
        const normalizedServices: ServiceTypeGroup[] = shopServices.map((group: any) => ({
          id: group.id,
          type: group.type ?? "",
          items: (group.items ?? []).map((d: any) => ({
            id: d.id,
            category: d.category ?? "",
            detail: d.detail ?? "",
            group_type: d.group_type ?? "",
            price: d.price != null ? String(d.price) : "",
          })),
        }));
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

  // เช็คว่าที่อยู่ถูกแก้ไขจากค่าที่บันทึกไว้หรือไม่
  const isAddressChanged = () =>
    (Object.keys(address) as (keyof AddressData)[]).some(
      (k) => (address[k] ?? "").trim() !== (savedAddress[k] ?? "").trim()
    );

  // บันทึกจริง: ถ้าส่ง coords มาจะบันทึกพิกัดใหม่ไปพร้อมที่อยู่ด้วย
  const submitProfile = async (
    coords?: { lat: number; lng: number }
  ): Promise<boolean> => {
    if (!shopId) return false;
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
          ...(coords && { latitude: coords.lat, longitude: coords.lng }),
        },
        address_detail: fullAddrString,
        full_address: fullAddrString,
      });

      setHasProfileData(true);
      setIsEditingProfile(false);
      await fetchShopSettings();
      return true;
    } catch (err) {
      console.error("Save profile error:", err);
      return false;
    } finally {
      setSaving(false);
    }
  };

  // กดบันทึก: ถ้าแก้ที่อยู่ → เปิดแผนที่ให้ยืนยันตำแหน่งก่อน, ถ้าไม่ → บันทึกเลย
  const handleSaveProfile = () => {
    if (!shopId) return;
    if (isAddressChanged()) {
      setShowLocationModal(true);
      return;
    }
    submitProfile();
  };

  const handleConfirmLocation = async (loc: { lat: number; lng: number }) => {
    const ok = await submitProfile(loc);
    if (ok) setShowLocationModal(false);
  };

  // อัปโหลดรูปโปรไฟล์ร้าน: คืนค่า null เมื่อสำเร็จ หรือข้อความ error เมื่อไม่สำเร็จ
  const handleUploadProfileImage = async (file: File): Promise<string | null> => {
    if (!shopId) return "ไม่พบ shop_id ของร้านค้า";
    try {
      setUploadingImage(true);
      const formData = new FormData();
      formData.append("image", file);
      // ไม่ต้องตั้ง Content-Type เอง เบราว์เซอร์/axios จะใส่ boundary ให้
      const res = await axios.put(`${API_BASE}/profile/${shopId}/image`, formData);
      const newImage: string | null = res.data?.data?.profile_image ?? null;
      setProfileImage(newImage);
      // แจ้ง navbar ให้เปลี่ยนรูปทันที ไม่ต้องรีเฟรช
      window.dispatchEvent(
        new CustomEvent("shop-profile-image-updated", {
          detail: { profile_image: newImage },
        })
      );
      return null;
    } catch (err: any) {
      const data = err?.response?.data;
      console.error("Upload profile image error:", err?.response?.status, data ?? err.message);
      return data?.error ?? "อัปโหลดรูปไม่สำเร็จ กรุณาลองใหม่อีกครั้ง";
    } finally {
      setUploadingImage(false);
    }
  };

  const handleToggleOpen = async () => {
    if (!shopId) return;
    if (isSuspended) {
      console.warn("[Action Blocked] Shop is suspended. Cannot update services.");
      return;
    }

  const handleSaveServices = async (): Promise<boolean> => {
    if (!shopId) return false;
    try {
      setSaving(true);

      const payloadServices = services.map((s) => ({
        type: s.type,
        items: s.items.map((item) => ({
          category: item.category || s.type,
          detail: item.detail,
          group_type: item.group_type,
          price: item.price,
        })),
      }));

      // ส่ง shop_id ทาง body อย่างเดียว (custom header อาจติด CORS preflight / โดน proxy ตัด underscore)
      await axios.post(`${API_BASE}/services`, {
        shop_id: shopId,
        services: payloadServices,
      });

      await fetchShopSettings();
      return true;
    } catch (err: any) {
      const data = err?.response?.data;
      console.error("Save services error:", err?.response?.status, data ?? err.message);
      alert(
        `บันทึกบริการพิมพ์ไม่สำเร็จ\n${data?.detail ?? data?.error ?? err.message}\n[backend: ${data?.debug?.version ?? "ไม่พบ version = โค้ดเก่า/ยังไม่ restart?"}]`
      );
      return false;
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
                profileImage={profileImage}
                onUploadImage={handleUploadProfileImage}
                uploadingImage={uploadingImage}
                openTime={openTime} setOpenTime={setOpenTime}
                closeTime={closeTime} setCloseTime={setCloseTime}
                address={address} setAddress={setAddress}
                onSave={handleSaveProfile} saving={saving}
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

      {showLocationModal && (
        <ShopLocationConfirmModal
          initialLocation={
            latitude != null && longitude != null
              ? { lat: latitude, lng: longitude }
              : null
          }
          saving={saving}
          onConfirm={handleConfirmLocation}
          onCancel={() => setShowLocationModal(false)}
        />
      )}
    </div>
  );
}
