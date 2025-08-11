import { Router } from "express";
import authRoutes from "./auth.routes.js";
// import tripRoutes from "./trip.routes.js";
// import stopRoutes from "./stop.routes.js";
// import activityRoutes from "./activity.routes.js";
// import budgetRoutes from "./budget.routes.js";
// import profileRoutes from "./profile.routes.js";
import uploadRoutes from "./upload.routes.js";

const router = Router();

router.use("/auth", authRoutes);
// router.use("/", tripRoutes);
// router.use("/", stopRoutes);
// router.use("/", activityRoutes);
// router.use("/", budgetRoutes);
// router.use("/", profileRoutes);
router.use("/upload", uploadRoutes);

export default router;
