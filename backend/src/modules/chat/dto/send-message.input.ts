import { InputType, Field, ID } from '@nestjs/graphql';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

@InputType()
export class SendMessageInput {
  @Field(() => ID)
  @IsNotEmpty()
  conversationId: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  @MaxLength(2000)
  content: string;
}
