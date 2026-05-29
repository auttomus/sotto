import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Server, Socket } from 'socket.io';

/**
 * Gateway WebSocket untuk namespace /notifications.
 * Setiap client yang terhubung akan otomatis masuk ke room personal
 * `user:{accountId}` sehingga notifikasi, pembaruan chat, dan
 * perubahan status order bisa dikirim secara real-time ke user tertentu.
 */
@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  },
  namespace: '/notifications',
})
export class NotificationsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(NotificationsGateway.name);

  constructor(private readonly jwtService: JwtService) {}

  async handleConnection(client: Socket) {
    try {
      const token = this.extractToken(client);
      if (!token) {
        this.logger.warn(
          `Client ${client.id} tidak memiliki token, memutuskan koneksi.`,
        );
        client.disconnect();
        return;
      }

      const payload = await this.jwtService.verifyAsync<{
        sub: string;
        accountId: string;
      }>(token);

      // Simpan accountId di client data agar bisa diakses nanti
      (client as unknown as Record<string, unknown>)['accountId'] =
        payload.accountId;

      // Masukkan client ke room personal
      await client.join(`user:${payload.accountId}`);
      this.logger.log(
        `User ${payload.accountId} terhubung ke notifications (${client.id})`,
      );
    } catch {
      this.logger.warn(
        `Token tidak valid untuk client ${client.id}, memutuskan koneksi.`,
      );
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client terputus dari notifications: ${client.id}`);
  }

  // ── Helper Methods untuk digunakan Service lain ──────────

  /** Kirim event ke user tertentu berdasarkan accountId */
  sendToUser(accountId: string, eventName: string, data: unknown) {
    this.server.to(`user:${accountId}`).emit(eventName, data);
  }

  /** Kirim event notifikasi baru */
  emitNewNotification(
    accountId: string,
    notification: Record<string, unknown>,
  ) {
    this.sendToUser(accountId, 'newNotification', notification);
  }

  /** Kirim event pembaruan percakapan (pesan baru masuk / dibaca) */
  emitConversationUpdated(
    accountId: string,
    data: { conversationId: string; lastMessage?: unknown },
  ) {
    this.sendToUser(accountId, 'conversationUpdated', data);
  }

  /** Kirim event pembaruan status order */
  emitOrderUpdated(
    accountId: string,
    data: { orderId: string; status: string; updatedAt: Date },
  ) {
    this.sendToUser(accountId, 'orderUpdated', data);
  }

  // ── Private ──────────────────────────────────────────────

  private extractToken(client: Socket): string | undefined {
    const auth = client.handshake.auth?.token as string | undefined;
    const header = client.handshake.headers?.authorization;
    const token = auth || header;
    if (!token) return undefined;
    return token.startsWith('Bearer ') ? token.split(' ')[1] : token;
  }
}
