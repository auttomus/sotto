import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { FeedService } from './feed.service';
import { PostModel } from './models/post.model';
import { CreatePostInput } from './dto/create-post.input';
import {
  CurrentUser,
  type CurrentUserPayload,
} from '../../common/decorators/current-user.decorator';
import { PrismaService } from '../../prisma/prisma.service';
import { TagsService } from '../tags/tags.service';

@Resolver(() => PostModel)
export class FeedResolver {
  constructor(
    private readonly feedService: FeedService,
    private readonly prisma: PrismaService,
    private readonly tagsService: TagsService,
  ) {}

  @Mutation(() => PostModel)
  async createPost(
    @CurrentUser() user: CurrentUserPayload,
    @Args('input') input: CreatePostInput,
  ) {
    const accountId = BigInt(user.accountId);
    const post = await this.feedService.createPost(
      accountId,
      input.content,
      input.linkedServiceId ? BigInt(input.linkedServiceId) : undefined,
    );

    // Tag association (polymorphic)
    if (input.tagIds?.length) {
      await this.tagsService.setTagsForObject(
        input.tagIds.map((id) => BigInt(id)),
        post.postId,
        'ScyllaPost',
      );
    }

    // Fan-out ke followers
    const followers = await this.prisma.follow.findMany({
      where: { targetAccountId: accountId },
      select: { accountId: true },
    });
    await this.feedService.fanOutToFollowers(
      accountId,
      post.postId,
      followers.map((f) => f.accountId),
    );

    return post;
  }

  @Query(() => [PostModel], { name: 'feed' })
  async getFeed(
    @CurrentUser() user: CurrentUserPayload,
    @Args('limit', { type: () => Int, defaultValue: 20 }) limit: number,
  ): Promise<PostModel[]> {
    const feedItems = await this.feedService.getUserFeed(
      BigInt(user.accountId),
      Math.min(limit, 50),
    );

    if (feedItems.length === 0) return [];

    // Ambil detail post
    const postIds = feedItems.map((f) => f.postId);
    const posts = await this.feedService.getPostsByIds(postIds);

    // Enrich dengan info author dari PostgreSQL
    const authorIds = [...new Set(posts.map((p) => BigInt(p.authorId)))];
    const authors = await this.prisma.account.findMany({
      where: { id: { in: authorIds } },
      select: {
        id: true,
        username: true,
        displayName: true,
        avatarObjectKey: true,
        school: { select: { name: true } },
      },
    });
    const authorMap = new Map(authors.map((a) => [a.id.toString(), a]));

    return posts.map((post) => {
      const author = authorMap.get(post.authorId);
      return {
        ...post,
        authorDisplayName: author?.displayName,
        authorUsername: author?.username,
        authorAvatarObjectKey: author?.avatarObjectKey,
        authorSchoolName: author?.school?.name,
      };
    });
  }
}
