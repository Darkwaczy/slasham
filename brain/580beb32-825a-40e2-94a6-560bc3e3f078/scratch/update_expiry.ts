import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config({ path: "server/.env" });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function updateExpiry() {
  const { data, error } = await supabase
    .from("deals")
    .update({ expiry_date: "2026-12-31 00:00:00+00" })
    .eq("id", "a0ac3f23-9bdc-4c02-8e38-cb8bf9ac07e3");

  if (error) {
    console.error("Error updating deal expiry:", error.message);
  } else {
    console.log("Successfully updated deal expiry");
  }
}

updateExpiry();
