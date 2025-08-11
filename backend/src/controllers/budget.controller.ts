// budget.controller.ts
// ...controller logic for budgets...
import type{ Request, Response } from "express";
import * as budgetService from '../services/budget.service.js';

/**
 * Creates a new budget for a trip.
 */
export const createBudget = async (req: Request, res: Response) => {
  try {
    const newBudget = await budgetService.createBudget(req.body);
    res.status(201).json(newBudget);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create budget' });
  }
};

/**
 * Gets a budget by trip ID.
 */
export const getBudgetByTripId = async (req: Request, res: Response) => {
  try {
    const { tripId } = req.params;
    const budget = await budgetService.getBudgetByTripId(tripId);
    if (!budget) {
      return res.status(404).json({ error: 'Budget not found for this trip' });
    }
    res.status(200).json(budget);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve budget' });
  }
};

/**
 * Updates a budget by trip ID.
 */
export const updateBudget = async (req: Request, res: Response) => {
  try {
    const { tripId } = req.params;
    const updatedBudget = await budgetService.updateBudget(tripId, req.body);
    res.status(200).json(updatedBudget);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update budget' });
  }
};

/**
 * Deletes a budget by trip ID.
 */
export const deleteBudget = async (req: Request, res: Response) => {
  try {
    const { tripId } = req.params;
    await budgetService.deleteBudget(tripId);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete budget' });
  }
};