import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  ApolloLink,
} from '@apollo/client';
import { useAuthStore } from '~/core/store/useAuthStore';

const isDockerOrProd = typeof window !== 'undefined' && (window.location.port === '8080' || !window.location.port);
const httpLink = new HttpLink({
  uri: isDockerOrProd
    ? `${window.location.origin}/graphql`
    : import.meta.env.VITE_GRAPHQL_URL || 'http://localhost:3000/graphql',
});

const authLink = new ApolloLink((operation, forward) => {
  const token = useAuthStore.getState().token;

  operation.setContext(({ headers = {} }) => ({
    headers: {
      ...headers,
      ...(token ? { authorization: `Bearer ${token}` } : {}),
    },
  }));

  return forward(operation);
});

export const apolloClient = new ApolloClient({
  link: ApolloLink.from([authLink, httpLink]),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          feed: {
            keyArgs: false,
            merge(existing, incoming) {
              return incoming;
            },
          },
        },
      },
    },
  }),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
    },
  },
});
