import { Router } from "express";
import {
    createBudget,
    getBudgetByTripId,
    updateBudget,
    deleteBudget,
} from "../controllers/budget.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/zod.middleware.js";
import { authorize } from "../middlewares/rbac.middleware.js";
import { budgetSchema } from "../schemas/budget.schema.js";

const router = Router();

// A budget is uniquely identified by a trip, so all routes should reflect this.
// `authenticate` is used to ensure the user is logged in.
// `validate` ensures the request body conforms to the schema.
// `authorize` is a good practice to ensure the user has permissions for this trip.

// Route to get a budget for a specific trip
router.get("/trips/:tripId/budget", authenticate, getBudgetByTripId);

// Route to create a budget for a specific trip
// POST is used for creating new resources.
router.post(
    "/trips/:tripId/budget",
    authenticate,
    validate(budgetSchema),
    createBudget
);

// Route to update a budget for a specific trip
// PUT is used for updating resources.
router.put(
    "/trips/:tripId/budget",
    authenticate,
    validate(budgetSchema),
    updateBudget
);

// Route to delete a budget for a specific trip
// DELETE is used for deleting resources.
router.delete("/trips/:tripId/budget", authenticate, deleteBudget);

export default router;