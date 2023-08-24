import { InputType, Int, Field, Float } from '@nestjs/graphql';
import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  MaxLength,
  MinLength,
} from 'class-validator';
import { GraphQLDate } from 'graphql-scalars';

@InputType()
export class CreateTripInput {
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
