import '@apollo/client';
import * as reactApollo from '@apollo/client/react';

declare module '@apollo/client' {
  // Re-export all react hooks and components that are missing when resolving to core
  export const useQuery: typeof reactApollo.useQuery;
  export const useLazyQuery: typeof reactApollo.useLazyQuery;
  export const useSuspenseQuery: typeof reactApollo.useSuspenseQuery;
  export const useMutation: typeof reactApollo.useMutation;
  export const useSubscription: typeof reactApollo.useSubscription;
  export const skipToken: typeof reactApollo.skipToken;
  export type SkipToken = reactApollo.SkipToken;

  export type QueryHookOptions<TData = any, TVariables = any> = reactApollo.QueryHookOptions<TData, TVariables>;
  export type LazyQueryHookOptions<TData = any, TVariables = any> = reactApollo.LazyQueryHookOptions<TData, TVariables>;
  export type SuspenseQueryHookOptions<TData = any, TVariables = any> = reactApollo.SuspenseQueryHookOptions<TData, TVariables>;
  export type MutationHookOptions<TData = any, TVariables = any> = reactApollo.MutationHookOptions<TData, TVariables>;
  export type SubscriptionHookOptions<TData = any, TVariables = any> = reactApollo.SubscriptionHookOptions<TData, TVariables>;

  export type MutationFunction<TData = any, TVariables = any> = reactApollo.MutationFunction<TData, TVariables>;
  export type MutationResult<TData = any> = reactApollo.MutationResult<TData>;
  export type QueryResult<TData = any, TVariables = any> = reactApollo.QueryResult<TData, TVariables>;
  export type LazyQueryResult<TData = any, TVariables = any> = reactApollo.LazyQueryResult<TData, TVariables>;
  export type UseSuspenseQueryResult<TData = any, TVariables = any> = reactApollo.UseSuspenseQueryResult<TData, TVariables>;

  // Restore BaseMutationOptions and BaseQueryOptions removed in Apollo Client v4
  export type BaseMutationOptions<TData = any, TVariables = any> = MutationOptions<TData, TVariables>;
  export type BaseQueryOptions<TVariables = any> = QueryOptions<TVariables>;
}
