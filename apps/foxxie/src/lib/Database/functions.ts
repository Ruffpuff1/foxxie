import { LanguageKeys } from '#lib/I18n';
import type { FoxxieArgs } from '#lib/Structures';
import { cast } from '@ruffpuff/utilities';
import { container, UserError } from '@sapphire/framework';
import type { GuildResolvable } from 'discord.js';
import type { ISchemaValue, SchemaGroup, SchemaKey } from '.';
import type { GuildEntity } from './entities/GuildEntity';
import type { SettingsCollectionCallback } from './repository';

type K = keyof V;
type V = GuildEntity;

export function acquireSettings<K1 extends K>(guild: GuildResolvable, paths: readonly [K1]): Promise<[V[K1]]>;
export function acquireSettings<K1 extends K, K2 extends K>(
    guild: GuildResolvable,
    paths: readonly [K1, K2]
): Promise<[V[K1], V[K2]]>;
export function acquireSettings<K1 extends K, K2 extends K, K3 extends K>(
    guild: GuildResolvable,
    paths: readonly [K1, K2, K3]
): Promise<[V[K1], V[K2], V[K3]]>;
export function acquireSettings<K1 extends K, K2 extends K, K3 extends K, K4 extends K>(
    guild: GuildResolvable,
    paths: readonly [K1, K2, K3, K4]
): Promise<[V[K1], V[K2], V[K3], V[K4]]>;
export function acquireSettings<K1 extends K, K2 extends K, K3 extends K, K4 extends K, K5 extends K>(
    guild: GuildResolvable,
    paths: readonly [K1, K2, K3, K4, K5]
): Promise<[V[K1], V[K2], V[K3], V[K4], V[K5]]>;
export function acquireSettings<K1 extends K, K2 extends K, K3 extends K, K4 extends K, K5 extends K, K6 extends K>(
    guild: GuildResolvable,
    paths: readonly [K1, K2, K3, K4, K5, K6]
): Promise<[V[K1], V[K2], V[K3], V[K4], V[K5], V[K6]]>;
export function acquireSettings<K1 extends K, K2 extends K, K3 extends K, K4 extends K, K5 extends K, K6 extends K, K7 extends K>(
    guild: GuildResolvable,
    paths: readonly [K1, K2, K3, K4, K5, K6, K7]
): Promise<[V[K1], V[K2], V[K3], V[K4], V[K5], V[K6], V[K7]]>;
export function acquireSettings<
    K1 extends K,
    K2 extends K,
    K3 extends K,
    K4 extends K,
    K5 extends K,
    K6 extends K,
    K7 extends K,
    K8 extends K
>(
    guild: GuildResolvable,
    paths: readonly [K1, K2, K3, K4, K5, K6, K7, K8]
): Promise<[V[K1], V[K2], V[K3], V[K4], V[K5], V[K6], V[K7], V[K8]]>;
export function acquireSettings<
    K1 extends K,
    K2 extends K,
    K3 extends K,
    K4 extends K,
    K5 extends K,
    K6 extends K,
    K7 extends K,
    K8 extends K,
    K9 extends K
>(
    guild: GuildResolvable,
    paths: readonly [K1, K2, K3, K4, K5, K6, K7, K8, K9]
): Promise<[V[K1], V[K2], V[K3], V[K4], V[K5], V[K6], V[K7], V[K8], V[K9]]>;
export function acquireSettings<KX extends K>(guild: GuildResolvable, paths: readonly KX[]): Promise<V[KX][]>;
export function acquireSettings<K1 extends K>(guild: GuildResolvable, path: K1): Promise<V[K1]>;
export function acquireSettings<R>(guild: GuildResolvable, cb: SettingsCollectionCallback<V, R>): Promise<R>;
export function acquireSettings(guild: GuildResolvable): Promise<V>;
export function acquireSettings(guild: GuildResolvable, paths?: any) {
    const resolved = container.client.guilds.resolveId(guild);
    if (resolved === null) throw new TypeError(`Cannot resolve "guild" to a Guild instance.`);
    return container.db.guilds.acquire(resolved, paths);
}

export function isSchemaGroup(groupOrKey: ISchemaValue): groupOrKey is SchemaGroup {
    return groupOrKey.type === 'Group';
}

export function isSchemaKey(groupOrKey: ISchemaValue): groupOrKey is SchemaKey {
    return groupOrKey.type !== 'Group';
}

export async function set(settings: GuildEntity, key: SchemaKey, args: FoxxieArgs) {
    const parsed = await key.parse(settings, args);
    if (key.array) {
        const values = cast<any[]>(settings[key.property]);
        const { serializer } = key;
        const index = values.findIndex(value => serializer.equals(value, parsed));
        if (index === -1) values.push(parsed);
        else values[index] = parsed;
    } else {
        const value = settings[key.property];
        const { serializer } = key;
        if (serializer.equals(value, parsed)) {
            throw new UserError({
                identifier: LanguageKeys.Commands.Configuration.ConfMenuNoChange,
                context: {
                    key: key.name,
                    value: key.stringify(settings, args.t, parsed)
                }
            });
        }
        (settings[key.property] as any) = parsed;
    }

    return settings.getLanguage();
}

export async function remove(settings: GuildEntity, key: SchemaKey, args: FoxxieArgs) {
    const parsed = await key.parse(settings, args);
    if (key.array) {
        const values = cast<any[]>(settings[key.property]);
        const { serializer } = key;
        const index = values.findIndex(value => serializer.equals(value, parsed));
        if (index === -1) {
            throw new UserError({
                identifier: LanguageKeys.Commands.Configuration.ConfMissingValue,
                context: {
                    key: key.name,
                    value: key.stringify(settings, args.t, parsed)
                }
            });
        }

        values.splice(index, 1);
    } else {
        // @ts-expect-error allowing assignment to guild
        // eslint-disable-next-line require-atomic-updates
        settings[key.property] = key.default;
    }

    return settings.getLanguage();
}

export function reset(settings: GuildEntity, key: SchemaKey) {
    const language = settings.getLanguage();
    // @ts-expect-error allowing assignment to guild
    settings[key.property] = key.default;
    return language;
}
