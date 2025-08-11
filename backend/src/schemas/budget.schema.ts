import { z } from "zod";

export const budgetSchema = z.object({
  tripId: z.uuid(),
  transportCost: z.number().default(0),
  stayCost: z.number().default(0),
  activitiesCost: z.number().default(0),
  mealsCost: z.number().default(0),
  totalCost: z.number().default(0),
});

export type BudgetSchema = z.infer<typeof budgetSchema>;
