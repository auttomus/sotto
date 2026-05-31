import { Module, forwardRef } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersResolver, ReviewsResolver } from './orders.resolver';
import { ReviewsService } from './reviews.service';
import { PaymentsModule } from '../payments/payments.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { OrdersScheduler } from './orders.scheduler';
import { ChatModule } from '../chat/chat.module';

@Module({
  imports: [PaymentsModule, NotificationsModule, forwardRef(() => ChatModule)],
  providers: [
    OrdersResolver,
    ReviewsResolver,
    OrdersService,
    ReviewsService,
    OrdersScheduler,
  ],
  exports: [OrdersService, ReviewsService],
})
export class OrdersModule {}
