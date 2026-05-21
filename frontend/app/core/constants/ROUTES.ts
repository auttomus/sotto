/**
 * Centralized route path constants.
 * Use these instead of hardcoded strings across the app.
 */
export const ROUTES = {
  // Main (with BottomNav)
  HOME: '/',
  EXPLORE: '/explore',
  CHATS: '/chats',
  ORDERS: '/orders',
  PROFILE: '/profile',

  // Dynamic
  PROFILE_PUBLIC: (username: string) => `/profile/${username}` as const,
  LISTING_DETAIL: (id: string) => `/listing/${id}` as const,
  POST_DETAIL: (postId: string) => `/post/${postId}` as const,

  // Workspace (fullscreen, no BottomNav)
  WORKSPACE_CHAT: (conversationId: string) => `/workspace/chat/${conversationId}` as const,
  WORKSPACE_ORDER: (orderId: string) => `/workspace/order/${orderId}` as const,
  WORKSPACE_CREATE: '/workspace/create',

  // Auth
  LOGIN: '/login',
  REGISTER: '/register',
} as const;
