import type { ClientEvents } from 'discord.js';

export type CustomGet<K, TCustom> = K & { __type__: TCustom };

export function T<TCustom = string, K = string>(k: K): CustomGet<K, TCustom> {
    return k as CustomGet<K, TCustom>;
}

export type CustomFunctionGet<K, TArgs, TReturn> = K & {
    __args__: TArgs;
    __return__: TReturn;
};

export function FT<TArgs, TReturn = string, K = string>(k: K): CustomFunctionGet<K, TArgs, TReturn> {
    return k as CustomFunctionGet<K, TArgs, TReturn>;
}

export type EventArgs<T extends keyof ClientEvents> = ClientEvents[T];
