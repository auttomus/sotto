<<<<<<< HEAD
import { type RouteConfig, route, layout, index } from "@react-router/dev/routes";
=======
import { type RouteConfig, route, index, layout } from "@react-router/dev/routes";
>>>>>>> origin/frontend-fix

export default [
  layout("routes/_main.tsx", [
    index("routes/_main._index.tsx"),
    route("explore", "routes/_main.explore.tsx"),
    route("profile", "routes/_main.profile.tsx"),
<<<<<<< HEAD
=======
    route("chats", "routes/_main.chats.tsx"),
    route("orders", "routes/_main.orders.tsx"),
>>>>>>> origin/frontend-fix
  ]),
  route("login", "routes/login.tsx"),
  route("register", "routes/register.tsx"),
  route("workspace/chat", "routes/workspace.chat.tsx"),
<<<<<<< HEAD
  route("workspace/create", "routes/workspace.create.tsx"),
  route("workspace/order", "routes/workspace.order.tsx"),
=======
  route("workspace/order", "routes/workspace.order.tsx"),
  route("workspace/create", "routes/workspace.create.tsx"),
>>>>>>> origin/frontend-fix
] satisfies RouteConfig;
