import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getBaseUrl() {
  if (typeof window !== 'undefined') {
    // Client-side
    return process.env.NEXT_PUBLIC_BASE_URL || window.location.origin;
  }
  // Server-side
  return process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
} 