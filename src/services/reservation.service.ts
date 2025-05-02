import { PrismaClient } from '@prisma/client';
import { AppError } from '../middleware/error.middleware';
import { EventService } from './event.service';

const prisma = new PrismaClient();

export class ReservationService {
  static async createReservation(userId: number, eventId: number, tickets: number = 1) {
    // Vérifier si l'utilisateur a déjà une réservation pour cet événement
    const existingReservation = await prisma.reservation.findFirst({
      where: {
        user_id: userId,
        event_id: eventId
      }
    });

    if (existingReservation) {
      throw new AppError('You already have a reservation for this event', 400);
    }

    // Récupérer l'événement pour vérifier le nombre de billets disponibles
    const event = await EventService.getEventById(eventId);
    if (!event) {
      throw new AppError('Événement non trouvé', 404);
    }

    if (event.seats_available < tickets) {
      throw new AppError(`Not enough seats available. Only ${event.seats_available} seats left.`, 400);
    }

    // Mettre à jour le nombre de billets disponibles et créer la réservation dans une transaction
    const result = await prisma.$transaction(async (prisma) => {
      // Mettre à jour le nombre de billets disponibles
      await EventService.updateEventSeats(eventId, tickets);

      // Créer la réservation
      const reservation = await prisma.reservation.create({
        data: {
          user_id: userId,
          event_id: eventId,
          tickets: tickets
        },
        include: {
          event: true
        }
      });

      // Simuler l'envoi d'un email

      const user = await prisma.user.findUnique({where: {id: userId}});
      const event = await prisma.event.findUnique({where: {id: eventId}});
      console.log(`Email envoyé à l'utilisateur ${user?.name} pour l'événement ${event?.title} avec ${tickets} billets`);

      return reservation;
    });

    return result;
  }

  static async getUserReservations(userId: number) {
    return prisma.reservation.findMany({
      where: {
        user_id: userId
      },
      include: {
        event: true
      },
      orderBy: {
        created_at: 'desc'
      }
    });
  }
}