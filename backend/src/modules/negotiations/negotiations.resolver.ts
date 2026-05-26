import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { NegotiationsService } from './negotiations.service';
import { CustomOfferModel } from './models/custom-offer.model';
import { CreateOfferInput } from './dto/create-offer.input';
import {
  CurrentUser,
  type CurrentUserPayload,
} from '../../common/decorators/current-user.decorator';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

type OfferRow = Prisma.CustomOfferGetPayload<Record<string, never>>;

@Resolver(() => CustomOfferModel)
export class NegotiationsResolver {
  constructor(
    private readonly negotiationsService: NegotiationsService,
    private readonly prisma: PrismaService,
  ) {}

  private async serializeOffer(offer: OfferRow): Promise<CustomOfferModel> {
    const order = await this.prisma.order.findUnique({
      where: { customOfferId: offer.id },
      select: { id: true },
    });
    return {
      id: offer.id,
      conversationId: offer.conversationId,
      sellerAccountId: offer.sellerAccountId,
      buyerAccountId: offer.buyerAccountId,
      listingId: offer.listingId,
      description: offer.description,
      proposedPrice: Number(offer.proposedPrice),
      deliveryTimeDays: offer.deliveryTimeDays,
      status: offer.status,
      expiresAt: offer.expiresAt ?? undefined,
      orderId: order?.id ?? null,
      createdAt: offer.createdAt,
      updatedAt: offer.updatedAt,
    };
  }

  @Mutation(() => CustomOfferModel)
  async createOffer(
    @CurrentUser() user: CurrentUserPayload,
    @Args('input') input: CreateOfferInput,
  ): Promise<CustomOfferModel> {
    const offer = await this.negotiationsService.createOffer(
      user.accountId,
      input,
    );
    return this.serializeOffer(offer);
  }

  @Mutation(() => CustomOfferModel)
  async acceptOffer(
    @CurrentUser() user: CurrentUserPayload,
    @Args('offerId', { type: () => ID }) offerId: string,
  ): Promise<CustomOfferModel> {
    const offer = await this.negotiationsService.acceptOffer(
      offerId,
      user.accountId,
    );
    return this.serializeOffer(offer);
  }

  @Mutation(() => CustomOfferModel)
  async rejectOffer(
    @CurrentUser() user: CurrentUserPayload,
    @Args('offerId', { type: () => ID }) offerId: string,
  ): Promise<CustomOfferModel> {
    const offer = await this.negotiationsService.rejectOffer(
      offerId,
      user.accountId,
    );
    return this.serializeOffer(offer);
  }

  @Mutation(() => CustomOfferModel)
  async withdrawOffer(
    @CurrentUser() user: CurrentUserPayload,
    @Args('offerId', { type: () => ID }) offerId: string,
  ): Promise<CustomOfferModel> {
    const offer = await this.negotiationsService.withdrawOffer(
      offerId,
      user.accountId,
    );
    return this.serializeOffer(offer);
  }

  @Query(() => [CustomOfferModel], { name: 'offersForConversation' })
  async getOffersForConversation(
    @Args('conversationId', { type: () => ID }) conversationId: string,
  ): Promise<CustomOfferModel[]> {
    const offers =
      await this.negotiationsService.getOffersForConversation(conversationId);
    return Promise.all(offers.map((o) => this.serializeOffer(o)));
  }
}
