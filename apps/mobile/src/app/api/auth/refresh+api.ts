import { WorkOS } from "@workos-inc/node";

export async function POST(request: Request) {
  const { token } = (await request.json()) as { token: string };
  const workos = new WorkOS(process.env.WORKOS_API_KEY);
  const response = await workos.userManagement.authenticateWithRefreshToken({
    clientId: process.env.WORKOS_CLIENT_ID!,
    refreshToken: token,
    // ipAddress: "192.0.2.1",
    // userAgent:
    //   "Mozilla/5.0 (X11; Linux x86_64; rv:123.0) Gecko/20100101 Firefox/123.0",
  });

  return Response.json(response);
}
