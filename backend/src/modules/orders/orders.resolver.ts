import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { OrdersService } from './orders.service';
import { ReviewsService } from './reviews.service';
import { OrderModel, ReviewModel } from './models/order.model';
import { CreateOrderInput } from './dto/create-order.input';
import { CurrentUser, CurrentUserPayload } from '../../common/decorators/current-user.decorator';
import { OrderStatus } from '@prisma/client';

@Resolver(() => OrderModel)
export class OrdersResolver {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly reviewsService: ReviewsService,
  ) {}

  private serializeOrder(order: any): OrderModel {
    return {
      id: order.id.toString(),
      buyerAccountId: order.buyerAccountId.toString(),
      sellerAccountId: order.sellerAccountId.toString(),
      listingId: order.listingId.toString(),
      customOfferId: order.customOfferId?.toString(),
      agreedPrice: Number(order.agreedPrice),
      status: order.status,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    };
  }

  @Mutation(() => OrderModel)
  async createOrder(
    @CurrentUser() user: CurrentUserPayload,
    @Args('input') input: CreateOrderInput,
  ) {
    const order = await this.ordersService.createOrder(
      BigInt(user.accountId),
      input,
    );
    return this.serializeOrder(order);
  }

  @Mutation(() => OrderModel)
  async advanceOrderStatus(
    @CurrentUser() user: CurrentUserPayload,
    @Args('orderId', { type: () => ID }) orderId: string,
  ) {
    const order = await this.ordersService.advanceStatus(
      BigInt(orderId),
      BigInt(user.accountId),
    );
    return this.serializeOrder(order);
  }

  @Mutation(() => OrderModel)
  async cancelOrder(
    @CurrentUser() user: CurrentUserPayload,
    @Args('orderId', { type: () => ID }) orderId: string,
  ) {
    const order = await this.ordersService.cancelOrder(
      BigInt(orderId),
      BigInt(user.accountId),
    );
    return this.serializeOrder(order);
  }

  @Query(() => OrderModel, { name: 'order', nullable: true })
  async getOrder(@Args('id', { type: () => ID }) id: string) {
    const order = await this.ordersService.getOrder(BigInt(id));
    return order ? this.serializeOrder(order) : null;
  }

  @Query(() => [OrderModel], { name: 'myOrders' })
  async getMyOrders(
    @CurrentUser() user: CurrentUserPayload,
    @Args('role') role: string,
    @Args('status', { nullable: true }) status?: OrderStatus,
  ) {
    const orders = await this.ordersService.getMyOrders(
      BigInt(user.accountId),
      role as 'buyer' | 'seller',
      status,
    );
    return orders.map((o) => this.serializeOrder(o));
  }

  @Mutation(() => ReviewModel)
  async createReview(
    @CurrentUser() user: CurrentUserPayload,
    @Args('orderId', { type: () => ID }) orderId: string,
    @Args('rating') rating: number,
    @Args('comment', { nullable: true }) comment?: string,
  ) {
    const review = await this.reviewsService.createReview(
      BigInt(orderId),
      BigInt(user.accountId),
      rating,
      comment,
    );
    return {
      ...review,
      id: review.id.toString(),
      orderId: review.orderId.toString(),
      reviewerAccountId: review.reviewerAccountId.toString(),
      targetAccountId: review.targetAccountId.toString(),
    };
  }
}
