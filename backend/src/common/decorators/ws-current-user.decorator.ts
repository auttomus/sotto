import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Socket } from 'socket.io';
import { JwtPayload } from '../guards/ws-jwt-auth.guard';

export const WsCurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext): JwtPayload | undefined => {
    const client = context.switchToWs().getClient<Socket>();
    const clientWithUser = client as unknown as Record<string, unknown>;
    return clientWithUser['user'] as JwtPayload | undefined;
  },
);
