import type { KettuEnv } from './types';

export function envParseBoolean<K extends keyof KettuEnv>(key: K, def?: boolean) {
    const value = process.env[key];

    if (!value && def) return def;

    if (value === 'true') return true;
    if (value === 'false') return false;

    throw new Error(`Expected boolean value for "${key}" but found nothing.`);
}

export function envIsDefined<K extends keyof KettuEnv>(key: K): boolean {
    const value = process.env[key];

    return Boolean(value);
}
