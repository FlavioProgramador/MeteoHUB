import { Router, type RequestHandler } from "express";
import {
  getProfile,
  login,
  logout,
  refresh,
  register,
  forgotPassword,
  resetPassword
} from "../controllers/authController.js";
import { asyncErrorWrapper } from "../middleware/asyncWrapper.js";
import { authenticate } from "../middleware/auth.js";
import rateLimit from "express-rate-limit";

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { error: "Muitas tentativas de login de um mesmo IP. Por favor, tente novamente após 15 minutos." }
});

const router = Router();

router.post("/register", asyncErrorWrapper(register as RequestHandler));
router.post("/login", loginLimiter, asyncErrorWrapper(login as RequestHandler));
router.post("/refresh", asyncErrorWrapper(refresh as RequestHandler));
router.post("/logout", asyncErrorWrapper(logout as RequestHandler));
router.get("/profile", authenticate as RequestHandler, asyncErrorWrapper(getProfile as RequestHandler));
router.post("/forgot-password", asyncErrorWrapper(forgotPassword as RequestHandler));
router.post("/reset-password", asyncErrorWrapper(resetPassword as RequestHandler));

export default router;
