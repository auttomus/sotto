import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class MediaAttachmentModel {
  @Field(() => ID)
  id: string;

  /** Polymorphic target type: "Listing", "ScyllaPost", "Avatar", etc. */
  @Field()
  attachedType: string;

  /** Polymorphic target ID (string to support both BigInt and TimeUUID) */
  @Field()
  attachedId: string;

  @Field()
  fileName: string;

  @Field()
  contentType: string;

  /** BigInt serialized to string */
  @Field()
  fileSize: string;

  @Field(() => String, { nullable: true })
  blurhash?: string | null;

  @Field()
  bucketName: string;

  @Field()
  objectKey: string;

  @Field()
  isPrivate: boolean;

  /** Resolved at query time: presigned URL (private) or public CDN URL */
  @Field(() => String, { nullable: true })
  url?: string | null;

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
