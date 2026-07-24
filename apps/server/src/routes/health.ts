import type { FastifyInstance } from "fastify";

/**
 * Health-check route.
 * GET /health -> { status: "ok" }
 */
export async function healthRoutes(app: FastifyInstance): Promise<void> {
  app.get("/health", async () => {
    return { status: "ok" };
  });
}
