import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { type rating } from "@/lib/schemas/schemas"

// Helper function for Dynamic and conditional tailwind classes
/**
 * A utility function that merges Tailwind CSS classes.
 * It uses 'clsx' to conditionally join class names and 'tailwind-merge'
 * to resolve conflicts, ensuring the final output is clean and correctly prioritized.
 * @param inputs An array of ClassValue, which can be strings, objects, or arrays.
 * @returns A single string of merged Tailwind CSS classes.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Helper function to convert English numbers to Persian
/**
 * Converts a number or a string containing English numerals to a string
 * with their Persian equivalents.
 * @param n A number or string to be converted.
 * @returns A string with Persian numerals.
 */
export const toPersian = (n: string | number): string => {
  const numStr = n.toString();
  const persian = {
    '0': '۰', '1': '۱', '2': '۲', '3': '۳', '4': '۴',
    '5': '۵', '6': '۶', '7': '۷', '8': '۸', '9': '۹'
  };
  return numStr.replace(/[0-9]/g, (match) => persian[match as keyof typeof persian]);
}

// Helper function to see if the string has only number
/**
 * Checks if a string consists of only a single numeral, either English or Persian.
 * @param str The string to check.
 * @returns 'true' if the string contains a single numeral, otherwise 'false'.
 */
export const isNumeric = (str: string): boolean => {
  return /^[0-9۰-۹]$/.test(str);
}

// Helper function to determine the animation class for a star in a rating component
/**
 * Determines the CSS class name for a star based on the current and previous rating values.
 * This is a pure function used to handle the animation and styling logic for
 * interactive and non-interactive star rating components.
 *
 * @param isInteractive - Indicates if the rating component is in interactive mode.
 * @param animate - The current animation state ('animate-right', 'animate-left', or 'none').
 * @param ratingValue - The numerical value of the star being rendered (1-5).
 * @param value - The final rating value that the user has selected.
 * @param prevValue - The rating value before the change, used to determine animation direction.
 * @returns A string representing the CSS class for the star's animation and state.
 */
export const getStarClassName = (
  isInteractive: boolean,
  animate: 'animate-right' | 'animate-left' | 'none',
  ratingValue: rating,
  value: rating,
  prevValue: rating | null
) => {
  if (isInteractive && animate !== 'none' && prevValue !== null) {

    // Star is outside the animated range, so it's a static 'active' state
    if (ratingValue < Math.min(value, prevValue)) {
      return 'active';
    }

    if (ratingValue === value) {
      return 'move-to';
    }

    if (ratingValue === prevValue) {
      return 'move-from';
    }

    // Star is in the animated range when moving right, creating a 'scale' effect
    if (value > prevValue && ratingValue > prevValue && ratingValue < value) {
      return 'scale';
    }

    // Star is in the animated range when moving left, creating a 'pop' effect
    if (value < prevValue && ratingValue > value && ratingValue < prevValue) {
      return 'pop';
    }
  } else {
    // Logic for non-interactive mode or when no animation is happening
    // Star is active if its value is less than the current rating
    if (ratingValue < value) {
      return 'active';
    }
    // Star is the current selected rating
    if (ratingValue === value) {
      return 'current';
    }
  }
  // Default case if no other conditions are met
  return '';
};
