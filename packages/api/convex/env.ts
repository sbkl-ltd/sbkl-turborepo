import { z } from "zod";

function requireEnv() {
  return {
    SITE_URL: z.string().parse(process.env["SITE_URL"]),
    WORKOS_ACTION_SECRET: z.string().parse(process.env["WORKOS_ACTION_SECRET"]),
    WORKOS_API_KEY: z.string().parse(process.env["WORKOS_API_KEY"]),
    WORKOS_CLIENT_ID: z.string().parse(process.env["WORKOS_CLIENT_ID"]),
    WORKOS_COOKIE_PASSWORD: z
      .string()
      .parse(process.env["WORKOS_COOKIE_PASSWORD"]),
    WORKOS_WEBHOOK_SECRET: z
      .string()
      .parse(process.env["WORKOS_WEBHOOK_SECRET"]),
  };
}

export const env = requireEnv();
