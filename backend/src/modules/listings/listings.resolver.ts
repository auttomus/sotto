import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { ListingsService } from './listings.service';
import { ListingModel } from './models/listing.model';
import { CreateListingInput } from './dto/create-listing.input';
import { UpdateListingInput } from './dto/update-listing.input';
import {
  CurrentUser,
  type CurrentUserPayload,
} from '../../common/decorators/current-user.decorator';
import { Public } from '../../common/decorators/public.decorator';

@Resolver(() => ListingModel)
export class ListingsResolver {
  constructor(private readonly listingsService: ListingsService) {}

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
}
