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

const router = Router();

// Route to get all activities for a specific stop
router.get("/stops/:stopId/activities", authenticate, getActivitiesByStopId);

// Route to create a new activity for a specific stop
router.post(
    "/stops/:stopId/activities",
    authenticate,
    validate(activitySchema),
    createActivity
);

// Route to update an activity by its ID
router.put(
    "/activities/:id",
    authenticate,
    validate(activitySchema),
    updateActivity
);

// Route to delete an activity by its ID
router.delete("/activities/:id", authenticate, deleteActivity);

export default router;