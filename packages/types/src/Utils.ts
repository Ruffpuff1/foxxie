import type { ClientEvents } from 'discord.js';

export type CustomGet<K, TCustom> = K & { __type__: TCustom };

export type CustomFunctionGet<K, TArgs, TReturn> = K & {
    __args__: TArgs;
    __return__: TReturn;
};

export type EventArgs<T extends keyof ClientEvents> = ClientEvents[T];

export type O = Record<string, unknown>;
