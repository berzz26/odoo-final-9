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
  try {
    // Delete activities of all stops under the trip
    await prisma.activity.deleteMany({
      where: {
        stop: {
          tripId: id,
        },
      },
    });

    // Delete stops related to the trip
    await prisma.stop.deleteMany({
      where: { tripId: id },
    });

    // Delete budget related to the trip
    await prisma.budget.deleteMany({
      where: { tripId: id },
    });

    // Then delete the trip itself
    const deletedTrip = await prisma.trip.delete({
      where: { id },
    });

    return deletedTrip;
  } catch (error: any) {
    if (error.code === 'P2025') {
      throw new Error(`Trip with id "${id}" does not exist.`);
    }
    throw new Error(`Failed to delete trip: ${error.message}`);
  }
};


export const getSpecificTrip = async (id: string) => {
  try {


    return await prisma.trip.findUnique({
      where: { id },
      include: {
        stops: {
          include: {
            activities: true // Include activities for each stop
          }
        },
        budget: true // Include the related budget
      }
    });
  } catch (error: any) {
    if (error.code === "P2025") {
      // Prisma's "Record not found" error
      throw new Error(`Trip with ID "${id}" not found`);
    }
    throw new Error(error.message || "Failed to fetch trip");
  }
};