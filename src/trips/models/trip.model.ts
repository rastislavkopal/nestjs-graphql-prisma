import { ObjectType, Field, Float, Int } from '@nestjs/graphql';
import { User } from '../../users/models/user.model';
import { BaseModel } from '../../common/models/base.model';
import { GraphQLDate } from 'graphql-scalars';

@ObjectType()
export class Trip extends BaseModel {
  @Field(() => User)
  organizer: User;

  @Field(() => String)
  destination: string;

  @Field(() => GraphQLDate)
  startDate: Date;

  @Field(() => GraphQLDate)
  endDate: Date;

  @Field(() => Float)
  cost: number;

  @Field(() => Int)
  maxParticipants: number;

  @Field(() => Int)
  currentParticipants: number;

  @Field(() => String)
  itinerary: string;
}
