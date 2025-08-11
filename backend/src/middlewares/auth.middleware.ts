// auth.middleware.ts
// ...middleware logic for authentication...

import jwt, { type JwtPayload } from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";
import type { Role } from "@prisma/client";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT secret missing from env");
}

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized: Auth token missing" });
  }

  try {
    if (!req.user) {
    }
    const decoded = jwt.verify(token, JWT_SECRET) as {
      userId: string;
      role: Role;
    };

    // The decoded token is assigned to req.user here.
    req.user = decoded;

    // This check is no longer needed after the assignment.
    // if (!req.user) {
    //   console.error("User not available");
    //   return res.status(403).json({ success: false });
    // }

    next();
  } catch (err) {
    console.error("Token verification failed:", err);
    return res
      .status(403)
      .json({ message: "Forbidden: Invalid or expired token" });
  }
};
