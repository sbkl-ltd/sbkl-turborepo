import z from "zod";

export const userSchema = z.object({
  authId: z.string(),
  email: z.string(),
  name: z.string(),
});

export type AuthKitUser = {
  createdAt: string;
  email: string;
  emailVerified: boolean;
  externalId?: null | string;
  firstName?: null | string;
  id: string;
  lastName?: null | string;
  lastSignInAt?: null | string;
  locale?: null | string;
  metadata: Record<string, any>;
  profilePictureUrl?: null | string;
  updatedAt: string;
};
