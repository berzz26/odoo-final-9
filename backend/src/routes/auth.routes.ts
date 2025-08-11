import { Router } from "express";
const router = Router();

// Auth routes
router.post("/signup" /* controller.signup */);
router.post("/login" /* controller.login */);
router.post("/logout" /* controller.logout */);

export default router;
