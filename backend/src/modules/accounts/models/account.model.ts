import { ObjectType, Field, ID, Float } from '@nestjs/graphql';

@ObjectType()
export class AccountModel {
  @Field(() => ID)
  id: string;

  @Field()
  username: string;

  @Field()
  displayName: string;

  @Field(() => String, { nullable: true })
  major?: string | null;

  @Field(() => String, { nullable: true })
  note?: string | null;

  @Field(() => String, { nullable: true })
  avatarObjectKey?: string | null;

  @Field(() => String, { nullable: true })
  avatarUrl?: string | null; // Resolved: presigned/public URL

  /** BigInt serialized to string */
  @Field()
  followersCount: string;

  @Field()
  followingCount: string;

  @Field(() => Float)
  trustScore: number;

  @Field(() => String, { nullable: true })
  schoolName?: string | null; // Resolved from relation

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  // Resolved field: apakah current user mengikuti akun ini
  @Field(() => Boolean, { nullable: true })
  isFollowing?: boolean | null;
}
