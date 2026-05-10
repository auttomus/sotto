import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { ChatResolver } from './chat.resolver';

@Module({
  providers: [ChatGateway, ChatResolver, ChatService],
  exports: [ChatService],
})
export class ChatModule {}
