import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class MediaAttachmentModel {
  @Field(() => ID)
  id: string;

  @Field()
  fileName: string;

  @Field()
  contentType: string;

  @Field()
  fileSize: string; // BigInt as string

  @Field({ nullable: true })
  blurhash?: string;

  @Field()
  objectKey: string;

  @Field()
  isPrivate: boolean;

  @Field({ nullable: true })
  url?: string; // Resolved at query time (presigned or public URL)

  @Field()
  createdAt: Date;
}

@ObjectType()
export class PresignedUploadResult {
  @Field()
  uploadUrl: string;

  @Field()
  objectKey: string;
}
