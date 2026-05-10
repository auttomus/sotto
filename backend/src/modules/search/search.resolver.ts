import { Resolver, Query, Args, ID } from '@nestjs/graphql';
import { SearchService } from './search.service';
import { ListingModel } from '../listings/models/listing.model';
import { AccountModel } from '../accounts/models/account.model';
import { Public } from '../../common/decorators/public.decorator';

@Resolver()
export class SearchResolver {
  constructor(private readonly searchService: SearchService) {}

  @Public()
  @Query(() => [ListingModel], { name: 'searchListings' })
  async searchListings(
    @Args('query') query: string,
    @Args('tagIds', { type: () => [ID], nullable: true }) tagIds?: string[],
  ) {
    const listings = await this.searchService.searchListings(
      query,
      tagIds?.map((id) => BigInt(id)),
    );
    return listings.map((l) => ({
      ...l,
      id: l.id.toString(),
      accountId: l.accountId.toString(),
      price: Number(l.price),
      account: l.account
        ? { ...l.account, trustScore: Number(l.account.trustScore) }
        : null,
    }));
  }

  @Public()
  @Query(() => [AccountModel], { name: 'searchAccounts' })
  async searchAccounts(@Args('query') query: string) {
    const accounts = await this.searchService.searchAccounts(query);
    return accounts.map((a) => ({
      id: a.id.toString(),
      username: a.username,
      displayName: a.displayName,
      major: a.major,
      note: a.note,
      avatarObjectKey: a.avatarObjectKey,
      followersCount: a.followersCount.toString(),
      followingCount: a.followingCount.toString(),
      trustScore: Number(a.trustScore),
      schoolName: (a as any).school?.name,
      createdAt: a.createdAt,
    }));
  }
}
