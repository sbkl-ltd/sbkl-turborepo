import { authkit } from "@workos-inc/authkit-nextjs";
import { NextRequest, NextResponse } from "next/server";

const unauthenticatedPaths = [
  "/",
  "/sign-in",
  "/sign-in/redirect",
  "/callback",
  "/sign-out",
  "/api/auth",
];

function isPathAllowed(pathname: string, allowedPaths: string[]): boolean {
  return allowedPaths.some((path) => {
    // Handle exact matches
    if (path === pathname) {
      return true;
    }

    // Handle wildcard patterns like /api/:path*
    if (path.includes(":path*")) {
      const basePath = path.replace("/:path*", "");
      return pathname.startsWith(basePath + "/") || pathname === basePath;
    }

    // Handle prefix matches
    if (pathname.startsWith(path + "/")) {
      return true;
    }

    return false;
  });
}

export default async function proxy(request: NextRequest) {

  const { pathname } = new URL(request.url);

  const { session, headers: authkitHeaders } = await authkit(request, {
    debug: false,
    eagerAuth: true,
    redirectUri: `${
      process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
    }/sign-in`,
  });

  // If path is in unauthenticatedPaths, allow access regardless of session status
  if (isPathAllowed(pathname, unauthenticatedPaths)) {

    const response = NextResponse.next({
      request: { headers: new Headers(request.headers) },
    });

    // Forward AuthKit headers for session management
    for (const [key, value] of authkitHeaders) {
      if (key.toLowerCase() === "set-cookie") {
        response.headers.append(key, value);
      } else {
        response.headers.set(key, value);
      }
    }

    return response;
  }

  // For protected paths, check if user is authenticated
  if (!session?.user) {
    const response = NextResponse.redirect(new URL("/sign-in", request.url));

    for (const [key, value] of authkitHeaders) {
      if (key.toLowerCase() === "set-cookie") {
        response.headers.append(key, value);
      } else {
        response.headers.set(key, value);
      }
    }
    return response;
  }

  // User is authenticated, allow access
  const response = NextResponse.next({
    request: { headers: new Headers(request.headers) },
  });

  for (const [key, value] of authkitHeaders) {
    if (key.toLowerCase() === "set-cookie") {
      response.headers.append(key, value);
    } else {
      response.headers.set(key, value);
    }
  }

  return response;
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
