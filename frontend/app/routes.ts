import { type RouteConfig, route, index, layout } from "@react-router/dev/routes";

export default [
  layout("routes/_main.tsx", [
    index("routes/_main._index.tsx"),
    route("explore", "routes/_main.explore.tsx"),
    route("profile", "routes/_main.profile.tsx"),
  ]),
  route("login", "routes/login.tsx"),
  route("register", "routes/register.tsx"),
  route("workspace/chat", "routes/workspace.chat.tsx"),
  route("workspace/order", "routes/workspace.order.tsx"),
  route("workspace/create", "routes/workspace.create.tsx"),
] satisfies RouteConfig;
