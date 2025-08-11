import type { Request, Response } from "express";
import * as activityService from '../services/activity.service.js';

/**
 * Creates a new activity for a specific stop.
 */
export const createActivity = async (req: Request, res: Response) => {
  try {
    const newActivity = await activityService.createActivity(req.body);
    res.status(201).json(newActivity);
    
  } catch (error) {
    res.status(500).json({ error: 'Failed to create activity' });
  }
};

/**
 * Gets all activities for a specific stop.
 */
export const getActivitiesByStopId = async (req: Request, res: Response) => {
  try {
    const { stopId } = req.params;
    const activities = await activityService.getActivitiesByStopId(stopId);
    if (!activities) {
      return res.status(404).json({ error: 'Activities not found for this stop' });
    }
    res.status(200).json(activities);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve activities' });
  }
};

/**
 * Updates an activity by its ID.
 */
export const updateActivity = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updatedActivity = await activityService.updateActivity(id, req.body);
    res.status(200).json(updatedActivity);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update activity' });
  }
};

/**
 * Deletes an activity by its ID.
 */
export const deleteActivity = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await activityService.deleteActivity(id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete activity' });
  }
};