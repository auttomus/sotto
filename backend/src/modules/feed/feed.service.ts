import { Injectable } from '@nestjs/common';
import { ScyllaService } from '../../infrastructure/scylla/scylla.service';
import { types } from 'cassandra-driver';

@Injectable()
export class FeedService {
  constructor(private readonly scylla: ScyllaService) {}

  /** Buat postingan baru di ScyllaDB */
  async createPost(
    authorId: string,
    content: string,
    linkedServiceId?: string,
  ) {
    const postId = types.TimeUuid.now();
    const now = new Date();

    await this.scylla.execute(
      `INSERT INTO posts (post_id, author_id, content, linked_service_id, created_at)
       VALUES (?, ?, ?, ?, ?)`,
      [
        postId,
        types.Uuid.fromString(authorId),
        content,
        linkedServiceId ? types.Uuid.fromString(linkedServiceId) : null,
        now,
      ],
    );

    return {
      postId: postId,
      authorId: authorId,
      content,
      linkedServiceId: linkedServiceId ?? null,
      createdAt: now,
      editedAt: null,
      deletedAt: null,
    };
  }

  /** Update post (ScyllaDB) */
  async updatePost(postId: string, authorId: string, content: string) {
    const postUuid = types.TimeUuid.fromString(postId);

    const checkResult = await this.scylla.execute(
      `SELECT author_id FROM posts WHERE post_id = ?`,
      [postUuid],
    );
    if (checkResult.rows.length === 0) throw new Error('Post tidak ditemukan');
    const ownerRow = checkResult.rows[0] as unknown as {
      author_id: { toString(): string };
    };
    if (ownerRow.author_id.toString() !== authorId)
      throw new Error('Tidak memiliki izin untuk menyunting post ini');

    const now = new Date();
    await this.scylla.execute(
      `UPDATE posts SET content = ?, edited_at = ? WHERE post_id = ?`,
      [content, now, postUuid],
    );
    return this.getPost(postId);
  }

  /** Soft-delete post (ScyllaDB) */
  async deletePost(postId: string, authorId: string) {
    const postUuid = types.TimeUuid.fromString(postId);

    const checkResult = await this.scylla.execute(
      `SELECT author_id FROM posts WHERE post_id = ?`,
      [postUuid],
    );
    if (checkResult.rows.length === 0) throw new Error('Post tidak ditemukan');
    const ownerRow = checkResult.rows[0] as unknown as {
      author_id: { toString(): string };
    };
    if (ownerRow.author_id.toString() !== authorId)
      throw new Error('Tidak memiliki izin untuk menghapus post ini');

    const now = new Date();
    await this.scylla.execute(
      `UPDATE posts SET deleted_at = ? WHERE post_id = ?`,
      [now, postUuid],
    );
    return true;
  }

  /** Tulis komentar (post dengan in_reply_to_post_id) */
  async createComment(
    authorId: string,
    parentPostId: string,
    content: string,
    linkedServiceId?: string,
  ) {
    const commentId = types.TimeUuid.now();
    const now = new Date();

    await this.scylla.execute(
      `INSERT INTO posts (post_id, author_id, in_reply_to_post_id, content, linked_service_id, created_at)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        commentId,
        types.Uuid.fromString(authorId),
        types.TimeUuid.fromString(parentPostId),
        content,
        linkedServiceId ? types.Uuid.fromString(linkedServiceId) : null,
        now,
      ],
    );

    return {
      postId: commentId,
      authorId: authorId,
      inReplyToPostId: parentPostId,
      content,
      linkedServiceId: linkedServiceId ?? null,
      createdAt: now,
      editedAt: null,
      deletedAt: null,
    };
  }

  /** Fan-out: distribusikan post ke timeline semua followers */
  async fanOutToFollowers(
    authorId: string,
    postId: string,
    followerIds: string[],
  ) {
    const now = new Date();
    const timeUuid = types.TimeUuid.fromString(postId);

    const authorUuid = types.Uuid.fromString(authorId);
    const queries = followerIds.map((followerId) => ({
      query: `INSERT INTO user_feeds (user_id, post_id, author_id, created_at) VALUES (?, ?, ?, ?)`,
      params: [types.Uuid.fromString(followerId), timeUuid, authorUuid, now],
    }));

    // Juga masukkan ke timeline author sendiri
    queries.push({
      query: `INSERT INTO user_feeds (user_id, post_id, author_id, created_at) VALUES (?, ?, ?, ?)`,
      params: [authorUuid, timeUuid, authorUuid, now],
    });

    if (queries.length > 0) {
      // Batch in chunks of 50 to avoid overloading ScyllaDB
      for (let i = 0; i < queries.length; i += 50) {
        await this.scylla.batch(queries.slice(i, i + 50));
      }
    }
  }

  /** Ambil global feed timeline (semua postingan original) */
  async getGlobalFeed(limit = 100) {
    const result = await this.scylla.execute(
      `SELECT * FROM posts LIMIT ? ALLOW FILTERING`,
      [limit],
    );
    const posts = result.rows.map((row) => {
      const r = row as unknown as {
        post_id: { toString(): string };
        author_id: { toString(): string };
        in_reply_to_post_id?: { toString(): string } | null;
        content: string;
        linked_service_id?: { toString(): string } | null;
        created_at: Date;
        edited_at?: Date | null;
        deleted_at?: Date | null;
      };
      return {
        postId: r.post_id.toString(),
        authorId: r.author_id.toString(),
        inReplyToPostId: r.in_reply_to_post_id?.toString() ?? null,
        content: r.content,
        linkedServiceId: r.linked_service_id?.toString() ?? null,
        createdAt: r.created_at,
        editedAt: r.edited_at ?? null,
        deletedAt: r.deleted_at ?? null,
      };
    });

    const filtered = posts.filter((p) => !p.inReplyToPostId && !p.deletedAt);
    return filtered.sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
    );
  }

  /** Ambil feed timeline untuk user (candidate posts sebelum ranking) */
  async getUserFeed(userId: string, limit = 200) {
    const result = await this.scylla.execute(
      `SELECT post_id, author_id, created_at FROM user_feeds
       WHERE user_id = ? ORDER BY post_id DESC LIMIT ?`,
      [types.Uuid.fromString(userId), limit],
    );
    return result.rows.map((row) => {
      const r = row as unknown as {
        post_id: { toString(): string };
        author_id: { toString(): string };
        created_at: Date;
      };
      return {
        postId: r.post_id.toString(),
        authorId: r.author_id.toString(),
        createdAt: r.created_at,
      };
    });
  }

  /** Ambil detail post berdasarkan ID */
  async getPost(postId: string) {
    const result = await this.scylla.execute(
      `SELECT * FROM posts WHERE post_id = ?`,
      [types.TimeUuid.fromString(postId)],
    );
    if (result.rows.length === 0) return null;
    const row = result.rows[0] as unknown as {
      post_id: { toString(): string };
      author_id: { toString(): string };
      in_reply_to_post_id?: { toString(): string } | null;
      content: string;
      linked_service_id?: { toString(): string } | null;
      created_at: Date;
      edited_at?: Date | null;
      deleted_at?: Date | null;
    };

    return {
      postId: row.post_id.toString(),
      authorId: row.author_id.toString(),
      inReplyToPostId: row.in_reply_to_post_id?.toString() ?? null,
      content: row.deleted_at ? '' : row.content,
      linkedServiceId: row.linked_service_id?.toString() ?? null,
      createdAt: row.created_at,
      editedAt: row.edited_at ?? null,
      deletedAt: row.deleted_at ?? null,
    };
  }

  /** Ambil banyak post berdasarkan IDs */
  async getPostsByIds(postIds: string[]) {
    if (postIds.length === 0) return [];
    const timeUuids = postIds.map((id) => types.TimeUuid.fromString(id));
    const result = await this.scylla.execute(
      `SELECT * FROM posts WHERE post_id IN ?`,
      [timeUuids],
    );
    return result.rows.map((row) => {
      const r = row as unknown as {
        post_id: { toString(): string };
        author_id: { toString(): string };
        in_reply_to_post_id?: { toString(): string } | null;
        content: string;
        linked_service_id?: { toString(): string } | null;
        created_at: Date;
        edited_at?: Date | null;
        deleted_at?: Date | null;
      };
      return {
        postId: r.post_id.toString(),
        authorId: r.author_id.toString(),
        inReplyToPostId: r.in_reply_to_post_id?.toString() ?? null,
        content: r.deleted_at ? '' : r.content,
        linkedServiceId: r.linked_service_id?.toString() ?? null,
        createdAt: r.created_at,
        editedAt: r.edited_at ?? null,
        deletedAt: r.deleted_at ?? null,
      };
    });
  }

  /** Toggle like status for a post in ScyllaDB */
  async toggleLikePost(accountId: string, postId: string): Promise<boolean> {
    const postUuid = types.TimeUuid.fromString(postId);
    const userUuid = types.Uuid.fromString(accountId);

    const checkResult = await this.scylla.execute(
      `SELECT * FROM post_likes WHERE post_id = ? AND user_id = ?`,
      [postUuid, userUuid],
    );

    if (checkResult.rows.length > 0) {
      await this.scylla.execute(
        `DELETE FROM post_likes WHERE post_id = ? AND user_id = ?`,
        [postUuid, userUuid],
      );
      return false;
    } else {
      await this.scylla.execute(
        `INSERT INTO post_likes (post_id, user_id, created_at) VALUES (?, ?, ?)`,
        [postUuid, userUuid, new Date()],
      );
      return true;
    }
  }

  /** Get total like count for a post from ScyllaDB */
  async getLikesCountForPost(postId: string): Promise<number> {
    const postUuid = types.TimeUuid.fromString(postId);
    const result = await this.scylla.execute(
      `SELECT COUNT(*) FROM post_likes WHERE post_id = ?`,
      [postUuid],
    );
    if (result.rows.length === 0) return 0;
    const row = result.rows[0] as Record<string, unknown>;
    const firstKey = Object.keys(row)[0];
    const countVal = row['count'] ?? (firstKey ? row[firstKey] : undefined);
    if (typeof countVal === 'number') {
      return countVal;
    }
    if (countVal !== null && countVal !== undefined) {
      return parseInt((countVal as { toString(): string }).toString(), 10);
    }
    return 0;
  }

  /** Check if a specific user liked a post */
  async isLikedByMe(accountId: string, postId: string): Promise<boolean> {
    if (!accountId) return false;
    const postUuid = types.TimeUuid.fromString(postId);
    const userUuid = types.Uuid.fromString(accountId);
    const result = await this.scylla.execute(
      `SELECT * FROM post_likes WHERE post_id = ? AND user_id = ?`,
      [postUuid, userUuid],
    );
    return result.rows.length > 0;
  }

  /** Ambil reply/komentar untuk suatu post dari ScyllaDB */
  async getRepliesForPost(postId: string) {
    const postUuid = types.TimeUuid.fromString(postId);
    const result = await this.scylla.execute(
      `SELECT * FROM posts WHERE in_reply_to_post_id = ?`,
      [postUuid],
    );
    return result.rows
      .map((row) => {
        const r = row as unknown as {
          post_id: { toString(): string };
          author_id: { toString(): string };
          in_reply_to_post_id?: { toString(): string } | null;
          content: string;
          linked_service_id?: { toString(): string } | null;
          created_at: Date;
          edited_at?: Date | null;
          deleted_at?: Date | null;
        };
        return {
          postId: r.post_id.toString(),
          authorId: r.author_id.toString(),
          inReplyToPostId: r.in_reply_to_post_id?.toString() ?? null,
          content: r.content,
          linkedServiceId: r.linked_service_id?.toString() ?? null,
          createdAt: r.created_at,
          editedAt: r.edited_at ?? null,
          deletedAt: r.deleted_at ?? null,
        };
      })
      .filter((p) => !p.deletedAt);
  }

  /** Ambil jumlah reply/komentar untuk suatu post dari ScyllaDB */
  async getRepliesCountForPost(postId: string): Promise<number> {
    const postUuid = types.TimeUuid.fromString(postId);
    const result = await this.scylla.execute(
      `SELECT count(*) FROM posts WHERE in_reply_to_post_id = ?`,
      [postUuid],
    );
    if (result.rows.length === 0) return 0;
    const row = result.rows[0] as Record<
      string,
      { toString(): string } | number
    >;
    const firstKey = Object.keys(row)[0];
    const countVal = row['count'] ?? (firstKey ? row[firstKey] : undefined);
    if (typeof countVal === 'number') {
      return countVal;
    }
    if (countVal !== null && countVal !== undefined) {
      return parseInt(countVal.toString(), 10);
    }
    return 0;
  }

  /** Ambil postingan atau komentar/reply berdasarkan author dari ScyllaDB */
  async getPostsByAuthor(authorId: string, isReply: boolean) {
    const authorUuid = types.Uuid.fromString(authorId);
    const result = await this.scylla.execute(
      `SELECT * FROM posts WHERE author_id = ? ALLOW FILTERING`,
      [authorUuid],
    );
    const posts = result.rows.map((row) => {
      const r = row as unknown as {
        post_id: { toString(): string };
        author_id: { toString(): string };
        in_reply_to_post_id?: { toString(): string } | null;
        content: string;
        linked_service_id?: { toString(): string } | null;
        created_at: Date;
        edited_at?: Date | null;
        deleted_at?: Date | null;
      };
      return {
        postId: r.post_id.toString(),
        authorId: r.author_id.toString(),
        inReplyToPostId: r.in_reply_to_post_id?.toString() ?? null,
        content: r.content,
        linkedServiceId: r.linked_service_id?.toString() ?? null,
        createdAt: r.created_at,
        editedAt: r.edited_at ?? null,
        deletedAt: r.deleted_at ?? null,
      };
    });

    const filtered = posts.filter(
      (p) =>
        !p.deletedAt && (isReply ? !!p.inReplyToPostId : !p.inReplyToPostId),
    );
    return filtered.sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
    );
  }

  /** Ambil postingan yang disukai oleh user */
  async getLikedPostsByUser(userId: string) {
    const userUuid = types.Uuid.fromString(userId);
    const result = await this.scylla.execute(
      `SELECT post_id FROM post_likes WHERE user_id = ? ALLOW FILTERING`,
      [userUuid],
    );
    const postIds = result.rows.map((row) => {
      const r = row as unknown as { post_id: { toString(): string } };
      return r.post_id.toString();
    });
    const posts = await this.getPostsByIds(postIds);
    return posts.filter((p) => !p.deletedAt);
  }
}
