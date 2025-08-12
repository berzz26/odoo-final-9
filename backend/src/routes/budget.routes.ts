// budget.routes.js
import { Router } from "express";
import {
    createBudget,
    getBudgetByTripId,
    updateBudget,
    deleteBudget,
} from "../controllers/budget.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/zod.middleware.js";
import { budgetSchema } from "../schemas/budget.schema.js";

const router = Router({ mergeParams: true }); // Enable merging params from parent router

// Routes for a budget tied to a specific trip.
router.get("/:tripId/budget", authenticate, getBudgetByTripId);
router.post("/:tripId/addBudget", authenticate, validate(budgetSchema), createBudget);
router.put("/:tripId/budget", authenticate, validate(budgetSchema), updateBudget);
router.delete("/:tripId/budget", authenticate, deleteBudget);

export default router;