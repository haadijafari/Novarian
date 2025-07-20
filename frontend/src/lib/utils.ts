import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

// Helper function for Dynamic and conditional tailwind classes
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Helper function to convert English numbers to Persian
export const toPersian = (n: string | number): string => {
  const numStr = n.toString();
  const persian = {
    '0': '۰', '1': '۱', '2': '۲', '3': '۳', '4': '۴',
    '5': '۵', '6': '۶', '7': '۷', '8': '۸', '9': '۹'
  };
  return numStr.replace(/[0-9]/g, (match) => persian[match as keyof typeof persian]);
}

// Helper function to see if the string has only number
export const isNumeric = (str: string): boolean => {
  // Now accepts both English and Persian numerals
  return /^[0-9۰-۹]$/.test(str);
}
