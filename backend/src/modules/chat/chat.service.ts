import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ScyllaService } from '../../infrastructure/scylla/scylla.service';
import { MediaService } from '../media/media.service';
import { CreateConversationInput } from './dto/create-conversation.input';
import { types } from 'cassandra-driver';
import { ConversationType, Prisma } from '@prisma/client';

// Explicit Prisma type for conversation with participants
type ConversationWithParticipants = Prisma.ConversationGetPayload<{
  include: {
    participants: {
      include: {
        account: {
          select: {
            id: true;
            username: true;
            displayName: true;
            avatarObjectKey: true;
          };
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
  editedAt?: Date | null;
  deletedAt?: Date | null;
  media?: any[];
};

@Injectable()
export class ChatService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly scylla: ScyllaService,
    private readonly mediaService: MediaService,
  ) {}

  // ── Conversations (PostgreSQL) ─────────────────────────

  /** Buat conversation baru beserta participants */
  async createConversation(
    creatorAccountId: string,
    input: CreateConversationInput,
  ): Promise<ConversationWithParticipants> {
    const type = (input.type as ConversationType) ?? ConversationType.DIRECT;
    const allParticipants = [
      ...new Set([creatorAccountId, ...input.participantIds]),
    ];

    // Logika Pencegahan Duplikasi untuk Chat DIRECT
    if (type === ConversationType.DIRECT && allParticipants.length === 2) {
      const existing = await this.prisma.conversation.findFirst({
        where: {
          type: ConversationType.DIRECT,
          AND: [
            { participants: { some: { accountId: allParticipants[0] } } },
            { participants: { some: { accountId: allParticipants[1] } } },
          ],
        },
        include: {
          participants: {
            include: {
              account: {
                select: {
                  id: true,
                  username: true,
                  displayName: true,
                  avatarObjectKey: true,
                },
              },
            },
          },
        },
      });

      if (existing) return existing;
    }

    return this.prisma.conversation.create({
      data: {
        type,
        participants: {
          create: allParticipants.map((id) => ({
            accountId: id,
          })),
        },
      },
      include: {
        participants: {
          include: {
            account: {
              select: {
                id: true,
                username: true,
                displayName: true,
                avatarObjectKey: true,
              },
            },
          },
        },
      },
    });
  }

  /** Ambil semua conversation milik user */
  async getConversations(
    accountId: string,
  ): Promise<ConversationWithParticipants[]> {
    return this.prisma.conversation.findMany({
      where: {
        participants: { some: { accountId } },
      },
      include: {
        participants: {
          include: {
            account: {
              select: {
                id: true,
                username: true,
                displayName: true,
                avatarObjectKey: true,
              },
            },
          },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });
  }

  /** Validasi bahwa user adalah peserta conversation */
  async validateParticipant(
    conversationId: string,
    accountId: string,
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
    conversationId: string,
    senderAccountId: string,
    content: string,
    mediaIds?: string[],
  ): Promise<SerializedMessage> {
    const messageId = types.TimeUuid.now();
    const now = new Date();

    await this.scylla.execute(
      `INSERT INTO messages (conversation_id, message_id, sender_id, content, created_at)
       VALUES (?, ?, ?, ?, ?)`,
      [
        types.Uuid.fromString(conversationId),
        messageId,
        types.Uuid.fromString(senderAccountId),
        content,
        now,
      ],
    );

    // Update timestamp conversation di PostgreSQL
    await this.prisma.conversation.update({
      where: { id: conversationId },
      data: { updatedAt: now },
    });

    // Media association (PostgreSQL)
    let mediaList: any[] = [];
    if (mediaIds?.length) {
      await this.prisma.mediaAttachment.updateMany({
        where: { id: { in: mediaIds }, accountId: senderAccountId },
        data: {
          attachedId: messageId.toString(),
          attachedType: 'ScyllaMessage',
        },
      });
      mediaList = await this.mediaService.getMediaForObject(
        'ScyllaMessage',
        messageId.toString(),
      );
    }

    return {
      messageId: messageId.toString(),
      conversationId: conversationId,
      senderId: senderAccountId,
      content,
      createdAt: now,
      editedAt: null,
      deletedAt: null,
      media: mediaList,
    };
  }

  /** Ambil detail pesan tunggal */
  async getMessage(
    conversationId: string,
    messageId: string,
  ): Promise<SerializedMessage> {
    const convoUuid = types.Uuid.fromString(conversationId);
    const msgUuid = types.TimeUuid.fromString(messageId);
    const result = await this.scylla.execute(
      `SELECT * FROM messages WHERE conversation_id = ? AND message_id = ?`,
      [convoUuid, msgUuid],
    );
    if (result.rows.length === 0)
      throw new NotFoundException('Pesan tidak ditemukan');
    const row = result.rows[0] as unknown as {
      sender_id: { toString(): string };
      content: string;
      created_at: Date;
      edited_at?: Date | null;
      deleted_at?: Date | null;
    };
    const media = await this.mediaService.getMediaForObject(
      'ScyllaMessage',
      messageId,
    );
    return {
      messageId,
      conversationId,
      senderId: row.sender_id.toString(),
      content: row.content,
      createdAt: row.created_at,
      editedAt: row.edited_at ?? null,
      deletedAt: row.deleted_at ?? null,
      media,
    };
  }

  /** Menyunting pesan yang ada */
  async updateMessage(
    conversationId: string,
    messageId: string,
    senderAccountId: string,
    content: string,
    mediaIds?: string[],
  ): Promise<SerializedMessage> {
    const convoUuid = types.Uuid.fromString(conversationId);
    const msgUuid = types.TimeUuid.fromString(messageId);

    // verify sender
    const checkResult = await this.scylla.execute(
      `SELECT sender_id FROM messages WHERE conversation_id = ? AND message_id = ?`,
      [convoUuid, msgUuid],
    );
    if (checkResult.rows.length === 0)
      throw new NotFoundException('Pesan tidak ditemukan');
    const senderRow = checkResult.rows[0] as unknown as {
      sender_id: { toString(): string };
    };
    if (senderRow.sender_id.toString() !== senderAccountId) {
      throw new Error('Tidak memiliki izin untuk menyunting pesan ini');
    }

    const now = new Date();
    await this.scylla.execute(
      `UPDATE messages SET content = ?, edited_at = ? WHERE conversation_id = ? AND message_id = ?`,
      [content, now, convoUuid, msgUuid],
    );

    // Media update
    if (mediaIds !== undefined) {
      await this.prisma.mediaAttachment.updateMany({
        where: { attachedId: messageId, attachedType: 'ScyllaMessage' },
        data: { attachedId: 'orphaned', attachedType: 'Orphan' },
      });
      if (mediaIds.length > 0) {
        await this.prisma.mediaAttachment.updateMany({
          where: { id: { in: mediaIds }, accountId: senderAccountId },
          data: { attachedId: messageId, attachedType: 'ScyllaMessage' },
        });
      }
    }

    return this.getMessage(conversationId, messageId);
  }

  /** Menghapus pesan secara soft-delete */
  async deleteMessage(
    conversationId: string,
    messageId: string,
    senderAccountId: string,
  ): Promise<boolean> {
    const convoUuid = types.Uuid.fromString(conversationId);
    const msgUuid = types.TimeUuid.fromString(messageId);

    const checkResult = await this.scylla.execute(
      `SELECT sender_id FROM messages WHERE conversation_id = ? AND message_id = ?`,
      [convoUuid, msgUuid],
    );
    if (checkResult.rows.length === 0)
      throw new NotFoundException('Pesan tidak ditemukan');
    const senderRow = checkResult.rows[0] as unknown as {
      sender_id: { toString(): string };
    };
    if (senderRow.sender_id.toString() !== senderAccountId) {
      throw new Error('Tidak memiliki izin untuk menghapus pesan ini');
    }

    const now = new Date();
    await this.scylla.execute(
      `UPDATE messages SET deleted_at = ? WHERE conversation_id = ? AND message_id = ?`,
      [now, convoUuid, msgUuid],
    );
    return true;
  }

  /** Ambil riwayat pesan untuk sebuah conversation */
  async getMessages(
    conversationId: string,
    limit = 50,
  ): Promise<SerializedMessage[]> {
    const result = await this.scylla.execute(
      `SELECT message_id, sender_id, content, created_at, edited_at, deleted_at
       FROM messages WHERE conversation_id = ?
       ORDER BY message_id DESC LIMIT ?`,
      [types.Uuid.fromString(conversationId), limit],
    );

    return result.rows.map((row) => ({
      messageId: String(row['message_id'] as unknown),
      conversationId: conversationId,
      senderId: String(row['sender_id'] as unknown),
      content: String(row['content'] as unknown),
      createdAt: row['created_at'] as Date,
      editedAt: row['edited_at'] ? (row['edited_at'] as Date) : null,
      deletedAt: row['deleted_at'] ? (row['deleted_at'] as Date) : null,
    }));
  }
}
