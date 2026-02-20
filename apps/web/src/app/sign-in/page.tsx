import { withAuth } from "@workos-inc/authkit-nextjs";
import { WorkOS } from "@workos-inc/node";
import { redirect, RedirectType } from "next/navigation";
import { z } from "zod";
import { Button } from "@sbkl-turborepo/ui/components/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@sbkl-turborepo/ui/components/card";

const workos = new WorkOS(process.env.WORKOS_API_KEY);

interface SignInPageProps {
  searchParams: Promise<{
    redirect?: string;
  }>;
}

export default async function SignInPage({ searchParams }: SignInPageProps) {
  const { redirect: redirectPath } = await searchParams;
  const { user } = await withAuth();

  if (user) {
    redirect(redirectPath || "/", RedirectType.replace);
  }

  // Create the state parameter in the format WorkOS AuthKit expects
  let state: string | undefined;
  if (redirectPath) {
    const stateObject = {
      returnPathname: redirectPath,
    };
    state = Buffer.from(JSON.stringify(stateObject)).toString("base64");
  }

  const googleOAuthUrl = workos.userManagement.getAuthorizationUrl({
    clientId: z.string().parse(process.env.WORKOS_CLIENT_ID),
    provider: "GoogleOAuth",
    redirectUri: z.string().parse(process.env.NEXT_PUBLIC_WORKOS_REDIRECT_URI),
    state,
  });

  const githubOAuthUrl = workos.userManagement.getAuthorizationUrl({
    clientId: z.string().parse(process.env.WORKOS_CLIENT_ID),
    provider: "GitHubOAuth",
    redirectUri: z.string().parse(process.env.NEXT_PUBLIC_WORKOS_REDIRECT_URI),
    state,
  });

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Welcome</h1>
          <p className="text-muted-foreground">Sign in to access your tasks</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-center text-xl">Sign in</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              variant="outline"
              size="lg"
              className="w-full"
              render={() => (
                <a href={googleOAuthUrl}>
                  <GoogleIcon className="h-5 w-5 mr-2" />
                  Sign in with Google
                </a>
              )}
            />

            <Button
              variant="outline"
              size="lg"
              className="w-full"
              render={() => (
                <a href={githubOAuthUrl}>
                  <GithubIcon className="h-5 w-5 mr-2" />
                  Sign in with GitHub
                </a>
              )}
            >
              <a href={githubOAuthUrl}>
                <GithubIcon className="h-5 w-5 mr-2" />
                Sign in with GitHub
              </a>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <path
        fill="currentColor"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="currentColor"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="currentColor"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="currentColor"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
    </svg>
  );
}
