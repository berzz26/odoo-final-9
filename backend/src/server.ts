import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
// import routes from "./routes/index.js";
import type { Request, Response } from "express";
const app = express();

// CORS setup (important for cookies + frontend on different port)
const FRONTEND_URL = process.env.FRONTEND_URL;

app.use(
  cors({
    origin: FRONTEND_URL, // frontend URL
    credentials: true, // allow cookies from browser
  }),
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get("/", (req: Request, res: Response) => {
  res.send("Team - 09 GlobalTrotter backend server running");
});

//mount the routes
// app.use("/api", routes);
const PORT = process.env.PORT;
if (!PORT) {
  throw new Error("Port in env not defined");
}
app.listen(PORT, () => {
  console.log(`Backend is up`);
});
