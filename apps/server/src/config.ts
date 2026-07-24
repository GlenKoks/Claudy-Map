import "dotenv/config";

/**
 * Centralised access to environment variables.
 */
export const config = {
  /** HTTP server */
  host: process.env.HOST ?? "0.0.0.0",
  port: Number(process.env.PORT ?? 3000),
  nodeEnv: process.env.NODE_ENV ?? "development",

  /** Supabase */
  supabaseUrl: process.env.SUPABASE_URL ?? "",
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY ?? "",
  supabaseAnonKey: process.env.SUPABASE_ANON_KEY ?? "",

  /** Telegram bot */
  telegramBotToken: process.env.TELEGRAM_BOT_TOKEN ?? "",
  telegramBotUsername: process.env.TELEGRAM_BOT_USERNAME ?? "",
  /** Max age (seconds) of a Telegram auth_date before it is rejected. */
  telegramAuthMaxAgeSeconds: Number(
    process.env.TELEGRAM_AUTH_MAX_AGE_SECONDS ?? 86400,
  ),

  /** OSRM routing engine */
  osrmUrl: process.env.OSRM_URL ?? "",
} as const;

export type Config = typeof config;

/** Whether the Supabase + Telegram integration is fully configured. */
export function isAuthConfigured(): boolean {
  return Boolean(
    config.supabaseUrl &&
      config.supabaseServiceRoleKey &&
      config.supabaseAnonKey &&
      config.telegramBotToken,
  );
}
