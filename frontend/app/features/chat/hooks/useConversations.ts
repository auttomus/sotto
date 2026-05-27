import { useGetConversationsQuery } from "~/core/apollo/generated";
import { useAuthStore } from "~/core/store/useAuthStore";

export function useConversations() {
  const { user } = useAuthStore();
  const { data, loading, error } = useGetConversationsQuery({
    fetchPolicy: "cache-and-network"
  });

  const chats = data?.conversations || [];

  return {
    chats,
    loading,
    error,
    user
  };
}
