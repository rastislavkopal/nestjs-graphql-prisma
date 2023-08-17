import { Inject, Injectable } from '@nestjs/common';
import { CreateMessageInput } from './dto/create-message.input';
import { PrismaService } from 'nestjs-prisma';
import { PubSub } from 'graphql-subscriptions';
import { Message, User } from '@prisma/client';
import { PUB_SUB } from '../common/pubsub/pubsub.const';
import { PaginationArgs } from '../common/pagination/pagination.args';
import { findManyCursorConnection } from '@devoxa/prisma-relay-cursor-connection';
import { MessageConnection } from './models/message-connection.model';

@Injectable()
export class MessagesService {
  constructor(
    private prisma: PrismaService,
    @Inject(PUB_SUB) private pubSub: PubSub,
  ) {}

  async create(
    loggedUser: User,
    createMessageInput: CreateMessageInput,
  ): Promise<Message> {
    const newMessage = await this.prisma.message.create({
      data: {
        text: createMessageInput.text,
        senderId: loggedUser.id,
        receiverId: createMessageInput.receiverId,
      },
    });
    this.pubSub.publish('messageCreated', { messageCreated: newMessage });
    return newMessage;
  }

  async findAllByUser(
    loggedUser: User,
    { after, before, first, last }: PaginationArgs,
    receiverId?: string,
  ): Promise<MessageConnection> {
    const a = await findManyCursorConnection(
      (args) =>
        this.prisma.message.findMany({
          include: { sender: true, receiver: true },
          where: {
            senderId: loggedUser.id,
            ...(receiverId && { receiverId }),
          },
          orderBy: { createdAt: 'desc' },
          ...args,
        }),
      () =>
        this.prisma.message.count({
          where: {
            senderId: loggedUser.id,
            ...(receiverId && { receiverId }),
          },
        }),
      { first, last, before, after },
    );
    return a;
  }

  findOne(id: number) {
    return `This action returns a #${id} message`;
  }

  remove(id: number) {
    return `This action removes a #${id} message`;
  }
}
