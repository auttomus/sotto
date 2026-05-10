import { ObjectType, Field, ID, Float } from '@nestjs/graphql';

@ObjectType()
export class AccountModel {
  @Field(() => ID)
  id: string;

  @Field()
  username: string;

  @Field()
  displayName: string;

  @Field({ nullable: true })
  major?: string;

  @Field({ nullable: true })
  note?: string;

  @Field({ nullable: true })
  avatarObjectKey?: string;

  @Field({ nullable: true })
  avatarUrl?: string; // Resolved: presigned/public URL

  @Field()
  followersCount: string; // BigInt as string

  @Field()
  followingCount: string;

  @Field(() => Float)
  trustScore: number;

  @Field({ nullable: true })
  schoolName?: string; // Resolved from relation

  @Field()
  createdAt: Date;

  // Resolved field: apakah current user mengikuti akun ini
  @Field({ nullable: true })
  isFollowing?: boolean;
}
