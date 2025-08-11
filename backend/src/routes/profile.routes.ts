import { Router } from "express";
const router = Router();

// Profile routes
router.get("/me" /* controller.getProfile */);
router.put("/me" /* controller.updateProfile */);

export default router;
