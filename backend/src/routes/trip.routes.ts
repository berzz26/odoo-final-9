// trip.routes.js
import { Router } from "express";
import {
    getAllTrips,
    createTrip,
    getTripById,
    updateTrip,
    deleteTrip,
    getSpecificTrip
} from "../controllers/trip.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/zod.middleware.js";
import { tripSchema } from "../schemas/trip.schema.js";

const router = Router();

// Routes for base trip management. All start with /
router.get("/", authenticate, getAllTrips);
router.post("/", authenticate, validate(tripSchema), createTrip);
router.get("/", authenticate, getTripById);
router.put("/:id", authenticate, validate(tripSchema), updateTrip);
router.delete("/:id", authenticate, deleteTrip);

router.get("/:id", authenticate, getSpecificTrip);
export default router;