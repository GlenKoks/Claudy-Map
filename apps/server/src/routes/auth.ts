import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import type {
  AuthUser,
  TelegramAuthData,
  TelegramAuthResponse,
} from "@claudy-map/shared-types";
import { config, isAuthConfigured } from "../config.js";
import { verifyTelegramAuth } from "../lib/telegram.js";
import { createAdminClient, createAnonClient } from "../lib/supabase.js";

/** Synthetic email used to key a Telegram user inside Supabase Auth. */
function telegramEmail(telegramId: number): string {
  return `tg_${telegramId}@telegram.local`;
}

function parseTelegramBody(body: unknown): TelegramAuthData | null {
  if (typeof body !== "object" || body === null) return null;
  const b = body as Record<string, unknown>;
  if (typeof b.id !== "number") return null;
  if (typeof b.first_name !== "string") return null;
  if (typeof b.auth_date !== "number") return null;
  if (typeof b.hash !== "string") return null;
  return {
    id: b.id,
    first_name: b.first_name,
    last_name: typeof b.last_name === "string" ? b.last_name : undefined,
    username: typeof b.username === "string" ? b.username : undefined,
    photo_url: typeof b.photo_url === "string" ? b.photo_url : undefined,
    auth_date: b.auth_date,
    hash: b.hash,
  };
}

/**
 * HTML page hosting the Telegram Login Widget. The mobile app loads this URL
 * in a WebView. Telegram validates the *page domain* against the domain set
 * for the bot via @BotFather (/setdomain), so this must be served from the
 * public domain registered there. On success the widget posts the auth
 * payload back to the React Native WebView via `window.ReactNativeWebView`.
 */
function telegramLoginPage(botUsername: string): string {
  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Claudy Map — Telegram login</title>
    <style>
      html, body { height: 100%; margin: 0; }
      body {
        display: flex; align-items: center; justify-content: center;
        font-family: -apple-system, Roboto, sans-serif; background: #fff;
      }
    </style>
  </head>
  <body>
    <script
      async
      src="https://telegram.org/js/telegram-widget.js?22"
      data-telegram-login="${botUsername}"
      data-size="large"
      data-userpic="true"
      data-request-access="write"
      data-onauth="onTelegramAuth(user)"
    ></script>
    <script>
      function onTelegramAuth(user) {
        if (window.ReactNativeWebView) {
          window.ReactNativeWebView.postMessage(JSON.stringify(user));
        }
      }
    </script>
  </body>
</html>`;
}

export async function authRoutes(app: FastifyInstance): Promise<void> {
  app.get(
    "/auth/telegram/login-page",
    async (_request: FastifyRequest, reply: FastifyReply) => {
      if (!config.telegramBotUsername) {
        return reply
          .status(503)
          .type("text/html")
          .send("<p>TELEGRAM_BOT_USERNAME is not configured.</p>");
      }
      return reply
        .type("text/html")
        .send(telegramLoginPage(config.telegramBotUsername));
    },
  );

  app.post(
    "/auth/telegram",
    async (request: FastifyRequest, reply: FastifyReply) => {
      if (!isAuthConfigured()) {
        return reply.status(503).send({
          error:
            "Auth is not configured on the server (missing Supabase/Telegram env vars).",
        });
      }

      const data = parseTelegramBody(request.body);
      if (!data) {
        return reply
          .status(400)
          .send({ error: "Invalid Telegram auth payload." });
      }

      const verification = verifyTelegramAuth(
        data,
        config.telegramBotToken,
        config.telegramAuthMaxAgeSeconds,
      );
      if (!verification.ok) {
        request.log.warn(
          { reason: verification.reason },
          "Telegram auth verification failed",
        );
        return reply
          .status(401)
          .send({ error: "Telegram authorization could not be verified." });
      }

      const email = telegramEmail(data.id);
      const userMetadata = {
        provider: "telegram",
        telegram_id: data.id,
        username: data.username ?? null,
        first_name: data.first_name,
        last_name: data.last_name ?? null,
        photo_url: data.photo_url ?? null,
      };

      const admin = createAdminClient();

      // Create the user on first login; ignore "already registered".
      const created = await admin.auth.admin.createUser({
        email,
        email_confirm: true,
        user_metadata: userMetadata,
      });
      if (created.error && !/registered|exists/i.test(created.error.message)) {
        request.log.error(
          { err: created.error },
          "Supabase createUser failed",
        );
        return reply.status(500).send({ error: "Could not create user." });
      }

      // Generate a magic-link OTP for the (now existing) user.
      const link = await admin.auth.admin.generateLink({
        type: "magiclink",
        email,
      });
      if (link.error || !link.data.properties) {
        request.log.error({ err: link.error }, "Supabase generateLink failed");
        return reply.status(500).send({ error: "Could not create session." });
      }

      const userId = link.data.user?.id;
      // Refresh metadata on every login (username / photo may change).
      if (userId) {
        await admin.auth.admin.updateUserById(userId, {
          user_metadata: userMetadata,
        });
      }

      // Exchange the OTP for a real session using the anon client.
      const anon = createAnonClient();
      const verify = await anon.auth.verifyOtp({
        type: "magiclink",
        token_hash: link.data.properties.hashed_token,
      });
      if (verify.error || !verify.data.session) {
        request.log.error({ err: verify.error }, "Supabase verifyOtp failed");
        return reply.status(500).send({ error: "Could not create session." });
      }

      const session = verify.data.session;
      const user: AuthUser = {
        id: userId ?? verify.data.user?.id ?? "",
        telegramId: data.id,
        username: data.username,
        firstName: data.first_name,
        lastName: data.last_name,
        photoUrl: data.photo_url,
      };

      const response: TelegramAuthResponse = {
        user,
        session: {
          accessToken: session.access_token,
          refreshToken: session.refresh_token,
          expiresAt: session.expires_at,
        },
      };
      return reply.send(response);
    },
  );
}
