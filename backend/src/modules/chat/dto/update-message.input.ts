import { InputType, Field, ID } from '@nestjs/graphql';
import { IsOptional, IsString, MaxLength, IsArray } from 'class-validator';

@InputType()
export class UpdateMessageInput {
  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  content?: string;

  @Field(() => [ID], { nullable: true })
  @IsOptional()
  @IsArray()
  mediaIds?: string[];
}
