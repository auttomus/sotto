import {
  Resolver,
  Query,
  Mutation,
  Args,
  ID,
  ResolveField,
  Parent,
  Int,
  Float,
} from '@nestjs/graphql';
import { ListingsService } from './listings.service';
import { ListingModel } from './models/listing.model';
import { CreateListingInput } from './dto/create-listing.input';
import { UpdateListingInput } from './dto/update-listing.input';
import {
  CurrentUser,
  type CurrentUserPayload,
} from '../../common/decorators/current-user.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { MediaService } from '../media/media.service';
import { MediaAttachmentModel } from '../media/models/media-attachment.model';
import { PrismaService } from '../../prisma/prisma.service';
import { ReviewModel } from '../orders/models/order.model';
import { MinioService } from '../../infrastructure/minio/minio.service';

@Resolver(() => ListingModel)
export class ListingsResolver {
  private statsCache = new Map<
    string,
    { averageRating: number; reviewsCount: number }
  >();
  private cacheTime = new Map<string, number>();

  constructor(
    private readonly listingsService: ListingsService,
    private readonly mediaService: MediaService,
    private readonly prisma: PrismaService,
    private readonly minio: MinioService,
  ) {}

  private async fetchStats(listingId: string) {
    const now = Date.now();
    const cached = this.statsCache.get(listingId);
    const cachedTime = this.cacheTime.get(listingId) || 0;

    if (cached && now - cachedTime < 2000) {
      return cached;
    }

    const [avgRes, countRes] = await Promise.all([
      this.prisma.review.aggregate({
        where: { order: { listingId } },
        _avg: { rating: true },
      }),
      this.prisma.review.count({
        where: { order: { listingId } },
      }),
    ]);

    const stats = {
      averageRating: avgRes._avg.rating ?? 0.0,
      reviewsCount: countRes,
    };

    this.statsCache.set(listingId, stats);
    this.cacheTime.set(listingId, now);
    return stats;
  }

  @Mutation(() => ListingModel)
  async createListing(
    @CurrentUser() user: CurrentUserPayload,
    @Args('input') input: CreateListingInput,
  ): Promise<ListingModel> {
    return this.listingsService.create(user.accountId, input);
  }

  @Mutation(() => ListingModel)
  async updateListing(
    @CurrentUser() user: CurrentUserPayload,
    @Args('id', { type: () => ID }) id: string,
    @Args('input') input: UpdateListingInput,
  ): Promise<ListingModel> {
    return this.listingsService.update(id, user.accountId, input);
  }

  @Mutation(() => Boolean)
  async deleteListing(
    @CurrentUser() user: CurrentUserPayload,
    @Args('id', { type: () => ID }) id: string,
  ): Promise<boolean> {
    return this.listingsService.delete(id, user.accountId);
  }

  @Public()
  @Query(() => ListingModel, { name: 'listing', nullable: true })
  async getListing(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<ListingModel | null> {
    return this.listingsService.findOne(id);
  }

  @Public()
  @Query(() => [ListingModel], { name: 'listings' })
  async getAllListings(): Promise<ListingModel[]> {
    return this.listingsService.findAll();
  }

  @Public()
  @Query(() => [ListingModel], { name: 'listingsByAccount' })
  async getListingsByAccount(
    @Args('accountId', { type: () => ID }) accountId: string,
  ): Promise<ListingModel[]> {
    return this.listingsService.findByAccount(accountId);
  }

  @ResolveField(() => [MediaAttachmentModel])
  async media(@Parent() listing: ListingModel) {
    return this.mediaService.getMediaForObject('Listing', listing.id);
  }

  @ResolveField(() => String, { nullable: true })
  async digitalFileObjectKey(
    @Parent() listing: ListingModel,
    @CurrentUser() user?: CurrentUserPayload,
  ): Promise<string | null> {
    if (!listing.digitalFileObjectKey) return null;
    if (!user) return null;

    // 1. Check if user is the seller/creator of this listing
    if (listing.accountId !== user.accountId) {
      // 2. Check if user has a completed order for this listing
      const purchaseCount = await this.prisma.order.count({
        where: {
          listingId: listing.id,
          buyerAccountId: user.accountId,
          status: 'COMPLETED',
        },
      });
      if (purchaseCount === 0) return null;
    }

    try {
      if (
        listing.digitalFileObjectKey.startsWith('http://') ||
        listing.digitalFileObjectKey.startsWith('https://')
      ) {
        return listing.digitalFileObjectKey;
      }
      const downloadUrl = await this.minio.getPresignedDownloadUrl(
        listing.digitalFileObjectKey,
        true,
      );
      if (downloadUrl.includes('http://minio:9000')) {
        return downloadUrl.replace(
          'http://minio:9000',
          'http://localhost:9000',
        );
      }
      return downloadUrl;
    } catch {
      return null;
    }
  }

  @ResolveField(() => Boolean)
  async isLikedByMe(
    @Parent() listing: ListingModel,
    @CurrentUser() user?: CurrentUserPayload,
  ): Promise<boolean> {
    if (!user) return false;
    return this.listingsService.isLikedByUser(listing.id, user.accountId);
  }

  @ResolveField(() => Int)
  async likesCount(@Parent() listing: ListingModel): Promise<number> {
    return this.listingsService.getLikesCount(listing.id);
  }

  @Mutation(() => Boolean)
  async toggleLikeListing(
    @CurrentUser() user: CurrentUserPayload,
    @Args('id', { type: () => ID }) id: string,
  ): Promise<boolean> {
    return this.listingsService.toggleLike(user.accountId, id);
  }

  @Query(() => [ListingModel], { name: 'likedListings' })
  async getLikedListings(
    @CurrentUser() user: CurrentUserPayload,
  ): Promise<ListingModel[]> {
    return this.listingsService.findLikedListings(user.accountId);
  }

  @ResolveField(() => Float)
  async averageRating(@Parent() listing: ListingModel): Promise<number> {
    const stats = await this.fetchStats(listing.id);
    return stats.averageRating;
  }

  @ResolveField(() => Int)
  async reviewsCount(@Parent() listing: ListingModel): Promise<number> {
    const stats = await this.fetchStats(listing.id);
    return stats.reviewsCount;
  }

  @ResolveField(() => [ReviewModel])
  async reviews(@Parent() listing: ListingModel): Promise<ReviewModel[]> {
    const dbReviews = await this.prisma.review.findMany({
      where: {
        order: {
          listingId: listing.id,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    // Serialize to GQL model
    return dbReviews.map((r) => ({
      id: r.id,
      orderId: r.orderId,
      reviewerAccountId: r.reviewerAccountId,
      targetAccountId: r.targetAccountId,
      rating: r.rating,
      comment: r.comment,
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
    }));
  }
}
