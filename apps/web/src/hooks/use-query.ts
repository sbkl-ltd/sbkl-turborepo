"use client";

import { convexQuery } from "@convex-dev/react-query";
import { useQuery as useTanstackQuery } from "@tanstack/react-query";
import type {
  FunctionArgs,
  FunctionReference,
  FunctionReturnType,
} from "convex/server";

export function useQuery<
  Query extends FunctionReference<"query">,
  Args extends FunctionArgs<Query> | "skip"
>(
  query: Query,
  args: Args,
  {
    enabled,
    initialData,
  }: { enabled?: boolean; initialData?: FunctionReturnType<Query> } = {}
) {
  return useTanstackQuery({
    ...convexQuery(query, args),
    placeholderData: (d) => d,
    initialData,
    enabled:
      (Boolean(typeof enabled === "boolean" && enabled) &&
        Boolean(args !== "skip")) ||
      (Boolean(typeof enabled === "undefined") && Boolean(args !== "skip")),
  });
}
