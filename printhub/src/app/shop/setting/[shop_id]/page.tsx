"use client";

import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { ShieldCheck, ShieldAlert, Lock, Store, Printer, Landmark, Loader2 } from "lucide-react";
import { useParams } from "next/navigation";

import ShopNavbar from "@/src/component/shop/navbar";
import ShopProfileTab from "@/src/component/shop/ShopProfileTab";
import ShopServicesTab, { ServiceTypeGroup } from "@/src/component/shop/ShopServiceTab";
import ShopBankTab from "@/src/component/shop/ShopBankTab";

type Tab = "profile" | "services" | "bank";

export default function ShopSettingsPage() {
  const params = useParams();
  const shopId = Array.isArray(params?.shop_id)
    ? params.shop_id[0]
    : (params?.shop_id as string);
  const [tab, setTab] = useState<Tab>("profile");
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);

  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [shopName, setShopName] = useState<string>("");
  const [ownerName, setOwnerName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [openTime, setOpenTime] = useState<string>("09:00");
  const [closeTime, setCloseTime] = useState<string>("18:00");
  const [addressId, setAddressId] = useState<string | null>(null);
  const [address, setAddress] = useState({
    detail: "",
    subdistrict: "",
    district: "",
    province: "",
    postcode: "",
  });

  const [services, setServices] = useState<ServiceTypeGroup[]>([]);
  const [bankAccountId, setBankAccountId] = useState<string | null>(null);
  const [bankName, setBankName] = useState<string>("");
  const [accountName, setAccountName] = useState<string>("");
  const [accountNumber, setAccountNumber] = useState<string>("");

  const [hasProfileData, setHasProfileData] = useState<boolean>(false);
  const [hasBankData, setHasBankData] = useState<boolean>(false);
  const [isEditingProfile, setIsEditingProfile] = useState<boolean>(true);
  const [isEditingBank, setIsEditingBank] = useState<boolean>(true);

  const API_BASE = "http://localhost:5000/shop";

  const fetchShopSettings = useCallback(async () => {
    if (!shopId) return;

    try {
      setLoading(true);

      const [profileRes, bankRes, servicesRes, verifyRes] = await Promise.all([
        axios.get(`${API_BASE}/profile/${shopId}`),
        axios.get(`${API_BASE}/bank-account/${shopId}`),
        axios.get(`${API_BASE}/services/${shopId}`),
        axios.get(`${API_BASE}/verify-status/${shopId}`),
      ]);

      const shop = profileRes.data?.data;
      const bankAccount = bankRes.data?.data;
      const shopServices = servicesRes.data?.data;
      const verifyStatus = verifyRes.data?.data;

      if (shop) {
        setShopName(shop.shop_name ?? "");
        setOwnerName(shop.owner_name ?? "");
        setPhone(shop.phone ?? "");
        setEmail(shop.email ?? "");
        setOpenTime(shop.open_time ?? "09:00");
        setCloseTime(shop.close_time ?? "18:00");

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

        const profileFilled = Boolean(shop.shop_name);
        setHasProfileData(profileFilled);
        setIsEditingProfile(!profileFilled);
      }

      setIsVerified(Boolean(verifyStatus?.is_verify));

      if (shopServices) {
        const normalizedServices: ServiceTypeGroup[] = shopServices.map((group: any) => {
          const rawDetails = group.service_detail ?? [];
          const groupMap: { [key: string]: any[] } = {};

          rawDetails.forEach((d: any) => {
            const gName = d.group_name || "ตัวเลือกทั่วไป";
            if (!groupMap[gName]) groupMap[gName] = [];
            groupMap[gName].push({
              id: d.id,
              detail: d.detail ?? "",
              price: d.price != null ? String(d.price) : "",
            });
          });

          const groupsArr = Object.keys(groupMap).map((gName) => ({
            group_name: gName,
            items: groupMap[gName],
          }));

          return {
            id: group.id,
            type: group.type ?? "",
            groups: groupsArr,
          };
        });

        setServices(normalizedServices);
      }

      if (bankAccount) {
        setBankAccountId(bankAccount.id ?? null);
        setBankName(bankAccount.bank_name ?? "");
        setAccountName(bankAccount.account_name ?? "");
        setAccountNumber(bankAccount.account_number ?? "");

        const bankFilled = Boolean(bankAccount.bank_name || bankAccount.account_number);
        setHasBankData(bankFilled);
        setIsEditingBank(!bankFilled);
      } else {
        setHasBankData(false);
        setIsEditingBank(true);
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
    try {
      setSaving(true);
      const headers = { shop_id: shopId };
      await axios.put(
        `${API_BASE}/profile`,
        {
          shop_name: shopName,
          owner_name: ownerName,
          phone,
          open_time: openTime,
          close_time: closeTime,
          address: { id: addressId, ...address },
        },
        { headers }
      );
      setHasProfileData(true);
      setIsEditingProfile(false);
    } catch (err) {
      console.error("Save profile error:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveServices = async () => {
    try {
      setSaving(true);
      const payloadServices = services.map((s) => ({
        id: s.id,
        type: s.type,
        service_detail: s.groups.flatMap((g) =>
          g.items.map((item) => ({
            id: item.id,
            detail: item.detail,
            group_name: g.group_name,
            price: Number(item.price) || 0,
          }))
        ),
      }));

      const headers = { shop_id: shopId };
      await axios.post(
        `${API_BASE}/services`,
        { services: payloadServices },
        { headers }
      );

      await fetchShopSettings();
    } catch (err) {
      console.error("Save services error:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveBank = async () => {
    try {
      setSaving(true);
      const headers = { shop_id: shopId };
      await axios.put(
        `${API_BASE}/bank`,
        {
          id: bankAccountId,
          bank_name: bankName,
          account_name: accountName,
          account_number: accountNumber,
        },
        { headers }
      );
      setHasBankData(true);
      setIsEditingBank(false);
    } catch (err) {
      console.error("Save bank error:", err);
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { key: "profile", label: "ข้อมูลร้าน", icon: <Store size={16} /> },
    { key: "services", label: "บริการพิมพ์", icon: <Printer size={16} />, locked: !isVerified },
    { key: "bank", label: "บัญชีธนาคาร", icon: <Landmark size={16} /> },
  ];

  return (
    <div className="min-h-screen bg-white">
      <ShopNavbar />

      <div className="mx-auto max-w-7xl px-12 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-lg font-bold text-[#0F2942]">ตั้งค่าร้านค้า</h2>
            <p className="mt-1 text-sm text-slate-500">
              จัดการข้อมูลร้าน บริการพิมพ์ และช่องทางรับชำระเงิน
            </p>
          </div>

          {isVerified ? (
            <span className="flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-600">
              <ShieldCheck size={14} /> ยืนยันตัวตนแล้ว
            </span>
          ) : (
            <span className="flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-medium text-amber-600">
              <ShieldAlert size={14} /> รอการตรวจสอบ
            </span>
          )}
        </div>

        {/* Tab Selection */}
        <div className="mb-8 flex border-b border-slate-200 gap-6">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key as Tab)}
              className={`flex items-center gap-2 pb-3 text-sm font-semibold border-b-2 transition-colors ${
                tab === t.key
                  ? "border-[#0F2942] text-[#0F2942]"
                  : "border-transparent text-slate-400 hover:text-slate-600"
              }`}
            >
              {t.icon}
              {t.label}
              {t.locked && <Lock size={12} className="text-slate-400" />}
            </button>
          ))}
        </div>

        {/* Tab Content Area */}
        {loading ? (
          <div className="py-12 text-center text-slate-500 flex items-center justify-center gap-2">
            <Loader2 className="animate-spin" size={18} />
            กำลังโหลดข้อมูล...
          </div>
        ) : (
          <div className="max-w-3xl">
            {tab === "profile" && (
              <ShopProfileTab
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