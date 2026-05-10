import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';

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
    @MessageBody() data: { conversationId: string },
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    await client.join(`conversation:${data.conversationId}`);
    this.logger.log(
      `Client ${client.id} bergabung ke room ${data.conversationId}`,
    );
  }

  /** Client mengirim pesan */
  @SubscribeMessage('sendMessage')
  async handleSendMessage(
    @MessageBody()
    data: {
      conversationId: string;
      senderAccountId: string;
      content: string;
    },
    @ConnectedSocket() client: Socket,
  ) {
    const message = await this.chatService.sendMessage(
      BigInt(data.conversationId),
      BigInt(data.senderAccountId),
      data.content,
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
    @MessageBody()
    data: { conversationId: string; accountId: string; isTyping: boolean },
    @ConnectedSocket() client: Socket,
  ) {
    client.to(`conversation:${data.conversationId}`).emit('userTyping', {
      accountId: data.accountId,
      isTyping: data.isTyping,
    });
  }
}
