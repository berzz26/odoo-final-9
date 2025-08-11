import { Role } from "@prisma/client";
import type { Request, Response, NextFunction } from "express";

export const authorize =
    (...allowedRoles: Role[]) =>
        (req: Request, res: Response, next: NextFunction) => {
            if (!req.user || !allowedRoles.includes(req.user.role)) {
                console.log("Allowed Roles:", allowedRoles, "User Role:", req.user?.role);
                return res.status(403).json({ message: "Forbidden: Insufficient role" });
            }
            next();
        };