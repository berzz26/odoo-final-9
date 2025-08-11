import { z } from "zod";

export const stopSchema = z.object({
  tripId: z.uuid(),
  city: z.string(),
  country: z.string().optional(),
  startDate: z.string(),
  endDate: z.string(),
});

export type StopSchema = z.infer<typeof stopSchema>;
