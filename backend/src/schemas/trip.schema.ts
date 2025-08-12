import { z } from "zod";

export const tripSchema = z.object({

  name: z.string(),
  description: z.string().optional(),
  startDate: z.string(),
  endDate: z.string(),
  coverPhoto: z.string().optional(),
  isPublic: z.boolean().default(true)
});

export type tripSchema = z.infer<typeof tripSchema>;
