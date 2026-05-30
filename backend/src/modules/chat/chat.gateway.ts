import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Logger, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import {
  WsJwtAuthGuard,
  JwtPayload,
} from '../../common/guards/ws-jwt-auth.guard';
import { WsCurrentUser } from '../../common/decorators/ws-current-user.decorator';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';

@UseGuards(WsJwtAuthGuard)
@UsePipes(new ValidationPipe({ transform: true }))
@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  },
  namespace: '/chat',
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(ChatGateway.name);

  constructor(private readonly chatService: ChatService) {}

  handleConnection(client: Socket) {
    this.logger.log(`Client terhubung: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client terputus: ${client.id}`);
  }

  /** Client bergabung ke room conversation */
  @SubscribeMessage('joinRoom')
  async handleJoinRoom(
    @WsCurrentUser() user: JwtPayload,
    @MessageBody() data: { conversationId: string },
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    // Validasi: Apakah user ini benar partisipan di conversationId ini?
    await this.chatService.validateParticipant(
      data.conversationId,
      user.accountId,
    );

    await client.join(`conversation:${data.conversationId}`);
    this.logger.log(
      `User ${user.accountId} bergabung ke room ${data.conversationId}`,
    );
  }

  /** Client mengirim pesan */
  @SubscribeMessage('sendMessage')
  async handleSendMessage(
    @WsCurrentUser() user: JwtPayload,
    @MessageBody()
    data: {
      conversationId: string;
      content: string;
      mediaIds?: string[];
    },
    @ConnectedSocket() client: Socket,
  ) {
    // Validasi: Harus partisipan
    await this.chatService.validateParticipant(
      data.conversationId,
      user.accountId,
    );

    const message = await this.chatService.sendMessage(
      data.conversationId,
      user.accountId, // Ambil dari TOKEN, bukan dari body JSON (Secure!)
      data.content,
      data.mediaIds,
    );

    // Broadcast pesan ke semua client di room kecuali pengirim
    client
      .to(`conversation:${data.conversationId}`)
      .emit('newMessage', message);

    return message; // Kirim konfirmasi ke pengirim
  }

  /** Client mengirim indikator typing */
  @SubscribeMessage('typing')
  handleTyping(
    @WsCurrentUser() user: JwtPayload,
    @MessageBody()
    data: { conversationId: string; isTyping: boolean },
    @ConnectedSocket() client: Socket,
  ) {
    client.to(`conversation:${data.conversationId}`).emit('userTyping', {
      accountId: user.accountId,
      isTyping: data.isTyping,
    });
  }

  /** Client menandai percakapan sebagai telah dibaca */
  @SubscribeMessage('readConversation')
  async handleReadConversation(
    @WsCurrentUser() user: JwtPayload,
    @MessageBody() data: { conversationId: string },
    @ConnectedSocket() client: Socket,
  ) {
    // Validasi: Harus partisipan
    await this.chatService.validateParticipant(
      data.conversationId,
      user.accountId,
    );

    // Tandai di DB
    await this.chatService.markAsRead(data.conversationId, user.accountId);

    // Ambil pesan terakhir untuk mendapatkan lastReadMessageId
    const messages = await this.chatService.getMessages(data.conversationId, 1);
    const latestMessage = messages[0];
    const lastReadMessageId = latestMessage?.messageId || null;

    // Siarkan ke client lain di room percakapan ini
    client.to(`conversation:${data.conversationId}`).emit('conversationRead', {
      conversationId: data.conversationId,
      accountId: user.accountId,
      lastReadMessageId,
    });
  }
}
