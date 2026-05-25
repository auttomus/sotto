import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersResolver } from './orders.resolver';
import { ReviewsService } from './reviews.service';
import { PaymentsModule } from '../payments/payments.module';

@Module({
  imports: [PaymentsModule],
  providers: [OrdersResolver, OrdersService, ReviewsService],
  exports: [OrdersService, ReviewsService],
})
export class OrdersModule {}
