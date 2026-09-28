import { Request, Response } from "express";
import supabase from "../../config/supabase.js";

/**
 * GET /api/admin/shops/pending
 */
export const getPendingShops = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { data: shops, error } = await supabase
      .from("print_shop")
      .select("*")
      .or("is_verify.eq.false,is_verify.is.null,is_verified.eq.false,is_verified.is.null,status.eq.pending")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("GetPendingShops Error:", error.message);
      const { data: fallbackShops } = await supabase
        .from("print_shop")
        .select("*")
        .order("created_at", { ascending: false });
        
      return res.status(200).json(fallbackShops ?? []);
    }

    return res.status(200).json(shops ?? []);
  } catch (err: any) {
    console.error("GetPendingShops Exception:", err.message || err);
    return res.status(200).json([]);
  }
};

/**
 * PATCH /api/admin/shops/verify
 */
export const verifyShop = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { shop_id, action } = req.body;

    if (!shop_id || !action) {
      return res.status(400).json({ error: "shop_id and action are required" });
    }

    const isApproved = action === "approve";
    const updateData: any = {
      is_verify: isApproved,
      status: isApproved ? "approved" : "rejected",
    };

    try {
      updateData.is_verified = isApproved;
    } catch (e) {}

    const { data: updatedShop, error } = await supabase
      .from("print_shop")
      .update(updateData)
      .eq("id", shop_id)
      .select()
      .single();

    if (error) {
      const { data: retryShop, error: retryError } = await supabase
        .from("print_shop")
        .update({ is_verify: isApproved })
        .eq("id", shop_id)
        .select()
        .single();

      if (retryError) {
        return res.status(400).json({ error: retryError.message });
      }

      return res.status(200).json({
        message: `Shop registration ${action}ed successfully`,
        data: retryShop,
      });
    }

    return res.status(200).json({
      message: `Shop registration ${action}ed successfully`,
      data: updatedShop,
    });
  } catch (err: any) {
    console.error("VerifyShop Error:", err.message || err);
    return res.status(500).json({ error: "Server Error" });
  }
};