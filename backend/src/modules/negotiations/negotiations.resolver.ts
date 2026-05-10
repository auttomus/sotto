import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { NegotiationsService } from './negotiations.service';
import { CustomOfferModel } from './models/custom-offer.model';
import { CreateOfferInput } from './dto/create-offer.input';
import {
  CurrentUser,
  type CurrentUserPayload,
} from '../../common/decorators/current-user.decorator';
import { Prisma } from '@prisma/client';

type OfferRow = Prisma.CustomOfferGetPayload<Record<string, never>>;

@Resolver(() => CustomOfferModel)
export class NegotiationsResolver {
  constructor(private readonly negotiationsService: NegotiationsService) {}

  private serializeOffer(offer: OfferRow): CustomOfferModel {
    return {
      id: offer.id.toString(),
      conversationId: offer.conversationId.toString(),
      sellerAccountId: offer.sellerAccountId.toString(),
      buyerAccountId: offer.buyerAccountId.toString(),
      listingId: offer.listingId?.toString(),
      description: offer.description,
      proposedPrice: Number(offer.proposedPrice),
      deliveryTimeDays: offer.deliveryTimeDays,
      status: offer.status,
      expiresAt: offer.expiresAt ?? undefined,
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
      BigInt(user.accountId),
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
      BigInt(offerId),
      BigInt(user.accountId),
    );
    return this.serializeOffer(offer);
  }

  @Mutation(() => CustomOfferModel)
  async rejectOffer(
    @CurrentUser() user: CurrentUserPayload,
    @Args('offerId', { type: () => ID }) offerId: string,
  ): Promise<CustomOfferModel> {
    const offer = await this.negotiationsService.rejectOffer(
      BigInt(offerId),
      BigInt(user.accountId),
    );
    return this.serializeOffer(offer);
  }

  @Mutation(() => CustomOfferModel)
  async withdrawOffer(
    @CurrentUser() user: CurrentUserPayload,
    @Args('offerId', { type: () => ID }) offerId: string,
  ): Promise<CustomOfferModel> {
    const offer = await this.negotiationsService.withdrawOffer(
      BigInt(offerId),
      BigInt(user.accountId),
    );
    return this.serializeOffer(offer);
  }

  @Query(() => [CustomOfferModel], { name: 'offersForConversation' })
  async getOffersForConversation(
    @Args('conversationId', { type: () => ID }) conversationId: string,
  ): Promise<CustomOfferModel[]> {
    const offers = await this.negotiationsService.getOffersForConversation(
      BigInt(conversationId),
    );
    return offers.map((o) => this.serializeOffer(o));
  }
}
