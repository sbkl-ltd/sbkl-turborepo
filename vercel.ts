import type { VercelConfig } from "@vercel/config/v1";

export const config: VercelConfig = {
  buildCommand: "npx convex deploy --cmd 'turbo run build'",
  installCommand: "bun install",
  bunVersion: "1.x",
  framework: "nextjs",
};
