import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface PluralizeTextOptions {
  single: string;
  plural?: string | null;
  count: number | readonly unknown[];
}

const pluralizeText = ({ single, plural, count }: PluralizeTextOptions): string => {
  const size = Array.isArray(count) ? count.length : count;

  if (size !== 1) {
    if (plural) {
      return plural;
    }
    return single.slice(-1) === "s" ? `${single}es` : `${single}s`;
  }
  return single;
};

export function pluralize(single: string, count: number | readonly unknown[]): string;
export function pluralize(single: string, plural: string, count: number | readonly unknown[]): string;
export function pluralize(
  single: string,
  pluralOrCount: string | number | readonly unknown[],
  count?: number | readonly unknown[],
): string {
  if (typeof count === "undefined") {
    return pluralizeText({ 
      single, 
      plural: null, 
      count: pluralOrCount as number | readonly unknown[]
    });
  }

  return pluralizeText({ 
    single, 
    plural: pluralOrCount as string, 
    count 
  });
}
