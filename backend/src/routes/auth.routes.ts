// routes/auth.routes.ts
import { Router } from "express";
import { signup, login, getUserDetails, updateUser } from "../controllers/auth.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { signupSchema, loginSchema, updateUserSchema } from "../schemas/auth.schema.js";
import { validate } from "../middlewares/zod.middleware.js";

const router = Router();

router.post("/signup", validate(signupSchema), signup);
router.post("/login", validate(loginSchema), login);

router.get("/me", authenticate, getUserDetails)
router.put("/me", authenticate, validate(updateUserSchema), updateUser);


export default router;
