"use client";

import * as React from "react";
import { ConvexReactClient, ConvexProviderWithAuth } from "convex/react";
import {
  AuthKitProvider,
  useAuth,
  useAccessToken,
} from "@workos-inc/authkit-nextjs/components";
import { ConvexQueryClient } from "@convex-dev/react-query";
import {
  isServer,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { Toaster } from "sonner";
import { TooltipProvider } from "@sbkl-turborepo/ui/components/tooltip";
import { ThemeProvider } from "@sbkl-turborepo/ui/providers/theme-provider";

function makeQueryClient() {
  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL!;
  const convex = new ConvexReactClient(convexUrl);
  // Share the authenticated Convex client with the react-query adapter.
  const convexQueryClient = new ConvexQueryClient(convex);
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        queryKeyHashFn: convexQueryClient.hashFn(),
        queryFn: convexQueryClient.queryFn(),
        // With SSR, we usually want to set some default staleTime
        // above 0 to avoid refetching immediately on the client
        staleTime: 60 * 1000,
      },
    },
  });
  convexQueryClient.connect(queryClient);
  return { queryClient, convex };
}

let browserQueryClient:
  | { queryClient: QueryClient; convex: ConvexReactClient }
  | undefined = undefined;

function getQueryClient() {
  if (isServer) {
    // Server: always make a new query client
    return makeQueryClient();
  } else {
    // Browser: make a new query client if we don't already have one
    // This is very important, so we don't re-make a new client if React
    // suspends during the initial render. This may not be needed if we
    // have a suspense boundary BELOW the creation of the query client
    if (!browserQueryClient) browserQueryClient = makeQueryClient();
    return browserQueryClient;
  }
}

function useAuthFromAuthKit() {
  const { user, loading: isLoading } = useAuth();
  const { getAccessToken, refresh } = useAccessToken();

  const isAuthenticated = !!user;

  const fetchAccessToken = React.useCallback(
    async ({ forceRefreshToken }: { forceRefreshToken?: boolean } = {}) => {
      if (!user) {
        return null;
      }

      try {
        if (forceRefreshToken) {
          return (await refresh()) ?? null;
        }

        return (await getAccessToken()) ?? null;
      } catch (error) {
        console.error("Failed to get access token:", error);
        return null;
      }
    },
    [user, refresh, getAccessToken]
  );

  return {
    isLoading,
    isAuthenticated,
    fetchAccessToken,
  };
}

export function AppProviders({ children }: { children: React.ReactNode }) {
  const { queryClient, convex } = getQueryClient();
  return (
    <ThemeProvider>
      <AuthKitProvider>
        <ConvexProviderWithAuth client={convex} useAuth={useAuthFromAuthKit}>
          <QueryClientProvider client={queryClient}>
            <TooltipProvider>{children}</TooltipProvider>
            <Toaster position="bottom-right" />
          </QueryClientProvider>
        </ConvexProviderWithAuth>
      </AuthKitProvider>
    </ThemeProvider>
  );
}
