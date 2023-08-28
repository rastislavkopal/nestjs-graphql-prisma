import { Booking } from './booking.model';
import PaginatedResponse from '../../common/pagination/pagination';
import { ObjectType } from '@nestjs/graphql';

@ObjectType()
export class BookingConnection extends PaginatedResponse(Booking) {}
