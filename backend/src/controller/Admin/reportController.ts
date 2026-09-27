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

    if (error) {
      console.error("GetAllReports Error:", error.message);
      return res.status(200).json([]);
    }

    return res.status(200).json(reports ?? []);
  } catch (err: any) {
    console.error("GetAllReports Exception:", err.message || err);
    return res.status(200).json([]);
  }
};

/**
 * PATCH /api/admin/reports/verify
 */
export const verifyReport = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { report_id, is_verified } = req.body;

    if (!report_id || typeof is_verified !== "boolean") {
      return res.status(400).json({ error: "report_id and is_verified (boolean) are required" });
    }

    const { data: updatedReport, error } = await supabase
      .from("report")
      .update({ is_verify: is_verified })
      .eq("id", report_id)
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(200).json({
      message: "Report verification updated successfully",
      data: updatedReport,
    });
  } catch (err: any) {
    console.error("VerifyReport Error:", err.message || err);
    return res.status(500).json({ error: "Server Error" });
  }
};