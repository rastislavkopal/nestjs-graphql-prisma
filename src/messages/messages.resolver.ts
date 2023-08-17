import {
  Resolver,
  Query,
  Mutation,
  Args,
  Int,
  Subscription,
} from '@nestjs/graphql';
import { MessagesService } from './messages.service';
import { Message } from './models/message.model';
import { CreateMessageInput } from './dto/create-message.input';
import { Inject, UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/gql-auth.guard';
import { LoggedUser } from '../common/decorators/logged-user.decorator';
import { User } from '@prisma/client';
import { PUB_SUB } from '../common/pubsub/pubsub.const';
import { PubSub, withFilter } from 'graphql-subscriptions';
import { PaginationArgs } from '../common/pagination/pagination.args';
import { MessageConnection } from './models/message-connection.model';

@Resolver(() => Message)
@UseGuards(GqlAuthGuard)
export class MessagesResolver {
  constructor(
    private readonly messagesService: MessagesService,
    @Inject(PUB_SUB) private pubSub: PubSub,
  ) {}

  @Mutation(() => Message)
  createMessage(
    @LoggedUser() user: User,
    @Args('data') data: CreateMessageInput,
  ) {
    return this.messagesService.create(user, data);
  }

  @Subscription(() => Message)
  messageCreated(@LoggedUser() user: User) {
    return withFilter(
      () => this.pubSub.asyncIterator('messageCreated'),
      (payload) => {
        return (
          payload.messageCreated.senderId === user.id ||
          payload.messageCreated.receiverId === user.id
        );
      },
    )(user);
  }

  @Query(() => MessageConnection, { name: 'myMessages' })
  userMessages(
    @LoggedUser() user: User,
    @Args() paginationArgs: PaginationArgs,
    @Args('receiverId', { type: () => String, nullable: true })
    receiverId?: string,
  ) {
    return this.messagesService.findAllByUser(user, paginationArgs, receiverId);
  }

  @Mutation(() => Message)
  removeMessage(@Args('id', { type: () => Int }) id: number) {
    return this.messagesService.remove(id);
  }
}
