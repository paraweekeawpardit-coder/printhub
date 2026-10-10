import { Request, Response } from "express";
import supabase from "../../config/supabase.js";

/**
 * GET /api/admin/transactions
 * ดึงรายการธุรกรรมการชำระเงินทั้งหมด พร้อม Pagination
 */
export const getAllTransactions = async (req: Request, res: Response): Promise<Response> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data: transactions, error, count } = await supabase
      .from("payment")
      .select(`
        *,
        order:order_id (
          id,
          order_no,
          total_price,
          total_amount,
          subtotal_price,
          platform_fee,
          small_order_fee,
          order_date,
          status:current_status_id (
            id,
            state
          )
        ),
        sender_customer:sender (
          id,
          first_name,
          last_name,
          contact
        ),
        receiver_shop:receiver (
          id,
          shop_name,
          owner_name,
          email,
          phone
        )
      `, { count: "exact" })
      .order("payment_date", { ascending: false })
      .range(from, to);

    if (error) {
      console.error("Supabase transaction error:", error.message);
      return res.status(200).json({
        data: [],
        currentPage: page,
        totalPages: 0,
        totalCount: 0,
      });
    }

    const formattedTransactions = (transactions || []).map((tx: any) => {
      const amount = Number(tx.amount || tx.order?.total_amount || tx.order?.total_price || 0);

      const dbSmallFee = Number(tx.order?.small_order_fee || 0);
      const dbPlatformFee = Number(tx.order?.platform_fee || 0);

      let platformFee = dbSmallFee + dbPlatformFee;
      if (platformFee === 0 && amount > 0) {
        platformFee = Number(tx.platform_fee || (amount < 50 ? 20 : Number((amount * 0.08).toFixed(2))));
      }

      const shopIncome = Number((amount - platformFee).toFixed(2));
      const rawOrderNo = tx.order?.order_no ? String(tx.order.order_no) : null;

      return {
        ...tx,
        amount: amount,
        platform_fee: platformFee,
        shop_income: Math.max(0, shopIncome),
        customer_name: tx.sender_customer 
          ? `${tx.sender_customer.first_name || ""} ${tx.sender_customer.last_name || ""}`.trim()
          : "-",
        shop_name: tx.receiver_shop?.shop_name || "-",
        order_no: rawOrderNo ? `#${rawOrderNo}` : "-",
        order_id: rawOrderNo ? `#${rawOrderNo}` : (tx.order_id || "-"),
      };
    });

    return res.status(200).json({
      data: formattedTransactions,
      currentPage: page,
      totalPages: count ? Math.ceil(count / limit) : 0,
      totalCount: count || 0,
    });
  } catch (err: any) {
    console.error("GetAllTransactions Exception:", err.message || err);
    return res.status(200).json({
      data: [],
      currentPage: 1,
      totalPages: 0,
      totalCount: 0,
    });
  }
};