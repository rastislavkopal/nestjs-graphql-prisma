import { Message } from './message.model';
import PaginatedResponse from '../../common/pagination/pagination';
import { ObjectType } from '@nestjs/graphql';

@ObjectType()
export class MessageConnection extends PaginatedResponse(Message) {}
