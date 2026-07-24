import Fastify from "fastify";
import { config } from "./config.js";
import { healthRoutes } from "./routes/health.js";

async function main(): Promise<void> {
  const app = Fastify({
    logger: true,
  });

  // Routes
  await app.register(healthRoutes);

  try {
    await app.listen({ host: config.host, port: config.port });
    app.log.info(`Claudy Map server listening on ${config.host}:${config.port}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

main();
