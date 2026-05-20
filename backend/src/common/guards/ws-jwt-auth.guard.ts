import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';

export class JwtPayload {
  sub: string;
  accountId: string;
  iat?: number;
  exp?: number;
}

@Injectable()
export class WsJwtAuthGuard implements CanActivate {
  private readonly logger = new Logger(WsJwtAuthGuard.name);

  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const client: Socket = context.switchToWs().getClient<Socket>();
      const token = this.extractTokenFromHeader(client);

      if (!token) {
        throw new WsException('Unauthorized access');
      }

      const payload: JwtPayload = await this.jwtService.verifyAsync(token);

      // Simpan payload user ke dalam objek client agar bisa diakses decorator
      // Gunakan casting ke Record untuk keamanan linting
      const clientWithUser = client as unknown as Record<string, unknown>;
      clientWithUser['user'] = payload;

      return true;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      this.logger.error(`WS Auth Error: ${errorMessage}`);
      throw new WsException('Unauthorized access');
    }
  }

  private extractTokenFromHeader(client: Socket): string | undefined {
    const auth = client.handshake.auth?.token as string | undefined;
    const header = client.handshake.headers?.authorization;

    const token = auth || header;
    if (!token) return undefined;

    return token.startsWith('Bearer ') ? token.split(' ')[1] : token;
  }
}
