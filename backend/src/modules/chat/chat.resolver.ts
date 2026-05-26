import {
  Resolver,
  Query,
  Mutation,
  Args,
  ID,
  Int,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { ChatService, type SerializedMessage } from './chat.service';
import { ConversationModel, MessageModel } from './models/chat.model';
import { CreateConversationInput } from './dto/create-conversation.input';
import {
  CurrentUser,
  type CurrentUserPayload,
} from '../../common/decorators/current-user.decorator';
import { MediaService } from '../media/media.service';
import { MediaAttachmentModel } from '../media/models/media-attachment.model';
import { OrderModel } from '../orders/models/order.model';
import { OrdersService } from '../orders/orders.service';
import { PrismaService } from '../../prisma/prisma.service';
import { OrderStatus } from '@prisma/client';

// Explicit type for participant from Prisma include shape
type ParticipantRow = {
  account: {
    id: string;
    displayName: string;
    avatarObjectKey: string | null;
  };
};

@Resolver(() => MessageModel)
export class ChatMessageResolver {
  constructor(
    private readonly chatService: ChatService,
    private readonly mediaService: MediaService,
  ) {}

  @Query(() => [MessageModel], { name: 'messages' })
  async getMessages(
    @CurrentUser() user: CurrentUserPayload,
    @Args('conversationId', { type: () => ID }) conversationId: string,
    @Args('limit', { type: () => Int, defaultValue: 50 }) limit: number,
  ): Promise<SerializedMessage[]> {
    // Validasi bahwa user adalah peserta
    await this.chatService.validateParticipant(conversationId, user.accountId);
    return this.chatService.getMessages(conversationId, limit);
  }

  @ResolveField(() => [MediaAttachmentModel])
  async media(@Parent() message: MessageModel) {
    return this.mediaService.getMediaForObject(
      'ScyllaMessage',
      message.messageId,
    );
  }
}

@Resolver(() => ConversationModel)
export class ChatConversationResolver {
  constructor(
    private readonly chatService: ChatService,
    private readonly prisma: PrismaService,
    private readonly ordersService: OrdersService,
  ) {}

  @Mutation(() => ConversationModel)
  async createConversation(
    @CurrentUser() user: CurrentUserPayload,
    @Args('input') input: CreateConversationInput,
  ): Promise<ConversationModel> {
    const convo = await this.chatService.createConversation(
      user.accountId,
      input,
    );
    return {
      id: convo.id,
      type: convo.type,
      createdAt: convo.createdAt,
      updatedAt: convo.updatedAt,
      participants: (convo.participants as ParticipantRow[]).map((p) => ({
        accountId: p.account.id,
        displayName: p.account.displayName,
        avatarObjectKey: p.account.avatarObjectKey ?? undefined,
      })),
    };
  }

  @Query(() => [ConversationModel], { name: 'conversations' })
  async getConversations(
    @CurrentUser() user: CurrentUserPayload,
  ): Promise<ConversationModel[]> {
    const convos = await this.chatService.getConversations(user.accountId);
    return convos.map((c) => ({
      id: c.id,
      type: c.type,
      createdAt: c.createdAt,
      updatedAt: c.updatedAt,
      participants: (c.participants as ParticipantRow[]).map((p) => ({
        accountId: p.account.id,
        displayName: p.account.displayName,
        avatarObjectKey: p.account.avatarObjectKey ?? undefined,
      })),
    }));
  }

  @ResolveField(() => OrderModel, { nullable: true })
  async activeOrder(
    @Parent() conversation: ConversationModel,
    @CurrentUser() user: CurrentUserPayload,
  ): Promise<OrderModel | null> {
    // Cari peserta lain (selain current user)
    const participants = await this.prisma.conversationParticipant.findMany({
      where: { conversationId: conversation.id },
    });

    const otherParticipant = participants.find(
      (p) => p.accountId !== user.accountId,
    );

    if (!otherParticipant) return null;

    // Cari order aktif antara dua user ini
    const activeOrder = await this.prisma.order.findFirst({
      where: {
        OR: [
          {
            buyerAccountId: user.accountId,
            sellerAccountId: otherParticipant.accountId,
          },
          {
            buyerAccountId: otherParticipant.accountId,
            sellerAccountId: user.accountId,
          },
        ],
        status: {
          notIn: [OrderStatus.COMPLETED, OrderStatus.CANCELLED],
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!activeOrder) return null;

    return {
      ...activeOrder,
      agreedPrice: activeOrder.agreedPrice.toNumber(),
    };
  }

  @ResolveField(() => String, { nullable: true })
  async lastMessageContent(
    @Parent() conversation: ConversationModel,
  ): Promise<string | null> {
    const messages = await this.chatService.getMessages(conversation.id, 1);
    return messages[0]?.content || null;
  }

  @ResolveField(() => Date, { nullable: true })
  async lastMessageAt(
    @Parent() conversation: ConversationModel,
  ): Promise<Date | null> {
    const messages = await this.chatService.getMessages(conversation.id, 1);
    return messages[0]?.createdAt || null;
  }
}
