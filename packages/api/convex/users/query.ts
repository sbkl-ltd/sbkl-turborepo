import { publicQuery } from "../functions";

export const me = publicQuery({
  handler: async (ctx) => {
    return ctx.user;
  },
});
