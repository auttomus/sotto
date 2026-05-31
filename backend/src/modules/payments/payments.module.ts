import { Module } from '@nestjs/common';
import { PaymentsController } from './payments.controller';
import { EscrowService } from './escrow.service';
import { PaymentsService } from './payments.service';
import { NotificationsModule } from '../notifications/notifications.module';
import { ChatModule } from '../chat/chat.module';

@Module({
  imports: [NotificationsModule, ChatModule],
  controllers: [PaymentsController],
  providers: [EscrowService, PaymentsService],
  exports: [EscrowService, PaymentsService],
})
export class PaymentsModule {}
