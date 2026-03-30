import { Router, type RequestHandler } from "express";
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

router.post("/register", asyncErrorWrapper(register as RequestHandler));
router.post("/login", asyncErrorWrapper(login as RequestHandler));
router.post("/refresh", asyncErrorWrapper(refresh as RequestHandler));
router.post("/logout", asyncErrorWrapper(logout as RequestHandler));
router.get("/profile", authenticate as RequestHandler, asyncErrorWrapper(getProfile as RequestHandler));
export default router;
