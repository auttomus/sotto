import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersResolver, ReviewsResolver } from './orders.resolver';
import { ReviewsService } from './reviews.service';
import { PaymentsModule } from '../payments/payments.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [PaymentsModule, NotificationsModule],
  providers: [OrdersResolver, ReviewsResolver, OrdersService, ReviewsService],
  exports: [OrdersService, ReviewsService],
})
export class OrdersModule {}
