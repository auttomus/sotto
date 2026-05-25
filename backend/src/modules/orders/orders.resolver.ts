import { Resolver, Query, Mutation, Args, ID, Context } from '@nestjs/graphql';
import { OrdersService } from './orders.service';
import { ReviewsService } from './reviews.service';
import { OrderModel, ReviewModel } from './models/order.model';
import { CreateOrderInput } from './dto/create-order.input';
import {
  CurrentUser,
  type CurrentUserPayload,
} from '../../common/decorators/current-user.decorator';
import { OrderStatus } from '@prisma/client';
import { PaymentsService } from '../payments/payments.service';

interface NgrokTunnel {
  proto: string;
  public_url: string;
}

interface NgrokApiResponse {
  tunnels?: NgrokTunnel[];
}

@Resolver(() => OrderModel)
export class OrdersResolver {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly reviewsService: ReviewsService,
    private readonly paymentsService: PaymentsService,
  ) {}

  private serializeOrder(order: import('@prisma/client').Order): OrderModel {
    return {
      id: order.id,
      buyerAccountId: order.buyerAccountId,
      sellerAccountId: order.sellerAccountId,
      listingId: order.listingId,
      customOfferId: order.customOfferId,
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
    const order = await this.ordersService.createOrder(user.accountId, input);
    return this.serializeOrder(order);
  }

  @Mutation(() => OrderModel)
  async advanceOrderStatus(
    @CurrentUser() user: CurrentUserPayload,
    @Args('orderId', { type: () => ID }) orderId: string,
  ) {
    const order = await this.ordersService.advanceStatus(
      orderId,
      user.accountId,
    );
    return this.serializeOrder(order);
  }

  @Mutation(() => OrderModel)
  async cancelOrder(
    @CurrentUser() user: CurrentUserPayload,
    @Args('orderId', { type: () => ID }) orderId: string,
  ) {
    const order = await this.ordersService.cancelOrder(orderId, user.accountId);
    return this.serializeOrder(order);
  }

  @Query(() => OrderModel, { name: 'order', nullable: true })
  async getOrder(@Args('id', { type: () => ID }) id: string) {
    const order = await this.ordersService.getOrder(id);
    return order ? this.serializeOrder(order) : null;
  }

  @Query(() => [OrderModel], { name: 'myOrders' })
  async getMyOrders(
    @CurrentUser() user: CurrentUserPayload,
    @Args('role') role: string,
    @Args('status', { nullable: true }) status?: OrderStatus,
  ) {
    const orders = await this.ordersService.getMyOrders(
      user.accountId,
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
      orderId,
      user.accountId,
      rating,
      comment,
    );
    return {
      ...review,
      id: review.id,
      orderId: review.orderId,
      reviewerAccountId: review.reviewerAccountId,
      targetAccountId: review.targetAccountId,
      comment: review.comment ?? undefined,
    };
  }

  @Mutation(() => String)
  async getMidtransSnapToken(
    @Args('orderId', { type: () => ID }) orderId: string,
    @Context() context: { req: import('express').Request },
  ): Promise<string> {
    const req = context.req;
    let publicUrl = process.env.PUBLIC_URL;

    // Auto-discovery URL Ngrok dinamis jika tidak ada yang diset di .env
    if (!publicUrl) {
      try {
        const ngrokRes = await fetch('http://localhost:4040/api/tunnels');
        if (ngrokRes.ok) {
          const data = (await ngrokRes.json()) as NgrokApiResponse;
          const tunnel =
            data.tunnels?.find((t) => t.proto === 'https') ||
            data.tunnels?.find((t) => t.proto === 'http');
          if (tunnel && tunnel.public_url) {
            publicUrl = tunnel.public_url;
          }
        }
      } catch {
        // Ngrok API tidak merespons (mungkin mati), lanjutkan ke fallback request header
      }
    }

    // Fallback terakhir: Deteksi host asal (Ngrok atau Localhost) secara dinamis dari header
    if (!publicUrl) {
      const rawHost =
        req.headers['x-forwarded-host'] ||
        req.headers['host'] ||
        'localhost:8080';
      const host = Array.isArray(rawHost) ? rawHost[0] : rawHost;

      const rawProto = req.headers['x-forwarded-proto'] || 'http';
      const protocol = Array.isArray(rawProto) ? rawProto[0] : rawProto;

      publicUrl = `${protocol}://${host}`;
    }

    return this.paymentsService.getSnapToken(orderId, publicUrl);
  }
}
