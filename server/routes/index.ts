import { Router } from "express";
import authRoutes from "./auth.js";
import favoritesRoutes from "./favorites.js";
import historyRoutes from "./history.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/favorites", favoritesRoutes);
router.use("/history", historyRoutes);

/**
 * @openapi
 * /health:
 *   get:
 *     summary: Verifica o status da API
 *     description: Endpoint simples para verificar se a API está funcionando.
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
 */
// Health check
router.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

export default router;
