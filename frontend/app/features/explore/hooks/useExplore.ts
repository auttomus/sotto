import { useState } from "react";
import { useSearchAccountsQuery, useSearchListingsQuery } from "~/core/apollo/generated";
import { useDebounce } from "~/core/hooks/useDebounce";

export function useExplore() {
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedQuery = useDebounce(searchQuery, 500);

  const isSearching = debouncedQuery.length > 0;

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

  // Default queries when not searching (fetch all/recommended)
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

  const isLoading = isSearching 
    ? (accountsLoading || listingsLoading) 
    : (defaultAccountsLoading || defaultListingsLoading);

  const error = isSearching 
    ? (accountsError || listingsError) 
    : (defaultAccountsError || defaultListingsError);

  const searchResults = {
    accounts: isSearching 
      ? (accountsData?.searchAccounts || []) 
      : (defaultAccountsData?.searchAccounts || []),
    listings: isSearching 
      ? (listingsData?.searchListings || []) 
      : (defaultListingsData?.searchListings || []),
  };

  return {
    activeCategory,
    setActiveCategory,
    searchQuery,
    setSearchQuery,
    debouncedQuery,
    isSearching,
    isLoading,
    error,
    searchResults
  };
}
