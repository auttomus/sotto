import {
  ObjectType,
  Field,
  ID,
  Float,
  Int,
  registerEnumType,
} from '@nestjs/graphql';
import { OfferStatus } from '@prisma/client';

registerEnumType(OfferStatus, { name: 'OfferStatus' });

@ObjectType()
export class CustomOfferModel {
  @Field(() => ID)
  id: string;

  @Field()
  conversationId: string;

  @Field()
  sellerAccountId: string;

  @Field()
  buyerAccountId: string;

  /** Optional: which listing this offer is based on */
  @Field(() => String, { nullable: true })
  listingId?: string | null;

  @Field()
  description: string;

  @Field(() => Float)
  proposedPrice: number;

  @Field(() => Int)
  deliveryTimeDays: number;

  @Field(() => OfferStatus)
  status: OfferStatus;

  @Field(() => Date, { nullable: true })
  expiresAt?: Date | null;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
