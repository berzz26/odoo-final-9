import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createStop = async (stopData: any) => {
    return prisma.stop.create({
        data: stopData,
    });
};

export const getStopsByTripId = async (tripId: string) => {
    return prisma.stop.findMany({
        where: { tripId: tripId },
        include: {
            activities: true, // Also retrieve related activities
        }
    });
};

export const updateStop = async (id: string, stopData: any) => {
    return prisma.stop.update({
        where: { id: id },
        data: stopData,
    });
};

export const deleteStop = async (id: string) => {
    return prisma.stop.delete({
        where: { id: id },
    });
};

export const getStopById = async (id: string) => {
    return prisma.stop.findUnique({
        where: { id: id },
        include: {
            activities: true, // Include the related activities
        },
    });
};
export const getAllStops = async () => {
    return prisma.stop.findMany({
        include: {
            activities: true, // Include related activities
        },
    });
};