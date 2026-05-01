import dotenv from "dotenv";
dotenv.config();

export type Env = {
  port: number;
  nodeEnv: string;
  corsOrigins: string[];
  supabaseUrl?: string;
  supabaseServiceRoleKey?: string;
  supabaseAnonKey?: string;
  resendApiKey?: string;
  jwtSecret: string;
  clientUrl: string;
  apiUrl: string;
  adminEmails: string[];
  paystackSecretKey?: string;
  paystackPublicKey?: string;
  paystackWebhookSecret?: string;
};

let cached: Env | null = null;

function splitCsv(value: string | undefined): string[] {
  return (value ?? "")
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);
}

export function getEnv(): Env {
  if (cached) return cached;

  const portRaw = process.env.PORT ?? "5000";
  const port = Number.parseInt(portRaw, 10);

  cached = {
    port: Number.isFinite(port) ? port : 5000,
    nodeEnv: process.env.NODE_ENV ?? "development",
    corsOrigins: splitCsv(process.env.CORS_ORIGINS).length
      ? splitCsv(process.env.CORS_ORIGINS)
      : [
          "http://localhost:3000",
          "http://localhost:5173",
          "http://127.0.0.1:3000",
          "http://127.0.0.1:5173",
          "https://slasham.com",
          "https://www.slasham.com",
        ],
    supabaseUrl: process.env.SUPABASE_URL,
    supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
    supabaseAnonKey: process.env.SUPABASE_ANON_KEY,
    resendApiKey: process.env.RESEND_API_KEY,
    jwtSecret: process.env.JWT_SECRET ?? "default_secret_for_dev_only",
    clientUrl: process.env.CLIENT_URL ?? "https://www.slasham.com",
    apiUrl: process.env.API_URL ?? "https://api.slasham.com",
    adminEmails: splitCsv(process.env.ADMIN_EMAILS),
    paystackSecretKey: process.env.PAYSTACK_SECRET_KEY,
    paystackPublicKey: process.env.PAYSTACK_PUBLIC_KEY,
    paystackWebhookSecret: process.env.PAYSTACK_WEBHOOK_SECRET,
  };

  return cached;
}

