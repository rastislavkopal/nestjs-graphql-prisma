import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateBookingInput } from './dto/create-booking.input';
import { UpdateBookingInput } from './dto/update-booking.input';
import { PrismaService } from 'nestjs-prisma';
import { User } from '../users/models/user.model';
import { PaginationArgs } from '../common/pagination/pagination.args';
import { BookingOrder } from './dto/booking-order.input';
import { BookingConnection } from './models/booking-connection.model';
import { findManyCursorConnection } from '@devoxa/prisma-relay-cursor-connection';
import { ForbiddenError } from '@nestjs/apollo';
import { Booking, BookingStatus } from '@prisma/client';

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

    const oldBooking = await this.prisma.booking.findFirst({
      where: {
        userId: loggedUser.id,
        tripId: createBookingInput.tripId,
      },
    });

    if (oldBooking)
      throw new ConflictException('Booking by this user already exists');

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

  async findTripBookings(
    loggedUser: User,
    { after, before, first, last }: PaginationArgs,
    tripId: string,
    orderBy?: BookingOrder,
  ): Promise<BookingConnection> {
    const trip = await this.prisma.trip.findUnique({
      where: { id: tripId },
    });

    if (!trip || trip.organizerId !== loggedUser.id)
      throw new ForbiddenError('You are not the organizer of this trip');

    const a = await findManyCursorConnection(
      (args) =>
        this.prisma.booking.findMany({
          where: {
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
            tripId: (tripId && { equals: tripId }) || undefined,
          },
        }),
      { first, last, before, after },
    );
    return a;
  }

  async findMyBookings(
    loggedUser: User,
    { after, before, first, last }: PaginationArgs,
    orderBy?: BookingOrder,
  ): Promise<BookingConnection> {
    const a = await findManyCursorConnection(
      (args) =>
        this.prisma.booking.findMany({
          where: {
            userId: loggedUser.id,
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

  async accept(id: string, loggedUser: User): Promise<Booking> {
    const booking = await this.prisma.booking.findUnique({
      where: { id },
      include: {
        trip: true,
      },
    });

    if (!booking || booking.trip.organizerId !== loggedUser.id)
      throw new ForbiddenError('You are not allowed to accept this booking');

    return this.prisma.booking.update({
      where: { id },
      data: {
        status: BookingStatus.ACCEPTED,
      },
    });
  }
}
