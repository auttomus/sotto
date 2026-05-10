import {
  ObjectType,
  Field,
  ID,
  Float,
  Int,
  registerEnumType,
} from '@nestjs/graphql';
import { OrderStatus } from '@prisma/client';

registerEnumType(OrderStatus, { name: 'OrderStatus' });

@ObjectType()
export class OrderModel {
  @Field(() => ID)
  id: string;

  @Field()
  buyerAccountId: string;

  @Field()
  sellerAccountId: string;

  @Field()
  listingId: string;

  @Field({ nullable: true })
  customOfferId?: string | null;

  @Field(() => Float)
  agreedPrice: number;

  @Field(() => OrderStatus)
  status: OrderStatus;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

@ObjectType()
export class ReviewModel {
  @Field(() => ID)
  id: string;

  @Field()
  orderId: string;

  @Field()
  reviewerAccountId: string;

  @Field()
  targetAccountId: string;

  @Field(() => Int)
  rating: number;

  @Field({ nullable: true })
  comment?: string | null;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
