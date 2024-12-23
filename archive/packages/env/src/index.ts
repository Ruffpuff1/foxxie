import type { Env, BooleanString, IntegerString } from './types';

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
class EnvParse {
    public static string<K extends keyof Env>(key: K): string {
        const value = process.env[key];
        if (value) return value as string;

        throw new Error(`Could not resolve "${key}" to string value.`);
    }

    public static int<K extends keyof Env>(key: K): number {
        const value = process.env[key];
        if (!value) throw new Error(`Could not resolve "${key}" to integer value.`);

        const parsed = parseInt(value as string, 10);
        if (!Number.isInteger(parsed)) throw new Error(`Could not resolve "${key}" to integer value.`);
        return parsed;
    }

    public static boolean<K extends keyof Env>(key: K): boolean {
        const value = process.env[key];
        if (value === 'true') return true;
        if (value === 'false') return false;
        throw new Error(`Could not resolve "${key}" to boolean value.`);
    }

    public static array<K extends keyof Env>(key: K, split = ' '): string[] {
        const value = process.env[key];
        if (!value) throw new Error(`Could not resolve "${key}" to array value.`);
        return value.split(split);
    }

    public static exists<K extends keyof Env>(...keys: K[]): boolean {
        return keys.every(k => {
            const value = process.env[k];
            return value !== undefined && value.length !== 0;
        });
    }
}

export { EnvParse, Env, IntegerString, BooleanString };
