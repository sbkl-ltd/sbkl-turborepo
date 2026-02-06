import { WorkOS } from "@workos-inc/node";
export async function POST(request: Request) {
  const workos = new WorkOS(process.env.WORKOS_API_KEY);
  const { provider, redirectUri } = (await request.json()) as {
    provider: string;
    redirectUri: string;
  };

  const url = workos.userManagement.getAuthorizationUrl({
    clientId: process.env.WORKOS_CLIENT_ID!,
    provider,
    redirectUri,
  });

  return Response.json({ url });
}
