import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { AccountsService } from './accounts.service';
import { FollowsService } from './follows.service';
import { AccountModel } from './models/account.model';
import { UpdateProfileInput } from './dto/update-profile.input';
import {
  CurrentUser,
  type CurrentUserPayload,
} from '../../common/decorators/current-user.decorator';
import { Public } from '../../common/decorators/public.decorator';

@Resolver(() => AccountModel)
export class AccountsResolver {
  constructor(
    private readonly accountsService: AccountsService,
    private readonly followsService: FollowsService,
  ) {}

  private serializeAccount(
    account: {
      id: bigint;
      username: string;
      displayName: string;
      major: string | null;
      note: string | null;
      avatarObjectKey: string | null;
      followersCount: number | bigint;
      followingCount: number | bigint;
      trustScore: import('@prisma/client').Prisma.Decimal | number;
      createdAt: Date;
      school?: { name?: string | null } | null;
    },
    extra: Record<string, unknown> = {},
  ): AccountModel {
    return {
      id: account.id.toString(),
      username: account.username,
      displayName: account.displayName,
      major: account.major,
      note: account.note,
      avatarObjectKey: account.avatarObjectKey,
      followersCount: account.followersCount.toString(),
      followingCount: account.followingCount.toString(),
      trustScore: Number(account.trustScore),
      schoolName: account.school?.name,
      createdAt: account.createdAt,
      ...extra,
    };
  }

  @Query(() => AccountModel, { name: 'myProfile' })
  async getMyProfile(@CurrentUser() user: CurrentUserPayload) {
    const account = await this.accountsService.getProfileById(
      BigInt(user.accountId),
    );
    return this.serializeAccount(account);
  }

  @Public()
  @Query(() => AccountModel, { name: 'profile', nullable: true })
  async getProfile(
    @Args('username') username: string,
    @CurrentUser() user?: CurrentUserPayload,
  ) {
    const account = await this.accountsService.getProfileByUsername(username);
    let isFollowing: boolean | undefined;
    if (user) {
      isFollowing = await this.followsService.isFollowing(
        BigInt(user.accountId),
        account.id,
      );
    }
    return this.serializeAccount(account, { isFollowing });
  }

  @Mutation(() => AccountModel)
  async updateProfile(
    @CurrentUser() user: CurrentUserPayload,
    @Args('input') input: UpdateProfileInput,
  ) {
    const account = await this.accountsService.updateProfile(
      BigInt(user.accountId),
      input,
    );
    return this.serializeAccount(account);
  }

  @Mutation(() => Boolean)
  async follow(
    @CurrentUser() user: CurrentUserPayload,
    @Args('targetAccountId', { type: () => ID }) targetAccountId: string,
  ) {
    return this.followsService.follow(
      BigInt(user.accountId),
      BigInt(targetAccountId),
    );
  }

  @Mutation(() => Boolean)
  async unfollow(
    @CurrentUser() user: CurrentUserPayload,
    @Args('targetAccountId', { type: () => ID }) targetAccountId: string,
  ) {
    return this.followsService.unfollow(
      BigInt(user.accountId),
      BigInt(targetAccountId),
    );
  }
}
