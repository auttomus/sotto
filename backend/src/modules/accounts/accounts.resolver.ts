import { Resolver, Query, Mutation, Args, ID, Int } from '@nestjs/graphql';
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
      id: string;
      username: string;
      displayName: string;
      majorId?: string | null;
      schoolId?: string | null;
      note?: string | null;
      avatarObjectKey?: string | null;
      bannerObjectKey?: string | null;
      followersCount?: number | bigint;
      followingCount?: number | bigint;
      trustScore?: import('@prisma/client').Prisma.Decimal | number;
      createdAt?: Date;
      updatedAt?: Date;
      school?: { name?: string | null } | null;
      major?: { name?: string | null } | null;
    },
    extra: Record<string, unknown> = {},
  ): AccountModel {
    return {
      id: account.id,
      username: account.username,
      displayName: account.displayName,
      major: account.major?.name ?? null,
      majorId: account.majorId ?? null,
      schoolId: account.schoolId ?? null,
      note: account.note ?? null,
      avatarObjectKey: account.avatarObjectKey ?? null,
      bannerObjectKey: account.bannerObjectKey ?? null,
      followersCount: (account.followersCount ?? 0).toString(),
      followingCount: (account.followingCount ?? 0).toString(),
      trustScore: Number(account.trustScore ?? 0),
      schoolName: account.school?.name ?? null,
      createdAt: account.createdAt ?? new Date(),
      updatedAt: account.updatedAt ?? new Date(),
      ...extra,
    };
  }

  @Query(() => AccountModel, { name: 'myProfile' })
  async getMyProfile(@CurrentUser() user: CurrentUserPayload) {
    const account = await this.accountsService.getProfileById(user.accountId);
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
        user.accountId,
        account.id,
      );
    }
    return this.serializeAccount(account, { isFollowing });
  }

  @Public()
  @Query(() => [AccountModel], { name: 'followers' })
  async getFollowers(
    @Args('accountId', { type: () => ID }) accountId: string,
    @Args('cursor', { type: () => String, nullable: true }) cursor?: string,
    @Args('take', { type: () => Int, nullable: true }) take?: number,
    @CurrentUser() user?: CurrentUserPayload,
  ) {
    const followers = await this.accountsService.getFollowers(
      accountId,
      cursor,
      take,
    );
    return Promise.all(
      followers.map(async (follower) => {
        let isFollowing = false;
        if (user) {
          isFollowing = await this.followsService.isFollowing(
            user.accountId,
            follower.id,
          );
        }
        return this.serializeAccount(follower, { isFollowing });
      }),
    );
  }

  @Public()
  @Query(() => [AccountModel], { name: 'following' })
  async getFollowing(
    @Args('accountId', { type: () => ID }) accountId: string,
    @Args('cursor', { type: () => String, nullable: true }) cursor?: string,
    @Args('take', { type: () => Int, nullable: true }) take?: number,
    @CurrentUser() user?: CurrentUserPayload,
  ) {
    const following = await this.accountsService.getFollowing(
      accountId,
      cursor,
      take,
    );
    return Promise.all(
      following.map(async (followingUser) => {
        let isFollowing = false;
        if (user) {
          isFollowing = await this.followsService.isFollowing(
            user.accountId,
            followingUser.id,
          );
        }
        return this.serializeAccount(followingUser, { isFollowing });
      }),
    );
  }

  @Mutation(() => AccountModel)
  async updateProfile(
    @CurrentUser() user: CurrentUserPayload,
    @Args('input') input: UpdateProfileInput,
  ) {
    const account = await this.accountsService.updateProfile(
      user.accountId,
      input,
    );
    return this.serializeAccount(account);
  }

  @Mutation(() => Boolean)
  async follow(
    @CurrentUser() user: CurrentUserPayload,
    @Args('targetAccountId', { type: () => ID }) targetAccountId: string,
  ) {
    return this.followsService.follow(user.accountId, targetAccountId);
  }

  @Mutation(() => Boolean)
  async unfollow(
    @CurrentUser() user: CurrentUserPayload,
    @Args('targetAccountId', { type: () => ID }) targetAccountId: string,
  ) {
    return this.followsService.unfollow(user.accountId, targetAccountId);
  }
}
