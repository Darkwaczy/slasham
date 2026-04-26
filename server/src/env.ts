import dotenv from "dotenv";
dotenv.config();

export type Env = {
  port: number;
  nodeEnv: string;
  corsOrigins: string[];
  supabaseUrl?: string;
  supabaseServiceRoleKey?: string;
  resendApiKey?: string;
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
      : ["http://localhost:3000", "http://localhost:5173", "http://127.0.0.1:3000", "http://127.0.0.1:5173"],
    supabaseUrl: process.env.SUPABASE_URL,
    supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
    resendApiKey: process.env.RESEND_API_KEY,
  };

  return cached;
}

