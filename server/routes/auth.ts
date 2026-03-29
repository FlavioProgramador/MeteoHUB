import { Router } from "express";
import {
  getProfile,
  login,
  logout,
  refresh,
  register,
} from "../controllers/authController.js";
import { asyncErrorWrapper } from "../middleware/asyncWrapper.js";
import { authenticate } from "../middleware/auth.js";

const router = Router();

router.post("/register", asyncErrorWrapper(register as any));
router.post("/login", asyncErrorWrapper(login as any));
router.post("/refresh", asyncErrorWrapper(refresh as any));
router.post("/logout", asyncErrorWrapper(logout as any));
router.get("/profile", authenticate, asyncErrorWrapper(getProfile as any));
export default router;
