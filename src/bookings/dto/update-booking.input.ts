import { CreateBookingInput } from './create-booking.input';
import { InputType, Field, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateBookingInput extends PartialType(CreateBookingInput) {
  @Field(() => Boolean)
  isApproved: boolean;
}
