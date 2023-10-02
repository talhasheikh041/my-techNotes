import { FetchBaseQueryError } from "@reduxjs/toolkit/query"
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function isFetchBaseQueryError(
  error: unknown
): error is FetchBaseQueryError {
  return typeof error === "object" && error != null && "status" in error
}

export function isErrorWithMessage(data: unknown): data is { message: string } {
  return (
    typeof data === "object" &&
    data != null &&
    "message" in data &&
    typeof (data as any).message === "string"
  )
}
