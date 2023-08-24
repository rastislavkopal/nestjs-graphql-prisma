import { Field, InputType, registerEnumType } from '@nestjs/graphql';
import { Order } from '../../common/order/order';

export enum TripOrderField {
  id = 'id',
  createdAt = 'createdAt',
  updatedAt = 'updatedAt',
  destination = 'destination',
  startDate = 'startDate',
  cost = 'cost',
  maxParticipants = 'maxParticipants',
  currentParticipants = 'currentParticipants',
}

registerEnumType(TripOrderField, {
  name: 'TripOrderField',
  description: 'Properties by which trip connections can be ordered.',
});

@InputType()
export class TripOrder extends Order {
  @Field(() => TripOrderField)
  field: TripOrderField;
}
