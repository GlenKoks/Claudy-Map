import "dotenv/config";

/**
 * Centralised access to environment variables.
 */
export const config = {
  /** HTTP server */
  host: process.env.HOST ?? "0.0.0.0",
  port: Number(process.env.PORT ?? 3000),
  nodeEnv: process.env.NODE_ENV ?? "development",

  /** Supabase (used in later stages) */
  supabaseUrl: process.env.SUPABASE_URL ?? "",
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY ?? "",

  /** Telegram bot (used in later stages) */
  telegramBotToken: process.env.TELEGRAM_BOT_TOKEN ?? "",

  /** OSRM routing engine */
  osrmUrl: process.env.OSRM_URL ?? "",
} as const;

export type Config = typeof config;
