"use client";

import React, {
  useState,
  useEffect,
} from "react";

import {
  useParams,
  useRouter,
} from "next/navigation";

import axios from "axios";

import {
  CheckCircle,
  XCircle,
  Download,
  MessageSquare,
  Clock,
  FileText,
  User,
  MapPin,
  ChevronLeft,
  RefreshCw,
  Loader2,
  AlertCircle,
  Lock,
} from "lucide-react";

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();

  const orderId =
    (params?.id ||
      params?.order_id) as string;

  const [order, setOrder] =
    useState<any>(null);

  const [isLoading, setIsLoading] =
    useState<boolean>(true);

  const [isUpdating, setIsUpdating] =
    useState<boolean>(false);

  const [error, setError] =
    useState<string | null>(null);

  // ==========================================
  // GET ORDER
  // ==========================================

  const fetchOrder = async () => {
    if (!orderId) {
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const res = await axios.get(
        `http://localhost:5000/shop/orders/${orderId}`
      );

      if (
        res.data &&
        res.data.order
      ) {
        setOrder(
          res.data.order
        );
      } else {
        throw new Error(
          "รูปแบบข้อมูลไม่ถูกต้อง"
        );
      }

    } catch (err: any) {
      console.error(
        "Axios Error:",
        err
      );

      const message =
        err.response?.data?.error ||
        err.message ||
        "เกิดข้อผิดพลาดในการดึงข้อมูล";

      setError(message);

    } finally {
      setIsLoading(false);
    }
  };

  // ==========================================
  // Fetch on page load
  // ==========================================

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  // ==========================================
  // UPDATE STATUS
  // ==========================================

  const handleUpdateStatus = async (
    nextStatus: string
  ) => {
    try {
      setIsUpdating(true);

      await axios.patch(
        `http://localhost:5000/shop/orders/${orderId}/status`,
        {
          status_state:
            nextStatus,
        }
      );

      await fetchOrder();

    } catch (err: any) {
      const message =
        err.response?.data?.error ||
        "อัปเดตสถานะไม่สำเร็จ";

      alert(message);

    } finally {
      setIsUpdating(false);
    }
  };

  // ==========================================
  // Loading
  // ==========================================

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">

        <div className="flex items-center gap-3 text-gray-500">

          <Loader2
            className="animate-spin text-blue-600"
            size={28}
          />

          <span className="text-sm font-medium">
            กำลังโหลดข้อมูลคำสั่งพิมพ์...
          </span>

        </div>

      </div>
    );
  }

  // ==========================================
  // Error
  // ==========================================

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">

        <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-[0_1px_3px_rgba(0,0,0,0.04)] text-center max-w-sm w-full">

          <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
            <AlertCircle
              className="text-red-500"
              size={22}
            />
          </div>

          <h2 className="text-base font-semibold text-gray-900 mb-1">
            เกิดข้อผิดพลาด
          </h2>

          <p className="text-sm text-gray-500 mb-6">
            {error ||
              "ไม่พบคำสั่งพิมพ์"}
          </p>

          <button
            onClick={() =>
              router.back()
            }
            className="w-full py-2.5 bg-[#12356b] text-white rounded-xl text-sm font-medium hover:bg-[#0e2b57] transition-colors"
          >
            ย้อนกลับ
          </button>

        </div>

      </div>
    );
  }

  // ==========================================
  // Confirmed
  // ==========================================

  const isConfirmed =
    order.status_state !==
      "รอการดำเนินการ" &&
    order.status_state !==
      "ยกเลิกการพิมพ์";

  const statusStyles: Record<string, string> = {
    "รอการดำเนินการ":
      "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
    "กำลังพิมพ์":
      "bg-blue-50 text-blue-700 ring-1 ring-blue-200",
    "พิมพ์เสร็จสิ้น":
      "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
    "ยกเลิกการพิมพ์":
      "bg-red-50 text-red-700 ring-1 ring-red-200",
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans pb-16">

      {/* Top Bar */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">

        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">

          <button
            onClick={() =>
              router.back()
            }
            className="flex items-center gap-1.5 text-gray-500 hover:text-gray-900 transition-colors -ml-2 px-2 py-1.5 rounded-lg hover:bg-gray-100"
          >
            <ChevronLeft size={18} />

            <span className="font-medium text-sm">
              ย้อนกลับ
            </span>
          </button>

          <div className="flex items-center gap-2">

            <span className="text-xs font-medium text-gray-400">
              หมายเลขออเดอร์
            </span>

            <span className="text-sm font-semibold text-[#12356b] bg-blue-50 px-2.5 py-1 rounded-lg">
              #{order.order_no}
            </span>

          </div>

        </div>

      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 mt-6 sm:mt-8">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-2xl border border-gray-200 shadow-[0_1px_3px_rgba(0,0,0,0.04)] mb-6">

          <div className="flex items-center gap-3">

            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
              รายละเอียดคำสั่งพิมพ์
            </h1>

            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                statusStyles[order.status_state] ||
                "bg-gray-100 text-gray-600 ring-1 ring-gray-200"
              }`}
            >
              {order.status_state}
            </span>

          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5">

            {order.status_state ===
              "รอการดำเนินการ" && (
              <>
                <button
                  onClick={() =>
                    handleUpdateStatus(
                      "ยกเลิกการพิมพ์"
                    )
                  }
                  disabled={isUpdating}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-red-600 hover:bg-red-50 hover:border-red-200 text-sm font-medium transition-colors disabled:opacity-50"
                >
                  <XCircle size={16} />
                  ปฏิเสธ
                </button>

                <button
                  onClick={() =>
                    handleUpdateStatus(
                      "กำลังพิมพ์"
                    )
                  }
                  disabled={isUpdating}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700 text-sm font-medium transition-colors shadow-sm shadow-blue-600/20 disabled:opacity-50"
                >
                  {isUpdating ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <CheckCircle size={16} />
                  )}
                  ยืนยันออเดอร์
                </button>
              </>
            )}

            {order.status_state ===
              "กำลังพิมพ์" && (
              <button
                onClick={() =>
                  handleUpdateStatus(
                    "พิมพ์เสร็จสิ้น"
                  )
                }
                disabled={isUpdating}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 text-sm font-medium transition-colors shadow-sm shadow-emerald-600/20 disabled:opacity-50"
              >
                <RefreshCw
                  size={16}
                  className={
                    isUpdating
                      ? "animate-spin"
                      : ""
                  }
                />

                อัปเดตสถานะเป็น "พิมพ์เสร็จสิ้น"
              </button>
            )}

          </div>

        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left */}
          <div className="lg:col-span-2 space-y-6">

            {/* Files */}
            <div className="bg-white p-5 sm:p-6 rounded-2xl border border-gray-200 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">

              <h2 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">

                <FileText
                  size={17}
                  className="text-blue-600"
                />

                ไฟล์สำหรับพิมพ์
                <span className="text-gray-400 font-normal">
                  ({order.files?.length || 0} ไฟล์)
                </span>

              </h2>

              {!isConfirmed ? (

                <div className="p-5 bg-gray-50 rounded-xl border border-dashed border-gray-300 text-center">

                  <Lock size={18} className="mx-auto text-gray-400 mb-2" />

                  <p className="text-sm text-gray-500">
                    กรุณา{" "}
                    <span className="font-semibold text-blue-600">
                      ยืนยันออเดอร์
                    </span>{" "}
                    ก่อน จึงจะดาวน์โหลดไฟล์ได้
                  </p>

                </div>

              ) : (

                <div className="space-y-2.5">

                  {order.files?.map(
                    (file: any) => (
                      <div
                        key={file.id}
                        className="flex items-center justify-between p-3.5 bg-gray-50 rounded-xl border border-gray-200"
                      >

                        <span className="text-sm font-medium text-gray-700 truncate">
                          {file.filename}
                        </span>

                        <a
                          href={
                            file.file_url
                          }
                          download
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 bg-white px-3 py-1.5 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors shrink-0 ml-3"
                        >
                          <Download size={13} />
                          โหลดไฟล์
                        </a>

                      </div>
                    )
                  )}

                </div>

              )}

            </div>

            {/* Items */}
            <div className="bg-white p-5 sm:p-6 rounded-2xl border border-gray-200 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">

              <h2 className="text-sm font-semibold text-gray-900 mb-4">
                รายการบริการที่สั่งพิมพ์
              </h2>

              <div className="overflow-x-auto -mx-2">

                <table className="w-full text-left text-sm text-gray-600 min-w-[480px]">

                  <thead>

                    <tr className="border-b border-gray-200">

                      <th className="py-2.5 px-2 text-xs font-medium text-gray-400 uppercase tracking-wide">
                        รายละเอียด
                      </th>

                      <th className="py-2.5 px-2 text-center text-xs font-medium text-gray-400 uppercase tracking-wide">
                        จำนวน
                      </th>

                      <th className="py-2.5 px-2 text-right text-xs font-medium text-gray-400 uppercase tracking-wide">
                        ราคา/หน่วย
                      </th>

                      <th className="py-2.5 px-2 text-right text-xs font-medium text-gray-400 uppercase tracking-wide">
                        ราคารวม
                      </th>

                    </tr>

                  </thead>

                  <tbody className="divide-y divide-gray-100">

                    {order.items?.map(
                      (item: any) => (
                        <tr key={item.id}>

                          <td className="py-3 px-2">

                            <p className="font-medium text-gray-800">
                              {item.group_name}
                            </p>

                            <p className="text-xs text-gray-400 mt-0.5">
                              {item.detail}
                            </p>

                          </td>

                          <td className="py-3 px-2 text-center">
                            {item.quantity}
                          </td>

                          <td className="py-3 px-2 text-right">
                            ฿
                            {Number(
                              item.unit_price
                            ).toFixed(2)}
                          </td>

                          <td className="py-3 px-2 text-right font-semibold text-gray-800">
                            ฿
                            {Number(
                              item.subtotal
                            ).toFixed(2)}
                          </td>

                        </tr>
                      )
                    )}

                  </tbody>

                </table>

              </div>

              <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center">

                <span className="text-sm text-gray-500 font-medium">
                  ราคารวมทั้งหมด
                </span>

                <span className="text-xl font-bold text-[#12356b]">
                  ฿
                  {Number(
                    order.total_price
                  ).toFixed(2)}
                </span>

              </div>

            </div>

          </div>

          {/* Right */}
          <div className="space-y-6">

            {/* Customer */}
            <div className="bg-white p-5 sm:p-6 rounded-2xl border border-gray-200 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">

              <h2 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">

                <User
                  size={17}
                  className="text-blue-600"
                />

                ข้อมูลลูกค้า

              </h2>

              <div className="space-y-3.5 text-sm">

                <div>

                  <p className="text-xs text-gray-400 mb-0.5">
                    ชื่อ-นามสกุล
                  </p>

                  <p className="font-medium text-gray-800">
                    {
                      order.customer
                        ?.first_name
                    }{" "}
                    {
                      order.customer
                        ?.last_name
                    }
                  </p>

                </div>

                <div>

                  <p className="text-xs text-gray-400 mb-0.5">
                    เบอร์ติดต่อ
                  </p>

                  <p className="font-medium text-gray-700">
                    {
                      order.customer
                        ?.contact ||
                      "-"
                    }
                  </p>

                </div>

                <div>

                  <p className="text-xs text-gray-400 mb-0.5 flex items-center gap-1">
                    <MapPin size={11} />
                    ที่อยู่จัดส่ง
                  </p>

                  <p className="text-gray-600 text-xs leading-relaxed">

                    {order.customer
                      ?.address
                      ? `${order.customer.address.detail} ต.${order.customer.address.subdistrict || ""} อ.${order.customer.address.district || ""} จ.${order.customer.address.province || ""} ${order.customer.address.postcode || ""}`
                      : "ไม่ได้ระบุที่อยู่"}

                  </p>

                </div>

              </div>

              <div className="mt-5 pt-4 border-t border-gray-100">

                <button
                  disabled={!isConfirmed}
                  onClick={() =>
                    router.push(
                      `/chat?customer_id=${order.customer?.id}`
                    )
                  }
                  className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-medium text-sm transition-colors ${
                    isConfirmed
                      ? "bg-[#12356b] text-white hover:bg-[#0e2b57]"
                      : "bg-gray-100 text-gray-400 cursor-not-allowed"
                  }`}
                >

                  <MessageSquare size={15} />

                  {isConfirmed
                    ? "แชทติดต่อลูกค้า"
                    : "แชท (ยืนยันออเดอร์ก่อน)"}

                </button>

              </div>

            </div>

            {/* Date */}
            <div className="bg-white p-5 sm:p-6 rounded-2xl border border-gray-200 shadow-[0_1px_3px_rgba(0,0,0,0.04)] space-y-3">

              <h2 className="text-sm font-semibold text-gray-900 mb-1 flex items-center gap-2">

                <Clock
                  size={17}
                  className="text-blue-600"
                />

                เวลานัดหมาย

              </h2>

              <div className="flex justify-between items-center text-sm py-1.5">

                <span className="text-gray-400 text-xs">
                  วันที่สั่งซื้อ
                </span>

                <span className="font-medium text-gray-700 text-xs">
                  {order.order_date
                    ? new Date(
                        order.order_date
                      ).toLocaleString(
                        "th-TH"
                      )
                    : "-"}
                </span>

              </div>

              <div className="flex justify-between items-center text-sm py-1.5 border-t border-gray-100">

                <span className="text-gray-400 text-xs">
                  เวลานัดรับงาน
                </span>

                <span className="font-semibold text-blue-700 text-xs">
                  {order.receive_date
                    ? new Date(
                        order.receive_date
                      ).toLocaleString(
                        "th-TH"
                      )
                    : "-"}
                </span>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}