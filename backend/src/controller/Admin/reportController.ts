import { Request, Response } from "express";
import supabase from "../../config/supabase.js";

/**
 * GET /api/admin/reports
 */
export const getAllReports = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { data: reports, error } = await supabase
      .from("report")
      .select("*")
      .order("created_at", { ascending: false });

    if (error || !reports) {
      console.error("GetAllReports Error:", error?.message);
      return res.status(200).json([]);
    }

    const customerIds = [...new Set(reports.map((r: any) => r.customer_id).filter(Boolean))];
    const shopIds = [...new Set(reports.map((r: any) => r.shop_id).filter(Boolean))];
    const orderIds = [...new Set(reports.map((r: any) => r.order_id).filter(Boolean))];

    const [{ data: customers }, { data: shops }, { data: orders }] = await Promise.all([
      customerIds.length > 0
        ? supabase.from("customer").select("id, first_name, last_name, contact").in("id", customerIds)
        : Promise.resolve({ data: [] }),
      shopIds.length > 0
        ? supabase.from("print_shop").select("id, shop_name, email, phone").in("id", shopIds)
        : Promise.resolve({ data: [] }),
      orderIds.length > 0
        ? supabase.from("print_order").select("id, order_no, total_price, total_amount, platform_fee, small_order_fee").in("id", orderIds)
        : Promise.resolve({ data: [] }),
    ]);

    const customerMap = new Map((customers || []).map((c: any) => [c.id, c]));
    const shopMap = new Map((shops || []).map((s: any) => [s.id, s]));
    const orderMap = new Map((orders || []).map((o: any) => [o.id, o]));

    const formattedReports = reports.map((item: any) => {
      const cust: any = customerMap.get(item.customer_id);
      const shp: any = shopMap.get(item.shop_id);
      const ord: any = orderMap.get(item.order_id);

      const custName = cust
        ? `${cust.first_name || ""} ${cust.last_name || ""}`.trim() || cust.contact
        : "-";

      const displayOrderNo = ord?.order_no
        ? `#${ord.order_no}`
        : item.order_id
        ? `#${item.order_id.slice(0, 8)}`
        : "-";

      return {
        ...item,
        status: item.status || "pending",
        order_no: displayOrderNo,
        order_id_display: displayOrderNo,
        total_price: ord?.total_amount || ord?.total_price || 0,
        customer_name: custName,
        customer_phone: cust?.contact || "-",
        shop_name: shp?.shop_name || "-",
        shop_phone: shp?.phone || "-",
        updated_at: item.updated_at || null,
      };
    });

    return res.status(200).json(formattedReports);
  } catch (err: any) {
    console.error("GetAllReports Exception:", err.message || err);
    return res.status(200).json([]);
  }
};

/**
 * PATCH /api/admin/reports/verify (รับเรื่องพิจารณา)
 */
export const verifyReport = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { report_id } = req.body;
    if (!report_id) return res.status(400).json({ error: "report_id is required" });

    const nowIso = new Date().toISOString();

    const { data, error } = await supabase
      .from("report")
      .update({
        status: "investigating",
        is_verified: true,
        updated_at: nowIso,
      })
      .eq("id", report_id)
      .select()
      .single();

    if (error) return res.status(400).json({ error: error.message });
    return res.status(200).json({ message: "Updated status to investigating", data });
  } catch (err: any) {
    console.error("VerifyReport Exception:", err);
    return res.status(500).json({ error: "Server Error" });
  }
};

/**
 * PATCH /api/admin/reports/resolve (ตัดสินเคส)
 */
export const resolveReport = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { report_id, decision, admin_note } = req.body;
    
    if (!report_id || !decision || !admin_note?.trim()) {
      return res.status(400).json({ error: "report_id, decision, and admin_note are required" });
    }

    const statusValue = decision === "approved" ? "resolved_refund" : "rejected";
    const nowIso = new Date().toISOString();

    const { data: report } = await supabase.from("report").select("*").eq("id", report_id).single();

    const { data: updatedReport, error } = await supabase
      .from("report")
      .update({
        status: statusValue,
        admin_note: admin_note.trim(),
        is_verified: true,
        updated_at: nowIso,
      })
      .eq("id", report_id)
      .select()
      .single();

    if (error) return res.status(400).json({ error: error.message });

    if (report?.order_id) {
      if (decision === "approved") {
        // กรณีอนุมัติคืนเงิน: เปลี่ยนสถานะเป็น "ยกเลิกการพิมพ์" เพื่อเข้าสู่ตารางคืนเงินลูกค้า
        const { data: statusObj } = await supabase
          .from("status")
          .select("id")
          .eq("state", "ยกเลิกการพิมพ์")
          .maybeSingle();

        if (statusObj) {
          await supabase
            .from("print_order")
            .update({ current_status_id: statusObj.id })
            .eq("id", report.order_id);
        }
      } else if (decision === "rejected") {
        // กรณีปฏิเสธคำร้อง: คิดค่าธรรมเนียมรวม (small_order_fee + platform_fee)
        const { data: order } = await supabase
          .from("print_order")
          .select("total_amount, total_price, platform_fee, small_order_fee")
          .eq("id", report.order_id)
          .single();

        const amount = Number(order?.total_amount || order?.total_price || 0);
        const smallFee = Number(order?.small_order_fee || 0);
        const percentFee = Number(order?.platform_fee || 0);

        // รวมค่าธรรมเนียมถ้าเป็น Small Order หรือ ออเดอร์ปกติ
        let totalFee = smallFee + percentFee;
        if (totalFee === 0 && amount > 0) {
          totalFee = Math.round(amount * 0.08 * 100) / 100;
        }

        const shopIncome = Math.max(0, amount - totalFee);

        // อัปเดตใน print_order
        await supabase
          .from("print_order")
          .update({
            shop_income: shopIncome,
          })
          .eq("id", report.order_id);

        // อัปเดตตาราง payment ให้สถานะเป็น 'pending_payout' เพื่อให้โผล่ในหน้า Shop Payouts ทันที
        await supabase
          .from("payment")
          .update({
            status: "pending_payout",
            platform_fee: totalFee,
            shop_income: shopIncome,
          })
          .eq("order_id", report.order_id);
      }
    }

    return res.status(200).json({ message: "Report resolved successfully", data: updatedReport });
  } catch (err: any) {
    console.error("ResolveReport Exception:", err);
    return res.status(500).json({ error: "Server Error" });
  }
};