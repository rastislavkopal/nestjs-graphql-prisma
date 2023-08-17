import { ObjectType, Field } from '@nestjs/graphql';
import { BaseModel } from '../../common/models/base.model';
import { User } from '../../users/models/user.model';

@ObjectType()
export class Message extends BaseModel {
  @Field(() => String)
  text: string;

  @Field(() => User)
  sender: User;

  @Field(() => User)
  receiver: User;
}
