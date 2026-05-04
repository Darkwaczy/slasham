import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config({ path: "server/.env" });

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function test() {
  console.log("Testing insert into vouchers with service_role...");
  const { data, error } = await supabase
    .from("vouchers")
    .insert({
      user_id: "00000000-0000-0000-0000-000000000000",
      deal_id: "00000000-0000-0000-0000-000000000000",
      voucher_code: "TEST-VOUCHER",
      payment_id: "00000000-0000-0000-0000-000000000000",
      status: "ACTIVE"
    });
  
  if (error) {
    console.error("Error:", error);
  } else {
    console.log("Success! RLS bypassed.");
  }
}
test();
