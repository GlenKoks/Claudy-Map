// Client configuration, read from EXPO_PUBLIC_* env vars (inlined at build time).
// Copy apps/mobile/.env.example to apps/mobile/.env and fill in values.

export const appConfig = {
  /** Base URL of the Claudy Map server (Fastify). */
  apiUrl: process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:3000",

  /** Supabase project (for holding the session created by the server). */
  supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL ?? "",
  supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? "",

  /** Telegram bot username (used to build the login-widget page URL). */
  telegramBotUsername: process.env.EXPO_PUBLIC_TELEGRAM_BOT_USERNAME ?? "",

  /**
   * Dev bypass: when enabled, an extra "dev login" button lets you skip
   * Telegram/Supabase and enter the app with a mock user. Defaults to on in
   * development builds, off otherwise.
   */
  allowDevLogin:
    (process.env.EXPO_PUBLIC_ALLOW_DEV_LOGIN ?? String(__DEV__)) === "true",

  /**
   * Privacy policy version the user must accept. Bump this to force re-consent
   * when the policy changes.
   */
  privacyPolicyVersion: "2026-07-24",
} as const;

/** Whether a real Supabase-backed session can be established. */
export const isSupabaseConfigured = Boolean(
  appConfig.supabaseUrl && appConfig.supabaseAnonKey,
);

/** URL of the server-hosted Telegram login widget page. */
export const telegramLoginPageUrl = `${appConfig.apiUrl}/auth/telegram/login-page`;
