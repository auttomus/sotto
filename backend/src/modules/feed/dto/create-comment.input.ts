import { InputType, Field, ID } from '@nestjs/graphql';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

@InputType()
export class CreateCommentInput {
  @Field(() => ID)
  @IsNotEmpty()
  parentPostId: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  content: string;
}
