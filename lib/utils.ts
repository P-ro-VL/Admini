import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function replacePlaceholders(text: string, params?: Record<string, string>): string {
    if (!text || !params) return text;

    let result = text;
    Object.entries(params).forEach(([key, value]) => {
        // Replace :key (standard URL param)
        result = result.replace(new RegExp(`:${key}\\b`, 'g'), value);
        // Replace %key% (custom placeholder)
        result = result.replace(new RegExp(`%${key}%`, 'g'), value);
    });
    return result;
}
