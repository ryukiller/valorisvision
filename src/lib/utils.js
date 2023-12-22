import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export const gtagEvent = ({ action, params }) => {
  console.log('here: ', action, params)
  window.gtag('event', action, params)
}