// import React from 'react';

// export interface Shop {
//   id: string;
//   shop_name: string;
//   profile_image: string | null;
//   rating: number;
//   open_time: string | null;
//   close_time: string | null;
//   is_open: boolean;
//   is_verify: boolean;
//   distance: number | null;
//   starting_price: number;
//   service_types: string[];
// }

// // ต้องมีคำว่า export default นำหน้า function
// export default function ShopCard({ shop }: { shop: Shop }) {
//   return (
//     <div className="border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition bg-white flex flex-col justify-between">
//       <div>
//         <div className="flex justify-between items-start mb-2">
//           <h3 className="font-bold text-lg text-gray-800">{shop.shop_name}</h3>
//           <span
//             className={`text-xs px-2.5 py-1 rounded-full font-medium ${
//               shop.is_open ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
//             }`}
//           >
//             {shop.is_open ? 'เปิดให้บริการ' : 'ปิดทำการ'}
//           </span>
//         </div>

//         <div className="flex items-center gap-3 text-sm text-gray-600 mb-2">
//           <span>⭐ {shop.rating > 0 ? shop.rating : 'ไม่มีรีวิว'}</span>
//           {shop.distance !== null && (
//             <span>📍 {shop.distance} กม.</span>
//           )}
//         </div>

//         <div className="text-xs text-gray-500 mb-2">
//           🕒 {shop.open_time && shop.close_time ? `${shop.open_time.slice(0, 5)} - ${shop.close_time.slice(0, 5)} น.` : 'ไม่ระบุเวลา'}
//         </div>

//         <div className="flex flex-wrap gap-1 mb-3">
//           {shop.service_types.map((type, idx) => (
//             <span key={idx} className="bg-blue-50 text-blue-600 text-xs px-2 py-0.5 rounded">
//               {type}
//             </span>
//           ))}
//         </div>
//       </div>

//       <div className="border-t border-gray-100 pt-2 mt-2 flex justify-between items-center">
//         <div>
//           <span className="text-xs text-gray-500">เริ่มต้น</span>
//           <p className="text-base font-bold text-blue-600">฿{shop.starting_price}</p>
//         </div>
//         <button className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1.5 rounded-lg transition">
//           ดูร้านค้า
//         </button>
//       </div>
//     </div>
//   );
// }


'use client';

import React from 'react';
import Link from 'next/link';

export interface Shop {
  id: string;
  shop_name: string;
  profile_image: string | null;
  rating: number;
  open_time: string | null;
  close_time: string | null;
  is_open: boolean;
  distance: number | null;
  starting_price: number;
  service_types: string[];
}

export default function ShopCard({ shop }: { shop: Shop }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
      <div>
        {/* รูปภาพร้านค้า และ Badge เปิด/ปิด */}
        <div className="w-full h-40 bg-slate-100 rounded-xl mb-3 overflow-hidden relative border border-slate-100">
          {shop.profile_image ? (
            <img
              src={shop.profile_image}
              alt={shop.shop_name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-blue-50/50 text-blue-500 font-bold text-3xl">
              🖨️
            </div>
          )}

          <span
            className={`absolute top-2.5 right-2.5 text-[11px] px-2.5 py-0.5 rounded-full font-semibold shadow-sm backdrop-blur-md ${
              shop.is_open
                ? 'bg-emerald-500/95 text-white'
                : 'bg-rose-500/95 text-white'
            }`}
          >
            {shop.is_open ? '● เปิดให้บริการ' : '○ ปิดทำการ'}
          </span>
        </div>

        {/* ชื่อร้านค้าและคะแนนรีวิว */}
        <div className="flex items-start justify-between gap-2 mb-1.5">
          <h3 className="font-bold text-base text-slate-900 truncate">{shop.shop_name}</h3>
          <div className="flex items-center gap-1 text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md shrink-0 border border-amber-200/50">
            <span>★</span>
            <span>{shop.rating > 0 ? shop.rating.toFixed(1) : '5.0'}</span>
          </div>
        </div>

        {/* ระยะทาง และ เวลาเปิด-ปิด */}
        <div className="flex items-center gap-2.5 text-xs text-slate-500 mb-3">
          <span className="flex items-center gap-1 text-blue-600 font-medium">
            📍 {shop.distance !== null ? `${shop.distance} กม.` : 'ใกล้ฉัน'}
          </span>
          <span>•</span>
          <span>
            🕒 {shop.open_time && shop.close_time ? `${shop.open_time.slice(0, 5)} - ${shop.close_time.slice(0, 5)} น.` : 'ไม่ระบุเวลา'}
          </span>
        </div>

        {/* รายการประเภทบริการ */}
        <div className="space-y-1 mb-4">
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">บริการเด่น</p>
          <div className="flex flex-wrap gap-1">
            {shop.service_types && shop.service_types.length > 0 ? (
              shop.service_types.map((type, idx) => (
                <span
                  key={idx}
                  className="bg-slate-100 text-slate-600 text-[11px] px-2 py-0.5 rounded-md font-medium"
                >
                  {type}
                </span>
              ))
            ) : (
              <span className="text-xs text-slate-400">ปริ้นท์งานทั่วไป</span>
            )}
          </div>
        </div>
      </div>

      {/* ราคาเริ่มต้น และ ลิงก์ไปหน้าสั่งงาน */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
        <div>
          <span className="text-[10px] text-slate-400 block leading-tight">ราคาเริ่มต้น</span>
          <p className="text-base font-bold text-blue-600">฿{shop.starting_price}</p>
        </div>
        

        <Link
            href={`/customer/order/${shop.id || (shop as any).shop_id || '1'}`}
            className="bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-xs font-semibold px-4 py-2 rounded-xl transition shadow-sm shadow-blue-200 inline-block text-center"
        >
        สั่งปริ้นท์งาน
        </Link>
      </div>
    </div>
  );
}