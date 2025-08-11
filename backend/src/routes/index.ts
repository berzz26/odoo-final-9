import { Router } from "express";
import authRoutes from "./auth.routes.js";
import tripRoutes from "./trip.routes.js";
import stopRoutes from "./stop.routes.js";
import activityRoutes from "./activity.routes.js";
import budgetRoutes from "./budget.routes.js";
import uploadRoutes from "./upload.routes.js";

const router = Router();

// Routes for user authentication (e.g., /auth/login, /auth/signup)
router.use("/auth", authRoutes);

// Routes for managing trips (e.g., /trips/:id)
// All trip-related routes will be prefixed with "/trips"
router.use("/trips", tripRoutes);

// Routes for managing stops, activities, and budgets
// These routes are nested under trips and will use the tripId as a parameter.
router.use("/stop", stopRoutes);
router.use("/activity", activityRoutes);
router.use("/trips", budgetRoutes);

// Routes for file uploads (e.g., /upload/avatar)
router.use("/upload", uploadRoutes);

export default router;