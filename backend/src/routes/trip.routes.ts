import { Router } from "express";
const router = Router();

// Trip routes
router.get("/trips" /* controller.getAllTrips */);
router.post("/trips" /* controller.createTrip */);
router.get("/trips/:id" /* controller.getTripById */);
router.put("/trips/:id" /* controller.updateTrip */);
router.delete("/trips/:id" /* controller.deleteTrip */);

export default router;
