import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ScyllaService } from '../../infrastructure/scylla/scylla.service';
import { CreateConversationInput } from './dto/create-conversation.input';
import { types } from 'cassandra-driver';
import { ConversationType, Prisma } from '@prisma/client';

// Explicit Prisma type for conversation with participants
type ConversationWithParticipants = Prisma.ConversationGetPayload<{
  include: {
    participants: {
      include: {
        account: {
          select: { id: true; displayName: true; avatarObjectKey: true };
        };
      };
    };
  };
}>;

export type SerializedMessage = {
  messageId: string;
  conversationId: string;
  senderId: string;
  content: string;
  createdAt: Date;
};

@Injectable()
export class ChatService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly scylla: ScyllaService,
  ) {}

  // ── Conversations (PostgreSQL) ─────────────────────────

  /** Buat conversation baru beserta participants */
  async createConversation(
    creatorAccountId: bigint,
    input: CreateConversationInput,
  ): Promise<ConversationWithParticipants> {
    const allParticipants = [
      ...new Set([creatorAccountId.toString(), ...input.participantIds]),
    ];

    return this.prisma.conversation.create({
      data: {
        type: (input.type as ConversationType) ?? ConversationType.DIRECT,
        // Note: Conversation.listingId does NOT exist in schema.
        // Listing context is conveyed via ConversationParticipant metadata
        // or by passing listingId as a message attachment in the future.
        participants: {
          create: allParticipants.map((id) => ({
            accountId: BigInt(id),
          })),
        },
      },
      include: {
        participants: {
          include: {
            account: {
              select: { id: true, displayName: true, avatarObjectKey: true },
            },
          },
        },
      },
    });
  }

  /** Ambil semua conversation milik user */
  async getConversations(
    accountId: bigint,
  ): Promise<ConversationWithParticipants[]> {
    return this.prisma.conversation.findMany({
      where: {
        participants: { some: { accountId } },
      },
      include: {
        participants: {
          include: {
            account: {
              select: { id: true, displayName: true, avatarObjectKey: true },
            },
          },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });
  }

  /** Validasi bahwa user adalah peserta conversation */
  async validateParticipant(
    conversationId: bigint,
    accountId: bigint,
  ): Promise<void> {
    const participant = await this.prisma.conversationParticipant.findFirst({
      where: { conversationId, accountId },
    });
    if (!participant) {
      throw new NotFoundException('Anda bukan peserta percakapan ini.');
    }
  }

  // ── Messages (ScyllaDB) ────────────────────────────────

  /** Kirim pesan — tulis ke ScyllaDB + update timestamp conversation */
  async sendMessage(
    conversationId: bigint,
    senderAccountId: bigint,
    content: string,
  ): Promise<SerializedMessage> {
    const messageId = types.TimeUuid.now();
    const now = new Date();

    await this.scylla.execute(
      `INSERT INTO messages (conversation_id, message_id, sender_id, content, created_at)
       VALUES (?, ?, ?, ?, ?)`,
      [conversationId, messageId, senderAccountId, content, now],
    );

    // Update timestamp conversation di PostgreSQL
    await this.prisma.conversation.update({
      where: { id: conversationId },
      data: { updatedAt: now },
    });

    return {
      messageId: messageId.toString(),
      conversationId: conversationId.toString(),
      senderId: senderAccountId.toString(),
      content,
      createdAt: now,
    };
  }

  /** Ambil riwayat pesan untuk sebuah conversation */
  async getMessages(
    conversationId: bigint,
    limit = 50,
  ): Promise<SerializedMessage[]> {
    const result = await this.scylla.execute(
      `SELECT message_id, sender_id, content, created_at
       FROM messages WHERE conversation_id = ?
       ORDER BY message_id DESC LIMIT ?`,
      [conversationId, limit],
    );

    return result.rows.map((row) => ({
      messageId: String(row['message_id'] as unknown),
      conversationId: conversationId.toString(),
      senderId: String(row['sender_id'] as unknown),
      content: String(row['content'] as unknown),
      createdAt: row['created_at'] as Date,
    }));
  }
}
