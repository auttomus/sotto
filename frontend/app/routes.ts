import { type RouteConfig, route, index, layout } from "@react-router/dev/routes";

export default [
  layout("routes/_main.tsx", [
    index("routes/_main._index.tsx"),
    route("explore", "routes/_main.explore.tsx"),
    route("profile", "routes/_main.profile.tsx"),
    route("profile/:username", "routes/_main.profile.$username.tsx"),
    route("chats", "routes/_main.chats.tsx"),
    route("orders", "routes/_main.orders.tsx"),
    route("listing/:id", "routes/_main.listing.$id.tsx"),
    route("post/:postId", "routes/_main.post.$postId.tsx"),
  ]),
  route("login", "routes/login.tsx"),
  route("register", "routes/register.tsx"),
  route("workspace/chat/:conversationId", "routes/workspace.chat.$conversationId.tsx"),
  route("workspace/order/:orderId", "routes/workspace.order.$orderId.tsx"),
  route("workspace/create", "routes/workspace.create.tsx"),
] satisfies RouteConfig;
