import { z } from "zod";

export const tripSchema = z.object({
  userId: z.uuid(),
  name: z.string(),
  description: z.string().optional(),
  startDate: z.string(),
  endDate: z.string(),
  coverPhoto: z.string().optional(),
});

export type tripSchema = z.infer<typeof tripSchema>;
