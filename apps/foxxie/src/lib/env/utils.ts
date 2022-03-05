import type { FoxxieEnv } from './types';
import { isNullishOrEmpty } from '@sapphire/utilities';

export function envParseInt<K extends keyof FoxxieEnv>(key: K, defaultValue?: number): number {
    const value = process.env[key];
    if (isNullishOrEmpty(value)) {
        if (defaultValue === undefined) throw new Error(`[ENV] ${key} - The key must be a number but received ${value}`);
        return defaultValue;
    }

    const parsed = parseInt(value, 10);
    if (!Number.isInteger(parsed)) throw new Error(`[ENV] ${key} - The key must be a number but received ${value}`);
    return parsed;
}

export function envParseBoolean<K extends keyof FoxxieEnv>(key: K, defaultValue?: boolean): boolean {
    const value = process.env[key];
    if (value === 'true') return true;
    if (value === 'false') return false;
    if (defaultValue === undefined) throw new Error(`[ENV] ${key} - The key must be either "true" or "false" received ${value}.`);
    return defaultValue;
}

export function envParseString<K extends keyof FoxxieEnv>(key: K, defaultValue?: FoxxieEnv[K]): FoxxieEnv[K] {
    const value = process.env[key];
    if (isNullishOrEmpty(value)) {
        if (defaultValue === undefined) throw new Error(`[ENV] ${key} - The key must be a string but received ${value}.`);
        return defaultValue;
    }

    return value;
}

export function envParseArray<K extends keyof FoxxieEnv>(key: K, defaultValue?: string[]): string[] {
    const value = process.env[key];
    if (isNullishOrEmpty(value)) {
        if (defaultValue === undefined) throw new Error(`[ENV] ${key} - The key must be an array but received ${value}.`);
        return defaultValue;
    }

    return value.split(' ');
}

export function envIsDefined(...keys: readonly (keyof FoxxieEnv)[]): boolean {
    return keys.every(key => {
        const value = process.env[key];
        return value !== undefined && value.length !== 0;
    });
}
