import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ScyllaService } from '../../infrastructure/scylla/scylla.service';
import { types } from 'cassandra-driver';

@Injectable()
export class SearchService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly scylla: ScyllaService,
  ) {}

  /** Pencarian listing berdasarkan query teks dan filter opsional */
  async searchListings(query: string, tagIds?: string[]) {
    return this.prisma.listing.findMany({
      where: {
        status: 'ACTIVE',
        deletedAt: null,
        AND: [
          {
            OR: [
              { title: { contains: query, mode: 'insensitive' } },
              { description: { contains: query, mode: 'insensitive' } },
            ],
          },
          ...(tagIds?.length
            ? [
                {
                  id: {
                    in: (
                      await this.prisma.taggedObject.findMany({
                        where: {
                          tagId: { in: tagIds },
                          objectType: 'Listing',
                        },
                        select: { objectId: true },
                      })
                    ).map((to) => to.objectId),
                  },
                },
              ]
            : []),
        ],
      },
      include: {
        account: {
          select: { displayName: true, username: true, trustScore: true },
        },
      },
      take: 20,
      orderBy: { createdAt: 'desc' },
    });
  }

  /** Pencarian akun berdasarkan nama, username, atau jurusan */
  async searchAccounts(query: string) {
    return this.prisma.account.findMany({
      where: {
        OR: [
          { username: { contains: query, mode: 'insensitive' } },
          { displayName: { contains: query, mode: 'insensitive' } },
          { major: { name: { contains: query, mode: 'insensitive' } } },
        ],
      },
      include: {
        school: { select: { name: true } },
        major: { select: { name: true } },
      },
      take: 20,
    });
  }

  /** Pencarian postingan berdasarkan query teks dan filter tag */
  async searchPosts(query: string, tagIds?: string[]) {
    // 1. Jika tagIds ditentukan, cari post ID yang cocok dengan tag tersebut
    let taggedPostIds: string[] = [];
    if (tagIds && tagIds.length > 0) {
      const taggedObjects = await this.prisma.taggedObject.findMany({
        where: {
          objectType: 'ScyllaPost',
          tagId: { in: tagIds },
        },
        select: { objectId: true },
      });
      taggedPostIds = taggedObjects.map((to) => to.objectId);
      if (taggedPostIds.length === 0) {
        return [];
      }
    }

    // 2. Ambil post dari ScyllaDB. Jika taggedPostIds ditentukan, query hanya ID tersebut.
    let postsRows: any[] = [];
    if (tagIds && tagIds.length > 0) {
      const timeUuids = taggedPostIds.map((id) =>
        types.TimeUuid.fromString(id),
      );
      const result = await this.scylla.execute(
        `SELECT * FROM posts WHERE post_id IN ?`,
        [timeUuids],
      );
      postsRows = result.rows;
    } else {
      const result = await this.scylla.execute('SELECT * FROM posts');
      postsRows = result.rows;
    }

    const allPosts = postsRows.map((row) => {
      const r = row as unknown as {
        post_id: { toString(): string };
        author_id: { toString(): string };
        in_reply_to_post_id?: { toString(): string } | null;
        content: string;
        linked_service_id?: { toString(): string } | null;
        created_at: Date;
      };
      return {
        postId: r.post_id.toString(),
        authorId: r.author_id.toString(),
        inReplyToPostId: r.in_reply_to_post_id?.toString() ?? null,
        content: r.content,
        linkedServiceId: r.linked_service_id?.toString() ?? null,
        createdAt: r.created_at,
      };
    });

    // Hanya ambil postingan utama (bukan komentar)
    let filteredPosts = allPosts.filter((post) => !post.inReplyToPostId);

    // 3. Filter berdasarkan teks query jika ditentukan
    if (query && query.trim().length > 0) {
      const lowerQuery = query.toLowerCase();

      // Cari tag yang cocok dengan query untuk juga menampilkan post dengan tag tersebut
      const matchingTags = await this.prisma.tag.findMany({
        where: {
          name: { contains: query, mode: 'insensitive' },
        },
        select: { id: true },
      });
      const matchingTagIds = matchingTags.map((t) => t.id);

      let queryTaggedPostIds: string[] = [];
      if (matchingTagIds.length > 0) {
        const taggedObjs = await this.prisma.taggedObject.findMany({
          where: {
            objectType: 'ScyllaPost',
            tagId: { in: matchingTagIds },
          },
          select: { objectId: true },
        });
        queryTaggedPostIds = taggedObjs.map((to) => to.objectId);
      }

      filteredPosts = filteredPosts.filter((post) => {
        const matchesContent = post.content.toLowerCase().includes(lowerQuery);
        const matchesTag = queryTaggedPostIds.includes(post.postId);
        return matchesContent || matchesTag;
      });
    }

    if (filteredPosts.length === 0) return [];

    // 4. Enrich dengan info author dari PostgreSQL
    const authorIds = [...new Set(filteredPosts.map((p) => p.authorId))];
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

    return filteredPosts
      .map((post) => {
        const author = authorMap.get(post.authorId);
        return {
          ...post,
          authorDisplayName: author?.displayName,
          authorUsername: author?.username,
          authorAvatarObjectKey: author?.avatarObjectKey,
          authorSchoolName: author?.school?.name,
        };
      })
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }
}
