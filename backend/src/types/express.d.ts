import { Role } from "@prisma/client";

// This is a common pattern to extend Express's Request interface
// to include a custom property like 'user'.
declare global {
    namespace Express {
        interface Request {
            user?: {
                userId: string;
                role: Role;
            };
        }
    }
}