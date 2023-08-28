import { ObjectType, Field } from '@nestjs/graphql';
import { Trip } from '../../trips/models/trip.model';
import { User } from '../../users/models/user.model';
import { BaseModel } from '../../common/models/base.model';

@ObjectType()
export class Booking extends BaseModel {
  @Field(() => User)
  user: User;

  @Field(() => Trip)
  trip: Trip;
}
