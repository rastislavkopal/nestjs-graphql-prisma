import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBookingInput } from './dto/create-booking.input';
import { UpdateBookingInput } from './dto/update-booking.input';
import { PrismaService } from 'nestjs-prisma';
import { User } from '../users/models/user.model';
import { PaginationArgs } from '../common/pagination/pagination.args';
import { BookingOrder } from './dto/booking-order.input';
import { BookingConnection } from './models/booking-connection.model';
import { findManyCursorConnection } from '@devoxa/prisma-relay-cursor-connection';

@Injectable()
export class BookingsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createBookingInput: CreateBookingInput, loggedUser: User) {
    const trip = await this.prisma.trip.findUnique({
      where: { id: createBookingInput.tripId },
    });

    if (!trip) {
      throw new NotFoundException('Trip not found');
    }

    const newBooking = this.prisma.booking.create({
      data: {
        tripId: createBookingInput.tripId,
        userId: loggedUser.id,
      },
      include: {
        trip: {
          include: {
            organizer: true,
          },
        },
        user: true,
      },
    });

    return newBooking;
  }

  async findAll(
    loggedUser: User,
    { after, before, first, last }: PaginationArgs,
    orderBy?: BookingOrder,
    tripId?: string,
  ): Promise<BookingConnection> {
    const a = await findManyCursorConnection(
      (args) =>
        this.prisma.booking.findMany({
          where: {
            userId: loggedUser.id,
            tripId: (tripId && { equals: tripId }) || undefined,
          },
          include: {
            user: true,
            trip: {
              include: {
                organizer: true,
              },
            },
          },
          orderBy: orderBy ? { [orderBy.field]: orderBy.direction } : undefined,
          ...args,
        }),
      () =>
        this.prisma.booking.count({
          where: {
            userId: loggedUser.id,
            tripId: (tripId && { equals: tripId }) || undefined,
          },
        }),
      { first, last, before, after },
    );
    return a;
  }

  async findOne(id: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id },
    });

    if (!booking) {
      throw new NotFoundException('Trip not found');
    }

    return booking;
  }

  async update(id: string, updateBookingInput: UpdateBookingInput) {
    const booking = await this.prisma.booking.findUnique({
      where: { id },
    });

    if (!booking) {
      throw new NotFoundException('Trip not found');
    }

    return this.prisma.booking.update({
      where: { id },
      data: updateBookingInput,
    });
  }

  async remove(id: string) {
    return this.prisma.booking.delete({
      where: { id },
    });
  }
}
