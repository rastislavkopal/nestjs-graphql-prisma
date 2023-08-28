import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { BookingsService } from './bookings.service';
import { Booking } from './models/booking.model';
import { CreateBookingInput } from './dto/create-booking.input';
import { UpdateBookingInput } from './dto/update-booking.input';
import { BookingConnection } from './models/booking-connection.model';
import { LoggedUser } from '../common/decorators/logged-user.decorator';
import { User } from '../users/models/user.model';
import { BookingOrder } from './dto/booking-order.input';
import { PaginationArgs } from '../common/pagination/pagination.args';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/gql-auth.guard';

@Resolver(() => Booking)
@UseGuards(GqlAuthGuard)
export class BookingsResolver {
  constructor(private readonly bookingsService: BookingsService) {}

  @Mutation(() => Booking)
  createBooking(
    @LoggedUser() loggedUser: User,
    @Args('data') createBookingInput: CreateBookingInput,
  ) {
    return this.bookingsService.create(createBookingInput, loggedUser);
  }

  @Query(() => BookingConnection, { name: 'bookings' })
  findAllBookings(
    @LoggedUser() loggedUser: User,
    @Args() paginationArgs: PaginationArgs,
    @Args({ name: 'orderBy', type: () => BookingOrder })
    orderBy: BookingOrder,
    @Args('tripId', { nullable: true }) tripId?: string,
  ): Promise<BookingConnection> {
    return this.bookingsService.findAll(
      loggedUser,
      paginationArgs,
      orderBy,
      tripId,
    );
  }

  @Query(() => Booking, { name: 'booking', nullable: true })
  findOne(@Args('id') id: string) {
    return this.bookingsService.findOne(id);
  }

  @Mutation(() => Booking)
  updateBooking(
    @Args('id') id: string,
    @Args('data') updateBookingInput: UpdateBookingInput,
  ) {
    return this.bookingsService.update(id, updateBookingInput);
  }

  @Mutation(() => Booking)
  removeBooking(@Args('id') id: string) {
    return this.bookingsService.remove(id);
  }
}
