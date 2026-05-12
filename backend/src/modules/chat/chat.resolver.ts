import { Resolver, Query, Mutation, Args, ID, Int } from '@nestjs/graphql';
import { ChatService, type SerializedMessage } from './chat.service';
import { ConversationModel, MessageModel } from './models/chat.model';
import { CreateConversationInput } from './dto/create-conversation.input';
import {
  CurrentUser,
  type CurrentUserPayload,
} from '../../common/decorators/current-user.decorator';

// Explicit type for participant from Prisma include shape
type ParticipantRow = {
  account: {
    id: string;
    displayName: string;
    avatarObjectKey: string | null;
  };
};

@Resolver()
export class ChatResolver {
  constructor(private readonly chatService: ChatService) {}

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
}
