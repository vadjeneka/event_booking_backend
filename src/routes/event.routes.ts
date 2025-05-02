import { Router } from 'express';
import { EventController } from '../controllers/event.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

router.get('/', EventController.getAllEvents);
router.get('/:id', EventController.getEventById);
router.post('/', authenticateToken, EventController.createEvent);

export default router;