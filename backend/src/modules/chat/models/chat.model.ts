import { ObjectType, Field, ID, registerEnumType } from '@nestjs/graphql';
import { MediaAttachmentModel } from '../../media/models/media-attachment.model';
import { ConversationType } from '@prisma/client';
import { OrderModel } from '../../orders/models/order.model';

registerEnumType(ConversationType, { name: 'ConversationType' });

@ObjectType()
export class ConversationModel {
  @Field(() => ID)
  id: string;

  @Field(() => ConversationType)
  type: ConversationType;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  // Resolved: nama-nama peserta
  @Field(() => [ConversationParticipant], { nullable: true })
  participants?: ConversationParticipant[];

  // Resolved: pesan terakhir untuk preview
  @Field(() => String, { nullable: true })
  lastMessageContent?: string;

  @Field(() => Date, { nullable: true })
  lastMessageAt?: Date;

  // Virtual Field: Pesanan aktif dalam percakapan ini
  @Field(() => OrderModel, { nullable: true })
  activeOrder?: OrderModel;
}

@ObjectType()
export class ConversationParticipant {
  @Field(() => ID)
  accountId: string;

  @Field()
  displayName: string;

  @Field(() => String, { nullable: true })
  avatarObjectKey?: string;
}

@ObjectType()
export class MessageModel {
  @Field()
  messageId: string;

  @Field()
  conversationId: string;

  @Field()
  senderId: string;

  @Field()
  content: string;

  @Field()
  createdAt: Date;

  // Resolved from PostgreSQL
  @Field(() => String, { nullable: true })
  senderDisplayName?: string;

  @Field(() => String, { nullable: true })
  senderAvatarObjectKey?: string;

  @Field(() => [MediaAttachmentModel], { nullable: true })
  media?: MediaAttachmentModel[];
}
