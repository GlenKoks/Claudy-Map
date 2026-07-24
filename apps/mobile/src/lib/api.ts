import type {
  TelegramAuthData,
  TelegramAuthResponse,
} from "@claudy-map/shared-types";
import { appConfig } from "./config";

/**
 * Send a Telegram Login Widget payload to the server, which verifies the hash
 * and returns a Supabase session + user.
 */
export async function authenticateWithTelegram(
  payload: TelegramAuthData,
): Promise<TelegramAuthResponse> {
  const res = await fetch(`${appConfig.apiUrl}/auth/telegram`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    let message = `Auth failed (HTTP ${res.status})`;
    try {
      const body = (await res.json()) as { error?: string };
      if (body.error) message = body.error;
    } catch {
      // ignore parse errors
    }
    throw new Error(message);
  }

  return (await res.json()) as TelegramAuthResponse;
}
