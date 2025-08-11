import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Get all trips from the database.
 * @returns An array of all trips.
 */
export const getAllTrips = async (userId: string) => {
  return prisma.trip.findMany({
    where: { userId: userId },
    include: {
      stops: {
        include: { activities: true },
      },
      budget: true,
    },
  });
};

/**
 * Create a new trip.
 * @param tripData The data for the new trip.
 * @returns The newly created trip.
 */
export const createTrip = async (tripData: any, userId: string) => {
  return prisma.trip.create({
    data: {
      userId,
      name: tripData.name,
      description: tripData.description ?? null,
      startDate: new Date(tripData.startDate),
      endDate: new Date(tripData.endDate),
      coverPhoto: tripData.coverPhoto ?? null,
    },
  });
};

/**
 * Get a trip by its ID, including related data.
 * @param id The ID of the trip.
 * @returns The trip with stops, activities, and budget, or null if not found.
 */
export const getTripById = async (id: string) => {
  return prisma.trip.findUnique({
    where: { id: id },
    include: {
      stops: {
        include: {
          activities: true // Include activities for each stop
        }
      },
      budget: true // Include the related budget
    }
  });
};

/**
 * Update an existing trip.
 * @param id The ID of the trip to update.
 * @param tripData The updated data for the trip.
 * @returns The updated trip.
 */
export const updateTrip = async (id: string, tripData: any) => {
  return prisma.trip.update({
    where: { id: id },
    data: tripData,
  });
};

/**
 * Delete a trip and all its related data.
 * @param id The ID of the trip to delete.
 */
export const deleteTrip = async (id: string) => {
  // Prisma can delete related records if you've set up `onDelete: Cascade` in your schema.
  // This is a powerful feature to ensure data integrity.
  return prisma.trip.delete({
    where: { id: id },
  });
};