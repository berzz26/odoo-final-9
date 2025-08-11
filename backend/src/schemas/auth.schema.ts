// schemas/auth.schema.ts
import { z } from "zod";

export const signupSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    role: z.enum(["USER", "ADMIN", "PROVIDER"]).optional(),
    phone: z.string().optional(),
    city: z.string().optional(),
    country: z.string(),
    avatarUrl: z.string().optional()
});

export const loginSchema = z.object({
    email: z.string().email("Invalid email"),
    password: z.string().min(6, "Password must be at least 6 characters")
});
export const updateUserSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters").optional(),
    email: z.string().email("Invalid email").optional(),
    phone: z.string().optional(),
    city: z.string().optional(),
    country: z.string().optional(),
    avatarUrl: z.string().optional()

});