import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


/**
 * Retourne les initiales à partir du prénom et nom
 * @example getInitials("john", "doe") → "JD"
 */
export const getInitials = (prenom: string, nom: string): string => {
  const firstLetter = (str?: string) => (str && str.length > 0 ? str.charAt(0).toUpperCase() : "");
  const p = firstLetter(prenom);
  const n = firstLetter(nom);
  if (p && n) return `${p}${n}`;
  if (p) return p;
  if (n) return n;
  return "?";
};



/**
 * Capitalise la première lettre d'une chaîne
 * @example capitalizeFirst("hello world") → "Hello world"
 */
export const capitalizeFirst = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};