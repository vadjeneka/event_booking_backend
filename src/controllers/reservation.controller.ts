import { Request, Response } from 'express';
import { ReservationService } from '../services/reservation.service';
import { AppError } from '../middleware/error.middleware';

interface AuthRequest extends Request {
  user?: {
    id: number;
  };
}

export class ReservationController {
  static async createReservation(req: AuthRequest, res: Response) {
    try {
      const eventId = parseInt(req.params.eventId);
      const userId = req.user?.id;
      const { tickets = 1 } = req.body;

      if (!userId) {
        throw new AppError('User not authenticated', 401);
      }

      if (typeof tickets !== 'number' || tickets < 1) {
        throw new AppError('Number of tickets must be a positive number', 400);
      }

      const reservation = await ReservationService.createReservation(userId, eventId, tickets);
      res.status(201).json(reservation);
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  }

  static async getUserReservations(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        throw new AppError('User not authenticated', 401);
      }

      const reservations = await ReservationService.getUserReservations(userId);
      res.json(reservations);
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  }
} 