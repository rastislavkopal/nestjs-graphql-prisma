import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  MaxLength,
  MinLength,
} from 'class-validator';
import { CreateTripInput } from './create-trip.input';
import { InputType, Field, Int, PartialType, Float } from '@nestjs/graphql';
import { GraphQLDate } from 'graphql-scalars';

@InputType()
export class UpdateTripInput extends PartialType(CreateTripInput) {
  @Field(() => String)
  @IsNotEmpty()
  destination: string;

  @Field(() => GraphQLDate)
  @IsNotEmpty()
  @IsDate()
  startDate: Date;

  @Field(() => GraphQLDate)
  @IsNotEmpty()
  @IsDate()
  endDate: Date;

  @Field(() => Float)
  @IsNotEmpty()
  @IsNumber()
  cost: number;

  @Field(() => Int)
  @IsNotEmpty()
  @IsNumber()
  maxParticipants: number;

  @Field(() => String)
  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(32000)
  itinerary: string;
}
