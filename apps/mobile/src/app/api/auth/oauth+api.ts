import { WorkOS } from "@workos-inc/node";

export async function POST(request: Request) {
  const { code } = (await request.json()) as { code: string };

  const workos = new WorkOS(process.env.WORKOS_API_KEY);

  const response = await workos.userManagement.authenticateWithCode({
    clientId: process.env.WORKOS_CLIENT_ID!,
    code,
  });

  return Response.json(response);
}
