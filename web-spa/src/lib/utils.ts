import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDuration(duration: number, unit: 'seconds' | 'milliseconds' = 'milliseconds' ): string {
  if (unit === 'milliseconds') {
    duration = Math.floor(duration / 1000)
  }
  const minutes = Math.floor(duration / 60)
  const remainingSeconds = duration % 60
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}s`
}
