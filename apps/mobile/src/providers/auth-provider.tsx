import * as React from "react";

import * as AuthSession from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import {
  authenticateWithCode,
  authenticateWithRefreshToken,
  confirmCode,
  getAuthorisationUrl,
  requestCode,
  verifyToken,
} from "@/lib/auth";
import { Doc } from "@sbkl-turborepo/api/dataModel";
import { AuthKitUser } from "@sbkl-turborepo/schemas/users";
import { useQuery } from "@/hooks/use-query";
import { api } from "@sbkl-turborepo/api";

export type User = Doc<"users"> & {
  authKit: AuthKitUser;
};

export interface AuthenticationResponse {
  accessToken: string;
  refreshToken: string;
}

interface TokenStorage {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
  removeItem(key: string): Promise<void>;
}

type LoginParams =
  | {
      provider: "OTP" | "SSO";
      email: string;
    }
  | {
      provider: "GoogleOAuth";
      email?: never;
    };

interface AuthkitProviderProps {
  children: React.ReactNode;
  storage: TokenStorage;
}

interface AuthContextValue {
  login: (params: LoginParams) => Promise<void>;
  confirmSignIn: (args: { email: string; code: string }) => Promise<void>;
  logout: () => Promise<void>;
  storage: TokenStorage;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  refreshAuth(): Promise<{ accessToken: string; refreshToken: string }>;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  setIsLoading: (isLoading: boolean) => void;
}

const AuthContext = React.createContext<AuthContextValue | undefined>(
  undefined
);

export function AuthkitProvider({ children, storage }: AuthkitProviderProps) {
  const [isLoading, setIsLoading] = React.useState(true);
  const [token, setToken] = React.useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const isMounted = React.useRef(false);

  // Load session from storage on mount
  React.useEffect(() => {
    isMounted.current = true;
    async function loadSession() {
      try {
        if (!isMounted.current) return;

        const accessToken = await storage.getItem("accessToken");
        const refreshToken = await storage.getItem("refreshToken");

        if (accessToken && refreshToken) {
          const {
            accessToken: verifiedAccessToken,
            refreshToken: verifiedRefreshToken,
          } = await verifyToken({
            accessToken,
            refreshToken,
          });
          setToken(verifiedAccessToken);
          await storage.setItem("accessToken", verifiedAccessToken);
          await storage.setItem("refreshToken", verifiedRefreshToken);
          setIsAuthenticated(true);
        }
      } finally {
        if (isMounted.current) setIsLoading(false);
        isMounted.current = true;
      }
    }
    loadSession();
  }, [storage]);

  async function persistSession({
    accessToken,
    refreshToken,
  }: AuthenticationResponse) {
    await storage.setItem("accessToken", accessToken);
    await storage.setItem("refreshToken", refreshToken);
    setToken(accessToken);
    setIsAuthenticated(true);
  }

  async function resetSession() {
    await storage.removeItem("accessToken");
    await storage.removeItem("refreshToken");
    setToken(null);
    setIsAuthenticated(false);
  }

  async function login(args: LoginParams) {
    try {
      if (args.provider === "OTP") {
        const { ok } = await requestCode({ email: args.email });
        if (!ok) throw new Error("Failed to request code");
        return;
      }

      const redirectUri = AuthSession.makeRedirectUri().toString();

      const authorisationUrl = await getAuthorisationUrl({
        provider: args.provider,
        redirectUri,
      });

      const result = await WebBrowser.openAuthSessionAsync(
        authorisationUrl,
        redirectUri
      );
      if (result.type !== "success" || !result.url)
        throw new Error("Authentication cancelled or failed");

      const params = new URL(result.url).searchParams;

      const code = params.get("code");

      if (!code) throw new Error("No code returned from SSO");

      const response = await authenticateWithCode({
        code,
      });

      await persistSession(response);
    } catch (err) {
      await resetSession();
    }
  }

  async function confirmSignIn(args: { email: string; code: string }) {
    setIsLoading(true);
    try {
      const response = await confirmCode(args);
      await persistSession(response);
    } catch (err) {
      await resetSession();
    } finally {
      setIsLoading(false);
    }
  }

  async function refreshAuth() {
    const currentRefreshToken = await storage.getItem("refreshToken");
    if (!currentRefreshToken) throw new Error("No refresh token found");
    const { accessToken, refreshToken } = await authenticateWithRefreshToken({
      token: currentRefreshToken,
    });
    await storage.setItem("accessToken", accessToken);
    await storage.setItem("refreshToken", refreshToken);
    setToken(accessToken);
    setIsAuthenticated(true);
    return { accessToken, refreshToken };
  }

  async function logout() {
    await storage.removeItem("accessToken");
    await storage.removeItem("refreshToken");
    setToken(null);
    setIsAuthenticated(false);
  }

  const value: AuthContextValue = {
    token,
    isAuthenticated,
    setIsAuthenticated,
    isLoading,
    setIsLoading,
    login,
    logout,
    storage,
    refreshAuth,
    confirmSignIn,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = React.use(AuthContext);
  if (!ctx)
    throw new Error("useAuthContext must be used within an AuthkitProvider");

  React.useEffect(() => {
    async function init() {
      const accessToken = await ctx?.storage.getItem("accessToken");
      if (accessToken) {
        ctx?.setIsAuthenticated(true);
      }
      ctx?.setIsLoading(false);
    }
    init();
  }, []);

  const fetchAccessToken = React.useCallback(
    async ({ forceRefreshToken }: { forceRefreshToken: boolean }) => {
      if (forceRefreshToken) {
        const { accessToken } = await ctx.refreshAuth();
        return accessToken;
      }
      return ctx.storage.getItem("accessToken");
    },
    []
  );

  return React.useMemo(
    () => ({
      isLoading: ctx.isLoading,
      isAuthenticated: ctx.isAuthenticated,
      fetchAccessToken,
    }),
    [ctx.isLoading, ctx.isAuthenticated, fetchAccessToken]
  );
}

export function useSignIn() {
  const ctx = React.use(AuthContext);
  if (!ctx) throw new Error("useSignIn must be used within an AuthkitProvider");

  return ctx.login;
}

export function useConfirmSignIn() {
  const ctx = React.use(AuthContext);
  if (!ctx)
    throw new Error("useConfirmSignIn must be used within an AuthkitProvider");

  return ctx.confirmSignIn;
}

export function useSignOut() {
  const ctx = React.use(AuthContext);
  if (!ctx)
    throw new Error("useSignOut must be used within an AuthkitProvider");

  return ctx.logout;
}

export function useRefreshAuth() {
  const ctx = React.use(AuthContext);
  if (!ctx)
    throw new Error("useRefreshAuth must be used within an AuthkitProvider");

  return ctx.refreshAuth;
}

export function useUser() {
  const ctx = React.use(AuthContext);
  if (!ctx) throw new Error("useUser must be used within an AuthkitProvider");

  const { data: user, isPending } = useQuery(api.users.query.me, {});

  return {
    user,
    isPending: ctx.isLoading || isPending,
    isAuthenticated: Boolean(ctx.isAuthenticated),
    isAuthenticatedAndUserLoaded: Boolean(ctx.isAuthenticated && user),
  };
}
