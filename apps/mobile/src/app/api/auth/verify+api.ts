import { lazy } from "@/lib/utils";
import { WorkOS } from "@workos-inc/node";
import { createRemoteJWKSet, jwtVerify } from "jose";
import z from "zod";

const workos = new WorkOS(process.env.WORKOS_API_KEY);

const JWKS = lazy(() =>
  createRemoteJWKSet(
    new URL(workos.userManagement.getJwksUrl(process.env.WORKOS_CLIENT_ID!))
  )
);

export async function POST(request: Request) {
  const { accessToken, refreshToken } = (await request.json()) as {
    accessToken: string;
    refreshToken: string;
  };

  try {
    await jwtVerify(accessToken, JWKS());
    return Response.json(
      {
        accessToken,
        refreshToken,
      },
      { status: 200 }
    );
  } catch (error) {
    const parsedError = z
      .object({
        code: z.string(),
      })
      .parse(error);
    if (parsedError.code === "ERR_JWT_EXPIRED") {
      const response = await workos.userManagement.authenticateWithRefreshToken(
        {
          clientId: process.env.WORKOS_CLIENT_ID!,
          refreshToken,
          // ipAddress: "192.0.2.1",
          // userAgent:
          //   "Mozilla/5.0 (X11; Linux x86_64; rv:123.0) Gecko/20100101 Firefox/123.0",
        }
      );

      return Response.json(response, { status: 200 });
    }
    return Response.json(
      {
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 401 }
    );
  }
}
