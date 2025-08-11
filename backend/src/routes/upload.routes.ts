// The router connects the endpoint to the controller and middleware.
import { Router } from "express";
import { handleFileUpload } from "../controllers/upload.controller.js";
import multer from "multer";
import { authenticate } from "../middlewares/auth.middleware.js";

// Use memory storage for multer to get the file buffer
const upload = multer({ storage: multer.memoryStorage() });

const router = Router();

// Define the route for file uploads
router.post("/avatar", authenticate, upload.single("avatar"), handleFileUpload);

export default router;
