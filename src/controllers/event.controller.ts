import { Request, Response } from 'express';
import { EventService } from '../services/event.service';
import { AppError } from '../middleware/error.middleware';

export class EventController {
  static async getAllEvents(req: Request, res: Response) {
    try {
      const { startDate, endDate } = req.query;

      const filters = {
        startDate: startDate ? new Date(startDate as string) : undefined,
        endDate: endDate ? new Date(endDate as string) : undefined
      };

      const events = await EventService.getAllEvents(filters);
      res.json(events);
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  }

  static async getEventById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const event = await EventService.getEventById(id);
      res.json(event);
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  }

  static async createEvent(req: Request, res: Response) {
    try {
      const eventData = req.body;
      const event = await EventService.createEvent(eventData);
      res.status(201).json(event);
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  }
} 