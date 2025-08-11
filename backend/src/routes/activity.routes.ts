// activity.routes.js
import { Router } from "express";
import {
  createActivity,
  getActivitiesByStopId,
  updateActivity,
  deleteActivity,
} from "../controllers/activity.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/zod.middleware.js";
import { activitySchema } from "../schemas/activity.schema.js";

const router = Router({ mergeParams: true }); // Enable merging params from parent router

// Routes for activities within a specific stop.
router.get("/:tripId/stops/:stopId/activities", authenticate, getActivitiesByStopId);
router.post("/:tripId/stops/:stopId/activities", authenticate, validate(activitySchema), createActivity);
router.put("/activities/:id", authenticate, validate(activitySchema), updateActivity); // Note: It's good practice to get the single activity by ID, which is a unique resource
router.delete("/activities/:id", authenticate, deleteActivity);

export default router;