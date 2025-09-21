import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import type { Platform } from "./api/types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// 从 URL 参数中获取平台和 access_token
export const getUrlParams = () => {
  const urlParams = new URLSearchParams(window.location.search)
  return {
    platform: urlParams.get('platform') as Platform | null,
    accessToken: urlParams.get('access_token'),
    code: urlParams.get('code')
  }
}