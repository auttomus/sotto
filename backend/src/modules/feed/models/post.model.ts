import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class PostModel {
  @Field(() => ID)
  postId: string;

  @Field()
  authorId: string;

  @Field(() => String, { nullable: true })
  inReplyToPostId?: string | null;

  @Field()
  content: string;

  @Field(() => String, { nullable: true })
  linkedServiceId?: string | null;

  @Field()
  createdAt: Date;

  // Resolved fields from PostgreSQL
  @Field(() => String, { nullable: true })
  authorDisplayName?: string | null;

  @Field(() => String, { nullable: true })
  authorUsername?: string | null;

  @Field(() => String, { nullable: true })
  authorAvatarObjectKey?: string | null;

  @Field(() => String, { nullable: true })
  authorSchoolName?: string | null;
}
