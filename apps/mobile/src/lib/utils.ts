import type { ClassValue } from "clsx";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function chunk<T>(
  arr: T[],
  options?: { chunkSize?: number; groupedBy?: keyof T }
) {
  let arrToChunk: T[][] = [];
  const res: T[][] = [];
  if (options?.groupedBy) {
    const groupedByMap = arr.reduce((map, item) => {
      const key = item[options.groupedBy!];
      const group = map.get(key) || [];
      group.push(item);
      map.set(key, group);
      return map;
    }, new Map<any, T[]>());

    arrToChunk = Array.from(groupedByMap.values());
    let currentChunk: T[] = [];
    for (const group of arrToChunk) {
      if (currentChunk.length + group.length <= (options?.chunkSize ?? 100)) {
        currentChunk = currentChunk.concat(group);
      } else {
        res.push(currentChunk);
        currentChunk = group;
      }
    }
    if (currentChunk.length > 0) {
      res.push(currentChunk);
    }
  } else {
    for (let i = 0; i < arr.length; i += options?.chunkSize ?? 100) {
      const chunk = arr.slice(i, i + (options?.chunkSize ?? 100));
      res.push(chunk);
    }
  }
  return res;
}

/**
 * Returns a function that can only be called once.
 * Subsequent calls will return the result of the first call.
 * This is useful for lazy initialization.
 * @param fn - The function to be called once.
 * @returns A function that can only be called once.
 */
export function lazy<T>(fn: () => T): () => T {
  let called = false;
  let result: T;
  return () => {
    if (!called) {
      result = fn();
      called = true;
    }
    return result;
  };
}
