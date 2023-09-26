import { InputType, Int, Field } from '@nestjs/graphql';
import { IsOptional, Max, MaxLength, Min, MinLength } from 'class-validator';

@InputType()
export class CreateReviewInput {
  @Min(1)
  @Max(5)
  @Field(() => Int)
  rating: number;

  @MinLength(0)
  @MaxLength(1027)
  @Field(() => String)
  message: string;

  @IsOptional()
  @Field(() => String, { nullable: true })
  organizerId?: string;

  @IsOptional()
  @Field(() => String, { nullable: true })
  tripId?: string;
}
