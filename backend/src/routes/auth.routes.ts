// routes/auth.routes.ts
import { Router } from "express";
import { signup, login, getUserDetails } from "../controllers/auth.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { signupSchema, loginSchema } from "../schemas/auth.schema.js";
import { validate } from "../middlewares/zod.middleware.js";

const router = Router();

router.post("/signup", validate(signupSchema), signup);
router.post("/login", validate(loginSchema), login);

router.get("/me", authenticate, getUserDetails)

export default router;
