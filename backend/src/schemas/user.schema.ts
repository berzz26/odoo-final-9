import { z } from "zod";

export const changeRoleSchema = z.object({
    role: z.enum(["ADMIN", "USER", "PROVIDER"]),
});


export const userSchema = z.object({
    name: z.string(),
    email: z.string(),
    password: z.string(),
    role: z.enum(["USER", "ADMIN", "PROVIDER"]),
});

export type UserSchema = z.infer<typeof userSchema>;

export type Roles = z.infer<typeof changeRoleSchema>["role"];