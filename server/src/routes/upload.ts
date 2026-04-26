import { Router } from "express";
import multer from "multer";
import { getSupabaseAdmin } from "../supabase";
import crypto from "crypto";

const router = Router();

// Configure multer to hold the file in memory
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

router.post("/image", upload.single("image"), async (req, res) => {
  try {
    const file = req.file;
    const { bucket } = req.body; // e.g., 'merchant-logos' or 'deal-images'

    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    if (!bucket) {
      return res.status(400).json({ error: "Bucket name is required" });
    }

    const supabase = getSupabaseAdmin();
    if (!supabase) return res.status(500).json({ error: "DB not configured" });

    // Generate a unique file name
    const fileExt = file.originalname.split(".").pop();
    const fileName = `${crypto.randomUUID()}.${fileExt}`;
    const filePath = `${fileName}`;

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
        upsert: false,
      });

    if (error) throw error;

    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    res.json({
      message: "Upload successful",
      url: publicUrlData.publicUrl,
      path: data.path,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Upload failed" });
  }
});

export default router;
