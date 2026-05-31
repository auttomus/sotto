import { Module, forwardRef } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { ChatMessageResolver, ChatConversationResolver } from './chat.resolver';
import { MediaModule } from '../media/media.module';
import { IamModule } from '../iam/iam.module';
import { OrdersModule } from '../orders/orders.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    MediaModule,
    IamModule,
    forwardRef(() => OrdersModule),
    NotificationsModule,
  ],
  providers: [
    ChatGateway,
    ChatMessageResolver,
    ChatConversationResolver,
    ChatService,
  ],
  exports: [ChatService],
})
export class ChatModule {}
