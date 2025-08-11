import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createActivity = async (activityData: any) => {
  return prisma.activity.create({
    data: activityData,
  });
};

export const getActivitiesByStopId = async (stopId: string) => {
  return prisma.activity.findMany({
    where: { stopId: stopId },
  });
};

export const updateActivity = async (id: string, activityData: any) => {
  return prisma.activity.update({
    where: { id: id },
    data: activityData,
  });
};

export const deleteActivity = async (id: string) => {
  return prisma.activity.delete({
    where: { id: id },
  });
};