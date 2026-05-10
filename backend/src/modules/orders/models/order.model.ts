import { ObjectType, Field, ID, Float, registerEnumType } from '@nestjs/graphql';
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
  customOfferId?: string;

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

  @Field()
  rating: number;

  @Field({ nullable: true })
  comment?: string;

  @Field()
  createdAt: Date;
}
