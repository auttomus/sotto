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


export type GetConversationsQuery = { conversations: Array<{ id: string, type: Types.ConversationType, createdAt: string, updatedAt: string, participants: Array<{ accountId: string, displayName: string, avatarObjectKey: string | null }> | null, activeOrder: { id: string, status: Types.OrderStatus, agreedPrice: number, createdAt: string } | null }> };

export type GetMessagesQueryVariables = Exact<{
  conversationId: string | number;
  limit?: number | null | undefined;
}>;


export type GetMessagesQuery = { messages: Array<{ messageId: string, senderId: string, content: string, createdAt: string, media: Array<{ id: string, fileName: string, contentType: string, url: string | null }> | null }> };

export type CreateConversationMutationVariables = Exact<{
  input: Types.CreateConversationInput;
}>;


export type CreateConversationMutation = { createConversation: { id: string, type: Types.ConversationType, createdAt: string } };

export type SearchAccountsQueryVariables = Exact<{
  query: string;
}>;


export type SearchAccountsQuery = { searchAccounts: Array<{ id: string, displayName: string, username: string, avatarObjectKey: string | null }> };

export type SearchListingsQueryVariables = Exact<{
  query: string;
}>;


export type SearchListingsQuery = { searchListings: Array<{ id: string, title: string, type: Types.ListingType, price: number, media: Array<{ objectKey: string, url: string | null }> | null }> };

export type GetFeedQueryVariables = Exact<{
  limit?: number | null | undefined;
}>;


export type GetFeedQuery = { feed: Array<{ postId: string, content: string, createdAt: string, authorId: string, authorDisplayName: string | null, authorUsername: string | null, authorAvatarObjectKey: string | null, authorSchoolName: string | null, linkedServiceId: string | null, inReplyToPostId: string | null, media: Array<{ id: string, fileName: string, contentType: string, url: string | null, objectKey: string }> | null }> };

export type CreatePostMutationVariables = Exact<{
  input: Types.CreatePostInput;
}>;


export type CreatePostMutation = { createPost: { postId: string, content: string, createdAt: string, authorId: string, authorDisplayName: string | null, authorUsername: string | null, authorAvatarObjectKey: string | null, authorSchoolName: string | null, linkedServiceId: string | null, media: Array<{ id: string, fileName: string, contentType: string, url: string | null, objectKey: string }> | null } };

export type GetListingsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetListingsQuery = { listings: Array<{ id: string, title: string, description: string, price: number, status: Types.ListingStatus, createdAt: string, accountId: string, account: { displayName: string, major: string | null, trustScore: number, username: string | null } | null }> };

export type GetListingDetailQueryVariables = Exact<{
  id: string | number;
}>;


export type GetListingDetailQuery = { listing: { id: string, title: string, description: string, price: number, status: Types.ListingStatus, type: Types.ListingType, isUnlimited: boolean, deliveryTimeDays: number | null, createdAt: string, accountId: string, account: { displayName: string, major: string | null, trustScore: number, username: string | null } | null, media: Array<{ id: string, fileName: string, contentType: string, objectKey: string, url: string | null, isPrivate: boolean }> | null } | null };

export type CreateListingMutationVariables = Exact<{
  input: Types.CreateListingInput;
}>;


export type CreateListingMutation = { createListing: { id: string, title: string, description: string, price: number, status: Types.ListingStatus } };

export type UpdateListingMutationVariables = Exact<{
  id: string | number;
  input: Types.UpdateListingInput;
}>;


export type UpdateListingMutation = { updateListing: { id: string, title: string, description: string, price: number, status: Types.ListingStatus } };

export type DeleteListingMutationVariables = Exact<{
  id: string | number;
}>;


export type DeleteListingMutation = { deleteListing: boolean };

export type GetMyOrdersQueryVariables = Exact<{
  role: string;
  status?: string | null | undefined;
}>;


export type GetMyOrdersQuery = { myOrders: Array<{ id: string, status: Types.OrderStatus, agreedPrice: number, createdAt: string, buyerAccountId: string, sellerAccountId: string, listingId: string }> };

export type GetOrderDetailQueryVariables = Exact<{
  id: string | number;
}>;


export type GetOrderDetailQuery = { order: { id: string, status: Types.OrderStatus, agreedPrice: number, createdAt: string, buyerAccountId: string, sellerAccountId: string, listingId: string } | null };

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


export type AcceptOfferMutation = { acceptOffer: { id: string, status: Types.OfferStatus } };

export type RejectOfferMutationVariables = Exact<{
  offerId: string | number;
}>;


export type RejectOfferMutation = { rejectOffer: { id: string, status: Types.OfferStatus } };

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


export type GetMyProfileQuery = { myProfile: { id: string, displayName: string, username: string, note: string | null, avatarObjectKey: string | null, avatarUrl: string | null, trustScore: number, schoolName: string | null, schoolId: string | null, major: string | null, majorId: string | null, followersCount: string, followingCount: string } };

export type GetUserProfileQueryVariables = Exact<{
  username: string;
}>;


export type GetUserProfileQuery = { profile: { id: string, displayName: string, username: string, note: string | null, avatarObjectKey: string | null, avatarUrl: string | null, trustScore: number, isFollowing: boolean | null, followersCount: string, followingCount: string, schoolName: string | null, major: string | null } | null };

export type GetListingsByAccountQueryVariables = Exact<{
  accountId: string | number;
}>;


export type GetListingsByAccountQuery = { listingsByAccount: Array<{ id: string, title: string, description: string, price: number, isUnlimited: boolean, deliveryTimeDays: number | null, status: Types.ListingStatus, type: Types.ListingType, media: Array<{ id: string, url: string | null, objectKey: string, fileName: string, contentType: string }> | null }> };

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


export type UpdateProfileMutation = { updateProfile: { id: string, displayName: string, username: string, note: string | null, avatarObjectKey: string | null, avatarUrl: string | null, major: string | null, majorId: string | null } };


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
    }
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
export const SearchAccountsDocument = gql`
    query SearchAccounts($query: String!) {
  searchAccounts(query: $query) {
    id
    displayName
    username
    avatarObjectKey
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
export const GetFeedDocument = gql`
    query GetFeed($limit: Int) {
  feed(limit: $limit) {
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
export const GetListingsDocument = gql`
    query GetListings {
  listings {
    id
    title
    description
    price
    status
    createdAt
    accountId
    account {
      displayName
      major
      trustScore
      username
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
    createdAt
    accountId
    account {
      displayName
      major
      trustScore
      username
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