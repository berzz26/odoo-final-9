// trip.controller.ts
// ...controller logic for trips...
import type { Request, Response } from "express";
import * as tripService from '../services/trip.service.js';

/**
 * Get all trips.
 */
export const getAllTrips = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ success: "false", message: "User not found" });
    }
    const trips = await tripService.getAllTrips(userId);
    res.status(200).json(trips);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve trips' });
  }
};

/**
 * Create a new trip.
 */
export const createTrip = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ message: "user not found" })
    }
    const newTrip = await tripService.createTrip(req.body, userId);
    res.status(201).json(newTrip);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create trip', err });
  }
};

/**
 * Get a trip by its ID, including all related stops, activities, and budget.
 */
export const getTripById = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ success: "false", message: "user not found" })
    }
    const trip = await tripService.getTripById(userId);
    if (!trip) {
      return res.status(404).json({ error: 'Trip not found' });
    }
    res.status(200).json(trip);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve trip' });
  }
};

/**
 * Update an existing trip.
 */
export const updateTrip = async (req: Request, res: Response) => {
  try {
    const updatedTrip = await tripService.updateTrip(req.params.id, req.body);
    res.status(200).json(updatedTrip);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update trip' });
  }
};

/**
 * Delete a trip and all its related data (stops, activities, and budget).
 */
export const deleteTrip = async (req: Request, res: Response) => {
  try {
    await tripService.deleteTrip(req.params.id);
    res.status(204).send(); // 204 No Content for successful deletion
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete trip' });
  }
};