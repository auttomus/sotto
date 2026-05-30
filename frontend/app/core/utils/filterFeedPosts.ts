/**
 * Utility to filter out parent posts from the main root level of a feed/timeline
 * if those parent posts are already being recursively rendered as ancestors of a reply
 * post present in the same timeline. This ensures a clean, connected timeline without duplication.
 */
export function filterFeedPosts(posts: any[] | null | undefined): any[] {
  if (!posts) return [];

  // Collect all parent post IDs that are replied to in this list
  const repliedToIds = new Set<string>();
  for (const post of posts) {
    if (post && post.inReplyToPostId) {
      repliedToIds.add(post.inReplyToPostId);
    }
  }

  // Filter out posts that are already acted as parent ancestors in this timeline list
  return posts.filter(post => post && !repliedToIds.has(post.postId));
}
