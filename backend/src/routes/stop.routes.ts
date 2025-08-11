import { Router } from "express";
const router = Router();

// Stop routes
router.post("/trips/:tripId/stops" /* controller.createStop */);
router.put("/stops/:id" /* controller.updateStop */);
router.delete("/stops/:id" /* controller.deleteStop */);

export default router;
