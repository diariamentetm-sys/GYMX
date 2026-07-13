import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility function to merge Tailwind CSS classes
 *
 * Combines clsx for conditional classes and tailwind-merge
 * to properly merge Tailwind classes without conflicts.
 *
 * @param inputs - Class names or conditional class objects
 * @returns Merged class string
 *
 * @example
 * cn("px-4 py-2", condition && "bg-yellow-400", {
 *   "text-white": isActive,
 *   "text-neutral-300": !isActive,
 * })
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
