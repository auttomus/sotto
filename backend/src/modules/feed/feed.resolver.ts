import {
  Resolver,
  Query,
  Mutation,
  Args,
  Int,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { FeedService } from './feed.service';
import { PostModel } from './models/post.model';
import { CreatePostInput } from './dto/create-post.input';
import { UpdatePostInput } from './dto/update-post.input';
import {
  CurrentUser,
  type CurrentUserPayload,
} from '../../common/decorators/current-user.decorator';
import { PrismaService } from '../../prisma/prisma.service';
import { TagsService } from '../tags/tags.service';
import { MediaService } from '../media/media.service';
import { NotificationsService } from '../notifications/notifications.service';
import { MediaAttachmentModel } from '../media/models/media-attachment.model';
import { TagModel } from '../tags/models/tag.model';
import { Public } from '../../common/decorators/public.decorator';
import { NotificationType } from '@prisma/client';
import { SynergyService } from '../synergy/synergy.service';

@Resolver(() => PostModel)
export class FeedResolver {
  constructor(
    private readonly feedService: FeedService,
    private readonly prisma: PrismaService,
    private readonly tagsService: TagsService,
    private readonly mediaService: MediaService,
    private readonly notificationsService: NotificationsService,
    private readonly synergyService: SynergyService,
  ) {}

  @Mutation(() => PostModel)
  async createPost(
    @CurrentUser() user: CurrentUserPayload,
    @Args('input') input: CreatePostInput,
  ) {
    const accountId = user.accountId;
    const post = input.inReplyToPostId
      ? await this.feedService.createComment(
          accountId,
          input.inReplyToPostId,
          input.content,
          input.linkedServiceId ? input.linkedServiceId : undefined,
        )
      : await this.feedService.createPost(
          accountId,
          input.content,
          input.linkedServiceId ? input.linkedServiceId : undefined,
        );

    // Tag association (polymorphic)
    if (input.tagIds?.length) {
      await this.tagsService.setTagsForObject(
        input.tagIds.map((id) => id),
        post.postId.toString(),
        'ScyllaPost',
      );
    }

    // Media association
    if (input.mediaIds?.length) {
      await this.prisma.mediaAttachment.updateMany({
        where: { id: { in: input.mediaIds }, accountId },
        data: {
          attachedId: post.postId.toString(),
          attachedType: 'ScyllaPost',
        },
      });
    }

    // Fan-out ke followers
    const followers = await this.prisma.follow.findMany({
      where: { targetAccountId: accountId },
      select: { accountId: true },
    });
    await this.feedService.fanOutToFollowers(
      accountId,
      post.postId.toString(),
      followers.map((f) => f.accountId),
    );

    // Jika ini adalah komentar/reply, beri tahu pemilik postingan asli
    if (input.inReplyToPostId) {
      const parentPost = await this.feedService.getPost(input.inReplyToPostId);
      if (parentPost && parentPost.authorId !== accountId) {
        await this.notificationsService.createNotification({
          accountId: parentPost.authorId,
          fromAccountId: accountId,
          type: NotificationType.MENTION,
          targetType: 'ScyllaPost',
          targetId: post.postId.toString(),
        });
      }
    }

    return post;
  }

  @Mutation(() => PostModel)
  async updatePost(
    @CurrentUser() user: CurrentUserPayload,
    @Args('postId') postId: string,
    @Args('input') input: UpdatePostInput,
  ) {
    const accountId = user.accountId;

    // update post in Scylla
    if (input.content !== undefined) {
      await this.feedService.updatePost(postId, accountId, input.content);
    }

    // update tags
    if (input.tagIds) {
      await this.tagsService.setTagsForObject(
        input.tagIds,
        postId,
        'ScyllaPost',
      );
    }

    // update media
    if (input.mediaIds !== undefined) {
      await this.prisma.mediaAttachment.updateMany({
        where: { attachedId: postId, attachedType: 'ScyllaPost' },
        data: { attachedId: 'orphaned', attachedType: 'Orphan' },
      });
      if (input.mediaIds.length > 0) {
        await this.prisma.mediaAttachment.updateMany({
          where: { id: { in: input.mediaIds }, accountId },
          data: { attachedId: postId, attachedType: 'ScyllaPost' },
        });
      }
    }

    const post = await this.getPost(postId);
    if (!post) throw new Error('Post tidak ditemukan');
    return post;
  }

  @Mutation(() => Boolean)
  async deletePost(
    @CurrentUser() user: CurrentUserPayload,
    @Args('postId') postId: string,
  ) {
    return this.feedService.deletePost(postId, user.accountId);
  }

  @Query(() => PostModel, { name: 'post', nullable: true })
  async getPost(
    @Args('postId', { type: () => String }) postId: string,
  ): Promise<PostModel | null> {
    const posts = await this.feedService.getPostsByIds([postId]);
    if (posts.length === 0) return null;

    const post = posts[0];
    const author = await this.prisma.account.findUnique({
      where: { id: post.authorId },
      select: {
        id: true,
        username: true,
        displayName: true,
        avatarObjectKey: true,
        school: { select: { name: true } },
      },
    });

    return {
      ...post,
      authorDisplayName: author?.displayName,
      authorUsername: author?.username,
      authorAvatarObjectKey: author?.avatarObjectKey,
      authorSchoolName: author?.school?.name,
    };
  }

  @Query(() => [PostModel], { name: 'replies' })
  async getReplies(
    @Args('postId', { type: () => String }) postId: string,
  ): Promise<PostModel[]> {
    const replies = await this.feedService.getRepliesForPost(postId);
    if (replies.length === 0) return [];

    const authorIds = [...new Set(replies.map((r) => r.authorId))];
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
    const authorMap = new Map(authors.map((a) => [a.id, a]));

    return replies.map((reply) => {
      const author = authorMap.get(reply.authorId);
      return {
        ...reply,
        authorDisplayName: author?.displayName,
        authorUsername: author?.username,
        authorAvatarObjectKey: author?.avatarObjectKey,
        authorSchoolName: author?.school?.name,
      };
    });
  }

  @Public()
  @Query(() => [PostModel], { name: 'globalFeed' })
  async getGlobalFeed(
    @Args('limit', { type: () => Int, defaultValue: 20 }) limit: number,
    @CurrentUser() user?: CurrentUserPayload,
  ): Promise<PostModel[]> {
    // 1. Ambil seluruh postingan aktif sebagai kandidat rekomendasi
    const candidates = await this.feedService.getGlobalFeed();
    if (candidates.length === 0) return [];

    // 2. Jika user login, jalankan Synergy Engine. Jika guest, fallback ke kronologis.
    let rankedCandidates: (Awaited<
      ReturnType<FeedService['getGlobalFeed']>
    >[number] & { score?: number })[] = [];
    if (user?.accountId) {
      rankedCandidates = await this.synergyService.rankPosts(
        user.accountId,
        candidates,
        limit,
      );
    } else {
      rankedCandidates = candidates
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
        .slice(0, limit);
    }

    if (rankedCandidates.length === 0) return [];

    const authorIds = [...new Set(rankedCandidates.map((p) => p.authorId))];
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
    const authorMap = new Map(authors.map((a) => [a.id, a]));

    return rankedCandidates.map((post) => {
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

  @Query(() => [PostModel], { name: 'feed' })
  async getFeed(
    @CurrentUser() user: CurrentUserPayload,
    @Args('limit', { type: () => Int, defaultValue: 20 }) limit: number,
  ): Promise<PostModel[]> {
    const feedItems = await this.feedService.getUserFeed(
      user.accountId,
      Math.min(limit, 50),
    );

    if (feedItems.length === 0) return [];

    // Ambil detail post
    const postIds = feedItems.map((f) => f.postId);
    const posts = await this.feedService.getPostsByIds(postIds);

    // Filter out posts that have been soft-deleted
    const activePosts = posts.filter((p) => !p.deletedAt);

    if (activePosts.length === 0) return [];

    // Urutkan secara kronologis (terbaru di atas)
    activePosts.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    // Enrich dengan info author dari PostgreSQL
    const authorIds = [...new Set(activePosts.map((p) => p.authorId))];
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
    const authorMap = new Map(authors.map((a) => [a.id, a]));

    return activePosts.map((post) => {
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

  @ResolveField(() => [MediaAttachmentModel])
  async media(@Parent() post: PostModel) {
    return this.mediaService.getMediaForObject('ScyllaPost', post.postId);
  }

  @ResolveField(() => [TagModel])
  async tags(@Parent() post: PostModel) {
    return this.tagsService.getTagsForObject(post.postId, 'ScyllaPost');
  }

  @ResolveField(() => Int)
  async likesCount(@Parent() post: PostModel): Promise<number> {
    return this.feedService.getLikesCountForPost(post.postId);
  }

  @ResolveField(() => Int)
  async repliesCount(@Parent() post: PostModel): Promise<number> {
    return this.feedService.getRepliesCountForPost(post.postId);
  }

  @ResolveField(() => Boolean)
  async likedByMe(
    @Parent() post: PostModel,
    @CurrentUser() user: CurrentUserPayload,
  ): Promise<boolean> {
    if (!user) return false;
    return this.feedService.isLikedByMe(user.accountId, post.postId);
  }

  @ResolveField(() => [PostModel])
  async ancestors(@Parent() post: PostModel): Promise<PostModel[]> {
    const list: PostModel[] = [];
    let currentInReplyTo = post.inReplyToPostId;

    const visited = new Set<string>();
    visited.add(post.postId);

    while (currentInReplyTo) {
      if (visited.has(currentInReplyTo)) break;
      visited.add(currentInReplyTo);

      const parentPost = await this.feedService.getPost(currentInReplyTo);
      if (!parentPost || parentPost.deletedAt) break;

      const author = await this.prisma.account.findUnique({
        where: { id: parentPost.authorId },
        select: {
          displayName: true,
          username: true,
          avatarObjectKey: true,
          school: { select: { name: true } },
        },
      });

      list.unshift({
        ...parentPost,
        authorDisplayName: author?.displayName,
        authorUsername: author?.username,
        authorAvatarObjectKey: author?.avatarObjectKey,
        authorSchoolName: author?.school?.name,
      });

      currentInReplyTo = parentPost.inReplyToPostId;
    }

    return list;
  }

  @Mutation(() => Boolean)
  async toggleLikePost(
    @CurrentUser() user: CurrentUserPayload,
    @Args('postId') postId: string,
  ): Promise<boolean> {
    return this.feedService.toggleLikePost(user.accountId, postId);
  }

  @Public()
  @Query(() => [PostModel], { name: 'postsByAccount' })
  async getPostsByAccount(
    @Args('accountId', { type: () => String }) accountId: string,
  ): Promise<PostModel[]> {
    const posts = await this.feedService.getPostsByAuthor(accountId, false);
    if (posts.length === 0) return [];

    const author = await this.prisma.account.findUnique({
      where: { id: accountId },
      select: {
        id: true,
        username: true,
        displayName: true,
        avatarObjectKey: true,
        school: { select: { name: true } },
      },
    });

    return posts.map((post) => ({
      ...post,
      authorDisplayName: author?.displayName,
      authorUsername: author?.username,
      authorAvatarObjectKey: author?.avatarObjectKey,
      authorSchoolName: author?.school?.name,
    }));
  }

  @Public()
  @Query(() => [PostModel], { name: 'repliesByAccount' })
  async getRepliesByAccount(
    @Args('accountId', { type: () => String }) accountId: string,
  ): Promise<PostModel[]> {
    const replies = await this.feedService.getPostsByAuthor(accountId, true);
    if (replies.length === 0) return [];

    const author = await this.prisma.account.findUnique({
      where: { id: accountId },
      select: {
        id: true,
        username: true,
        displayName: true,
        avatarObjectKey: true,
        school: { select: { name: true } },
      },
    });

    return replies.map((reply) => ({
      ...reply,
      authorDisplayName: author?.displayName,
      authorUsername: author?.username,
      authorAvatarObjectKey: author?.avatarObjectKey,
      authorSchoolName: author?.school?.name,
    }));
  }

  @Query(() => [PostModel], { name: 'likedPosts' })
  async getLikedPosts(
    @CurrentUser() user: CurrentUserPayload,
  ): Promise<PostModel[]> {
    const posts = await this.feedService.getLikedPostsByUser(user.accountId);
    if (posts.length === 0) return [];

    const authorIds = [...new Set(posts.map((p) => p.authorId))];
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
    const authorMap = new Map(authors.map((a) => [a.id, a]));

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
