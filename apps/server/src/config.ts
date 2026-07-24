import "dotenv/config";

/**
 * Centralised access to environment variables.
 *
 * Stage 0: only the essentials for booting the server and (later) talking to
 * Supabase / Telegram / OSRM. Values are read lazily and left optional for now
 * so the server can start without a fully populated .env during development.
 */
export const config = {
  /** HTTP server */
  host: process.env.HOST ?? "0.0.0.0",
  port: Number(process.env.PORT ?? 3000),
  nodeEnv: process.env.NODE_ENV ?? "development",

  /** Supabase */
  supabaseUrl: process.env.SUPABASE_URL ?? "",
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY ?? "",

  /** Telegram bot */
  telegramBotToken: process.env.TELEGRAM_BOT_TOKEN ?? "",

  /** OSRM routing engine */
  osrmUrl: process.env.OSRM_URL ?? "",
} as const;

export type Config = typeof config;
