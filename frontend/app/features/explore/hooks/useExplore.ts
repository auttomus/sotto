import { useSearchParams } from "react-router";
import { 
  useSearchAccountsQuery, 
  useSearchListingsQuery,
  useSearchPostsQuery,
  useSearchTagsQuery,
  useGetMyProfileQuery
} from "~/core/apollo/generated";
import { useDebounce } from "~/core/hooks/useDebounce";

export function useExplore() {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get("query") || "";
  const debouncedQuery = useDebounce(searchQuery, 500);

  const isSearching = debouncedQuery.length > 0;

  const setSearchQuery = (newQuery: string) => {
    setSearchParams(
      (prev) => {
        if (newQuery) {
          prev.set("query", newQuery);
        } else {
          prev.delete("query");
        }
        return prev;
      },
      { replace: true }
    );
  };

  // Profil user saat ini untuk menyembunyikan akun sendiri dari rekomendasi
  const { data: myProfileData } = useGetMyProfileQuery({
    fetchPolicy: "cache-first"
  });
  const myAccountId = myProfileData?.myProfile?.id;

  // Real-time search queries
  const { 
    data: accountsData, 
    loading: accountsLoading,
    error: accountsError
  } = useSearchAccountsQuery({
    variables: { query: debouncedQuery },
    skip: !isSearching,
    fetchPolicy: "cache-and-network"
  });

  const { 
    data: listingsData, 
    loading: listingsLoading,
    error: listingsError
  } = useSearchListingsQuery({
    variables: { query: debouncedQuery },
    skip: !isSearching,
    fetchPolicy: "cache-and-network"
  });

  const {
    data: postsData,
    loading: postsLoading,
    error: postsError
  } = useSearchPostsQuery({
    variables: { query: debouncedQuery },
    skip: !isSearching,
    fetchPolicy: "cache-and-network"
  });

  const {
    data: tagsData,
    loading: tagsLoading,
    error: tagsError
  } = useSearchTagsQuery({
    variables: { query: debouncedQuery },
    skip: !isSearching,
    fetchPolicy: "cache-and-network"
  });

  // Default queries ketika tidak melakukan pencarian (rekomendasi)
  const { 
    data: defaultAccountsData, 
    loading: defaultAccountsLoading,
    error: defaultAccountsError
  } = useSearchAccountsQuery({
    variables: { query: "" },
    skip: isSearching,
    fetchPolicy: "cache-first"
  });

  const { 
    data: defaultListingsData, 
    loading: defaultListingsLoading,
    error: defaultListingsError
  } = useSearchListingsQuery({
    variables: { query: "" },
    skip: isSearching,
    fetchPolicy: "cache-first"
  });

  const {
    data: defaultPostsData,
    loading: defaultPostsLoading,
    error: defaultPostsError
  } = useSearchPostsQuery({
    variables: { query: "" },
    skip: isSearching,
    fetchPolicy: "cache-first"
  });

  const {
    data: defaultTagsData,
    loading: defaultTagsLoading,
    error: defaultTagsError
  } = useSearchTagsQuery({
    variables: { query: "" },
    skip: isSearching,
    fetchPolicy: "cache-first"
  });

  const isLoading = isSearching 
    ? (accountsLoading || listingsLoading || postsLoading || tagsLoading) 
    : (defaultAccountsLoading || defaultListingsLoading || defaultPostsLoading || defaultTagsLoading);

  const error = isSearching 
    ? (accountsError || listingsError || postsError || tagsError) 
    : (defaultAccountsError || defaultListingsError || defaultPostsError || defaultTagsError);

  const searchResults = {
    accounts: isSearching 
      ? (accountsData?.searchAccounts || []) 
      : (defaultAccountsData?.searchAccounts || []).filter(acc => acc.id !== myAccountId),
    listings: (isSearching 
      ? (listingsData?.searchListings || []) 
      : (defaultListingsData?.searchListings || [])).slice(0, 5),
    posts: (isSearching
      ? (postsData?.searchPosts || [])
      : (defaultPostsData?.searchPosts || [])).slice(0, 5),
    tags: (isSearching
      ? (tagsData?.searchTags || [])
      : (defaultTagsData?.searchTags || [])).slice(0, 10),
  };

  return {
    searchQuery,
    setSearchQuery,
    debouncedQuery,
    isSearching,
    isLoading,
    error,
    searchResults
  };
}
