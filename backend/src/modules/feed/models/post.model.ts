import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class PostModel {
  @Field(() => ID)
  postId: string;

  @Field()
  authorId: string;

  @Field({ nullable: true })
  inReplyToPostId?: string;

  @Field()
  content: string;

  @Field({ nullable: true })
  linkedServiceId?: string;

  @Field()
  createdAt: Date;

  // Resolved fields from PostgreSQL
  @Field({ nullable: true })
  authorDisplayName?: string;

  @Field({ nullable: true })
  authorUsername?: string;

  @Field({ nullable: true })
  authorAvatarObjectKey?: string;

  @Field({ nullable: true })
  authorSchoolName?: string;
}
