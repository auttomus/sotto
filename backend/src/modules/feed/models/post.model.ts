import { ObjectType, Field, ID, Int } from '@nestjs/graphql';
import { MediaAttachmentModel } from '../../media/models/media-attachment.model';
import { TagModel } from '../../tags/models/tag.model';

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

  @Field(() => Date, { nullable: true })
  editedAt?: Date | null;

  @Field(() => Date, { nullable: true })
  deletedAt?: Date | null;

  // Resolved fields from PostgreSQL
  @Field(() => String, { nullable: true })
  authorDisplayName?: string | null;

  @Field(() => String, { nullable: true })
  authorUsername?: string | null;

  @Field(() => String, { nullable: true })
  authorAvatarObjectKey?: string | null;

  @Field(() => String, { nullable: true })
  authorSchoolName?: string | null;

  @Field(() => [MediaAttachmentModel], { nullable: true })
  media?: MediaAttachmentModel[];

  @Field(() => [TagModel], { nullable: true })
  tags?: TagModel[];

  @Field(() => Int)
  likesCount?: number;

  @Field(() => Int)
  repliesCount?: number;

  @Field(() => Boolean)
  likedByMe?: boolean;

  @Field(() => [PostModel], { nullable: true })
  ancestors?: PostModel[];
}
