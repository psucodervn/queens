import { clsx, type ClassValue } from 'clsx'
import { ClientResponseError } from 'pocketbase'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof ClientResponseError) {
    // Handle PocketBase specific errors
    if (error.response.code === 400) {
      // Handle validation errors
      const firstError = Object.values(error.response.data?.data || {})[0]
      if (Array.isArray(firstError)) {
        return firstError[0]
      }
      return error.message
    }
    return error.message
  }

  if (error instanceof Error) {
    return error.message
  }

  return 'An unexpected error occurred'
}

export function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}
