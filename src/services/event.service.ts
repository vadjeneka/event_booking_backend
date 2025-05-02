import { PrismaClient } from '@prisma/client';
import { AppError } from '../middleware/error.middleware';

const prisma = new PrismaClient();

export class EventService {
  static async getAllEvents(filters?: { startDate?: Date; endDate?: Date }) {
    const where = filters
      ? {
          start_time: {
            gte: filters.startDate,
            lte: filters.endDate
          }
        }
      : {};

    return prisma.event.findMany({
      where,
      orderBy: {
        start_time: 'asc'
      }
    });
  }

  static async getEventById(id: number) {
    const event = await prisma.event.findUnique({
      where: { id }
    });

    if (!event) {
      throw new AppError('Event not found', 404);
    }

    return event;
  }

  static async createEvent(data: {
    title: string;
    description: string;
    location: string;
    start_time: Date;
    end_time: Date;
    seats_available: number;
  }) {
    return prisma.event.create({
      data
    });
  }

  static async updateEventSeats(eventId: number, tickets: number) {
    const event = await prisma.event.findUnique({
      where: { id: eventId }
    });

    if (!event) {
      throw new AppError('Event not found', 404);
    }

    if (event.seats_available < tickets) {
      throw new AppError(`Not enough seats available. Only ${event.seats_available} seats left.`, 400);
    }

    return prisma.event.update({
      where: { id: eventId },
      data: {
        seats_available: {
          decrement: tickets
        }
      }
    });
  }
}