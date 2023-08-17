import { Module } from '@nestjs/common';
import { PostsResolver } from './posts.resolver';
import { PubSubModule } from '../common/pubsub/pubsub.module';

@Module({
  imports: [PubSubModule],
  providers: [PostsResolver],
})
export class PostsModule {}
