import z from "zod";
import { storage } from "./storage";

export async function requestCode(args: { email: string }) {
  const response = await fetch(`/api/auth/otp-request`, {
    method: "POST",
    body: JSON.stringify(args),
  });
  const data = await response.json();
  return z.object({ ok: z.boolean() }).parse(data);
}

export async function confirmCode(args: { email: string; code: string }) {
  const response = await fetch(`/api/auth/otp-confirm`, {
    method: "POST",
    body: JSON.stringify(args),
  });
  const data = await response.json();
  return z
    .object({
      accessToken: z.string(),
      refreshToken: z.string(),
    })
    .parse(data);
}

export async function getAuthorisationUrl({
  provider,
  redirectUri,
}: {
  provider: string;
  redirectUri: string;
}) {
  const response = await fetch(`/api/auth/authorize`, {
    method: "POST",
    body: JSON.stringify({ provider, redirectUri }),
  });
  const data = await response.json();
  return z.object({ url: z.string() }).parse(data).url;
}

export async function authenticateWithCode({ code }: { code: string }) {
  const response = await fetch(`/api/auth/oauth`, {
    method: "POST",
    body: JSON.stringify({ code }),
  });
  const data = await response.json();

  const parsedData = z
    .object({
      accessToken: z.string(),
      refreshToken: z.string(),
    })
    .parse(data);

  await storage.setItem("refreshToken", parsedData.refreshToken);
  await storage.setItem("accessToken", parsedData.accessToken);

  return parsedData;
}

export async function authenticateWithRefreshToken({
  token,
}: {
  token: string;
}) {
  const response = await fetch(`/api/auth/refresh`, {
    method: "POST",
    body: JSON.stringify({ token }),
  });
  const data = await response.json();
  return z
    .object({
      accessToken: z.string(),
      refreshToken: z.string(),
    })
    .parse(data);
}

export async function verifyToken({
  accessToken,
  refreshToken,
}: {
  accessToken: string;
  refreshToken: string;
}) {
  const response = await fetch(`/api/auth/verify`, {
    method: "POST",
    body: JSON.stringify({ accessToken, refreshToken }),
  });
  const data = await response.json();

  return z
    .object({
      accessToken: z.string(),
      refreshToken: z.string(),
    })
    .parse(data);
}
