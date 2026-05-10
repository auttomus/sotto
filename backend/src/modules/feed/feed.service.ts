import { Injectable } from '@nestjs/common';
import { ScyllaService } from '../../infrastructure/scylla/scylla.service';
import { types } from 'cassandra-driver';

@Injectable()
export class FeedService {
  constructor(private readonly scylla: ScyllaService) {}

  /** Buat postingan baru di ScyllaDB */
  async createPost(
    authorId: bigint,
    content: string,
    linkedServiceId?: bigint,
  ) {
    const postId = types.TimeUuid.now();
    const now = new Date();

    await this.scylla.execute(
      `INSERT INTO posts (post_id, author_id, content, linked_service_id, created_at)
       VALUES (?, ?, ?, ?, ?)`,
      [postId, authorId, content, linkedServiceId ?? null, now],
    );

    return {
      postId: postId.toString(),
      authorId: authorId.toString(),
      content,
      linkedServiceId: linkedServiceId?.toString() ?? null,
      createdAt: now,
    };
  }

  /** Tulis komentar (post dengan in_reply_to_post_id) */
  async createComment(authorId: bigint, parentPostId: string, content: string) {
    const commentId = types.TimeUuid.now();
    const now = new Date();

    await this.scylla.execute(
      `INSERT INTO posts (post_id, author_id, in_reply_to_post_id, content, created_at)
       VALUES (?, ?, ?, ?, ?)`,
      [
        commentId,
        authorId,
        types.TimeUuid.fromString(parentPostId),
        content,
        now,
      ],
    );

    return {
      postId: commentId.toString(),
      authorId: authorId.toString(),
      inReplyToPostId: parentPostId,
      content,
      createdAt: now,
    };
  }

  /** Fan-out: distribusikan post ke timeline semua followers */
  async fanOutToFollowers(
    authorId: bigint,
    postId: string,
    followerIds: bigint[],
  ) {
    const now = new Date();
    const timeUuid = types.TimeUuid.fromString(postId);

    const queries = followerIds.map((followerId) => ({
      query: `INSERT INTO user_feeds (user_id, post_id, author_id, created_at) VALUES (?, ?, ?, ?)`,
      params: [followerId, timeUuid, authorId, now],
    }));

    // Juga masukkan ke timeline author sendiri
    queries.push({
      query: `INSERT INTO user_feeds (user_id, post_id, author_id, created_at) VALUES (?, ?, ?, ?)`,
      params: [authorId, timeUuid, authorId, now],
    });

    if (queries.length > 0) {
      // Batch in chunks of 50 to avoid overloading ScyllaDB
      for (let i = 0; i < queries.length; i += 50) {
        await this.scylla.batch(queries.slice(i, i + 50));
      }
    }
  }

  /** Ambil feed timeline untuk user (candidate posts sebelum ranking) */
  async getUserFeed(userId: bigint, limit = 200) {
    const result = await this.scylla.execute(
      `SELECT post_id, author_id, created_at FROM user_feeds
       WHERE user_id = ? ORDER BY post_id DESC LIMIT ?`,
      [userId, limit],
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
    };
    return {
      postId: row.post_id.toString(),
      authorId: row.author_id.toString(),
      inReplyToPostId: row.in_reply_to_post_id?.toString() ?? null,
      content: row.content,
      linkedServiceId: row.linked_service_id?.toString() ?? null,
      createdAt: row.created_at,
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
  }
}
