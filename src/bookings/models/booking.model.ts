import { ObjectType, Field, registerEnumType } from '@nestjs/graphql';
import { Trip } from '../../trips/models/trip.model';
import { User } from '../../users/models/user.model';
import { BaseModel } from '../../common/models/base.model';
import { BookingStatus } from '@prisma/client';

registerEnumType(BookingStatus, {
  name: 'BookingStatus',
  description: 'Booking status',
});

@ObjectType()
export class Booking extends BaseModel {
  @Field(() => User)
  user: User;

  @Field(() => Trip)
  trip: Trip;
}
