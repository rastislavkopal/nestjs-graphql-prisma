import { ObjectType } from '@nestjs/graphql';
import PaginatedResponse from '../../common/pagination/pagination';
import { Trip } from './trip.model';

@ObjectType()
export class TripConnection extends PaginatedResponse(Trip) {}
