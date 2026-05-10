import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsOptional, IsBoolean } from 'class-validator';

@InputType()
export class RequestUploadInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  fileName: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  contentType: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  attachedType: string; // "Listing", "ScyllaPost", "ScyllaMessage", "Avatar"

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  attachedId?: string;

  @Field({ defaultValue: false })
  @IsOptional()
  @IsBoolean()
  isPrivate?: boolean;
}
