import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function splitList<T>(inputList: T[], chunkSize: number): T[][] {
  const result: T[][] = [];
  for (let i = 0; i < inputList.length; i += chunkSize) {
    result.push(inputList.slice(i, i + chunkSize));
  }
  return result;
}