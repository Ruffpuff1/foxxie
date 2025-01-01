export interface Env {
    TZ: string;
    NODE_ENV: 'production' | 'development';
}

export type BooleanString = 'true' | 'false';
export type IntegerString = `${bigint}`;
