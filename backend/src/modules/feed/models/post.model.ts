import { ObjectType, Field, ID } from '@nestjs/graphql';
import { MediaAttachmentModel } from '../../media/models/media-attachment.model';

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

  @Field(() => [MediaAttachmentModel], { nullable: true })
  media?: MediaAttachmentModel[];
}
