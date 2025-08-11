import { Router } from "express";
import { getAllTrips, createTrip, getTripById, updateTrip, deleteTrip } from "../controllers/trip.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/zod.middleware.js";
import { authorize } from "../middlewares/rbac.middleware.js";
import { tripSchema } from "../schemas/trip.schema.js";


const router = Router();

// Trip routes
router.get("/trips", authenticate, authorize("ADMIN"), getAllTrips);
router.post("/trips", authenticate, validate(tripSchema), createTrip);
router.get("/trips/:id", authenticate, getTripById);
router.put("/trips/:id", authenticate, validate(tripSchema), updateTrip);
router.delete("/trips/:id", authenticate, authorize("USER"), deleteTrip);

export default router;
