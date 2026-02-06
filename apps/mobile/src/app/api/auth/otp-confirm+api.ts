import { WorkOS } from "@workos-inc/node";

export async function POST(request: Request) {
  const { email, code } = (await request.json()) as {
    email: string;
    code: string;
  };
  const workos = new WorkOS(process.env.WORKOS_API_KEY);

  const response = await workos.userManagement.authenticateWithMagicAuth({
    clientId: process.env.WORKOS_CLIENT_ID!,
    code,
    email,
  });

  return Response.json(response);
}
