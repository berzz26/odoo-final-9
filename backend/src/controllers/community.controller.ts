import type { Request, Response } from "express";
import prisma from "../config/db.js";

// GET /community/itineraries
export const getPublicItineraries = async (req: Request, res: Response) => {
    try {
        // Simple pagination params
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const skip = (page - 1) * limit;

        const trips = await prisma.trip.findMany({
            where: { isPublic: true },
            skip,
            take: limit,
            include: {
                user: { select: { id: true, name: true, avatarUrl: true } },
                rating: true,
            },
            orderBy: { createdAt: "desc" },
        });

        // Calculate average rating per trip
        const results = trips.map((trip) => {
            const avgRating =
                trip.rating.length > 0
                    ? trip.rating.reduce((sum, r) => sum + r.score, 0) / trip.rating.length
                    : 0;
            return {
                id: trip.id,
                name: trip.name,
                description: trip.description,
                coverPhoto: trip.coverPhoto,
                user: trip.user,
                avgRating,
            };
        });

        res.json({ page, limit, data: results });
    } catch (error) {
        console.error("Error fetching public itineraries:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// GET /community/itineraries/:id
export const getPublicItineraryById = async (req: Request, res: Response) => {
    const tripId = req.params.id;
    try {
        const trip = await prisma.trip.findUnique({
            where: { id: tripId },
            include: {
                user: { select: { id: true, name: true, avatarUrl: true } },
                stops: {
                    include: {
                        activities: true,
                    },
                },
                budget: true,
                rating: {
                    include: {
                        user: { select: { id: true, name: true, avatarUrl: true } },
                    },
                    orderBy: { createdAt: "desc" },
                },
            },
        });

        if (!trip || !trip.isPublic) {
            return res.status(404).json({ message: "Public itinerary not found" });
        }

        res.json(trip);
    } catch (error) {
        console.error("Error fetching itinerary details:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// POST /community/itineraries/:id/rate
export const rateItinerary = async (req: Request, res: Response) => {
    const tripId = req.params.id;
    const userId = req.user?.userId;
    const { score, comment } = req.body;

    if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    if (!score || score < 1 || score > 5) {
        return res.status(400).json({ message: "Score must be between 1 and 5" });
    }

    try {
        // Ensure trip exists and is public
        const trip = await prisma.trip.findUnique({ where: { id: tripId } });
        if (!trip || !trip.isPublic) {
            return res.status(404).json({ message: "Public itinerary not found" });
        }

        // Upsert rating (create new or update existing)
        const existingRating = await prisma.rating.findUnique({
            where: {
                tripId_userId: {
                    tripId,
                    userId,
                },
            },
        });

        if (existingRating) {
            const updated = await prisma.rating.update({
                where: { id: existingRating.id },
                data: { score, comment },
            });
            return res.json({ message: "Rating updated", rating: updated });
        } else {
            const created = await prisma.rating.create({
                data: { tripId, userId, score, comment },
            });
            return res.status(201).json({ message: "Rating created", rating: created });
        }
    } catch (error) {
        console.error("Error submitting rating:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
