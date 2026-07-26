import 'dotenv/config';
const isProduction = process.env.NODE_ENV === "production";

export const SERVER_PORT = Number(process.env.PORT || 8081);

// JWT_SECRET must be explicitly set and be at least 32 characters
if (!process.env.JWT_SECRET) {
  if (isProduction) {
    throw new Error("CRITICAL: Missing JWT_SECRET in production environment. Generate one with: node -e \"console.log(require('crypto').randomBytes(64).toString('hex'))\"");
  }
  console.warn("⚠️  WARNING: JWT_SECRET not set. Using dev-only fallback. NEVER deploy this to production!");
}

if (process.env.JWT_SECRET && process.env.JWT_SECRET.length < 32) {
  console.warn("⚠️  WARNING: JWT_SECRET is too short (< 32 chars). Use a longer, random secret for security.");
}

export const JWT_SECRET = process.env.JWT_SECRET || "dev-only-DO-NOT-USE-IN-PRODUCTION-" + Date.now();

export const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:8080";
export const API_BASE_PATH = process.env.API_BASE_PATH || "/api";

export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || "";
export const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || "";

export const ACB_HISTORY_API_URL = process.env.ACB_HISTORY_API_URL || "";
export const ACB_CRON_SCHEDULE = process.env.ACB_CRON_SCHEDULE || "*/2 * * * *";
export const ENABLE_ACB_CRON = isProduction && process.env.ENABLE_ACB_CRON !== "false";

export const SMTP_HOST = process.env.SMTP_HOST || "smtp.gmail.com";
export const SMTP_PORT = Number(process.env.SMTP_PORT || 587);
export const SMTP_USER = process.env.SMTP_USER || "";
export const SMTP_PASS = process.env.SMTP_PASS || "";
export const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "";


