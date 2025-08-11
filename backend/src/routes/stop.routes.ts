// stop.routes.js
import { Router } from "express";
import {
    createStop,
    getStopsByTripId,
    getStopById,
    updateStop,
    deleteStop,
    getAllStops
} from "../controllers/stop.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/zod.middleware.js";
import { stopSchema } from "../schemas/stop.schema.js";

const router = Router({ mergeParams: true }); // Enable merging params from parent router

// Routes for stops within a specific trip. All start with /:tripId/stops
router.get("/:tripId/stops", authenticate, getStopsByTripId);
router.post("/:tripId/stops", authenticate, validate(stopSchema), createStop);
router.get("/:tripId/stops/:id", authenticate, getStopById); // Getting a single stop
router.put("/:tripId/stops/:id", authenticate, validate(stopSchema), updateStop);
router.delete("/:tripId/stops/:id", authenticate, deleteStop);

router.get('/getAllStop', authenticate, getAllStops)

export default router;