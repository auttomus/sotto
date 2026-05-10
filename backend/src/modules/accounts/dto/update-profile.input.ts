import { InputType, Field } from '@nestjs/graphql';
import { IsOptional, IsString, MaxLength } from 'class-validator';

@InputType()
export class UpdateProfileInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  displayName?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(300)
  note?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  major?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  avatarObjectKey?: string;
}
