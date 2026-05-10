import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersResolver } from './orders.resolver';
import { ReviewsService } from './reviews.service';

@Module({
  providers: [OrdersResolver, OrdersService, ReviewsService],
  exports: [OrdersService, ReviewsService],
})
export class OrdersModule {}
