import { z, ZodError, type ZodType } from "zod";
import type { Request, Response, NextFunction } from "express";

export const validate =
    (schema: ZodType) => (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = schema.safeParse(req.body);

            if (!result.success) {
                return res.status(400).json({ errors: result.error.format() });
            }

            req.body = result.data; // Overwrite req.body with the validated, type-safe data
            next();
        } catch (error) {
            if (error instanceof ZodError) {
                return res.status(400).json({ errors: error.issues });
            }
            return res.status(500).json({ message: "Internal server error." });
        }
    };