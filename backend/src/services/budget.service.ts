import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createBudget = async (budgetData: any) => {
  return prisma.budget.create({
    data: budgetData,
  });
};

export const getBudgetByTripId = async (tripId: string) => {
  return prisma.budget.findUnique({
    where: { tripId: tripId },
  });
};

export const updateBudget = async (tripId: string, budgetData: any) => {
  return prisma.budget.update({
    where: { tripId: tripId },
    data: budgetData,
  });
};

export const deleteBudget = async (tripId: string) => {
  return prisma.budget.delete({
    where: { tripId: tripId },
  });
};