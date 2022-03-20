import type { Env, BooleanString, IntegerString } from './types';

class EnvParse {
    public string<K extends keyof Env>(key: K): string {
        const value = process.env[key];
        if (value) return value;

        throw new Error(`Could not resolve "${key}" to string value.`);
    }

    public int<K extends keyof Env>(key: K): number {
        const value = process.env[key];
        if (!value) throw new Error(`Could not resolve "${key}" to integer value.`);

        const parsed = parseInt(value, 10);
        if (!Number.isInteger(parsed)) throw new Error(`Could not resolve "${key}" to integer value.`);
        return parsed;
    }

    public boolean<K extends keyof Env>(key: K): boolean {
        const value = process.env[key];
        if (value === 'true') return true;
        if (value === 'false') return false;
        throw new Error(`Could not resolve "${key}" to boolean value.`);
    }

    public array<K extends keyof Env>(key: K, split = ' '): string[] {
        const value = process.env[key];
        if (!value) throw new Error(`Could not resolve "${key}" to array value.`);
        return value.split(split);
    }

    public exists<K extends keyof Env>(...keys: K[]): boolean {
        return keys.every(k => {
            const value = process.env[k];
            return value !== undefined && value.length !== 0;
        })
    }
}

export { EnvParse, Env, IntegerString, BooleanString };
