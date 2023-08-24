import { Injectable } from '@nestjs/common';
import { CreateTripInput } from './dto/create-trip.input';
import { UpdateTripInput } from './dto/update-trip.input';
import { User } from '../users/models/user.model';
import { PrismaService } from 'nestjs-prisma';
import { Trip } from './models/trip.model';
import { PaginationArgs } from '../common/pagination/pagination.args';
import { TripConnection } from './models/trip-connetion.model';
import { findManyCursorConnection } from '@devoxa/prisma-relay-cursor-connection';
import { TripOrder } from './dto/trip-order.input';
import { NullableType } from '../common/types/nullable.type';

@Injectable()
export class TripsService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createTripInput: CreateTripInput, loggedUser: User) {
    const newTrip = this.prisma.trip.create({
      data: {
        organizerId: loggedUser.id,
        currentParticipants: 0,
        ...createTripInput,
      },
      include: { organizer: true },
    });
    return newTrip;
  }

  async findAll(
    { after, before, first, last }: PaginationArgs,
    orderBy: TripOrder,
    query?: string,
  ): Promise<TripConnection> {
    const a = await findManyCursorConnection(
      (args) =>
        this.prisma.trip.findMany({
          include: { organizer: true },
          where: {
            destination: { contains: query || '' },
          },
          orderBy: orderBy ? { [orderBy.field]: orderBy.direction } : undefined,
          ...args,
        }),
      () =>
        this.prisma.trip.count({
          where: {
            destination: { contains: query || '' },
          },
        }),
      { first, last, before, after },
    );
    return a;
  }

  async findOne(id: string): Promise<NullableType<Trip>> {
    return this.prisma.trip.findUnique({
      where: { id },
      include: { organizer: true },
    });
  }

  async update(
    id: string,
    updateTripInput: UpdateTripInput,
  ): Promise<NullableType<Trip>> {
    const trip = await this.prisma.trip.findUnique({
      where: { id },
    });

    if (!trip) return null;

    return this.prisma.trip.update({
      where: { id },
      data: updateTripInput,
      include: { organizer: true },
    });
  }

  async remove(id: string): Promise<NullableType<Trip>> {
    const trip = await this.prisma.trip.findUnique({
      where: { id },
    });

    if (!trip) return null;

    return this.prisma.trip.delete({
      where: { id },
      include: { organizer: true },
    });
  }
}
