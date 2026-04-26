import { Router } from "express";
import { getSupabaseAdmin } from "../supabase";

const router = Router();

router.get("/", (_req, res) => {
  const supabaseReady = !!getSupabaseAdmin();
  res.json({
    status: "ok",
    message: "Slasham API is running",
    supabaseReady,
  });
});

export default router;

