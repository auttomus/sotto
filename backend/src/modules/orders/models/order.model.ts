import {
  ObjectType,
  Field,
  ID,
  Float,
  Int,
  registerEnumType,
} from '@nestjs/graphql';
import { OrderStatus } from '@prisma/client';

import { AccountModel } from '../../accounts/models/account.model';

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

  @Field(() => String, { nullable: true })
  customOfferId?: string | null;

  @Field(() => Float)
  agreedPrice: number;

  @Field(() => OrderStatus)
  status: OrderStatus;

  @Field(() => Boolean)
  isReviewable?: boolean;

  @Field(() => AccountModel, { nullable: true })
  buyer?: AccountModel;

  @Field(() => AccountModel, { nullable: true })
  seller?: AccountModel;

  @Field(() => ReviewModel, { nullable: true })
  review?: ReviewModel | null;

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

  @Field(() => String, { nullable: true })
  comment?: string | null;

  @Field(() => AccountModel, { nullable: true })
  reviewer?: AccountModel | null;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
