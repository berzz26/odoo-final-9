import { z } from "zod";

export const activitySchema = z.object({
  stopId: z.uuid(),
  name: z.string(),
  description: z.string().optional(),
  category: z.string().optional(), // e.g., sightseeing, food, adventure
  cost: z.number().optional(), // estimated cost
  duration: z.number().int().optional(), // in minutes
});

export type ActivitySchema = z.infer<typeof activitySchema>;
