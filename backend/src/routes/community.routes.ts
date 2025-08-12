import { Router } from "express";
import {
    getPublicItineraries,
    getPublicItineraryById,
    rateItinerary,
} from "../controllers/community.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = Router();

// Get paginated list of public itineraries
router.get("/", authenticate, getPublicItineraries);

// Get full details of a specific public itinerary by ID
router.get("/:id", authenticate, getPublicItineraryById);

// Authenticated user rates or updates rating for a public itinerary
router.post("/rate/:id", authenticate, rateItinerary);

export default router;
