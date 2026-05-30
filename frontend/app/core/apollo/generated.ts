/* eslint-disable */
// @ts-nocheck

/** Internal type. DO NOT USE DIRECTLY. */
type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** Internal type. DO NOT USE DIRECTLY. */
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
import type * as Types from '../../../base-types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
import * as ApolloReactHooks from '@apollo/client/react';
const defaultOptions = {} as const;
export type SearchSchoolsQueryVariables = Exact<{
  query: string;
}>;


export type SearchSchoolsQuery = { searchSchools: Array<{ id: string, name: string }> };

export type MajorsBySchoolQueryVariables = Exact<{
  schoolId: string | number;
}>;


export type MajorsBySchoolQuery = { majorsBySchool: Array<{ id: string, name: string }> };

export type GetConversationsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetConversationsQuery = { conversations: Array<{ id: string, type: Types.ConversationType, createdAt: string, updatedAt: string, lastMessageContent: string | null, lastMessageAt: string | null, unreadCount: number, participants: Array<{ accountId: string, displayName: string, avatarObjectKey: string | null, username: string | null, lastReadMessageId: string | null }> | null, activeOrder: { id: string, status: Types.OrderStatus, agreedPrice: number, createdAt: string } | null }> };

export type GetMessagesQueryVariables = Exact<{
  conversationId: string | number;
  limit?: number | null | undefined;
}>;


export type GetMessagesQuery = { messages: Array<{ messageId: string, senderId: string, content: string, createdAt: string, editedAt: string | null, deletedAt: string | null, media: Array<{ id: string, fileName: string, contentType: string, url: string | null }> | null }> };

export type GetUnreadChatCountQueryVariables = Exact<{ [key: string]: never; }>;


export type GetUnreadChatCountQuery = { unreadChatCount: number };

export type CreateConversationMutationVariables = Exact<{
  input: Types.CreateConversationInput;
}>;


export type CreateConversationMutation = { createConversation: { id: string, type: Types.ConversationType, createdAt: string } };

export type UpdateMessageMutationVariables = Exact<{
  conversationId: string | number;
  messageId: string | number;
  input: Types.UpdateMessageInput;
}>;


export type UpdateMessageMutation = { updateMessage: { messageId: string, content: string, editedAt: string | null } };

export type DeleteMessageMutationVariables = Exact<{
  conversationId: string | number;
  messageId: string | number;
}>;


export type DeleteMessageMutation = { deleteMessage: boolean };

export type MarkConversationAsReadMutationVariables = Exact<{
  conversationId: string | number;
}>;


export type MarkConversationAsReadMutation = { markConversationAsRead: boolean };

export type SearchTagsQueryVariables = Exact<{
  query: string;
}>;


export type SearchTagsQuery = { searchTags: Array<{ id: string, name: string, isUsable: boolean }> };

export type CreateTagMutationVariables = Exact<{
  name: string;
}>;


export type CreateTagMutation = { createTag: { id: string, name: string, isUsable: boolean } };

export type SearchAccountsQueryVariables = Exact<{
  query: string;
}>;


export type SearchAccountsQuery = { searchAccounts: Array<{ id: string, displayName: string, username: string, avatarObjectKey: string | null, schoolName: string | null, major: string | null, trustScore: number, note: string | null }> };

export type SearchListingsQueryVariables = Exact<{
  query: string;
}>;


export type SearchListingsQuery = { searchListings: Array<{ id: string, title: string, type: Types.ListingType, price: number, media: Array<{ objectKey: string, url: string | null }> | null }> };

export type SearchPostsQueryVariables = Exact<{
  query: string;
}>;


export type SearchPostsQuery = { searchPosts: Array<{ postId: string, content: string, createdAt: string, authorId: string, authorDisplayName: string | null, authorUsername: string | null, authorAvatarObjectKey: string | null, authorSchoolName: string | null, linkedServiceId: string | null, inReplyToPostId: string | null, likesCount: number, repliesCount: number, likedByMe: boolean, tags: Array<{ id: string, name: string }> | null, media: Array<{ id: string, fileName: string, contentType: string, url: string | null, objectKey: string }> | null }> };

export type GetFeedQueryVariables = Exact<{
  limit?: number | null | undefined;
}>;


export type GetFeedQuery = { feed: Array<{ postId: string, content: string, createdAt: string, editedAt: string | null, deletedAt: string | null, authorId: string, authorDisplayName: string | null, authorUsername: string | null, authorAvatarObjectKey: string | null, authorSchoolName: string | null, linkedServiceId: string | null, inReplyToPostId: string | null, likesCount: number, repliesCount: number, likedByMe: boolean, tags: Array<{ id: string, name: string }> | null, media: Array<{ id: string, fileName: string, contentType: string, url: string | null, objectKey: string }> | null }> };

export type CreatePostMutationVariables = Exact<{
  input: Types.CreatePostInput;
}>;


export type CreatePostMutation = { createPost: { postId: string, content: string, createdAt: string, authorId: string, authorDisplayName: string | null, authorUsername: string | null, authorAvatarObjectKey: string | null, authorSchoolName: string | null, linkedServiceId: string | null, media: Array<{ id: string, fileName: string, contentType: string, url: string | null, objectKey: string }> | null } };

export type ToggleLikePostMutationVariables = Exact<{
  postId: string;
}>;


export type ToggleLikePostMutation = { toggleLikePost: boolean };

export type GetPostQueryVariables = Exact<{
  postId: string;
}>;


export type GetPostQuery = { post: { postId: string, content: string, createdAt: string, editedAt: string | null, deletedAt: string | null, authorId: string, authorDisplayName: string | null, authorUsername: string | null, authorAvatarObjectKey: string | null, authorSchoolName: string | null, linkedServiceId: string | null, inReplyToPostId: string | null, likesCount: number, repliesCount: number, likedByMe: boolean, tags: Array<{ id: string, name: string }> | null, media: Array<{ id: string, fileName: string, contentType: string, url: string | null, objectKey: string }> | null, ancestors: Array<{ postId: string, content: string, createdAt: string, editedAt: string | null, deletedAt: string | null, authorId: string, authorDisplayName: string | null, authorUsername: string | null, authorAvatarObjectKey: string | null, authorSchoolName: string | null, linkedServiceId: string | null, inReplyToPostId: string | null, likesCount: number, repliesCount: number, likedByMe: boolean, tags: Array<{ id: string, name: string }> | null, media: Array<{ id: string, fileName: string, contentType: string, url: string | null, objectKey: string }> | null }> | null } | null };

export type GetRepliesQueryVariables = Exact<{
  postId: string;
}>;


export type GetRepliesQuery = { replies: Array<{ postId: string, content: string, createdAt: string, editedAt: string | null, deletedAt: string | null, authorId: string, authorDisplayName: string | null, authorUsername: string | null, authorAvatarObjectKey: string | null, authorSchoolName: string | null, linkedServiceId: string | null, inReplyToPostId: string | null, likesCount: number, repliesCount: number, likedByMe: boolean, tags: Array<{ id: string, name: string }> | null, media: Array<{ id: string, fileName: string, contentType: string, url: string | null, objectKey: string }> | null }> };

export type GetGlobalFeedQueryVariables = Exact<{
  limit?: number | null | undefined;
}>;


export type GetGlobalFeedQuery = { globalFeed: Array<{ postId: string, content: string, createdAt: string, editedAt: string | null, deletedAt: string | null, authorId: string, authorDisplayName: string | null, authorUsername: string | null, authorAvatarObjectKey: string | null, authorSchoolName: string | null, linkedServiceId: string | null, inReplyToPostId: string | null, likesCount: number, repliesCount: number, likedByMe: boolean, tags: Array<{ id: string, name: string }> | null, media: Array<{ id: string, fileName: string, contentType: string, url: string | null, objectKey: string }> | null }> };

export type UpdatePostMutationVariables = Exact<{
  postId: string;
  input: Types.UpdatePostInput;
}>;


export type UpdatePostMutation = { updatePost: { postId: string, content: string, createdAt: string, editedAt: string | null, deletedAt: string | null } };

export type DeletePostMutationVariables = Exact<{
  postId: string;
}>;


export type DeletePostMutation = { deletePost: boolean };

export type GetListingsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetListingsQuery = { listings: Array<{ id: string, title: string, description: string, price: number, status: Types.ListingStatus, createdAt: string, updatedAt: string, accountId: string, isLikedByMe: boolean, likesCount: number, account: { displayName: string, major: string | null, trustScore: number, username: string | null, avatarObjectKey: string | null } | null }> };

export type GetListingDetailQueryVariables = Exact<{
  id: string | number;
}>;


export type GetListingDetailQuery = { listing: { id: string, title: string, description: string, price: number, status: Types.ListingStatus, type: Types.ListingType, isUnlimited: boolean, deliveryTimeDays: number | null, digitalFileObjectKey: string | null, digitalLink: string | null, createdAt: string, updatedAt: string, accountId: string, isLikedByMe: boolean, likesCount: number, averageRating: number, reviewsCount: number, account: { displayName: string, major: string | null, trustScore: number, username: string | null, avatarObjectKey: string | null } | null, media: Array<{ id: string, fileName: string, contentType: string, objectKey: string, url: string | null, isPrivate: boolean }> | null, reviews: Array<{ id: string, rating: number, comment: string | null, createdAt: string, reviewer: { displayName: string, username: string, avatarObjectKey: string | null } | null }> | null } | null };

export type CreateListingMutationVariables = Exact<{
  input: Types.CreateListingInput;
}>;


export type CreateListingMutation = { createListing: { id: string, title: string, description: string, price: number, status: Types.ListingStatus, digitalFileObjectKey: string | null, digitalLink: string | null } };

export type UpdateListingMutationVariables = Exact<{
  id: string | number;
  input: Types.UpdateListingInput;
}>;


export type UpdateListingMutation = { updateListing: { id: string, title: string, description: string, price: number, status: Types.ListingStatus, digitalFileObjectKey: string | null, digitalLink: string | null, updatedAt: string } };

export type DeleteListingMutationVariables = Exact<{
  id: string | number;
}>;


export type DeleteListingMutation = { deleteListing: boolean };

export type ToggleLikeListingMutationVariables = Exact<{
  id: string | number;
}>;


export type ToggleLikeListingMutation = { toggleLikeListing: boolean };

export type GetNotificationsQueryVariables = Exact<{
  cursor?: string | null | undefined;
  take?: number | null | undefined;
}>;


export type GetNotificationsQuery = { notifications: Array<{ id: string, accountId: string, type: Types.NotificationType, targetType: string | null, targetId: string | null, isRead: boolean, createdAt: string, fromAccountId: string | null, fromDisplayName: string | null }> };

export type GetUnreadNotificationCountQueryVariables = Exact<{ [key: string]: never; }>;


export type GetUnreadNotificationCountQuery = { unreadNotificationCount: number };

export type MarkNotificationAsReadMutationVariables = Exact<{
  id: string | number;
}>;


export type MarkNotificationAsReadMutation = { markNotificationAsRead: boolean };

export type MarkAllNotificationsAsReadMutationVariables = Exact<{ [key: string]: never; }>;


export type MarkAllNotificationsAsReadMutation = { markAllNotificationsAsRead: boolean };

export type GetMyOrdersQueryVariables = Exact<{
  role: string;
  status?: string | null | undefined;
}>;


export type GetMyOrdersQuery = { myOrders: Array<{ id: string, status: Types.OrderStatus, agreedPrice: number, createdAt: string, buyerAccountId: string, sellerAccountId: string, listingId: string, isReviewable: boolean }> };

export type GetOrderDetailQueryVariables = Exact<{
  id: string | number;
}>;


export type GetOrderDetailQuery = { order: { id: string, status: Types.OrderStatus, agreedPrice: number, createdAt: string, buyerAccountId: string, sellerAccountId: string, listingId: string, isReviewable: boolean, buyer: { id: string, displayName: string, username: string, avatarObjectKey: string | null } | null, seller: { id: string, displayName: string, username: string, avatarObjectKey: string | null } | null, review: { id: string, rating: number, comment: string | null } | null } | null };

export type GetOffersForConversationQueryVariables = Exact<{
  conversationId: string | number;
}>;


export type GetOffersForConversationQuery = { offersForConversation: Array<{ id: string, conversationId: string, sellerAccountId: string, buyerAccountId: string, listingId: string | null, description: string, proposedPrice: number, deliveryTimeDays: number, status: Types.OfferStatus, orderId: string | null, createdAt: string }> };

export type CreateOrderMutationVariables = Exact<{
  input: Types.CreateOrderInput;
}>;


export type CreateOrderMutation = { createOrder: { id: string, status: Types.OrderStatus, agreedPrice: number } };

export type CreateOfferMutationVariables = Exact<{
  input: Types.CreateOfferInput;
}>;


export type CreateOfferMutation = { createOffer: { id: string, status: Types.OfferStatus, proposedPrice: number } };

export type WithdrawOfferMutationVariables = Exact<{
  offerId: string | number;
}>;


export type WithdrawOfferMutation = { withdrawOffer: { id: string, status: Types.OfferStatus } };

export type AcceptOfferMutationVariables = Exact<{
  offerId: string | number;
}>;


export type AcceptOfferMutation = { acceptOffer: { id: string, status: Types.OfferStatus, orderId: string | null } };

export type RejectOfferMutationVariables = Exact<{
  offerId: string | number;
}>;


export type RejectOfferMutation = { rejectOffer: { id: string, status: Types.OfferStatus } };

export type GetMidtransSnapTokenMutationVariables = Exact<{
  orderId: string | number;
}>;


export type GetMidtransSnapTokenMutation = { getMidtransSnapToken: string };

export type VerifyPaymentMutationVariables = Exact<{
  orderId: string | number;
}>;


export type VerifyPaymentMutation = { verifyPayment: string };

export type AdvanceOrderStatusMutationVariables = Exact<{
  orderId: string | number;
}>;


export type AdvanceOrderStatusMutation = { advanceOrderStatus: { id: string, status: Types.OrderStatus } };

export type CancelOrderMutationVariables = Exact<{
  orderId: string | number;
}>;


export type CancelOrderMutation = { cancelOrder: { id: string, status: Types.OrderStatus } };

export type CreateReviewMutationVariables = Exact<{
  orderId: string | number;
  rating: number;
  comment?: string | null | undefined;
}>;


export type CreateReviewMutation = { createReview: { id: string, rating: number, comment: string | null } };

export type GetMyProfileQueryVariables = Exact<{ [key: string]: never; }>;


export type GetMyProfileQuery = { myProfile: { id: string, displayName: string, username: string, note: string | null, avatarObjectKey: string | null, avatarUrl: string | null, trustScore: number, schoolName: string | null, schoolId: string | null, major: string | null, majorId: string | null, followersCount: string, followingCount: string, bannerObjectKey: string | null } };

export type GetUserProfileQueryVariables = Exact<{
  username: string;
}>;


export type GetUserProfileQuery = { profile: { id: string, displayName: string, username: string, note: string | null, avatarObjectKey: string | null, avatarUrl: string | null, trustScore: number, isFollowing: boolean | null, followersCount: string, followingCount: string, schoolName: string | null, major: string | null, bannerObjectKey: string | null } | null };

export type GetListingsByAccountQueryVariables = Exact<{
  accountId: string | number;
}>;


export type GetListingsByAccountQuery = { listingsByAccount: Array<{ id: string, title: string, description: string, price: number, isUnlimited: boolean, deliveryTimeDays: number | null, status: Types.ListingStatus, type: Types.ListingType, createdAt: string, updatedAt: string, media: Array<{ id: string, url: string | null, objectKey: string, fileName: string, contentType: string }> | null }> };

export type FollowAccountMutationVariables = Exact<{
  targetAccountId: string | number;
}>;


export type FollowAccountMutation = { follow: boolean };

export type UnfollowAccountMutationVariables = Exact<{
  targetAccountId: string | number;
}>;


export type UnfollowAccountMutation = { unfollow: boolean };

export type UpdateProfileMutationVariables = Exact<{
  input: Types.UpdateProfileInput;
}>;


export type UpdateProfileMutation = { updateProfile: { id: string, displayName: string, username: string, note: string | null, avatarObjectKey: string | null, avatarUrl: string | null, major: string | null, majorId: string | null, bannerObjectKey: string | null } };

export type GetPostsByAccountQueryVariables = Exact<{
  accountId: string;
}>;


export type GetPostsByAccountQuery = { postsByAccount: Array<{ postId: string, content: string, createdAt: string, deletedAt: string | null, authorId: string, authorDisplayName: string | null, authorUsername: string | null, authorAvatarObjectKey: string | null, authorSchoolName: string | null, linkedServiceId: string | null, inReplyToPostId: string | null, likesCount: number, repliesCount: number, likedByMe: boolean, tags: Array<{ id: string, name: string }> | null, media: Array<{ id: string, fileName: string, contentType: string, url: string | null, objectKey: string }> | null }> };

export type GetRepliesByAccountQueryVariables = Exact<{
  accountId: string;
}>;


export type GetRepliesByAccountQuery = { repliesByAccount: Array<{ postId: string, content: string, createdAt: string, deletedAt: string | null, authorId: string, authorDisplayName: string | null, authorUsername: string | null, authorAvatarObjectKey: string | null, authorSchoolName: string | null, linkedServiceId: string | null, inReplyToPostId: string | null, likesCount: number, repliesCount: number, likedByMe: boolean, tags: Array<{ id: string, name: string }> | null, media: Array<{ id: string, fileName: string, contentType: string, url: string | null, objectKey: string }> | null }> };

export type GetLikedListingsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetLikedListingsQuery = { likedListings: Array<{ id: string, title: string, description: string, price: number, status: Types.ListingStatus, type: Types.ListingType, isUnlimited: boolean, deliveryTimeDays: number | null, createdAt: string, updatedAt: string, accountId: string, isLikedByMe: boolean, likesCount: number, account: { displayName: string, major: string | null, trustScore: number, username: string | null, avatarObjectKey: string | null } | null, media: Array<{ id: string, fileName: string, contentType: string, objectKey: string, url: string | null, isPrivate: boolean }> | null }> };

export type GetLikedPostsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetLikedPostsQuery = { likedPosts: Array<{ postId: string, content: string, createdAt: string, authorId: string, authorDisplayName: string | null, authorUsername: string | null, authorAvatarObjectKey: string | null, authorSchoolName: string | null, linkedServiceId: string | null, inReplyToPostId: string | null, likesCount: number, repliesCount: number, likedByMe: boolean, tags: Array<{ id: string, name: string }> | null, media: Array<{ id: string, fileName: string, contentType: string, url: string | null, objectKey: string }> | null }> };


export const SearchSchoolsDocument = gql`
    query SearchSchools($query: String!) {
  searchSchools(query: $query) {
    id
    name
  }
}
    `;

/**
 * __useSearchSchoolsQuery__
 *
 * To run a query within a React component, call `useSearchSchoolsQuery` and pass it any options that fit your needs.
 * When your component renders, `useSearchSchoolsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSearchSchoolsQuery({
 *   variables: {
 *      query: // value for 'query'
 *   },
 * });
 */
export function useSearchSchoolsQuery(baseOptions: ApolloReactHooks.QueryHookOptions<SearchSchoolsQuery, SearchSchoolsQueryVariables> & ({ variables: SearchSchoolsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<SearchSchoolsQuery, SearchSchoolsQueryVariables>(SearchSchoolsDocument, options);
      }
export function useSearchSchoolsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<SearchSchoolsQuery, SearchSchoolsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<SearchSchoolsQuery, SearchSchoolsQueryVariables>(SearchSchoolsDocument, options);
        }
// @ts-ignore
export function useSearchSchoolsSuspenseQuery(baseOptions?: ApolloReactHooks.SuspenseQueryHookOptions<SearchSchoolsQuery, SearchSchoolsQueryVariables>): ApolloReactHooks.UseSuspenseQueryResult<SearchSchoolsQuery, SearchSchoolsQueryVariables>;
export function useSearchSchoolsSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<SearchSchoolsQuery, SearchSchoolsQueryVariables>): ApolloReactHooks.UseSuspenseQueryResult<SearchSchoolsQuery | undefined, SearchSchoolsQueryVariables>;
export function useSearchSchoolsSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<SearchSchoolsQuery, SearchSchoolsQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<SearchSchoolsQuery, SearchSchoolsQueryVariables>(SearchSchoolsDocument, options);
        }
export type SearchSchoolsQueryHookResult = ReturnType<typeof useSearchSchoolsQuery>;
export type SearchSchoolsLazyQueryHookResult = ReturnType<typeof useSearchSchoolsLazyQuery>;
export type SearchSchoolsSuspenseQueryHookResult = ReturnType<typeof useSearchSchoolsSuspenseQuery>;
export type SearchSchoolsQueryResult = Apollo.QueryResult<SearchSchoolsQuery, SearchSchoolsQueryVariables>;
export const MajorsBySchoolDocument = gql`
    query MajorsBySchool($schoolId: ID!) {
  majorsBySchool(schoolId: $schoolId) {
    id
    name
  }
}
    `;

/**
 * __useMajorsBySchoolQuery__
 *
 * To run a query within a React component, call `useMajorsBySchoolQuery` and pass it any options that fit your needs.
 * When your component renders, `useMajorsBySchoolQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMajorsBySchoolQuery({
 *   variables: {
 *      schoolId: // value for 'schoolId'
 *   },
 * });
 */
export function useMajorsBySchoolQuery(baseOptions: ApolloReactHooks.QueryHookOptions<MajorsBySchoolQuery, MajorsBySchoolQueryVariables> & ({ variables: MajorsBySchoolQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<MajorsBySchoolQuery, MajorsBySchoolQueryVariables>(MajorsBySchoolDocument, options);
      }
export function useMajorsBySchoolLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<MajorsBySchoolQuery, MajorsBySchoolQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<MajorsBySchoolQuery, MajorsBySchoolQueryVariables>(MajorsBySchoolDocument, options);
        }
// @ts-ignore
export function useMajorsBySchoolSuspenseQuery(baseOptions?: ApolloReactHooks.SuspenseQueryHookOptions<MajorsBySchoolQuery, MajorsBySchoolQueryVariables>): ApolloReactHooks.UseSuspenseQueryResult<MajorsBySchoolQuery, MajorsBySchoolQueryVariables>;
export function useMajorsBySchoolSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<MajorsBySchoolQuery, MajorsBySchoolQueryVariables>): ApolloReactHooks.UseSuspenseQueryResult<MajorsBySchoolQuery | undefined, MajorsBySchoolQueryVariables>;
export function useMajorsBySchoolSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<MajorsBySchoolQuery, MajorsBySchoolQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<MajorsBySchoolQuery, MajorsBySchoolQueryVariables>(MajorsBySchoolDocument, options);
        }
export type MajorsBySchoolQueryHookResult = ReturnType<typeof useMajorsBySchoolQuery>;
export type MajorsBySchoolLazyQueryHookResult = ReturnType<typeof useMajorsBySchoolLazyQuery>;
export type MajorsBySchoolSuspenseQueryHookResult = ReturnType<typeof useMajorsBySchoolSuspenseQuery>;
export type MajorsBySchoolQueryResult = Apollo.QueryResult<MajorsBySchoolQuery, MajorsBySchoolQueryVariables>;
export const GetConversationsDocument = gql`
    query GetConversations {
  conversations {
    id
    type
    createdAt
    updatedAt
    participants {
      accountId
      displayName
      avatarObjectKey
      username
      lastReadMessageId
    }
    lastMessageContent
    lastMessageAt
    unreadCount
    activeOrder {
      id
      status
      agreedPrice
      createdAt
    }
  }
}
    `;

/**
 * __useGetConversationsQuery__
 *
 * To run a query within a React component, call `useGetConversationsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetConversationsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetConversationsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetConversationsQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<GetConversationsQuery, GetConversationsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GetConversationsQuery, GetConversationsQueryVariables>(GetConversationsDocument, options);
      }
export function useGetConversationsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetConversationsQuery, GetConversationsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GetConversationsQuery, GetConversationsQueryVariables>(GetConversationsDocument, options);
        }
// @ts-ignore
export function useGetConversationsSuspenseQuery(baseOptions?: ApolloReactHooks.SuspenseQueryHookOptions<GetConversationsQuery, GetConversationsQueryVariables>): ApolloReactHooks.UseSuspenseQueryResult<GetConversationsQuery, GetConversationsQueryVariables>;
export function useGetConversationsSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<GetConversationsQuery, GetConversationsQueryVariables>): ApolloReactHooks.UseSuspenseQueryResult<GetConversationsQuery | undefined, GetConversationsQueryVariables>;
export function useGetConversationsSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<GetConversationsQuery, GetConversationsQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<GetConversationsQuery, GetConversationsQueryVariables>(GetConversationsDocument, options);
        }
export type GetConversationsQueryHookResult = ReturnType<typeof useGetConversationsQuery>;
export type GetConversationsLazyQueryHookResult = ReturnType<typeof useGetConversationsLazyQuery>;
export type GetConversationsSuspenseQueryHookResult = ReturnType<typeof useGetConversationsSuspenseQuery>;
export type GetConversationsQueryResult = Apollo.QueryResult<GetConversationsQuery, GetConversationsQueryVariables>;
export const GetMessagesDocument = gql`
    query GetMessages($conversationId: ID!, $limit: Int) {
  messages(conversationId: $conversationId, limit: $limit) {
    messageId
    senderId
    content
    createdAt
    editedAt
    deletedAt
    media {
      id
      fileName
      contentType
      url
    }
  }
}
    `;

/**
 * __useGetMessagesQuery__
 *
 * To run a query within a React component, call `useGetMessagesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetMessagesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetMessagesQuery({
 *   variables: {
 *      conversationId: // value for 'conversationId'
 *      limit: // value for 'limit'
 *   },
 * });
 */
export function useGetMessagesQuery(baseOptions: ApolloReactHooks.QueryHookOptions<GetMessagesQuery, GetMessagesQueryVariables> & ({ variables: GetMessagesQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GetMessagesQuery, GetMessagesQueryVariables>(GetMessagesDocument, options);
      }
export function useGetMessagesLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetMessagesQuery, GetMessagesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GetMessagesQuery, GetMessagesQueryVariables>(GetMessagesDocument, options);
        }
// @ts-ignore
export function useGetMessagesSuspenseQuery(baseOptions?: ApolloReactHooks.SuspenseQueryHookOptions<GetMessagesQuery, GetMessagesQueryVariables>): ApolloReactHooks.UseSuspenseQueryResult<GetMessagesQuery, GetMessagesQueryVariables>;
export function useGetMessagesSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<GetMessagesQuery, GetMessagesQueryVariables>): ApolloReactHooks.UseSuspenseQueryResult<GetMessagesQuery | undefined, GetMessagesQueryVariables>;
export function useGetMessagesSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<GetMessagesQuery, GetMessagesQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<GetMessagesQuery, GetMessagesQueryVariables>(GetMessagesDocument, options);
        }
export type GetMessagesQueryHookResult = ReturnType<typeof useGetMessagesQuery>;
export type GetMessagesLazyQueryHookResult = ReturnType<typeof useGetMessagesLazyQuery>;
export type GetMessagesSuspenseQueryHookResult = ReturnType<typeof useGetMessagesSuspenseQuery>;
export type GetMessagesQueryResult = Apollo.QueryResult<GetMessagesQuery, GetMessagesQueryVariables>;
export const GetUnreadChatCountDocument = gql`
    query GetUnreadChatCount {
  unreadChatCount
}
    `;

/**
 * __useGetUnreadChatCountQuery__
 *
 * To run a query within a React component, call `useGetUnreadChatCountQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUnreadChatCountQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUnreadChatCountQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetUnreadChatCountQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<GetUnreadChatCountQuery, GetUnreadChatCountQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GetUnreadChatCountQuery, GetUnreadChatCountQueryVariables>(GetUnreadChatCountDocument, options);
      }
export function useGetUnreadChatCountLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetUnreadChatCountQuery, GetUnreadChatCountQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GetUnreadChatCountQuery, GetUnreadChatCountQueryVariables>(GetUnreadChatCountDocument, options);
        }
// @ts-ignore
export function useGetUnreadChatCountSuspenseQuery(baseOptions?: ApolloReactHooks.SuspenseQueryHookOptions<GetUnreadChatCountQuery, GetUnreadChatCountQueryVariables>): ApolloReactHooks.UseSuspenseQueryResult<GetUnreadChatCountQuery, GetUnreadChatCountQueryVariables>;
export function useGetUnreadChatCountSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<GetUnreadChatCountQuery, GetUnreadChatCountQueryVariables>): ApolloReactHooks.UseSuspenseQueryResult<GetUnreadChatCountQuery | undefined, GetUnreadChatCountQueryVariables>;
export function useGetUnreadChatCountSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<GetUnreadChatCountQuery, GetUnreadChatCountQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<GetUnreadChatCountQuery, GetUnreadChatCountQueryVariables>(GetUnreadChatCountDocument, options);
        }
export type GetUnreadChatCountQueryHookResult = ReturnType<typeof useGetUnreadChatCountQuery>;
export type GetUnreadChatCountLazyQueryHookResult = ReturnType<typeof useGetUnreadChatCountLazyQuery>;
export type GetUnreadChatCountSuspenseQueryHookResult = ReturnType<typeof useGetUnreadChatCountSuspenseQuery>;
export type GetUnreadChatCountQueryResult = Apollo.QueryResult<GetUnreadChatCountQuery, GetUnreadChatCountQueryVariables>;
export const CreateConversationDocument = gql`
    mutation CreateConversation($input: CreateConversationInput!) {
  createConversation(input: $input) {
    id
    type
    createdAt
  }
}
    `;
export type CreateConversationMutationFn = Apollo.MutationFunction<CreateConversationMutation, CreateConversationMutationVariables>;

/**
 * __useCreateConversationMutation__
 *
 * To run a mutation, you first call `useCreateConversationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateConversationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createConversationMutation, { data, loading, error }] = useCreateConversationMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateConversationMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<CreateConversationMutation, CreateConversationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<CreateConversationMutation, CreateConversationMutationVariables>(CreateConversationDocument, options);
      }
export type CreateConversationMutationHookResult = ReturnType<typeof useCreateConversationMutation>;
export type CreateConversationMutationResult = Apollo.MutationResult<CreateConversationMutation>;
export type CreateConversationMutationOptions = Apollo.BaseMutationOptions<CreateConversationMutation, CreateConversationMutationVariables>;
export const UpdateMessageDocument = gql`
    mutation UpdateMessage($conversationId: ID!, $messageId: ID!, $input: UpdateMessageInput!) {
  updateMessage(
    conversationId: $conversationId
    messageId: $messageId
    input: $input
  ) {
    messageId
    content
    editedAt
  }
}
    `;
export type UpdateMessageMutationFn = Apollo.MutationFunction<UpdateMessageMutation, UpdateMessageMutationVariables>;

/**
 * __useUpdateMessageMutation__
 *
 * To run a mutation, you first call `useUpdateMessageMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateMessageMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateMessageMutation, { data, loading, error }] = useUpdateMessageMutation({
 *   variables: {
 *      conversationId: // value for 'conversationId'
 *      messageId: // value for 'messageId'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateMessageMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<UpdateMessageMutation, UpdateMessageMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<UpdateMessageMutation, UpdateMessageMutationVariables>(UpdateMessageDocument, options);
      }
export type UpdateMessageMutationHookResult = ReturnType<typeof useUpdateMessageMutation>;
export type UpdateMessageMutationResult = Apollo.MutationResult<UpdateMessageMutation>;
export type UpdateMessageMutationOptions = Apollo.BaseMutationOptions<UpdateMessageMutation, UpdateMessageMutationVariables>;
export const DeleteMessageDocument = gql`
    mutation DeleteMessage($conversationId: ID!, $messageId: ID!) {
  deleteMessage(conversationId: $conversationId, messageId: $messageId)
}
    `;
export type DeleteMessageMutationFn = Apollo.MutationFunction<DeleteMessageMutation, DeleteMessageMutationVariables>;

/**
 * __useDeleteMessageMutation__
 *
 * To run a mutation, you first call `useDeleteMessageMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteMessageMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteMessageMutation, { data, loading, error }] = useDeleteMessageMutation({
 *   variables: {
 *      conversationId: // value for 'conversationId'
 *      messageId: // value for 'messageId'
 *   },
 * });
 */
export function useDeleteMessageMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<DeleteMessageMutation, DeleteMessageMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<DeleteMessageMutation, DeleteMessageMutationVariables>(DeleteMessageDocument, options);
      }
export type DeleteMessageMutationHookResult = ReturnType<typeof useDeleteMessageMutation>;
export type DeleteMessageMutationResult = Apollo.MutationResult<DeleteMessageMutation>;
export type DeleteMessageMutationOptions = Apollo.BaseMutationOptions<DeleteMessageMutation, DeleteMessageMutationVariables>;
export const MarkConversationAsReadDocument = gql`
    mutation MarkConversationAsRead($conversationId: ID!) {
  markConversationAsRead(conversationId: $conversationId)
}
    `;
export type MarkConversationAsReadMutationFn = Apollo.MutationFunction<MarkConversationAsReadMutation, MarkConversationAsReadMutationVariables>;

/**
 * __useMarkConversationAsReadMutation__
 *
 * To run a mutation, you first call `useMarkConversationAsReadMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useMarkConversationAsReadMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [markConversationAsReadMutation, { data, loading, error }] = useMarkConversationAsReadMutation({
 *   variables: {
 *      conversationId: // value for 'conversationId'
 *   },
 * });
 */
export function useMarkConversationAsReadMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<MarkConversationAsReadMutation, MarkConversationAsReadMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<MarkConversationAsReadMutation, MarkConversationAsReadMutationVariables>(MarkConversationAsReadDocument, options);
      }
export type MarkConversationAsReadMutationHookResult = ReturnType<typeof useMarkConversationAsReadMutation>;
export type MarkConversationAsReadMutationResult = Apollo.MutationResult<MarkConversationAsReadMutation>;
export type MarkConversationAsReadMutationOptions = Apollo.BaseMutationOptions<MarkConversationAsReadMutation, MarkConversationAsReadMutationVariables>;
export const SearchTagsDocument = gql`
    query SearchTags($query: String!) {
  searchTags(query: $query) {
    id
    name
    isUsable
  }
}
    `;

/**
 * __useSearchTagsQuery__
 *
 * To run a query within a React component, call `useSearchTagsQuery` and pass it any options that fit your needs.
 * When your component renders, `useSearchTagsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSearchTagsQuery({
 *   variables: {
 *      query: // value for 'query'
 *   },
 * });
 */
export function useSearchTagsQuery(baseOptions: ApolloReactHooks.QueryHookOptions<SearchTagsQuery, SearchTagsQueryVariables> & ({ variables: SearchTagsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<SearchTagsQuery, SearchTagsQueryVariables>(SearchTagsDocument, options);
      }
export function useSearchTagsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<SearchTagsQuery, SearchTagsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<SearchTagsQuery, SearchTagsQueryVariables>(SearchTagsDocument, options);
        }
// @ts-ignore
export function useSearchTagsSuspenseQuery(baseOptions?: ApolloReactHooks.SuspenseQueryHookOptions<SearchTagsQuery, SearchTagsQueryVariables>): ApolloReactHooks.UseSuspenseQueryResult<SearchTagsQuery, SearchTagsQueryVariables>;
export function useSearchTagsSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<SearchTagsQuery, SearchTagsQueryVariables>): ApolloReactHooks.UseSuspenseQueryResult<SearchTagsQuery | undefined, SearchTagsQueryVariables>;
export function useSearchTagsSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<SearchTagsQuery, SearchTagsQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<SearchTagsQuery, SearchTagsQueryVariables>(SearchTagsDocument, options);
        }
export type SearchTagsQueryHookResult = ReturnType<typeof useSearchTagsQuery>;
export type SearchTagsLazyQueryHookResult = ReturnType<typeof useSearchTagsLazyQuery>;
export type SearchTagsSuspenseQueryHookResult = ReturnType<typeof useSearchTagsSuspenseQuery>;
export type SearchTagsQueryResult = Apollo.QueryResult<SearchTagsQuery, SearchTagsQueryVariables>;
export const CreateTagDocument = gql`
    mutation CreateTag($name: String!) {
  createTag(name: $name) {
    id
    name
    isUsable
  }
}
    `;
export type CreateTagMutationFn = Apollo.MutationFunction<CreateTagMutation, CreateTagMutationVariables>;

/**
 * __useCreateTagMutation__
 *
 * To run a mutation, you first call `useCreateTagMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateTagMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createTagMutation, { data, loading, error }] = useCreateTagMutation({
 *   variables: {
 *      name: // value for 'name'
 *   },
 * });
 */
export function useCreateTagMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<CreateTagMutation, CreateTagMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<CreateTagMutation, CreateTagMutationVariables>(CreateTagDocument, options);
      }
export type CreateTagMutationHookResult = ReturnType<typeof useCreateTagMutation>;
export type CreateTagMutationResult = Apollo.MutationResult<CreateTagMutation>;
export type CreateTagMutationOptions = Apollo.BaseMutationOptions<CreateTagMutation, CreateTagMutationVariables>;
export const SearchAccountsDocument = gql`
    query SearchAccounts($query: String!) {
  searchAccounts(query: $query) {
    id
    displayName
    username
    avatarObjectKey
    schoolName
    major
    trustScore
    note
  }
}
    `;

/**
 * __useSearchAccountsQuery__
 *
 * To run a query within a React component, call `useSearchAccountsQuery` and pass it any options that fit your needs.
 * When your component renders, `useSearchAccountsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSearchAccountsQuery({
 *   variables: {
 *      query: // value for 'query'
 *   },
 * });
 */
export function useSearchAccountsQuery(baseOptions: ApolloReactHooks.QueryHookOptions<SearchAccountsQuery, SearchAccountsQueryVariables> & ({ variables: SearchAccountsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<SearchAccountsQuery, SearchAccountsQueryVariables>(SearchAccountsDocument, options);
      }
export function useSearchAccountsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<SearchAccountsQuery, SearchAccountsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<SearchAccountsQuery, SearchAccountsQueryVariables>(SearchAccountsDocument, options);
        }
// @ts-ignore
export function useSearchAccountsSuspenseQuery(baseOptions?: ApolloReactHooks.SuspenseQueryHookOptions<SearchAccountsQuery, SearchAccountsQueryVariables>): ApolloReactHooks.UseSuspenseQueryResult<SearchAccountsQuery, SearchAccountsQueryVariables>;
export function useSearchAccountsSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<SearchAccountsQuery, SearchAccountsQueryVariables>): ApolloReactHooks.UseSuspenseQueryResult<SearchAccountsQuery | undefined, SearchAccountsQueryVariables>;
export function useSearchAccountsSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<SearchAccountsQuery, SearchAccountsQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<SearchAccountsQuery, SearchAccountsQueryVariables>(SearchAccountsDocument, options);
        }
export type SearchAccountsQueryHookResult = ReturnType<typeof useSearchAccountsQuery>;
export type SearchAccountsLazyQueryHookResult = ReturnType<typeof useSearchAccountsLazyQuery>;
export type SearchAccountsSuspenseQueryHookResult = ReturnType<typeof useSearchAccountsSuspenseQuery>;
export type SearchAccountsQueryResult = Apollo.QueryResult<SearchAccountsQuery, SearchAccountsQueryVariables>;
export const SearchListingsDocument = gql`
    query SearchListings($query: String!) {
  searchListings(query: $query) {
    id
    title
    type
    price
    media {
      objectKey
      url
    }
  }
}
    `;

/**
 * __useSearchListingsQuery__
 *
 * To run a query within a React component, call `useSearchListingsQuery` and pass it any options that fit your needs.
 * When your component renders, `useSearchListingsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSearchListingsQuery({
 *   variables: {
 *      query: // value for 'query'
 *   },
 * });
 */
export function useSearchListingsQuery(baseOptions: ApolloReactHooks.QueryHookOptions<SearchListingsQuery, SearchListingsQueryVariables> & ({ variables: SearchListingsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<SearchListingsQuery, SearchListingsQueryVariables>(SearchListingsDocument, options);
      }
export function useSearchListingsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<SearchListingsQuery, SearchListingsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<SearchListingsQuery, SearchListingsQueryVariables>(SearchListingsDocument, options);
        }
// @ts-ignore
export function useSearchListingsSuspenseQuery(baseOptions?: ApolloReactHooks.SuspenseQueryHookOptions<SearchListingsQuery, SearchListingsQueryVariables>): ApolloReactHooks.UseSuspenseQueryResult<SearchListingsQuery, SearchListingsQueryVariables>;
export function useSearchListingsSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<SearchListingsQuery, SearchListingsQueryVariables>): ApolloReactHooks.UseSuspenseQueryResult<SearchListingsQuery | undefined, SearchListingsQueryVariables>;
export function useSearchListingsSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<SearchListingsQuery, SearchListingsQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<SearchListingsQuery, SearchListingsQueryVariables>(SearchListingsDocument, options);
        }
export type SearchListingsQueryHookResult = ReturnType<typeof useSearchListingsQuery>;
export type SearchListingsLazyQueryHookResult = ReturnType<typeof useSearchListingsLazyQuery>;
export type SearchListingsSuspenseQueryHookResult = ReturnType<typeof useSearchListingsSuspenseQuery>;
export type SearchListingsQueryResult = Apollo.QueryResult<SearchListingsQuery, SearchListingsQueryVariables>;
export const SearchPostsDocument = gql`
    query SearchPosts($query: String!) {
  searchPosts(query: $query) {
    postId
    content
    createdAt
    authorId
    authorDisplayName
    authorUsername
    authorAvatarObjectKey
    authorSchoolName
    linkedServiceId
    inReplyToPostId
    likesCount
    repliesCount
    likedByMe
    tags {
      id
      name
    }
    media {
      id
      fileName
      contentType
      url
      objectKey
    }
  }
}
    `;

/**
 * __useSearchPostsQuery__
 *
 * To run a query within a React component, call `useSearchPostsQuery` and pass it any options that fit your needs.
 * When your component renders, `useSearchPostsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSearchPostsQuery({
 *   variables: {
 *      query: // value for 'query'
 *   },
 * });
 */
export function useSearchPostsQuery(baseOptions: ApolloReactHooks.QueryHookOptions<SearchPostsQuery, SearchPostsQueryVariables> & ({ variables: SearchPostsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<SearchPostsQuery, SearchPostsQueryVariables>(SearchPostsDocument, options);
      }
export function useSearchPostsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<SearchPostsQuery, SearchPostsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<SearchPostsQuery, SearchPostsQueryVariables>(SearchPostsDocument, options);
        }
// @ts-ignore
export function useSearchPostsSuspenseQuery(baseOptions?: ApolloReactHooks.SuspenseQueryHookOptions<SearchPostsQuery, SearchPostsQueryVariables>): ApolloReactHooks.UseSuspenseQueryResult<SearchPostsQuery, SearchPostsQueryVariables>;
export function useSearchPostsSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<SearchPostsQuery, SearchPostsQueryVariables>): ApolloReactHooks.UseSuspenseQueryResult<SearchPostsQuery | undefined, SearchPostsQueryVariables>;
export function useSearchPostsSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<SearchPostsQuery, SearchPostsQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<SearchPostsQuery, SearchPostsQueryVariables>(SearchPostsDocument, options);
        }
export type SearchPostsQueryHookResult = ReturnType<typeof useSearchPostsQuery>;
export type SearchPostsLazyQueryHookResult = ReturnType<typeof useSearchPostsLazyQuery>;
export type SearchPostsSuspenseQueryHookResult = ReturnType<typeof useSearchPostsSuspenseQuery>;
export type SearchPostsQueryResult = Apollo.QueryResult<SearchPostsQuery, SearchPostsQueryVariables>;
export const GetFeedDocument = gql`
    query GetFeed($limit: Int) {
  feed(limit: $limit) {
    postId
    content
    createdAt
    editedAt
    deletedAt
    authorId
    authorDisplayName
    authorUsername
    authorAvatarObjectKey
    authorSchoolName
    linkedServiceId
    inReplyToPostId
    likesCount
    repliesCount
    likedByMe
    tags {
      id
      name
    }
    media {
      id
      fileName
      contentType
      url
      objectKey
    }
  }
}
    `;

/**
 * __useGetFeedQuery__
 *
 * To run a query within a React component, call `useGetFeedQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetFeedQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetFeedQuery({
 *   variables: {
 *      limit: // value for 'limit'
 *   },
 * });
 */
export function useGetFeedQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<GetFeedQuery, GetFeedQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GetFeedQuery, GetFeedQueryVariables>(GetFeedDocument, options);
      }
export function useGetFeedLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetFeedQuery, GetFeedQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GetFeedQuery, GetFeedQueryVariables>(GetFeedDocument, options);
        }
// @ts-ignore
export function useGetFeedSuspenseQuery(baseOptions?: ApolloReactHooks.SuspenseQueryHookOptions<GetFeedQuery, GetFeedQueryVariables>): ApolloReactHooks.UseSuspenseQueryResult<GetFeedQuery, GetFeedQueryVariables>;
export function useGetFeedSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<GetFeedQuery, GetFeedQueryVariables>): ApolloReactHooks.UseSuspenseQueryResult<GetFeedQuery | undefined, GetFeedQueryVariables>;
export function useGetFeedSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<GetFeedQuery, GetFeedQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<GetFeedQuery, GetFeedQueryVariables>(GetFeedDocument, options);
        }
export type GetFeedQueryHookResult = ReturnType<typeof useGetFeedQuery>;
export type GetFeedLazyQueryHookResult = ReturnType<typeof useGetFeedLazyQuery>;
export type GetFeedSuspenseQueryHookResult = ReturnType<typeof useGetFeedSuspenseQuery>;
export type GetFeedQueryResult = Apollo.QueryResult<GetFeedQuery, GetFeedQueryVariables>;
export const CreatePostDocument = gql`
    mutation CreatePost($input: CreatePostInput!) {
  createPost(input: $input) {
    postId
    content
    createdAt
    authorId
    authorDisplayName
    authorUsername
    authorAvatarObjectKey
    authorSchoolName
    linkedServiceId
    media {
      id
      fileName
      contentType
      url
      objectKey
    }
  }
}
    `;
export type CreatePostMutationFn = Apollo.MutationFunction<CreatePostMutation, CreatePostMutationVariables>;

/**
 * __useCreatePostMutation__
 *
 * To run a mutation, you first call `useCreatePostMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreatePostMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createPostMutation, { data, loading, error }] = useCreatePostMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreatePostMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<CreatePostMutation, CreatePostMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<CreatePostMutation, CreatePostMutationVariables>(CreatePostDocument, options);
      }
export type CreatePostMutationHookResult = ReturnType<typeof useCreatePostMutation>;
export type CreatePostMutationResult = Apollo.MutationResult<CreatePostMutation>;
export type CreatePostMutationOptions = Apollo.BaseMutationOptions<CreatePostMutation, CreatePostMutationVariables>;
export const ToggleLikePostDocument = gql`
    mutation ToggleLikePost($postId: String!) {
  toggleLikePost(postId: $postId)
}
    `;
export type ToggleLikePostMutationFn = Apollo.MutationFunction<ToggleLikePostMutation, ToggleLikePostMutationVariables>;

/**
 * __useToggleLikePostMutation__
 *
 * To run a mutation, you first call `useToggleLikePostMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useToggleLikePostMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [toggleLikePostMutation, { data, loading, error }] = useToggleLikePostMutation({
 *   variables: {
 *      postId: // value for 'postId'
 *   },
 * });
 */
export function useToggleLikePostMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<ToggleLikePostMutation, ToggleLikePostMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<ToggleLikePostMutation, ToggleLikePostMutationVariables>(ToggleLikePostDocument, options);
      }
export type ToggleLikePostMutationHookResult = ReturnType<typeof useToggleLikePostMutation>;
export type ToggleLikePostMutationResult = Apollo.MutationResult<ToggleLikePostMutation>;
export type ToggleLikePostMutationOptions = Apollo.BaseMutationOptions<ToggleLikePostMutation, ToggleLikePostMutationVariables>;
export const GetPostDocument = gql`
    query GetPost($postId: String!) {
  post(postId: $postId) {
    postId
    content
    createdAt
    editedAt
    deletedAt
    authorId
    authorDisplayName
    authorUsername
    authorAvatarObjectKey
    authorSchoolName
    linkedServiceId
    inReplyToPostId
    likesCount
    repliesCount
    likedByMe
    tags {
      id
      name
    }
    media {
      id
      fileName
      contentType
      url
      objectKey
    }
    ancestors {
      postId
      content
      createdAt
      editedAt
      deletedAt
      authorId
      authorDisplayName
      authorUsername
      authorAvatarObjectKey
      authorSchoolName
      linkedServiceId
      inReplyToPostId
      likesCount
      repliesCount
      likedByMe
      tags {
        id
        name
      }
      media {
        id
        fileName
        contentType
        url
        objectKey
      }
    }
  }
}
    `;

/**
 * __useGetPostQuery__
 *
 * To run a query within a React component, call `useGetPostQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPostQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPostQuery({
 *   variables: {
 *      postId: // value for 'postId'
 *   },
 * });
 */
export function useGetPostQuery(baseOptions: ApolloReactHooks.QueryHookOptions<GetPostQuery, GetPostQueryVariables> & ({ variables: GetPostQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GetPostQuery, GetPostQueryVariables>(GetPostDocument, options);
      }
export function useGetPostLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetPostQuery, GetPostQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GetPostQuery, GetPostQueryVariables>(GetPostDocument, options);
        }
// @ts-ignore
export function useGetPostSuspenseQuery(baseOptions?: ApolloReactHooks.SuspenseQueryHookOptions<GetPostQuery, GetPostQueryVariables>): ApolloReactHooks.UseSuspenseQueryResult<GetPostQuery, GetPostQueryVariables>;
export function useGetPostSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<GetPostQuery, GetPostQueryVariables>): ApolloReactHooks.UseSuspenseQueryResult<GetPostQuery | undefined, GetPostQueryVariables>;
export function useGetPostSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<GetPostQuery, GetPostQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<GetPostQuery, GetPostQueryVariables>(GetPostDocument, options);
        }
export type GetPostQueryHookResult = ReturnType<typeof useGetPostQuery>;
export type GetPostLazyQueryHookResult = ReturnType<typeof useGetPostLazyQuery>;
export type GetPostSuspenseQueryHookResult = ReturnType<typeof useGetPostSuspenseQuery>;
export type GetPostQueryResult = Apollo.QueryResult<GetPostQuery, GetPostQueryVariables>;
export const GetRepliesDocument = gql`
    query GetReplies($postId: String!) {
  replies(postId: $postId) {
    postId
    content
    createdAt
    editedAt
    deletedAt
    authorId
    authorDisplayName
    authorUsername
    authorAvatarObjectKey
    authorSchoolName
    linkedServiceId
    inReplyToPostId
    likesCount
    repliesCount
    likedByMe
    tags {
      id
      name
    }
    media {
      id
      fileName
      contentType
      url
      objectKey
    }
  }
}
    `;

/**
 * __useGetRepliesQuery__
 *
 * To run a query within a React component, call `useGetRepliesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetRepliesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetRepliesQuery({
 *   variables: {
 *      postId: // value for 'postId'
 *   },
 * });
 */
export function useGetRepliesQuery(baseOptions: ApolloReactHooks.QueryHookOptions<GetRepliesQuery, GetRepliesQueryVariables> & ({ variables: GetRepliesQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GetRepliesQuery, GetRepliesQueryVariables>(GetRepliesDocument, options);
      }
export function useGetRepliesLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetRepliesQuery, GetRepliesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GetRepliesQuery, GetRepliesQueryVariables>(GetRepliesDocument, options);
        }
// @ts-ignore
export function useGetRepliesSuspenseQuery(baseOptions?: ApolloReactHooks.SuspenseQueryHookOptions<GetRepliesQuery, GetRepliesQueryVariables>): ApolloReactHooks.UseSuspenseQueryResult<GetRepliesQuery, GetRepliesQueryVariables>;
export function useGetRepliesSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<GetRepliesQuery, GetRepliesQueryVariables>): ApolloReactHooks.UseSuspenseQueryResult<GetRepliesQuery | undefined, GetRepliesQueryVariables>;
export function useGetRepliesSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<GetRepliesQuery, GetRepliesQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<GetRepliesQuery, GetRepliesQueryVariables>(GetRepliesDocument, options);
        }
export type GetRepliesQueryHookResult = ReturnType<typeof useGetRepliesQuery>;
export type GetRepliesLazyQueryHookResult = ReturnType<typeof useGetRepliesLazyQuery>;
export type GetRepliesSuspenseQueryHookResult = ReturnType<typeof useGetRepliesSuspenseQuery>;
export type GetRepliesQueryResult = Apollo.QueryResult<GetRepliesQuery, GetRepliesQueryVariables>;
export const GetGlobalFeedDocument = gql`
    query GetGlobalFeed($limit: Int) {
  globalFeed(limit: $limit) {
    postId
    content
    createdAt
    editedAt
    deletedAt
    authorId
    authorDisplayName
    authorUsername
    authorAvatarObjectKey
    authorSchoolName
    linkedServiceId
    inReplyToPostId
    likesCount
    repliesCount
    likedByMe
    tags {
      id
      name
    }
    media {
      id
      fileName
      contentType
      url
      objectKey
    }
  }
}
    `;

/**
 * __useGetGlobalFeedQuery__
 *
 * To run a query within a React component, call `useGetGlobalFeedQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetGlobalFeedQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetGlobalFeedQuery({
 *   variables: {
 *      limit: // value for 'limit'
 *   },
 * });
 */
export function useGetGlobalFeedQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<GetGlobalFeedQuery, GetGlobalFeedQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GetGlobalFeedQuery, GetGlobalFeedQueryVariables>(GetGlobalFeedDocument, options);
      }
export function useGetGlobalFeedLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetGlobalFeedQuery, GetGlobalFeedQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GetGlobalFeedQuery, GetGlobalFeedQueryVariables>(GetGlobalFeedDocument, options);
        }
// @ts-ignore
export function useGetGlobalFeedSuspenseQuery(baseOptions?: ApolloReactHooks.SuspenseQueryHookOptions<GetGlobalFeedQuery, GetGlobalFeedQueryVariables>): ApolloReactHooks.UseSuspenseQueryResult<GetGlobalFeedQuery, GetGlobalFeedQueryVariables>;
export function useGetGlobalFeedSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<GetGlobalFeedQuery, GetGlobalFeedQueryVariables>): ApolloReactHooks.UseSuspenseQueryResult<GetGlobalFeedQuery | undefined, GetGlobalFeedQueryVariables>;
export function useGetGlobalFeedSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<GetGlobalFeedQuery, GetGlobalFeedQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<GetGlobalFeedQuery, GetGlobalFeedQueryVariables>(GetGlobalFeedDocument, options);
        }
export type GetGlobalFeedQueryHookResult = ReturnType<typeof useGetGlobalFeedQuery>;
export type GetGlobalFeedLazyQueryHookResult = ReturnType<typeof useGetGlobalFeedLazyQuery>;
export type GetGlobalFeedSuspenseQueryHookResult = ReturnType<typeof useGetGlobalFeedSuspenseQuery>;
export type GetGlobalFeedQueryResult = Apollo.QueryResult<GetGlobalFeedQuery, GetGlobalFeedQueryVariables>;
export const UpdatePostDocument = gql`
    mutation UpdatePost($postId: String!, $input: UpdatePostInput!) {
  updatePost(postId: $postId, input: $input) {
    postId
    content
    createdAt
    editedAt
    deletedAt
  }
}
    `;
export type UpdatePostMutationFn = Apollo.MutationFunction<UpdatePostMutation, UpdatePostMutationVariables>;

/**
 * __useUpdatePostMutation__
 *
 * To run a mutation, you first call `useUpdatePostMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdatePostMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updatePostMutation, { data, loading, error }] = useUpdatePostMutation({
 *   variables: {
 *      postId: // value for 'postId'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdatePostMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<UpdatePostMutation, UpdatePostMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<UpdatePostMutation, UpdatePostMutationVariables>(UpdatePostDocument, options);
      }
export type UpdatePostMutationHookResult = ReturnType<typeof useUpdatePostMutation>;
export type UpdatePostMutationResult = Apollo.MutationResult<UpdatePostMutation>;
export type UpdatePostMutationOptions = Apollo.BaseMutationOptions<UpdatePostMutation, UpdatePostMutationVariables>;
export const DeletePostDocument = gql`
    mutation DeletePost($postId: String!) {
  deletePost(postId: $postId)
}
    `;
export type DeletePostMutationFn = Apollo.MutationFunction<DeletePostMutation, DeletePostMutationVariables>;

/**
 * __useDeletePostMutation__
 *
 * To run a mutation, you first call `useDeletePostMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeletePostMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deletePostMutation, { data, loading, error }] = useDeletePostMutation({
 *   variables: {
 *      postId: // value for 'postId'
 *   },
 * });
 */
export function useDeletePostMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<DeletePostMutation, DeletePostMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<DeletePostMutation, DeletePostMutationVariables>(DeletePostDocument, options);
      }
export type DeletePostMutationHookResult = ReturnType<typeof useDeletePostMutation>;
export type DeletePostMutationResult = Apollo.MutationResult<DeletePostMutation>;
export type DeletePostMutationOptions = Apollo.BaseMutationOptions<DeletePostMutation, DeletePostMutationVariables>;
export const GetListingsDocument = gql`
    query GetListings {
  listings {
    id
    title
    description
    price
    status
    createdAt
    updatedAt
    accountId
    isLikedByMe
    likesCount
    account {
      displayName
      major
      trustScore
      username
      avatarObjectKey
    }
  }
}
    `;

/**
 * __useGetListingsQuery__
 *
 * To run a query within a React component, call `useGetListingsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetListingsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetListingsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetListingsQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<GetListingsQuery, GetListingsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GetListingsQuery, GetListingsQueryVariables>(GetListingsDocument, options);
      }
export function useGetListingsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetListingsQuery, GetListingsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GetListingsQuery, GetListingsQueryVariables>(GetListingsDocument, options);
        }
// @ts-ignore
export function useGetListingsSuspenseQuery(baseOptions?: ApolloReactHooks.SuspenseQueryHookOptions<GetListingsQuery, GetListingsQueryVariables>): ApolloReactHooks.UseSuspenseQueryResult<GetListingsQuery, GetListingsQueryVariables>;
export function useGetListingsSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<GetListingsQuery, GetListingsQueryVariables>): ApolloReactHooks.UseSuspenseQueryResult<GetListingsQuery | undefined, GetListingsQueryVariables>;
export function useGetListingsSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<GetListingsQuery, GetListingsQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<GetListingsQuery, GetListingsQueryVariables>(GetListingsDocument, options);
        }
export type GetListingsQueryHookResult = ReturnType<typeof useGetListingsQuery>;
export type GetListingsLazyQueryHookResult = ReturnType<typeof useGetListingsLazyQuery>;
export type GetListingsSuspenseQueryHookResult = ReturnType<typeof useGetListingsSuspenseQuery>;
export type GetListingsQueryResult = Apollo.QueryResult<GetListingsQuery, GetListingsQueryVariables>;
export const GetListingDetailDocument = gql`
    query GetListingDetail($id: ID!) {
  listing(id: $id) {
    id
    title
    description
    price
    status
    type
    isUnlimited
    deliveryTimeDays
    digitalFileObjectKey
    digitalLink
    createdAt
    updatedAt
    accountId
    isLikedByMe
    likesCount
    account {
      displayName
      major
      trustScore
      username
      avatarObjectKey
    }
    media {
      id
      fileName
      contentType
      objectKey
      url
      isPrivate
    }
    averageRating
    reviewsCount
    reviews {
      id
      rating
      comment
      createdAt
      reviewer {
        displayName
        username
        avatarObjectKey
      }
    }
  }
}
    `;

/**
 * __useGetListingDetailQuery__
 *
 * To run a query within a React component, call `useGetListingDetailQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetListingDetailQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetListingDetailQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetListingDetailQuery(baseOptions: ApolloReactHooks.QueryHookOptions<GetListingDetailQuery, GetListingDetailQueryVariables> & ({ variables: GetListingDetailQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GetListingDetailQuery, GetListingDetailQueryVariables>(GetListingDetailDocument, options);
      }
export function useGetListingDetailLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetListingDetailQuery, GetListingDetailQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GetListingDetailQuery, GetListingDetailQueryVariables>(GetListingDetailDocument, options);
        }
// @ts-ignore
export function useGetListingDetailSuspenseQuery(baseOptions?: ApolloReactHooks.SuspenseQueryHookOptions<GetListingDetailQuery, GetListingDetailQueryVariables>): ApolloReactHooks.UseSuspenseQueryResult<GetListingDetailQuery, GetListingDetailQueryVariables>;
export function useGetListingDetailSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<GetListingDetailQuery, GetListingDetailQueryVariables>): ApolloReactHooks.UseSuspenseQueryResult<GetListingDetailQuery | undefined, GetListingDetailQueryVariables>;
export function useGetListingDetailSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<GetListingDetailQuery, GetListingDetailQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<GetListingDetailQuery, GetListingDetailQueryVariables>(GetListingDetailDocument, options);
        }
export type GetListingDetailQueryHookResult = ReturnType<typeof useGetListingDetailQuery>;
export type GetListingDetailLazyQueryHookResult = ReturnType<typeof useGetListingDetailLazyQuery>;
export type GetListingDetailSuspenseQueryHookResult = ReturnType<typeof useGetListingDetailSuspenseQuery>;
export type GetListingDetailQueryResult = Apollo.QueryResult<GetListingDetailQuery, GetListingDetailQueryVariables>;
export const CreateListingDocument = gql`
    mutation CreateListing($input: CreateListingInput!) {
  createListing(input: $input) {
    id
    title
    description
    price
    status
    digitalFileObjectKey
    digitalLink
  }
}
    `;
export type CreateListingMutationFn = Apollo.MutationFunction<CreateListingMutation, CreateListingMutationVariables>;

/**
 * __useCreateListingMutation__
 *
 * To run a mutation, you first call `useCreateListingMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateListingMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createListingMutation, { data, loading, error }] = useCreateListingMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateListingMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<CreateListingMutation, CreateListingMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<CreateListingMutation, CreateListingMutationVariables>(CreateListingDocument, options);
      }
export type CreateListingMutationHookResult = ReturnType<typeof useCreateListingMutation>;
export type CreateListingMutationResult = Apollo.MutationResult<CreateListingMutation>;
export type CreateListingMutationOptions = Apollo.BaseMutationOptions<CreateListingMutation, CreateListingMutationVariables>;
export const UpdateListingDocument = gql`
    mutation UpdateListing($id: ID!, $input: UpdateListingInput!) {
  updateListing(id: $id, input: $input) {
    id
    title
    description
    price
    status
    digitalFileObjectKey
    digitalLink
    updatedAt
  }
}
    `;
export type UpdateListingMutationFn = Apollo.MutationFunction<UpdateListingMutation, UpdateListingMutationVariables>;

/**
 * __useUpdateListingMutation__
 *
 * To run a mutation, you first call `useUpdateListingMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateListingMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateListingMutation, { data, loading, error }] = useUpdateListingMutation({
 *   variables: {
 *      id: // value for 'id'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateListingMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<UpdateListingMutation, UpdateListingMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<UpdateListingMutation, UpdateListingMutationVariables>(UpdateListingDocument, options);
      }
export type UpdateListingMutationHookResult = ReturnType<typeof useUpdateListingMutation>;
export type UpdateListingMutationResult = Apollo.MutationResult<UpdateListingMutation>;
export type UpdateListingMutationOptions = Apollo.BaseMutationOptions<UpdateListingMutation, UpdateListingMutationVariables>;
export const DeleteListingDocument = gql`
    mutation DeleteListing($id: ID!) {
  deleteListing(id: $id)
}
    `;
export type DeleteListingMutationFn = Apollo.MutationFunction<DeleteListingMutation, DeleteListingMutationVariables>;

/**
 * __useDeleteListingMutation__
 *
 * To run a mutation, you first call `useDeleteListingMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteListingMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteListingMutation, { data, loading, error }] = useDeleteListingMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteListingMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<DeleteListingMutation, DeleteListingMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<DeleteListingMutation, DeleteListingMutationVariables>(DeleteListingDocument, options);
      }
export type DeleteListingMutationHookResult = ReturnType<typeof useDeleteListingMutation>;
export type DeleteListingMutationResult = Apollo.MutationResult<DeleteListingMutation>;
export type DeleteListingMutationOptions = Apollo.BaseMutationOptions<DeleteListingMutation, DeleteListingMutationVariables>;
export const ToggleLikeListingDocument = gql`
    mutation ToggleLikeListing($id: ID!) {
  toggleLikeListing(id: $id)
}
    `;
export type ToggleLikeListingMutationFn = Apollo.MutationFunction<ToggleLikeListingMutation, ToggleLikeListingMutationVariables>;

/**
 * __useToggleLikeListingMutation__
 *
 * To run a mutation, you first call `useToggleLikeListingMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useToggleLikeListingMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [toggleLikeListingMutation, { data, loading, error }] = useToggleLikeListingMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useToggleLikeListingMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<ToggleLikeListingMutation, ToggleLikeListingMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<ToggleLikeListingMutation, ToggleLikeListingMutationVariables>(ToggleLikeListingDocument, options);
      }
export type ToggleLikeListingMutationHookResult = ReturnType<typeof useToggleLikeListingMutation>;
export type ToggleLikeListingMutationResult = Apollo.MutationResult<ToggleLikeListingMutation>;
export type ToggleLikeListingMutationOptions = Apollo.BaseMutationOptions<ToggleLikeListingMutation, ToggleLikeListingMutationVariables>;
export const GetNotificationsDocument = gql`
    query GetNotifications($cursor: String, $take: Int) {
  notifications(cursor: $cursor, take: $take) {
    id
    accountId
    type
    targetType
    targetId
    isRead
    createdAt
    fromAccountId
    fromDisplayName
  }
}
    `;

/**
 * __useGetNotificationsQuery__
 *
 * To run a query within a React component, call `useGetNotificationsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetNotificationsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetNotificationsQuery({
 *   variables: {
 *      cursor: // value for 'cursor'
 *      take: // value for 'take'
 *   },
 * });
 */
export function useGetNotificationsQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<GetNotificationsQuery, GetNotificationsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GetNotificationsQuery, GetNotificationsQueryVariables>(GetNotificationsDocument, options);
      }
export function useGetNotificationsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetNotificationsQuery, GetNotificationsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GetNotificationsQuery, GetNotificationsQueryVariables>(GetNotificationsDocument, options);
        }
// @ts-ignore
export function useGetNotificationsSuspenseQuery(baseOptions?: ApolloReactHooks.SuspenseQueryHookOptions<GetNotificationsQuery, GetNotificationsQueryVariables>): ApolloReactHooks.UseSuspenseQueryResult<GetNotificationsQuery, GetNotificationsQueryVariables>;
export function useGetNotificationsSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<GetNotificationsQuery, GetNotificationsQueryVariables>): ApolloReactHooks.UseSuspenseQueryResult<GetNotificationsQuery | undefined, GetNotificationsQueryVariables>;
export function useGetNotificationsSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<GetNotificationsQuery, GetNotificationsQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<GetNotificationsQuery, GetNotificationsQueryVariables>(GetNotificationsDocument, options);
        }
export type GetNotificationsQueryHookResult = ReturnType<typeof useGetNotificationsQuery>;
export type GetNotificationsLazyQueryHookResult = ReturnType<typeof useGetNotificationsLazyQuery>;
export type GetNotificationsSuspenseQueryHookResult = ReturnType<typeof useGetNotificationsSuspenseQuery>;
export type GetNotificationsQueryResult = Apollo.QueryResult<GetNotificationsQuery, GetNotificationsQueryVariables>;
export const GetUnreadNotificationCountDocument = gql`
    query GetUnreadNotificationCount {
  unreadNotificationCount
}
    `;

/**
 * __useGetUnreadNotificationCountQuery__
 *
 * To run a query within a React component, call `useGetUnreadNotificationCountQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUnreadNotificationCountQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUnreadNotificationCountQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetUnreadNotificationCountQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<GetUnreadNotificationCountQuery, GetUnreadNotificationCountQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GetUnreadNotificationCountQuery, GetUnreadNotificationCountQueryVariables>(GetUnreadNotificationCountDocument, options);
      }
export function useGetUnreadNotificationCountLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetUnreadNotificationCountQuery, GetUnreadNotificationCountQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GetUnreadNotificationCountQuery, GetUnreadNotificationCountQueryVariables>(GetUnreadNotificationCountDocument, options);
        }
// @ts-ignore
export function useGetUnreadNotificationCountSuspenseQuery(baseOptions?: ApolloReactHooks.SuspenseQueryHookOptions<GetUnreadNotificationCountQuery, GetUnreadNotificationCountQueryVariables>): ApolloReactHooks.UseSuspenseQueryResult<GetUnreadNotificationCountQuery, GetUnreadNotificationCountQueryVariables>;
export function useGetUnreadNotificationCountSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<GetUnreadNotificationCountQuery, GetUnreadNotificationCountQueryVariables>): ApolloReactHooks.UseSuspenseQueryResult<GetUnreadNotificationCountQuery | undefined, GetUnreadNotificationCountQueryVariables>;
export function useGetUnreadNotificationCountSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<GetUnreadNotificationCountQuery, GetUnreadNotificationCountQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<GetUnreadNotificationCountQuery, GetUnreadNotificationCountQueryVariables>(GetUnreadNotificationCountDocument, options);
        }
export type GetUnreadNotificationCountQueryHookResult = ReturnType<typeof useGetUnreadNotificationCountQuery>;
export type GetUnreadNotificationCountLazyQueryHookResult = ReturnType<typeof useGetUnreadNotificationCountLazyQuery>;
export type GetUnreadNotificationCountSuspenseQueryHookResult = ReturnType<typeof useGetUnreadNotificationCountSuspenseQuery>;
export type GetUnreadNotificationCountQueryResult = Apollo.QueryResult<GetUnreadNotificationCountQuery, GetUnreadNotificationCountQueryVariables>;
export const MarkNotificationAsReadDocument = gql`
    mutation MarkNotificationAsRead($id: ID!) {
  markNotificationAsRead(id: $id)
}
    `;
export type MarkNotificationAsReadMutationFn = Apollo.MutationFunction<MarkNotificationAsReadMutation, MarkNotificationAsReadMutationVariables>;

/**
 * __useMarkNotificationAsReadMutation__
 *
 * To run a mutation, you first call `useMarkNotificationAsReadMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useMarkNotificationAsReadMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [markNotificationAsReadMutation, { data, loading, error }] = useMarkNotificationAsReadMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useMarkNotificationAsReadMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<MarkNotificationAsReadMutation, MarkNotificationAsReadMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<MarkNotificationAsReadMutation, MarkNotificationAsReadMutationVariables>(MarkNotificationAsReadDocument, options);
      }
export type MarkNotificationAsReadMutationHookResult = ReturnType<typeof useMarkNotificationAsReadMutation>;
export type MarkNotificationAsReadMutationResult = Apollo.MutationResult<MarkNotificationAsReadMutation>;
export type MarkNotificationAsReadMutationOptions = Apollo.BaseMutationOptions<MarkNotificationAsReadMutation, MarkNotificationAsReadMutationVariables>;
export const MarkAllNotificationsAsReadDocument = gql`
    mutation MarkAllNotificationsAsRead {
  markAllNotificationsAsRead
}
    `;
export type MarkAllNotificationsAsReadMutationFn = Apollo.MutationFunction<MarkAllNotificationsAsReadMutation, MarkAllNotificationsAsReadMutationVariables>;

/**
 * __useMarkAllNotificationsAsReadMutation__
 *
 * To run a mutation, you first call `useMarkAllNotificationsAsReadMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useMarkAllNotificationsAsReadMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [markAllNotificationsAsReadMutation, { data, loading, error }] = useMarkAllNotificationsAsReadMutation({
 *   variables: {
 *   },
 * });
 */
export function useMarkAllNotificationsAsReadMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<MarkAllNotificationsAsReadMutation, MarkAllNotificationsAsReadMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<MarkAllNotificationsAsReadMutation, MarkAllNotificationsAsReadMutationVariables>(MarkAllNotificationsAsReadDocument, options);
      }
export type MarkAllNotificationsAsReadMutationHookResult = ReturnType<typeof useMarkAllNotificationsAsReadMutation>;
export type MarkAllNotificationsAsReadMutationResult = Apollo.MutationResult<MarkAllNotificationsAsReadMutation>;
export type MarkAllNotificationsAsReadMutationOptions = Apollo.BaseMutationOptions<MarkAllNotificationsAsReadMutation, MarkAllNotificationsAsReadMutationVariables>;
export const GetMyOrdersDocument = gql`
    query GetMyOrders($role: String!, $status: String) {
  myOrders(role: $role, status: $status) {
    id
    status
    agreedPrice
    createdAt
    buyerAccountId
    sellerAccountId
    listingId
    isReviewable
  }
}
    `;

/**
 * __useGetMyOrdersQuery__
 *
 * To run a query within a React component, call `useGetMyOrdersQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetMyOrdersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetMyOrdersQuery({
 *   variables: {
 *      role: // value for 'role'
 *      status: // value for 'status'
 *   },
 * });
 */
export function useGetMyOrdersQuery(baseOptions: ApolloReactHooks.QueryHookOptions<GetMyOrdersQuery, GetMyOrdersQueryVariables> & ({ variables: GetMyOrdersQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GetMyOrdersQuery, GetMyOrdersQueryVariables>(GetMyOrdersDocument, options);
      }
export function useGetMyOrdersLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetMyOrdersQuery, GetMyOrdersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GetMyOrdersQuery, GetMyOrdersQueryVariables>(GetMyOrdersDocument, options);
        }
// @ts-ignore
export function useGetMyOrdersSuspenseQuery(baseOptions?: ApolloReactHooks.SuspenseQueryHookOptions<GetMyOrdersQuery, GetMyOrdersQueryVariables>): ApolloReactHooks.UseSuspenseQueryResult<GetMyOrdersQuery, GetMyOrdersQueryVariables>;
export function useGetMyOrdersSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<GetMyOrdersQuery, GetMyOrdersQueryVariables>): ApolloReactHooks.UseSuspenseQueryResult<GetMyOrdersQuery | undefined, GetMyOrdersQueryVariables>;
export function useGetMyOrdersSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<GetMyOrdersQuery, GetMyOrdersQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<GetMyOrdersQuery, GetMyOrdersQueryVariables>(GetMyOrdersDocument, options);
        }
export type GetMyOrdersQueryHookResult = ReturnType<typeof useGetMyOrdersQuery>;
export type GetMyOrdersLazyQueryHookResult = ReturnType<typeof useGetMyOrdersLazyQuery>;
export type GetMyOrdersSuspenseQueryHookResult = ReturnType<typeof useGetMyOrdersSuspenseQuery>;
export type GetMyOrdersQueryResult = Apollo.QueryResult<GetMyOrdersQuery, GetMyOrdersQueryVariables>;
export const GetOrderDetailDocument = gql`
    query GetOrderDetail($id: ID!) {
  order(id: $id) {
    id
    status
    agreedPrice
    createdAt
    buyerAccountId
    sellerAccountId
    listingId
    isReviewable
    buyer {
      id
      displayName
      username
      avatarObjectKey
    }
    seller {
      id
      displayName
      username
      avatarObjectKey
    }
    review {
      id
      rating
      comment
    }
  }
}
    `;

/**
 * __useGetOrderDetailQuery__
 *
 * To run a query within a React component, call `useGetOrderDetailQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetOrderDetailQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetOrderDetailQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetOrderDetailQuery(baseOptions: ApolloReactHooks.QueryHookOptions<GetOrderDetailQuery, GetOrderDetailQueryVariables> & ({ variables: GetOrderDetailQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GetOrderDetailQuery, GetOrderDetailQueryVariables>(GetOrderDetailDocument, options);
      }
export function useGetOrderDetailLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetOrderDetailQuery, GetOrderDetailQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GetOrderDetailQuery, GetOrderDetailQueryVariables>(GetOrderDetailDocument, options);
        }
// @ts-ignore
export function useGetOrderDetailSuspenseQuery(baseOptions?: ApolloReactHooks.SuspenseQueryHookOptions<GetOrderDetailQuery, GetOrderDetailQueryVariables>): ApolloReactHooks.UseSuspenseQueryResult<GetOrderDetailQuery, GetOrderDetailQueryVariables>;
export function useGetOrderDetailSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<GetOrderDetailQuery, GetOrderDetailQueryVariables>): ApolloReactHooks.UseSuspenseQueryResult<GetOrderDetailQuery | undefined, GetOrderDetailQueryVariables>;
export function useGetOrderDetailSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<GetOrderDetailQuery, GetOrderDetailQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<GetOrderDetailQuery, GetOrderDetailQueryVariables>(GetOrderDetailDocument, options);
        }
export type GetOrderDetailQueryHookResult = ReturnType<typeof useGetOrderDetailQuery>;
export type GetOrderDetailLazyQueryHookResult = ReturnType<typeof useGetOrderDetailLazyQuery>;
export type GetOrderDetailSuspenseQueryHookResult = ReturnType<typeof useGetOrderDetailSuspenseQuery>;
export type GetOrderDetailQueryResult = Apollo.QueryResult<GetOrderDetailQuery, GetOrderDetailQueryVariables>;
export const GetOffersForConversationDocument = gql`
    query GetOffersForConversation($conversationId: ID!) {
  offersForConversation(conversationId: $conversationId) {
    id
    conversationId
    sellerAccountId
    buyerAccountId
    listingId
    description
    proposedPrice
    deliveryTimeDays
    status
    orderId
    createdAt
  }
}
    `;

/**
 * __useGetOffersForConversationQuery__
 *
 * To run a query within a React component, call `useGetOffersForConversationQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetOffersForConversationQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetOffersForConversationQuery({
 *   variables: {
 *      conversationId: // value for 'conversationId'
 *   },
 * });
 */
export function useGetOffersForConversationQuery(baseOptions: ApolloReactHooks.QueryHookOptions<GetOffersForConversationQuery, GetOffersForConversationQueryVariables> & ({ variables: GetOffersForConversationQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GetOffersForConversationQuery, GetOffersForConversationQueryVariables>(GetOffersForConversationDocument, options);
      }
export function useGetOffersForConversationLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetOffersForConversationQuery, GetOffersForConversationQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GetOffersForConversationQuery, GetOffersForConversationQueryVariables>(GetOffersForConversationDocument, options);
        }
// @ts-ignore
export function useGetOffersForConversationSuspenseQuery(baseOptions?: ApolloReactHooks.SuspenseQueryHookOptions<GetOffersForConversationQuery, GetOffersForConversationQueryVariables>): ApolloReactHooks.UseSuspenseQueryResult<GetOffersForConversationQuery, GetOffersForConversationQueryVariables>;
export function useGetOffersForConversationSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<GetOffersForConversationQuery, GetOffersForConversationQueryVariables>): ApolloReactHooks.UseSuspenseQueryResult<GetOffersForConversationQuery | undefined, GetOffersForConversationQueryVariables>;
export function useGetOffersForConversationSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<GetOffersForConversationQuery, GetOffersForConversationQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<GetOffersForConversationQuery, GetOffersForConversationQueryVariables>(GetOffersForConversationDocument, options);
        }
export type GetOffersForConversationQueryHookResult = ReturnType<typeof useGetOffersForConversationQuery>;
export type GetOffersForConversationLazyQueryHookResult = ReturnType<typeof useGetOffersForConversationLazyQuery>;
export type GetOffersForConversationSuspenseQueryHookResult = ReturnType<typeof useGetOffersForConversationSuspenseQuery>;
export type GetOffersForConversationQueryResult = Apollo.QueryResult<GetOffersForConversationQuery, GetOffersForConversationQueryVariables>;
export const CreateOrderDocument = gql`
    mutation CreateOrder($input: CreateOrderInput!) {
  createOrder(input: $input) {
    id
    status
    agreedPrice
  }
}
    `;
export type CreateOrderMutationFn = Apollo.MutationFunction<CreateOrderMutation, CreateOrderMutationVariables>;

/**
 * __useCreateOrderMutation__
 *
 * To run a mutation, you first call `useCreateOrderMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateOrderMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createOrderMutation, { data, loading, error }] = useCreateOrderMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateOrderMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<CreateOrderMutation, CreateOrderMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<CreateOrderMutation, CreateOrderMutationVariables>(CreateOrderDocument, options);
      }
export type CreateOrderMutationHookResult = ReturnType<typeof useCreateOrderMutation>;
export type CreateOrderMutationResult = Apollo.MutationResult<CreateOrderMutation>;
export type CreateOrderMutationOptions = Apollo.BaseMutationOptions<CreateOrderMutation, CreateOrderMutationVariables>;
export const CreateOfferDocument = gql`
    mutation CreateOffer($input: CreateOfferInput!) {
  createOffer(input: $input) {
    id
    status
    proposedPrice
  }
}
    `;
export type CreateOfferMutationFn = Apollo.MutationFunction<CreateOfferMutation, CreateOfferMutationVariables>;

/**
 * __useCreateOfferMutation__
 *
 * To run a mutation, you first call `useCreateOfferMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateOfferMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createOfferMutation, { data, loading, error }] = useCreateOfferMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateOfferMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<CreateOfferMutation, CreateOfferMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<CreateOfferMutation, CreateOfferMutationVariables>(CreateOfferDocument, options);
      }
export type CreateOfferMutationHookResult = ReturnType<typeof useCreateOfferMutation>;
export type CreateOfferMutationResult = Apollo.MutationResult<CreateOfferMutation>;
export type CreateOfferMutationOptions = Apollo.BaseMutationOptions<CreateOfferMutation, CreateOfferMutationVariables>;
export const WithdrawOfferDocument = gql`
    mutation WithdrawOffer($offerId: ID!) {
  withdrawOffer(offerId: $offerId) {
    id
    status
  }
}
    `;
export type WithdrawOfferMutationFn = Apollo.MutationFunction<WithdrawOfferMutation, WithdrawOfferMutationVariables>;

/**
 * __useWithdrawOfferMutation__
 *
 * To run a mutation, you first call `useWithdrawOfferMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useWithdrawOfferMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [withdrawOfferMutation, { data, loading, error }] = useWithdrawOfferMutation({
 *   variables: {
 *      offerId: // value for 'offerId'
 *   },
 * });
 */
export function useWithdrawOfferMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<WithdrawOfferMutation, WithdrawOfferMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<WithdrawOfferMutation, WithdrawOfferMutationVariables>(WithdrawOfferDocument, options);
      }
export type WithdrawOfferMutationHookResult = ReturnType<typeof useWithdrawOfferMutation>;
export type WithdrawOfferMutationResult = Apollo.MutationResult<WithdrawOfferMutation>;
export type WithdrawOfferMutationOptions = Apollo.BaseMutationOptions<WithdrawOfferMutation, WithdrawOfferMutationVariables>;
export const AcceptOfferDocument = gql`
    mutation AcceptOffer($offerId: ID!) {
  acceptOffer(offerId: $offerId) {
    id
    status
    orderId
  }
}
    `;
export type AcceptOfferMutationFn = Apollo.MutationFunction<AcceptOfferMutation, AcceptOfferMutationVariables>;

/**
 * __useAcceptOfferMutation__
 *
 * To run a mutation, you first call `useAcceptOfferMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAcceptOfferMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [acceptOfferMutation, { data, loading, error }] = useAcceptOfferMutation({
 *   variables: {
 *      offerId: // value for 'offerId'
 *   },
 * });
 */
export function useAcceptOfferMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<AcceptOfferMutation, AcceptOfferMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<AcceptOfferMutation, AcceptOfferMutationVariables>(AcceptOfferDocument, options);
      }
export type AcceptOfferMutationHookResult = ReturnType<typeof useAcceptOfferMutation>;
export type AcceptOfferMutationResult = Apollo.MutationResult<AcceptOfferMutation>;
export type AcceptOfferMutationOptions = Apollo.BaseMutationOptions<AcceptOfferMutation, AcceptOfferMutationVariables>;
export const RejectOfferDocument = gql`
    mutation RejectOffer($offerId: ID!) {
  rejectOffer(offerId: $offerId) {
    id
    status
  }
}
    `;
export type RejectOfferMutationFn = Apollo.MutationFunction<RejectOfferMutation, RejectOfferMutationVariables>;

/**
 * __useRejectOfferMutation__
 *
 * To run a mutation, you first call `useRejectOfferMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRejectOfferMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [rejectOfferMutation, { data, loading, error }] = useRejectOfferMutation({
 *   variables: {
 *      offerId: // value for 'offerId'
 *   },
 * });
 */
export function useRejectOfferMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<RejectOfferMutation, RejectOfferMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<RejectOfferMutation, RejectOfferMutationVariables>(RejectOfferDocument, options);
      }
export type RejectOfferMutationHookResult = ReturnType<typeof useRejectOfferMutation>;
export type RejectOfferMutationResult = Apollo.MutationResult<RejectOfferMutation>;
export type RejectOfferMutationOptions = Apollo.BaseMutationOptions<RejectOfferMutation, RejectOfferMutationVariables>;
export const GetMidtransSnapTokenDocument = gql`
    mutation GetMidtransSnapToken($orderId: ID!) {
  getMidtransSnapToken(orderId: $orderId)
}
    `;
export type GetMidtransSnapTokenMutationFn = Apollo.MutationFunction<GetMidtransSnapTokenMutation, GetMidtransSnapTokenMutationVariables>;

/**
 * __useGetMidtransSnapTokenMutation__
 *
 * To run a mutation, you first call `useGetMidtransSnapTokenMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useGetMidtransSnapTokenMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [getMidtransSnapTokenMutation, { data, loading, error }] = useGetMidtransSnapTokenMutation({
 *   variables: {
 *      orderId: // value for 'orderId'
 *   },
 * });
 */
export function useGetMidtransSnapTokenMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<GetMidtransSnapTokenMutation, GetMidtransSnapTokenMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<GetMidtransSnapTokenMutation, GetMidtransSnapTokenMutationVariables>(GetMidtransSnapTokenDocument, options);
      }
export type GetMidtransSnapTokenMutationHookResult = ReturnType<typeof useGetMidtransSnapTokenMutation>;
export type GetMidtransSnapTokenMutationResult = Apollo.MutationResult<GetMidtransSnapTokenMutation>;
export type GetMidtransSnapTokenMutationOptions = Apollo.BaseMutationOptions<GetMidtransSnapTokenMutation, GetMidtransSnapTokenMutationVariables>;
export const VerifyPaymentDocument = gql`
    mutation VerifyPayment($orderId: ID!) {
  verifyPayment(orderId: $orderId)
}
    `;
export type VerifyPaymentMutationFn = Apollo.MutationFunction<VerifyPaymentMutation, VerifyPaymentMutationVariables>;

/**
 * __useVerifyPaymentMutation__
 *
 * To run a mutation, you first call `useVerifyPaymentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useVerifyPaymentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [verifyPaymentMutation, { data, loading, error }] = useVerifyPaymentMutation({
 *   variables: {
 *      orderId: // value for 'orderId'
 *   },
 * });
 */
export function useVerifyPaymentMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<VerifyPaymentMutation, VerifyPaymentMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<VerifyPaymentMutation, VerifyPaymentMutationVariables>(VerifyPaymentDocument, options);
      }
export type VerifyPaymentMutationHookResult = ReturnType<typeof useVerifyPaymentMutation>;
export type VerifyPaymentMutationResult = Apollo.MutationResult<VerifyPaymentMutation>;
export type VerifyPaymentMutationOptions = Apollo.BaseMutationOptions<VerifyPaymentMutation, VerifyPaymentMutationVariables>;
export const AdvanceOrderStatusDocument = gql`
    mutation AdvanceOrderStatus($orderId: ID!) {
  advanceOrderStatus(orderId: $orderId) {
    id
    status
  }
}
    `;
export type AdvanceOrderStatusMutationFn = Apollo.MutationFunction<AdvanceOrderStatusMutation, AdvanceOrderStatusMutationVariables>;

/**
 * __useAdvanceOrderStatusMutation__
 *
 * To run a mutation, you first call `useAdvanceOrderStatusMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAdvanceOrderStatusMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [advanceOrderStatusMutation, { data, loading, error }] = useAdvanceOrderStatusMutation({
 *   variables: {
 *      orderId: // value for 'orderId'
 *   },
 * });
 */
export function useAdvanceOrderStatusMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<AdvanceOrderStatusMutation, AdvanceOrderStatusMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<AdvanceOrderStatusMutation, AdvanceOrderStatusMutationVariables>(AdvanceOrderStatusDocument, options);
      }
export type AdvanceOrderStatusMutationHookResult = ReturnType<typeof useAdvanceOrderStatusMutation>;
export type AdvanceOrderStatusMutationResult = Apollo.MutationResult<AdvanceOrderStatusMutation>;
export type AdvanceOrderStatusMutationOptions = Apollo.BaseMutationOptions<AdvanceOrderStatusMutation, AdvanceOrderStatusMutationVariables>;
export const CancelOrderDocument = gql`
    mutation CancelOrder($orderId: ID!) {
  cancelOrder(orderId: $orderId) {
    id
    status
  }
}
    `;
export type CancelOrderMutationFn = Apollo.MutationFunction<CancelOrderMutation, CancelOrderMutationVariables>;

/**
 * __useCancelOrderMutation__
 *
 * To run a mutation, you first call `useCancelOrderMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCancelOrderMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [cancelOrderMutation, { data, loading, error }] = useCancelOrderMutation({
 *   variables: {
 *      orderId: // value for 'orderId'
 *   },
 * });
 */
export function useCancelOrderMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<CancelOrderMutation, CancelOrderMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<CancelOrderMutation, CancelOrderMutationVariables>(CancelOrderDocument, options);
      }
export type CancelOrderMutationHookResult = ReturnType<typeof useCancelOrderMutation>;
export type CancelOrderMutationResult = Apollo.MutationResult<CancelOrderMutation>;
export type CancelOrderMutationOptions = Apollo.BaseMutationOptions<CancelOrderMutation, CancelOrderMutationVariables>;
export const CreateReviewDocument = gql`
    mutation CreateReview($orderId: ID!, $rating: Float!, $comment: String) {
  createReview(orderId: $orderId, rating: $rating, comment: $comment) {
    id
    rating
    comment
  }
}
    `;
export type CreateReviewMutationFn = Apollo.MutationFunction<CreateReviewMutation, CreateReviewMutationVariables>;

/**
 * __useCreateReviewMutation__
 *
 * To run a mutation, you first call `useCreateReviewMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateReviewMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createReviewMutation, { data, loading, error }] = useCreateReviewMutation({
 *   variables: {
 *      orderId: // value for 'orderId'
 *      rating: // value for 'rating'
 *      comment: // value for 'comment'
 *   },
 * });
 */
export function useCreateReviewMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<CreateReviewMutation, CreateReviewMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<CreateReviewMutation, CreateReviewMutationVariables>(CreateReviewDocument, options);
      }
export type CreateReviewMutationHookResult = ReturnType<typeof useCreateReviewMutation>;
export type CreateReviewMutationResult = Apollo.MutationResult<CreateReviewMutation>;
export type CreateReviewMutationOptions = Apollo.BaseMutationOptions<CreateReviewMutation, CreateReviewMutationVariables>;
export const GetMyProfileDocument = gql`
    query GetMyProfile {
  myProfile {
    id
    displayName
    username
    note
    avatarObjectKey
    avatarUrl
    trustScore
    schoolName
    schoolId
    major
    majorId
    followersCount
    followingCount
    bannerObjectKey
  }
}
    `;

/**
 * __useGetMyProfileQuery__
 *
 * To run a query within a React component, call `useGetMyProfileQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetMyProfileQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetMyProfileQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetMyProfileQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<GetMyProfileQuery, GetMyProfileQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GetMyProfileQuery, GetMyProfileQueryVariables>(GetMyProfileDocument, options);
      }
export function useGetMyProfileLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetMyProfileQuery, GetMyProfileQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GetMyProfileQuery, GetMyProfileQueryVariables>(GetMyProfileDocument, options);
        }
// @ts-ignore
export function useGetMyProfileSuspenseQuery(baseOptions?: ApolloReactHooks.SuspenseQueryHookOptions<GetMyProfileQuery, GetMyProfileQueryVariables>): ApolloReactHooks.UseSuspenseQueryResult<GetMyProfileQuery, GetMyProfileQueryVariables>;
export function useGetMyProfileSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<GetMyProfileQuery, GetMyProfileQueryVariables>): ApolloReactHooks.UseSuspenseQueryResult<GetMyProfileQuery | undefined, GetMyProfileQueryVariables>;
export function useGetMyProfileSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<GetMyProfileQuery, GetMyProfileQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<GetMyProfileQuery, GetMyProfileQueryVariables>(GetMyProfileDocument, options);
        }
export type GetMyProfileQueryHookResult = ReturnType<typeof useGetMyProfileQuery>;
export type GetMyProfileLazyQueryHookResult = ReturnType<typeof useGetMyProfileLazyQuery>;
export type GetMyProfileSuspenseQueryHookResult = ReturnType<typeof useGetMyProfileSuspenseQuery>;
export type GetMyProfileQueryResult = Apollo.QueryResult<GetMyProfileQuery, GetMyProfileQueryVariables>;
export const GetUserProfileDocument = gql`
    query GetUserProfile($username: String!) {
  profile(username: $username) {
    id
    displayName
    username
    note
    avatarObjectKey
    avatarUrl
    trustScore
    isFollowing
    followersCount
    followingCount
    schoolName
    major
    bannerObjectKey
  }
}
    `;

/**
 * __useGetUserProfileQuery__
 *
 * To run a query within a React component, call `useGetUserProfileQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUserProfileQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUserProfileQuery({
 *   variables: {
 *      username: // value for 'username'
 *   },
 * });
 */
export function useGetUserProfileQuery(baseOptions: ApolloReactHooks.QueryHookOptions<GetUserProfileQuery, GetUserProfileQueryVariables> & ({ variables: GetUserProfileQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GetUserProfileQuery, GetUserProfileQueryVariables>(GetUserProfileDocument, options);
      }
export function useGetUserProfileLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetUserProfileQuery, GetUserProfileQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GetUserProfileQuery, GetUserProfileQueryVariables>(GetUserProfileDocument, options);
        }
// @ts-ignore
export function useGetUserProfileSuspenseQuery(baseOptions?: ApolloReactHooks.SuspenseQueryHookOptions<GetUserProfileQuery, GetUserProfileQueryVariables>): ApolloReactHooks.UseSuspenseQueryResult<GetUserProfileQuery, GetUserProfileQueryVariables>;
export function useGetUserProfileSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<GetUserProfileQuery, GetUserProfileQueryVariables>): ApolloReactHooks.UseSuspenseQueryResult<GetUserProfileQuery | undefined, GetUserProfileQueryVariables>;
export function useGetUserProfileSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<GetUserProfileQuery, GetUserProfileQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<GetUserProfileQuery, GetUserProfileQueryVariables>(GetUserProfileDocument, options);
        }
export type GetUserProfileQueryHookResult = ReturnType<typeof useGetUserProfileQuery>;
export type GetUserProfileLazyQueryHookResult = ReturnType<typeof useGetUserProfileLazyQuery>;
export type GetUserProfileSuspenseQueryHookResult = ReturnType<typeof useGetUserProfileSuspenseQuery>;
export type GetUserProfileQueryResult = Apollo.QueryResult<GetUserProfileQuery, GetUserProfileQueryVariables>;
export const GetListingsByAccountDocument = gql`
    query GetListingsByAccount($accountId: ID!) {
  listingsByAccount(accountId: $accountId) {
    id
    title
    description
    price
    isUnlimited
    deliveryTimeDays
    status
    type
    createdAt
    updatedAt
    media {
      id
      url
      objectKey
      fileName
      contentType
    }
  }
}
    `;

/**
 * __useGetListingsByAccountQuery__
 *
 * To run a query within a React component, call `useGetListingsByAccountQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetListingsByAccountQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetListingsByAccountQuery({
 *   variables: {
 *      accountId: // value for 'accountId'
 *   },
 * });
 */
export function useGetListingsByAccountQuery(baseOptions: ApolloReactHooks.QueryHookOptions<GetListingsByAccountQuery, GetListingsByAccountQueryVariables> & ({ variables: GetListingsByAccountQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GetListingsByAccountQuery, GetListingsByAccountQueryVariables>(GetListingsByAccountDocument, options);
      }
export function useGetListingsByAccountLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetListingsByAccountQuery, GetListingsByAccountQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GetListingsByAccountQuery, GetListingsByAccountQueryVariables>(GetListingsByAccountDocument, options);
        }
// @ts-ignore
export function useGetListingsByAccountSuspenseQuery(baseOptions?: ApolloReactHooks.SuspenseQueryHookOptions<GetListingsByAccountQuery, GetListingsByAccountQueryVariables>): ApolloReactHooks.UseSuspenseQueryResult<GetListingsByAccountQuery, GetListingsByAccountQueryVariables>;
export function useGetListingsByAccountSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<GetListingsByAccountQuery, GetListingsByAccountQueryVariables>): ApolloReactHooks.UseSuspenseQueryResult<GetListingsByAccountQuery | undefined, GetListingsByAccountQueryVariables>;
export function useGetListingsByAccountSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<GetListingsByAccountQuery, GetListingsByAccountQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<GetListingsByAccountQuery, GetListingsByAccountQueryVariables>(GetListingsByAccountDocument, options);
        }
export type GetListingsByAccountQueryHookResult = ReturnType<typeof useGetListingsByAccountQuery>;
export type GetListingsByAccountLazyQueryHookResult = ReturnType<typeof useGetListingsByAccountLazyQuery>;
export type GetListingsByAccountSuspenseQueryHookResult = ReturnType<typeof useGetListingsByAccountSuspenseQuery>;
export type GetListingsByAccountQueryResult = Apollo.QueryResult<GetListingsByAccountQuery, GetListingsByAccountQueryVariables>;
export const FollowAccountDocument = gql`
    mutation FollowAccount($targetAccountId: ID!) {
  follow(targetAccountId: $targetAccountId)
}
    `;
export type FollowAccountMutationFn = Apollo.MutationFunction<FollowAccountMutation, FollowAccountMutationVariables>;

/**
 * __useFollowAccountMutation__
 *
 * To run a mutation, you first call `useFollowAccountMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useFollowAccountMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [followAccountMutation, { data, loading, error }] = useFollowAccountMutation({
 *   variables: {
 *      targetAccountId: // value for 'targetAccountId'
 *   },
 * });
 */
export function useFollowAccountMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<FollowAccountMutation, FollowAccountMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<FollowAccountMutation, FollowAccountMutationVariables>(FollowAccountDocument, options);
      }
export type FollowAccountMutationHookResult = ReturnType<typeof useFollowAccountMutation>;
export type FollowAccountMutationResult = Apollo.MutationResult<FollowAccountMutation>;
export type FollowAccountMutationOptions = Apollo.BaseMutationOptions<FollowAccountMutation, FollowAccountMutationVariables>;
export const UnfollowAccountDocument = gql`
    mutation UnfollowAccount($targetAccountId: ID!) {
  unfollow(targetAccountId: $targetAccountId)
}
    `;
export type UnfollowAccountMutationFn = Apollo.MutationFunction<UnfollowAccountMutation, UnfollowAccountMutationVariables>;

/**
 * __useUnfollowAccountMutation__
 *
 * To run a mutation, you first call `useUnfollowAccountMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUnfollowAccountMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [unfollowAccountMutation, { data, loading, error }] = useUnfollowAccountMutation({
 *   variables: {
 *      targetAccountId: // value for 'targetAccountId'
 *   },
 * });
 */
export function useUnfollowAccountMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<UnfollowAccountMutation, UnfollowAccountMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<UnfollowAccountMutation, UnfollowAccountMutationVariables>(UnfollowAccountDocument, options);
      }
export type UnfollowAccountMutationHookResult = ReturnType<typeof useUnfollowAccountMutation>;
export type UnfollowAccountMutationResult = Apollo.MutationResult<UnfollowAccountMutation>;
export type UnfollowAccountMutationOptions = Apollo.BaseMutationOptions<UnfollowAccountMutation, UnfollowAccountMutationVariables>;
export const UpdateProfileDocument = gql`
    mutation UpdateProfile($input: UpdateProfileInput!) {
  updateProfile(input: $input) {
    id
    displayName
    username
    note
    avatarObjectKey
    avatarUrl
    major
    majorId
    bannerObjectKey
  }
}
    `;
export type UpdateProfileMutationFn = Apollo.MutationFunction<UpdateProfileMutation, UpdateProfileMutationVariables>;

/**
 * __useUpdateProfileMutation__
 *
 * To run a mutation, you first call `useUpdateProfileMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateProfileMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateProfileMutation, { data, loading, error }] = useUpdateProfileMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateProfileMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<UpdateProfileMutation, UpdateProfileMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<UpdateProfileMutation, UpdateProfileMutationVariables>(UpdateProfileDocument, options);
      }
export type UpdateProfileMutationHookResult = ReturnType<typeof useUpdateProfileMutation>;
export type UpdateProfileMutationResult = Apollo.MutationResult<UpdateProfileMutation>;
export type UpdateProfileMutationOptions = Apollo.BaseMutationOptions<UpdateProfileMutation, UpdateProfileMutationVariables>;
export const GetPostsByAccountDocument = gql`
    query GetPostsByAccount($accountId: String!) {
  postsByAccount(accountId: $accountId) {
    postId
    content
    createdAt
    deletedAt
    authorId
    authorDisplayName
    authorUsername
    authorAvatarObjectKey
    authorSchoolName
    linkedServiceId
    inReplyToPostId
    likesCount
    repliesCount
    likedByMe
    tags {
      id
      name
    }
    media {
      id
      fileName
      contentType
      url
      objectKey
    }
  }
}
    `;

/**
 * __useGetPostsByAccountQuery__
 *
 * To run a query within a React component, call `useGetPostsByAccountQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPostsByAccountQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPostsByAccountQuery({
 *   variables: {
 *      accountId: // value for 'accountId'
 *   },
 * });
 */
export function useGetPostsByAccountQuery(baseOptions: ApolloReactHooks.QueryHookOptions<GetPostsByAccountQuery, GetPostsByAccountQueryVariables> & ({ variables: GetPostsByAccountQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GetPostsByAccountQuery, GetPostsByAccountQueryVariables>(GetPostsByAccountDocument, options);
      }
export function useGetPostsByAccountLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetPostsByAccountQuery, GetPostsByAccountQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GetPostsByAccountQuery, GetPostsByAccountQueryVariables>(GetPostsByAccountDocument, options);
        }
// @ts-ignore
export function useGetPostsByAccountSuspenseQuery(baseOptions?: ApolloReactHooks.SuspenseQueryHookOptions<GetPostsByAccountQuery, GetPostsByAccountQueryVariables>): ApolloReactHooks.UseSuspenseQueryResult<GetPostsByAccountQuery, GetPostsByAccountQueryVariables>;
export function useGetPostsByAccountSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<GetPostsByAccountQuery, GetPostsByAccountQueryVariables>): ApolloReactHooks.UseSuspenseQueryResult<GetPostsByAccountQuery | undefined, GetPostsByAccountQueryVariables>;
export function useGetPostsByAccountSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<GetPostsByAccountQuery, GetPostsByAccountQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<GetPostsByAccountQuery, GetPostsByAccountQueryVariables>(GetPostsByAccountDocument, options);
        }
export type GetPostsByAccountQueryHookResult = ReturnType<typeof useGetPostsByAccountQuery>;
export type GetPostsByAccountLazyQueryHookResult = ReturnType<typeof useGetPostsByAccountLazyQuery>;
export type GetPostsByAccountSuspenseQueryHookResult = ReturnType<typeof useGetPostsByAccountSuspenseQuery>;
export type GetPostsByAccountQueryResult = Apollo.QueryResult<GetPostsByAccountQuery, GetPostsByAccountQueryVariables>;
export const GetRepliesByAccountDocument = gql`
    query GetRepliesByAccount($accountId: String!) {
  repliesByAccount(accountId: $accountId) {
    postId
    content
    createdAt
    deletedAt
    authorId
    authorDisplayName
    authorUsername
    authorAvatarObjectKey
    authorSchoolName
    linkedServiceId
    inReplyToPostId
    likesCount
    repliesCount
    likedByMe
    tags {
      id
      name
    }
    media {
      id
      fileName
      contentType
      url
      objectKey
    }
  }
}
    `;

/**
 * __useGetRepliesByAccountQuery__
 *
 * To run a query within a React component, call `useGetRepliesByAccountQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetRepliesByAccountQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetRepliesByAccountQuery({
 *   variables: {
 *      accountId: // value for 'accountId'
 *   },
 * });
 */
export function useGetRepliesByAccountQuery(baseOptions: ApolloReactHooks.QueryHookOptions<GetRepliesByAccountQuery, GetRepliesByAccountQueryVariables> & ({ variables: GetRepliesByAccountQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GetRepliesByAccountQuery, GetRepliesByAccountQueryVariables>(GetRepliesByAccountDocument, options);
      }
export function useGetRepliesByAccountLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetRepliesByAccountQuery, GetRepliesByAccountQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GetRepliesByAccountQuery, GetRepliesByAccountQueryVariables>(GetRepliesByAccountDocument, options);
        }
// @ts-ignore
export function useGetRepliesByAccountSuspenseQuery(baseOptions?: ApolloReactHooks.SuspenseQueryHookOptions<GetRepliesByAccountQuery, GetRepliesByAccountQueryVariables>): ApolloReactHooks.UseSuspenseQueryResult<GetRepliesByAccountQuery, GetRepliesByAccountQueryVariables>;
export function useGetRepliesByAccountSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<GetRepliesByAccountQuery, GetRepliesByAccountQueryVariables>): ApolloReactHooks.UseSuspenseQueryResult<GetRepliesByAccountQuery | undefined, GetRepliesByAccountQueryVariables>;
export function useGetRepliesByAccountSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<GetRepliesByAccountQuery, GetRepliesByAccountQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<GetRepliesByAccountQuery, GetRepliesByAccountQueryVariables>(GetRepliesByAccountDocument, options);
        }
export type GetRepliesByAccountQueryHookResult = ReturnType<typeof useGetRepliesByAccountQuery>;
export type GetRepliesByAccountLazyQueryHookResult = ReturnType<typeof useGetRepliesByAccountLazyQuery>;
export type GetRepliesByAccountSuspenseQueryHookResult = ReturnType<typeof useGetRepliesByAccountSuspenseQuery>;
export type GetRepliesByAccountQueryResult = Apollo.QueryResult<GetRepliesByAccountQuery, GetRepliesByAccountQueryVariables>;
export const GetLikedListingsDocument = gql`
    query GetLikedListings {
  likedListings {
    id
    title
    description
    price
    status
    type
    isUnlimited
    deliveryTimeDays
    createdAt
    updatedAt
    accountId
    isLikedByMe
    likesCount
    account {
      displayName
      major
      trustScore
      username
      avatarObjectKey
    }
    media {
      id
      fileName
      contentType
      objectKey
      url
      isPrivate
    }
  }
}
    `;

/**
 * __useGetLikedListingsQuery__
 *
 * To run a query within a React component, call `useGetLikedListingsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetLikedListingsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetLikedListingsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetLikedListingsQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<GetLikedListingsQuery, GetLikedListingsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GetLikedListingsQuery, GetLikedListingsQueryVariables>(GetLikedListingsDocument, options);
      }
export function useGetLikedListingsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetLikedListingsQuery, GetLikedListingsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GetLikedListingsQuery, GetLikedListingsQueryVariables>(GetLikedListingsDocument, options);
        }
// @ts-ignore
export function useGetLikedListingsSuspenseQuery(baseOptions?: ApolloReactHooks.SuspenseQueryHookOptions<GetLikedListingsQuery, GetLikedListingsQueryVariables>): ApolloReactHooks.UseSuspenseQueryResult<GetLikedListingsQuery, GetLikedListingsQueryVariables>;
export function useGetLikedListingsSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<GetLikedListingsQuery, GetLikedListingsQueryVariables>): ApolloReactHooks.UseSuspenseQueryResult<GetLikedListingsQuery | undefined, GetLikedListingsQueryVariables>;
export function useGetLikedListingsSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<GetLikedListingsQuery, GetLikedListingsQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<GetLikedListingsQuery, GetLikedListingsQueryVariables>(GetLikedListingsDocument, options);
        }
export type GetLikedListingsQueryHookResult = ReturnType<typeof useGetLikedListingsQuery>;
export type GetLikedListingsLazyQueryHookResult = ReturnType<typeof useGetLikedListingsLazyQuery>;
export type GetLikedListingsSuspenseQueryHookResult = ReturnType<typeof useGetLikedListingsSuspenseQuery>;
export type GetLikedListingsQueryResult = Apollo.QueryResult<GetLikedListingsQuery, GetLikedListingsQueryVariables>;
export const GetLikedPostsDocument = gql`
    query GetLikedPosts {
  likedPosts {
    postId
    content
    createdAt
    authorId
    authorDisplayName
    authorUsername
    authorAvatarObjectKey
    authorSchoolName
    linkedServiceId
    inReplyToPostId
    likesCount
    repliesCount
    likedByMe
    tags {
      id
      name
    }
    media {
      id
      fileName
      contentType
      url
      objectKey
    }
  }
}
    `;

/**
 * __useGetLikedPostsQuery__
 *
 * To run a query within a React component, call `useGetLikedPostsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetLikedPostsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetLikedPostsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetLikedPostsQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<GetLikedPostsQuery, GetLikedPostsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GetLikedPostsQuery, GetLikedPostsQueryVariables>(GetLikedPostsDocument, options);
      }
export function useGetLikedPostsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetLikedPostsQuery, GetLikedPostsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GetLikedPostsQuery, GetLikedPostsQueryVariables>(GetLikedPostsDocument, options);
        }
// @ts-ignore
export function useGetLikedPostsSuspenseQuery(baseOptions?: ApolloReactHooks.SuspenseQueryHookOptions<GetLikedPostsQuery, GetLikedPostsQueryVariables>): ApolloReactHooks.UseSuspenseQueryResult<GetLikedPostsQuery, GetLikedPostsQueryVariables>;
export function useGetLikedPostsSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<GetLikedPostsQuery, GetLikedPostsQueryVariables>): ApolloReactHooks.UseSuspenseQueryResult<GetLikedPostsQuery | undefined, GetLikedPostsQueryVariables>;
export function useGetLikedPostsSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<GetLikedPostsQuery, GetLikedPostsQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<GetLikedPostsQuery, GetLikedPostsQueryVariables>(GetLikedPostsDocument, options);
        }
export type GetLikedPostsQueryHookResult = ReturnType<typeof useGetLikedPostsQuery>;
export type GetLikedPostsLazyQueryHookResult = ReturnType<typeof useGetLikedPostsLazyQuery>;
export type GetLikedPostsSuspenseQueryHookResult = ReturnType<typeof useGetLikedPostsSuspenseQuery>;
export type GetLikedPostsQueryResult = Apollo.QueryResult<GetLikedPostsQuery, GetLikedPostsQueryVariables>;