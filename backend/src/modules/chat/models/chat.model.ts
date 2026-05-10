import { ObjectType, Field, ID, registerEnumType } from '@nestjs/graphql';
import { ConversationType } from '@prisma/client';

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
  @Field({ nullable: true })
  lastMessageContent?: string;

  @Field({ nullable: true })
  lastMessageAt?: Date;
}

@ObjectType()
export class ConversationParticipant {
  @Field(() => ID)
  accountId: string;

  @Field()
  displayName: string;

  @Field({ nullable: true })
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
  @Field({ nullable: true })
  senderDisplayName?: string;

  @Field({ nullable: true })
  senderAvatarObjectKey?: string;
}
