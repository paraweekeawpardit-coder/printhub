'use client';

import React from 'react';

export interface OrderItem {
  id?: string;
  fileName: string;
  paperSize: string; // เช่น "A4"
  colorType: string; // เช่น "ขาว-ดำ", "สี"
  printSide: string; // เช่น "หน้าเดียว", "หน้า-หลัง"
  pagesPerSet: number;
  pricePerPage: number;
  quantity: number;
  totalPrice: number;
}

export interface AdditionalService {
  name: string; // เช่น "ค่าบริการเข้าเล่มสันเกลียว"
  price: number;
}

export interface OrderDetails {
  id: string;
  items: OrderItem[];
  services: AdditionalService[];
  smallOrderFeeThreshold?: number; // เกณฑ์ขั้นต่ำ เช่น 50 บาท
  smallOrderFee?: number; // ค่าธรรมเนียมสั่งซื้อขนาดเล็ก
}

interface OrderSummaryProps {
  orderData: OrderDetails | null;
  isLoading?: boolean;
}

export function OrderSummary({ orderData, isLoading }: OrderSummaryProps) {
  if (isLoading) {
    return (
      <div className="p-4 text-center text-sm text-gray-500 animate-pulse">
        กำลังโหลดข้อมูลรายการสั่งซื้อ...
      </div>
    );
  }

  if (!orderData) {
    return (
      <div className="p-4 text-center text-sm text-red-500">
        ไม่พบข้อมูลรายการสั่งซื้อ
      </div>
    );
  }

  const { items = [], services = [], smallOrderFeeThreshold = 50, smallOrderFee = 20 } = orderData;

  // คำนวณราคารวมงานพิมพ์
  const printSubtotal = items.reduce((sum, item) => sum + (item.totalPrice || 0), 0);

  // คำนวณราคารวมบริการเสริม
  const serviceSubtotal = services.reduce((sum, svc) => sum + (svc.price || 0), 0);

  // คำนวณราคารวมงานปริ้นท์ทั้งสิ้น (ก่อนค่าธรรมเนียม)
  const totalPrintAndService = printSubtotal + serviceSubtotal;

  // เงื่อนไขค่าธรรมเนียมสั่งซื้อขนาดเล็ก: ถ้าค่างานรวม < 50 บาท และ > 0 บาท จะบวกเพิ่ม 20 บาทตรงๆ
  const actualSmallOrderFee = totalPrintAndService < smallOrderFeeThreshold && totalPrintAndService > 0
    ? smallOrderFee
    : 0;

  // ยอดชำระเงินสุทธิ
  const netTotal = totalPrintAndService + actualSmallOrderFee;

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 font-mono text-xs space-y-3 text-gray-800">
      <div className="text-center font-bold text-sm border-b border-dashed border-gray-300 pb-2">
        ใบสรุปรายการสั่งซื้อ (Order Summary)
      </div>

      {/* รายการงานพิมพ์ */}
      <div>
        <div className="font-bold text-blue-800 mb-1">รายการงานพิมพ์:</div>
        {items.length === 0 ? (
          <p className="text-gray-400 pl-2">- ไม่มีรายการงานพิมพ์</p>
        ) : (
          items.map((item, idx) => (
            <div key={idx} className="mb-2 pl-2 border-l-2 border-blue-200">
              <div className="font-semibold text-gray-700">{item.fileName || `งานพิมพ์เอกสาร ${item.paperSize}`}</div>
              <div className="text-gray-600">
                - งานพิมพ์เอกสาร {item.paperSize} ({item.colorType} / {item.printSide})
              </div>
              <div className="flex justify-between text-gray-600">
                <span>{item.pagesPerSet} หน้า x {item.pricePerPage.toFixed(2)} บาท/หน้า = {(item.pagesPerSet * item.pricePerPage).toFixed(2)} บาท</span>
              </div>
              <div className="flex justify-between font-medium pt-0.5">
                <span>รวม {item.quantity} ชุด (x{item.quantity})</span>
                <span className="font-bold">= {item.totalPrice.toFixed(2)} บาท</span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* บริการเสริม */}
      {services.length > 0 && (
        <div className="border-t border-dashed border-gray-300 pt-2">
          <div className="font-bold text-blue-800 mb-1">บริการเสริม:</div>
          {services.map((svc, idx) => (
            <div key={idx} className="flex justify-between pl-2 text-gray-700">
              <span>- {svc.name}</span>
              <span>= {svc.price.toFixed(2)} บาท</span>
            </div>
          ))}
        </div>
      )}

      {/* รวมค่างานปริ้นท์ทั้งสิ้น */}
      <div className="border-t border-gray-300 pt-2 space-y-1">
        <div className="flex justify-between font-bold text-gray-800">
          <span>รวมค่างานปริ้นท์ทั้งสิ้น</span>
          <span>= {totalPrintAndService.toFixed(2)} บาท</span>
        </div>

        {/* ค่าธรรมเนียมสั่งซื้อขนาดเล็ก (Small Order Fee) */}
        {actualSmallOrderFee > 0 ? (
          <div className="flex justify-between text-xs text-amber-700">
            <div>
              <span className="font-semibold block">ค่าธรรมเนียมสั่งซื้อขนาดเล็ก (Small Order Fee)</span>
              <span className="text-amber-600 block text-[10px]">
                *เนื่องจากค่างานไม่ถึง {smallOrderFeeThreshold} บาท (คิดเพิ่ม 20 บาท)
              </span>
            </div>
            <span className="font-bold">= +{actualSmallOrderFee.toFixed(2)} บาท</span>
          </div>
        ) : (
          <div className="flex justify-between text-xs text-gray-500">
            <div>
              <span>ค่าธรรมเนียมสั่งซื้อขนาดเล็ก (Small Order Fee)</span>
              <span className="text-gray-400 block text-[10px]">
                *ไม่มี (เนื่องจากค่างาน ≥ {smallOrderFeeThreshold} บาท)
              </span>
            </div>
            <span>= 0.00 บาท</span>
          </div>
        )}
      </div>

      {/* ยอดชำระเงินสุทธิ */}
      <div className="border-t-2 border-double border-gray-400 pt-2 flex justify-between items-center text-sm font-bold text-blue-700">
        <span>ยอดชำระเงินสุทธิ</span>
        <span className="text-base">= {netTotal.toFixed(2)} บาท</span>
      </div>
    </div>
  );
}