import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "react-router";
import { ApolloProvider } from "@apollo/client/react";
import { apolloClient } from "~/core/apollo/client";

import type { Route } from "./+types/root";
import "./app.css";
import pkg from "../package.json";
import { ToastProvider } from "~/components/ui/ToastProvider";
import { DialogProvider } from "~/components/ui/DialogProvider";
import { useRealtimeGateway } from "~/core/hooks/useRealtimeGateway";

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              } catch (_) {}
            `,
          }}
        />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export async function loader() {
  return {
    ENV: {
      VITE_MIDTRANS_CLIENT_KEY: process.env.MIDTRANS_CLIENT_KEY || process.env.VITE_MIDTRANS_CLIENT_KEY || "",
      VITE_MINIO_PUBLIC_URL: process.env.MINIO_PUBLIC_URL || process.env.VITE_MINIO_PUBLIC_URL || "",
      VITE_APP_VERSION: pkg.version || "0.7.0 (beta)",
    }
  };
}

function RealtimeProvider({ children }: { children: React.ReactNode }) {
  useRealtimeGateway();
  return <>{children}</>;
}

export default function App() {
  const data = useLoaderData<any>();

  return (
    <ApolloProvider client={apolloClient}>
      {data?.ENV && (
        <script
          dangerouslySetInnerHTML={{
            __html: `window.ENV = ${JSON.stringify(data.ENV)};`,
          }}
        />
      )}
      <RealtimeProvider>
        <Outlet />
      </RealtimeProvider>
      <ToastProvider />
      <DialogProvider />
    </ApolloProvider>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
