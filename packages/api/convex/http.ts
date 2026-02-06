import { httpRouter, ROUTABLE_HTTP_METHODS } from "convex/server";
import { httpAction } from "./_generated/server";
import { authKit } from "./auth";
import { ActionCtx } from "./_generated/server";
import { HonoWithConvex } from "convex-helpers/server/hono";
import { Hono } from "hono";
import { logger } from "hono/logger";
import stripAnsi from "strip-ansi";

const app: HonoWithConvex<ActionCtx> = new Hono();

app.use(
  "*",
  logger((...args) => {
    console.log(...args.map(stripAnsi));
  })
);

const http = httpRouter();
authKit.registerRoutes(http);

for (const routableMethod of ROUTABLE_HTTP_METHODS) {
  http.route({
    pathPrefix: "/",
    method: routableMethod,
    handler: httpAction(async (ctx, request: Request) => {
      return await app.fetch(request, ctx);
    }),
  });
}

export default http;
