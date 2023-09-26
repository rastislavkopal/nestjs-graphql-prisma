import { ObjectType, Field, Int } from '@nestjs/graphql';
import { User } from '../../users/models/user.model';
import { Trip } from '../../trips/models/trip.model';
import { BaseModel } from '../../common/models/base.model';

@ObjectType()
export class Review extends BaseModel {
  @Field(() => Int)
  rating: number;

  @Field(() => String)
  message: string;

  @Field(() => User)
  author: User;

  @Field(() => User, { nullable: true })
  organizer?: User | null;

  @Field(() => Trip, { nullable: true })
  trip?: Trip | null;
}
