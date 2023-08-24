import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { TripsService } from './trips.service';
import { Trip } from './models/trip.model';
import { CreateTripInput } from './dto/create-trip.input';
import { UpdateTripInput } from './dto/update-trip.input';
import { GqlAuthGuard } from '../auth/gql-auth.guard';
import { UseGuards } from '@nestjs/common';
import { LoggedUser } from '../common/decorators/logged-user.decorator';
import { User } from '@prisma/client';
import { PaginationArgs } from '../common/pagination/pagination.args';
import { TripConnection } from './models/trip-connetion.model';
import { TripOrder } from './dto/trip-order.input';

@Resolver(() => Trip)
export class TripsResolver {
  constructor(private readonly tripsService: TripsService) {}

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Trip)
  createTrip(
    @Args('data') createTripInput: CreateTripInput,
    @LoggedUser() user: User,
  ) {
    return this.tripsService.create(createTripInput, user);
  }

  @Query(() => TripConnection, { name: 'trips' })
  findAll(
    @Args() paginationArgs: PaginationArgs,
    @Args({ name: 'orderBy', type: () => TripOrder })
    orderBy: TripOrder,
    @Args({ name: 'query', type: () => String, nullable: true })
    query: string,
  ) {
    return this.tripsService.findAll(paginationArgs, orderBy, query);
  }

  @Query(() => Trip, { nullable: true, name: 'trip' })
  findOne(@Args('id', { type: () => String }) id: string) {
    return this.tripsService.findOne(id);
  }

  @Mutation(() => Trip, { nullable: true })
  updateTrip(
    @Args('id', { type: () => String }) id: string,
    @Args('data') updateTripInput: UpdateTripInput,
  ) {
    return this.tripsService.update(id, updateTripInput);
  }

  @Mutation(() => Trip, { nullable: true })
  deleteTrip(@Args('id', { type: () => String }) id: string) {
    return this.tripsService.remove(id);
  }
}
