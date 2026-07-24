// Claudy Map — shared types
//
// Types shared between the mobile app and the server. Grows per stage.

// ---------------------------------------------------------------------------
// Auth (Stage 1 — onboarding & authorization)
// ---------------------------------------------------------------------------

/**
 * Payload produced by the Telegram Login Widget.
 * See https://core.telegram.org/widgets/login#receiving-authorization-data
 */
export interface TelegramAuthData {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  auth_date: number;
  hash: string;
}

/** Minimal authenticated user exposed to the client. */
export interface AuthUser {
  id: string;
  telegramId: number;
  username?: string;
  firstName?: string;
  lastName?: string;
  photoUrl?: string;
}

/** Supabase session tokens the client sets via `supabase.auth.setSession`. */
export interface AuthSession {
  accessToken: string;
  refreshToken: string;
  /** Unix seconds when the access token expires (if known). */
  expiresAt?: number;
}

/** Response of `POST /auth/telegram`. */
export interface TelegramAuthResponse {
  user: AuthUser;
  session: AuthSession;
}

/** Generic error envelope returned by auth endpoints. */
export interface AuthErrorResponse {
  error: string;
}
