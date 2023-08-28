import { Field, InputType, registerEnumType } from '@nestjs/graphql';
import { Order } from '../../common/order/order';

export enum BookingOrderField {
  id = 'id',
  createdAt = 'createdAt',
  updatedAt = 'updatedAt',
  userId = 'userId',
}

registerEnumType(BookingOrderField, {
  name: 'BookingOrderField',
  description: 'Properties by which Booking connections can be ordered.',
});

@InputType()
export class BookingOrder extends Order {
  @Field(() => BookingOrderField)
  field: BookingOrderField;
}
