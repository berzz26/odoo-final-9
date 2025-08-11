// import dotenv from "dotenv";
// dotenv.config();

// Debug: Check if environment variables are loaded
// console.log('Environment Variables:', {
//   JWT_SECRET: process.env.JWT_SECRET,
//   SUPABASE_URL: process.env.SUPABASE_URL,
//   PORT: process.env.PORT
// });

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
// import routes from "./routes/index.js";
import type { Request, Response } from "express";
import routes from "./routes/index.js";

const app = express();

// CORS setup (important for cookies + frontend on different port)

app.use(
  cors({
    origin: "*", // allow all origins
    credentials: false, // can't use credentials with '*'
  })
);


app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get("/", (req: Request, res: Response) => {
  res.send("Team - 09 GlobalTrotter backend server running");
});

//mount the routes
app.use("/api", routes);


const PORT = process.env.PORT;
if (!PORT) {
  throw new Error("Port in env not defined");
}
app.listen(PORT, () => {
  console.log(`Backend is up`);
});
