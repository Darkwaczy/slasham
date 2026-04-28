import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import healthRouter from "./routes/health";
import authRouter from "./routes/auth";
import uploadRouter from "./routes/upload";
import merchantsRouter from "./routes/merchants";
import dealsRouter from "./routes/deals";
import vouchersRouter from "./routes/vouchers";
import adminRouter from "./routes/admin";
import userRouter from "./routes/user";
import { getEnv } from "./env";

export function createApp() {
  const env = getEnv();
  const app = express();

  // ✅ Required for Vercel/proxied environments
  app.set("trust proxy", 1);

  // ── Security Headers ─────────────────────────────────────────────────────
  app.use(helmet());

  // ── CORS ─────────────────────────────────────────────────────────────────
  app.use(
    cors({
      origin: env.corsOrigins,
      credentials: true,
    })
  );

  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true, limit: "10mb" }));
  app.use(cookieParser());

  // ── Rate Limiters ─────────────────────────────────────────────────────────
  // Custom key generator to extract real client IP from Vercel/Cloudflare headers
  const resolveIp = (req: any) => {
    return (req.headers["x-forwarded-for"] as string)?.split(",")[0].trim() || req.ip || "unknown";
  };

  const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    keyGenerator: resolveIp,
    message: { error: "Too many login attempts. Please try again in 15 minutes." },
    standardHeaders: true,
    legacyHeaders: false,
  });

  const registerLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 5,
    keyGenerator: resolveIp,
    message: { error: "Too many accounts created from this IP. Please try again later." },
    standardHeaders: true,
    legacyHeaders: false,
  });

  const otpLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    keyGenerator: resolveIp,
    message: { error: "Too many verification attempts. Please try again later." },
    standardHeaders: true,
    legacyHeaders: false,
  });

  // Apply rate limiters to sensitive auth endpoints
  app.use("/api/auth/login", loginLimiter);
  app.use("/api/auth/register", registerLimiter);
  app.use("/api/auth/verify-otp", otpLimiter);

  // ── Routes ────────────────────────────────────────────────────────────────
  app.get("/", (_req, res) => res.redirect("/health"));
  app.use("/health", healthRouter);
  app.use("/api/auth", authRouter);
  app.use("/api/upload", uploadRouter);
  app.use("/api/merchants", merchantsRouter);
  app.use("/api/deals", dealsRouter);
  app.use("/api/vouchers", vouchersRouter);
  app.use("/api/admin", adminRouter);
  app.use("/api/user", userRouter);

  // ── Production: Serve React App & BrowserRouter Catch-All ────────────────
  if (env.nodeEnv === "production") {
    const path = require("path") as typeof import("path");
    // Resolve dist folder relative to this compiled file (server/dist/src/ → ../../dist)
    const distPath = path.resolve(__dirname, "../../dist");

    // Serve the built React static files
    app.use(express.static(distPath));

    // Catch-all: any route not matched by the API gets index.html
    // This is REQUIRED for BrowserRouter to work on page refresh
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  return app;
}

export default createApp;


