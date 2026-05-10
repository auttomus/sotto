import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { ListingsService } from './listings.service';
import { ListingModel } from './models/listing.model';
import { CreateListingInput } from './dto/create-listing.input';
import {
  CurrentUser,
  type CurrentUserPayload,
} from '../../common/decorators/current-user.decorator';

@Resolver(() => ListingModel)
export class ListingsResolver {
  constructor(private readonly listingsService: ListingsService) {}

  // Setara dengan POST /listings
  @Mutation(() => ListingModel)
  async createListing(
    @CurrentUser() user: CurrentUserPayload,
    @Args('input') input: CreateListingInput,
  ) {
    return this.listingsService.create(user.accountId, input);
  }

  // Setara dengan GET /listings
  @Query(() => [ListingModel], { name: 'listings' })
  async getAllListings() {
    return this.listingsService.findAll();
  }
}
