import { InputType, Field, ID, Float, Int } from '@nestjs/graphql';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

@InputType()
export class CreateOfferInput {
  @Field(() => ID)
  @IsNotEmpty()
  conversationId: string;

  @Field(() => ID)
  @IsNotEmpty()
  buyerAccountId: string;

  @Field(() => ID, { nullable: true })
  @IsOptional()
  listingId?: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  description: string;

  @Field(() => Float)
  @IsNumber()
  @Min(0)
  proposedPrice: number;

  @Field(() => Int)
  @IsNumber()
  @Min(1)
  deliveryTimeDays: number;
}
