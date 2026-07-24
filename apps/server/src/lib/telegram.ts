import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import type { TelegramAuthData } from "@claudy-map/shared-types";

/**
 * Verify the authenticity of a Telegram Login Widget payload.
 *
 * Algorithm (https://core.telegram.org/widgets/login#checking-authorization):
 *  1. secret_key = SHA256(bot_token)
 *  2. data_check_string = join sorted "key=value" pairs (excluding `hash`) with "\n"
 *  3. valid if HMAC_SHA256(data_check_string, secret_key) === hash
 *
 * Also enforces a freshness window on `auth_date`.
 */
export function verifyTelegramAuth(
  data: TelegramAuthData,
  botToken: string,
  maxAgeSeconds: number,
): { ok: true } | { ok: false; reason: string } {
  const { hash, ...fields } = data;

  if (!hash) {
    return { ok: false, reason: "missing hash" };
  }

  const dataCheckString = Object.keys(fields)
    .filter((key) => {
      const value = (fields as Record<string, unknown>)[key];
      return value !== undefined && value !== null;
    })
    .sort()
    .map((key) => `${key}=${(fields as Record<string, unknown>)[key]}`)
    .join("\n");

  const secretKey = createHash("sha256").update(botToken).digest();
  const computedHash = createHmac("sha256", secretKey)
    .update(dataCheckString)
    .digest("hex");

  const computedBuf = Buffer.from(computedHash, "hex");
  const providedBuf = Buffer.from(hash, "hex");
  if (
    computedBuf.length !== providedBuf.length ||
    !timingSafeEqual(computedBuf, providedBuf)
  ) {
    return { ok: false, reason: "hash mismatch" };
  }

  const nowSeconds = Math.floor(Date.now() / 1000);
  if (nowSeconds - data.auth_date > maxAgeSeconds) {
    return { ok: false, reason: "auth_date expired" };
  }

  return { ok: true };
}
