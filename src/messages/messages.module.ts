import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesResolver } from './messages.resolver';
import { PubSubModule } from '../common/pubsub/pubsub.module';

@Module({
  imports: [PubSubModule],
  providers: [MessagesResolver, MessagesService],
})
export class MessagesModule {}
