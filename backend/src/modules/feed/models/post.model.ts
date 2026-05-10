import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class PostModel {
  @Field(() => ID)
  postId: string;

  @Field()
  authorId: string;

  @Field({ nullable: true })
  inReplyToPostId?: string | null;

  @Field()
  content: string;

  @Field({ nullable: true })
  linkedServiceId?: string | null;

  @Field()
  createdAt: Date;

  // Resolved fields from PostgreSQL
  @Field({ nullable: true })
  authorDisplayName?: string | null;

  @Field({ nullable: true })
  authorUsername?: string | null;

  @Field({ nullable: true })
  authorAvatarObjectKey?: string | null;

  @Field({ nullable: true })
  authorSchoolName?: string | null;
}
