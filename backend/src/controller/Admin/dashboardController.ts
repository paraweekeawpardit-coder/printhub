import { Request, Response } from "express";
import supabase from "../../config/supabase.js";

interface PaymentRow {
  amount?: number;
  payment_date?: string;
  created_at?: string;
}

/**
 * GET /api/admin/dashboard-stats
 */
export const getPlatformStats = async (req: Request, res: Response): Promise<Response> => {
  let customerCount = 0;
  let shopCount = 0;
  let totalPlatformIncome = 0;
  let pendingReports = 0;
  let dailyIncome: { name: string; income: number }[] = [];

  try {
    const { count } = await supabase
      .from("customer")
      .select("*", { count: "exact", head: true });
    customerCount = count ?? 0;
  } catch (err: any) {
    console.warn("Customer table error:", err.message || err);
  }

  try {
    const { count } = await supabase
      .from("print_shop")
      .select("*", { count: "exact", head: true })
      .or("is_verify.eq.true,is_verified.eq.true");
    shopCount = count ?? 0;
  } catch (err: any) {
    console.warn("Print Shop table error:", err.message || err);
  }

  try {
    const { data: payments } = await supabase
      .from("payment")
      .select("amount, payment_date, created_at");

    if (payments) {
      const paymentRows = payments as PaymentRow[];
      const sumIncome = paymentRows.reduce((sum, row) => sum + (row.amount || 0) * 0.05, 0);
      totalPlatformIncome = Number(sumIncome.toFixed(2));

      const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      const last7DaysMap: { [key: string]: { name: string; income: number } } = {};

      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dateStr = d.toISOString().split("T")[0];
        last7DaysMap[dateStr] = { name: daysOfWeek[d.getDay()], income: 0 };
      }

      paymentRows.forEach((p) => {
        const rawDate = p.payment_date || p.created_at;
        if (rawDate) {
          const pDateStr = new Date(rawDate).toISOString().split("T")[0];
          if (last7DaysMap[pDateStr]) {
            last7DaysMap[pDateStr].income += (p.amount || 0) * 0.05;
          }
        }
      });

      dailyIncome = Object.values(last7DaysMap).map((item) => ({
        name: item.name,
        income: Number(item.income.toFixed(2)),
      }));
    }
  } catch (err: any) {
    console.warn("Payment table error:", err.message || err);
  }

  try {
    const { count } = await supabase
      .from("report")
      .select("*", { count: "exact", head: true })
      .or("is_verify.eq.false,is_verify.is.null");
    pendingReports = count ?? 0;
  } catch (err: any) {
    console.warn("Report table error:", err.message || err);
  }

  return res.status(200).json({
    totalCustomers: customerCount,
    totalActiveShops: shopCount,
    totalPlatformIncome,
    pendingReports,
    dailyIncome,
  });
};