import { Router } from "express";
import authRoutes from "./auth.js";
import favoritesRoutes from "./favorites.js";
import historyRoutes from "./history.js";
import prisma from "../utils/prisma.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/favorites", favoritesRoutes);
router.use("/history", historyRoutes);

/**
 * @openapi
 * /health:
 *   get:
 *     summary: Verifica o status da API e métricas de saúde
 *     description: Retorna o status da API, saúde do banco de dados e métricas do processo.
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "ok"
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                 uptime:
 *                   type: number
 *                 memory:
 *                   type: object
 *                   properties:
 *                     rss:
 *                       type: number
 *                     heapUsed:
 *                       type: number
 *                     heapTotal:
 *                       type: number
 *                 database:
 *                   type: string
 *                   enum: ["connected", "disconnected"]
 */
router.get("/health", async (_req, res) => {
  const memoryUsage = process.memoryUsage();
  let dbStatus = "disconnected";

  try {
    await prisma.$queryRaw`SELECT 1`;
    dbStatus = "connected";
  } catch {
    // DB is unreachable
  }

  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: {
      rss: `${Math.round(memoryUsage.rss / 1024 / 1024)}MB`,
      heapUsed: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)}MB`,
      heapTotal: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)}MB`,
    },
    database: dbStatus,
  });
});

export default router;
