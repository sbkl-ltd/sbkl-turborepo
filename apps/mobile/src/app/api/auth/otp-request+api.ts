import { WorkOS } from "@workos-inc/node";
import { Resend as ResendAPI } from "resend";

export async function POST(request: Request) {
  try {
    const { email } = (await request.json()) as { email: string };

    const workos = new WorkOS(process.env.WORKOS_API_KEY);

    const { code } = await workos.userManagement.createMagicAuth({
      email,
    });

    if (process.env.RESEND_API_KEY) {
      const resend = new ResendAPI(process.env.RESEND_API_KEY);
      const { error } = await resend.emails.send({
        from: `sbkl <${process.env.EMAIL_FROM}>`,
        to: [email],
        subject: `Sign in to sbkl`,
        text: `
    Hello,
    
    Your temporary code to access sbkl is:
    
    ${code}
    
    You can use this code to verify your account and access sbkl.
    
    This code will expire in 15 minutes.
    
    Best regards,
    The sbkl Team
    `,
      });
      if (error) {
        return Response.json({ error: error.message }, { status: 500 });
      }
    }

    return Response.json({ ok: true });
  } catch (error) {
    console.error(error);
    return Response.json({ ok: false }, { status: 500 });
  }
}
