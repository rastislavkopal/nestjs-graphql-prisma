import { Injectable } from '@nestjs/common';
import { CreateReviewInput } from './dto/create-review.input';
import { UpdateReviewInput } from './dto/update-review.input';
import { User } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import { findManyCursorConnection } from '@devoxa/prisma-relay-cursor-connection';
import { ReviewConnection } from './models/review-connection.model';
import { PaginationArgs } from '../common/pagination/pagination.args';
import { Review } from './models/review.model';
import { NullableType } from '../common/types/nullable.type';

@Injectable()
export class ReviewsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(loggedUser: User, input: CreateReviewInput): Promise<Review> {
    const newReview = await this.prisma.review.create({
      data: {
        ...input,
        authorId: loggedUser.id,
      },
      include: {
        organizer: true,
        author: true,
        trip: {
          include: {
            organizer: true,
          },
        },
      },
    });
    return newReview;
  }

  async findAll(
    loggedUser: User,
    { after, before, first, last }: PaginationArgs,
    organizerId?: string,
    tripId?: string,
  ): Promise<ReviewConnection> {
    const a = await findManyCursorConnection(
      (args) =>
        this.prisma.review.findMany({
          where: {
            authorId: loggedUser.id,
            tripId: (tripId && { equals: tripId }) || undefined,
            organizerId: (organizerId && { equals: organizerId }) || undefined,
          },
          include: {
            organizer: true,
            author: true,
            trip: {
              include: {
                organizer: true,
              },
            },
          },
          // orderBy: 'createdAt', TODO
          ...args,
        }),
      () =>
        this.prisma.review.count({
          where: {
            authorId: loggedUser.id,
            tripId: (tripId && { equals: tripId }) || undefined,
            organizerId: (organizerId && { equals: organizerId }) || undefined,
          },
        }),
      { first, last, before, after },
    );
    return a;
  }

  findOne(id: string): Promise<NullableType<Review>> {
    return this.prisma.review.findUnique({
      where: { id },
      include: {
        organizer: true,
        author: true,
        trip: {
          include: {
            organizer: true,
          },
        },
      },
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  update(id: string, input: UpdateReviewInput): Promise<NullableType<Review>> {
    return null;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  remove(id: string): Promise<NullableType<Review>> {
    return null;
  }
}
