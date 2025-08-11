import { Router } from "express";
const router = Router();

// Budget routes
router.get("/trips/:tripId/budget" /* controller.getBudget */);
router.put("/trips/:tripId/budget" /* controller.updateBudget */);

export default router;
