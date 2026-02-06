import z from "zod";
import { internalQuery } from "../../functions";

export const findByAuthId = internalQuery({
  args: { authId: z.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("authId", (q) => q.eq("authId", args.authId))
      .unique();
  },
});
