import { ObjectType, Field, ID, Float, registerEnumType } from '@nestjs/graphql';
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

  @Field({ nullable: true })
  listingId?: string;

  @Field()
  description: string;

  @Field(() => Float)
  proposedPrice: number;

  @Field()
  deliveryTimeDays: number;

  @Field(() => OfferStatus)
  status: OfferStatus;

  @Field({ nullable: true })
  expiresAt?: Date;

  @Field()
  createdAt: Date;
}
