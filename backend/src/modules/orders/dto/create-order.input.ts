import { InputType, Field, ID, Float } from '@nestjs/graphql';
import { IsNotEmpty, IsNumber, IsOptional, Min } from 'class-validator';

@InputType()
export class CreateOrderInput {
  @Field(() => ID)
  @IsNotEmpty()
  listingId: string;

  @Field(() => ID, { nullable: true })
  @IsOptional()
  customOfferId?: string;

  @Field(() => Float)
  @IsNumber()
  @Min(0)
  agreedPrice: number;
}
