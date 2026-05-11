import { InputType, Field, Float, Int, ID } from '@nestjs/graphql';
import {
  IsOptional,
  IsString,
  IsNumber,
  MaxLength,
  Min,
  IsBoolean,
  IsArray,
} from 'class-validator';

@InputType()
export class UpdateListingInput {
  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  title?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  description?: string;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(0)
  basePrice?: number;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(1)
  deliveryTimeDays?: number;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(1)
  maxActiveOrders?: number;

  @Field(() => Boolean, { nullable: true })
  @IsOptional()
  @IsBoolean()
  isUnlimited?: boolean;

  @Field(() => [ID], { nullable: true })
  @IsOptional()
  @IsArray()
  tagIds?: string[];
}
