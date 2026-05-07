import { ObjectType, Field, ID, Float } from '@nestjs/graphql';

// Model untuk Relasi Profil Penjual
@ObjectType()
export class AccountPartial {
  @Field()
  displayName: string;

  @Field({ nullable: true })
  major?: string;

  @Field(() => Float)
  trustScore: number;
}

// Model Utama Listing
@ObjectType()
export class ListingModel {
  @Field(() => ID)
  id: string; // BigInt dari Prisma akan dilempar ke mari sebagai String

  @Field()
  title: string;

  @Field()
  description: string;

  @Field(() => Float)
  price: number; // Decimal dari Prisma akan diubah jadi angka biasa (Float)

  @Field(() => ID)
  accountId: string;

  @Field(() => AccountPartial, { nullable: true })
  account?: AccountPartial;

  @Field()
  createdAt: Date;
}
