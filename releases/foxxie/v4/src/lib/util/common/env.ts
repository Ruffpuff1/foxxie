export function envIsDefined(keys: string[]): boolean {
    return keys.every(key => {
        const value = process.env[key];
        return value !== undefined && value.length !== 0;
    });
}

export function envParseArray(key: string, defaultValue?: string[]): string[] {
    const value = process.env[key];
    if (!value) {
        if (defaultValue === undefined) throw new Error(`[ENV] ${key} - The key must be an array, but is empty or undefined.`);
        return defaultValue;
    }

    return value.split(' ');
}