import { Router } from "express";
import { createStop, getStopsByTripId, updateStop, deleteStop } from "../controllers/stop.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/zod.middleware.js";
import { authorize } from "../middlewares/rbac.middleware.js";
import { stopSchema } from "../schemas/stop.schema.js";
const router = Router();

// Stop routes
router.post("/trips/:tripId/stops", authenticate, validate(stopSchema));
router.put("/stops/:id", authenticate, validate(stopSchema));
router.delete("/stops/:id", authenticate);

export default router;
