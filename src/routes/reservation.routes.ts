import { Router } from 'express';
import { ReservationController } from '../controllers/reservation.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

router.post('/events/:eventId/reserve', authenticateToken, ReservationController.createReservation);
router.get('/my-reservations', authenticateToken, ReservationController.getUserReservations);

export default router;