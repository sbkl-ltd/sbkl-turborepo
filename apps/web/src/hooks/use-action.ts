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

import { useMutation as useTanstackMutation } from "@tanstack/react-query";
import { useAction as useConvexAction } from "convex/react";

export function useAction<
  Action extends FunctionReference<"action">,
  Args extends FunctionArgs<Action>,
  ReturnType extends FunctionReturnType<Action>,
>(
  action: Action,
  options?: UseMutationOptions<ReturnType, Error, Args>
): UseMutationResult<ReturnType, Error, Args> {
  const convexAction = useConvexAction(action);
  return useTanstackMutation<Args, Error, ReturnType>({
    mutationFn: async (args) => {
      return await convexAction(args);
    },
    ...(options ?? {}),
  });
}
