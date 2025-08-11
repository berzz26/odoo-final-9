import { Router } from "express";
const router = Router();

// Activity routes
router.post("/stops/:stopId/activities" /* controller.createActivity */);
router.put("/activities/:id" /* controller.updateActivity */);
router.delete("/activities/:id" /* controller.deleteActivity */);

export default router;
