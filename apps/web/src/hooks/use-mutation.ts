"use client";

import type {
  UseMutationOptions,
  UseMutationResult,
} from "@tanstack/react-query";
import type {
  FunctionArgs,
  FunctionReference,
  FunctionReturnType,
} from "convex/server";

import { useConvex } from "convex/react";
import { useMutation as useTanstackMutation } from "@tanstack/react-query";

export function useMutation<Mutation extends FunctionReference<"mutation">>(
  mutation: Mutation,
  options?: Omit<
    UseMutationOptions<
      FunctionReturnType<Mutation>,
      Error,
      FunctionArgs<Mutation>
    >,
    "mutationFn"
  >
): UseMutationResult<
  FunctionReturnType<Mutation>,
  Error,
  FunctionArgs<Mutation>
> {
  const convex = useConvex();
  return useTanstackMutation<
    FunctionReturnType<Mutation>,
    Error,
    FunctionArgs<Mutation>
  >({
    mutationFn: (args) => convex.mutation(mutation, args),
    ...(options ?? {}),
  });
}
