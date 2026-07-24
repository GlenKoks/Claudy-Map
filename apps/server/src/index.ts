import Fastify from "fastify";
import { config, isAuthConfigured } from "./config.js";
import { healthRoutes } from "./routes/health.js";
import { authRoutes } from "./routes/auth.js";

async function main(): Promise<void> {
  const app = Fastify({
    logger: true,
  });

  // Routes
  await app.register(healthRoutes);
  await app.register(authRoutes);

  try {
    await app.listen({ host: config.host, port: config.port });
    app.log.info(
      `Claudy Map server listening on ${config.host}:${config.port}`,
    );
    if (!isAuthConfigured()) {
      app.log.warn(
        "Auth is NOT fully configured — /auth/telegram will return 503. " +
          "Set SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, SUPABASE_ANON_KEY and TELEGRAM_BOT_TOKEN.",
      );
    }
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

main();
