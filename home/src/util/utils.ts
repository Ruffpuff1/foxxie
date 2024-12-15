import enUS from '@assets/locales/en_us';
import esMX from '@assets/locales/es_mx';
import { Locale, Translations } from '@assets/locales/types';
import { Booklink } from '@developers/Book/Book';
import { User } from 'firebase/auth';

export const ALLOWED_EMAILS = process.env.NEXT_PUBLIC_ALLOWED_EMAILS?.split(' ');

export const isValid = (user: User | null): boolean => {
    if (ALLOWED_EMAILS?.includes(user?.email as string)) return true;
    return false;
};

export const sleep = (ms: number) => {
    return new Promise(resolve => setTimeout(resolve, ms));
};

export function exclude<T extends Record<string, any>, K extends keyof T>(arr: T[], indexKey: K, ...keys: string[]) {
    const filtered = arr.filter(box => !keys.includes(box[indexKey]));
    return filtered;
}

export function bookLinksToMap<T extends Record<string, string>>(book: Booklink[], locale: Locale, ...extras: [T, string][] | ((trsn: Translations) => [T, string])[]) {
    const map = new Map<string, MapEntry>();
    const localeSet = locale === 'en_us' ? enUS : esMX;

    for (const bookItem of book) {
        const value = localeSet.book[bookItem.key];
        map.set(value, { link: bookItem.href, value });
    }

    for (const extra of extras) {
        const [obj, path] = typeof extra === 'function' ? extra(localeSet) : extra;

        const entries = Object.entries(obj);

        for (const [, value] of entries) {
            map.set(value, { link: path, value });
        }
    }

    return map;
}

export interface MapEntry {
    link: string;
    value: string;
}

export function containsAnyChar(str1: string, str2: string): boolean {
    let count = 0;

    const str1Chars = str1.split('');
    for (const char of str1Chars) {
        if (str2.includes(char)) {
            count++;
        }
    }

    return count >= 5;
}
