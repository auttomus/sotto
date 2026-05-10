import { InputType, Field, ID } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, IsArray } from 'class-validator';
import { ConversationType } from '@prisma/client';

@InputType()
export class CreateConversationInput {
  @Field(() => [ID])
  @IsArray()
  @IsNotEmpty()
  participantIds: string[];

  @Field(() => String, { defaultValue: 'DIRECT' })
  @IsOptional()
  type?: ConversationType;
}
