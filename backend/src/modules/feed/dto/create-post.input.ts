import { InputType, Field, ID } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

@InputType()
export class CreatePostInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  content: string;

  @Field(() => [ID], { nullable: true })
  @IsOptional()
  tagIds?: string[];

  @Field(() => ID, { nullable: true })
  @IsOptional()
  linkedServiceId?: string;
}
