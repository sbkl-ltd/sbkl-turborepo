import * as React from "react";

import { GestureHandlerRootView } from "react-native-gesture-handler";
import { PortalHost } from "@rn-primitives/portal";
import { storage } from "@/lib/storage";
import { ConvexQueryClient } from "@convex-dev/react-query";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";

import { AuthkitProvider, useAuth } from "@/providers/auth-provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConvexProviderWithAuth, ConvexReactClient } from "convex/react";
import { useUniwind } from "uniwind";

interface ProvidersProps {
  children: React.ReactNode;
}

const convex = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL!, {
  unsavedChangesWarning: false,
});
const convexQueryClient = new ConvexQueryClient(convex);
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryKeyHashFn: convexQueryClient.hashFn(),
      queryFn: convexQueryClient.queryFn(),
    },
  },
});
convexQueryClient.connect(queryClient);

export function AppProvider({ children }: ProvidersProps) {
  const { theme } = useUniwind();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider value={theme === "dark" ? DarkTheme : DefaultTheme}>
        <AuthkitProvider storage={storage}>
          <ConvexProviderWithAuth client={convex} useAuth={useAuth}>
            <QueryClientProvider client={queryClient}>
              {children}
              <PortalHost />
            </QueryClientProvider>
          </ConvexProviderWithAuth>
        </AuthkitProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
