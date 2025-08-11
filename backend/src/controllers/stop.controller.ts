import type { Request, Response } from "express";
import * as stopService from '../services/stop.service.js';

/**
 * Creates a new stop for a specific trip.
 */
export const createStop = async (req: Request, res: Response) => {
  try {
    const newStop = await stopService.createStop(req.body);
    res.status(201).json(newStop);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create stop' });
  }
};

/**
 * Gets all stops for a specific trip.
 */
export const getStopsByTripId = async (req: Request, res: Response) => {
  try {
    const { tripId } = req.params;
    const stops = await stopService.getStopsByTripId(tripId);
    if (!stops) {
      return res.status(404).json({ error: 'Stops not found for this trip' });
    }
    res.status(200).json(stops);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve stops' });
  }
};

/**
 * Updates a stop by its ID.
 */
export const updateStop = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updatedStop = await stopService.updateStop(id, req.body);
    res.status(200).json(updatedStop);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update stop' });
  }
};

/**
 * Deletes a stop by its ID.
 */
export const deleteStop = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await stopService.deleteStop(id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete stop' });
  }
};
// controllers/stop.controller.ts
// ... (existing imports)

/**
 * Gets a single stop by its ID.
 */
export const getStopById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const stop = await stopService.getStopById(id);
    if (!stop) {
      return res.status(404).json({ error: 'Stop not found' });
    }
    res.status(200).json(stop);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve stop' });
  }
};

// ... (other controller functions)