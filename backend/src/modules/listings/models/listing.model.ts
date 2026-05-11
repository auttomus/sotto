import {
  ObjectType,
  Field,
  ID,
  Float,
  Int,
  registerEnumType,
} from '@nestjs/graphql';
import { ListingType, ListingStatus } from '@prisma/client';

registerEnumType(ListingType, { name: 'ListingType' });
registerEnumType(ListingStatus, { name: 'ListingStatus' });

// Model untuk Relasi Profil Penjual (ringkas)
@ObjectType()
export class AccountPartial {
  @Field()
  displayName: string;

  @Field(() => String, { nullable: true })
  major?: string | null;

  @Field(() => Float)
  trustScore: number;

  @Field(() => String, { nullable: true })
  username?: string | null;
}

// Model Utama Listing
@ObjectType()
export class ListingModel {
  @Field(() => ID)
  id: string;

  @Field()
  title: string;

  @Field()
  description: string;

  @Field(() => Float)
  price: number;

  @Field(() => ListingType)
  type: ListingType;

  @Field(() => ListingStatus)
  status: ListingStatus;

  @Field(() => Int, { nullable: true })
  deliveryTimeDays?: number | null;

  @Field(() => Int, { nullable: true })
  maxActiveOrders?: number | null;

  @Field()
  isUnlimited: boolean;

  @Field(() => ID)
  accountId: string;

  @Field(() => AccountPartial, { nullable: true })
  account?: AccountPartial | null;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
