import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateMessageInput {
  @Field(() => String)
  text: string;

  @Field(() => String)
  receiverId: string;
}
