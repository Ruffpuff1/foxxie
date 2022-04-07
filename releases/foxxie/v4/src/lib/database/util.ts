import type { GuildResolvable } from 'discord.js';
import { container } from '@sapphire/framework';
import type { GuildEntity } from '.';

export function aquireSettings(guild: GuildResolvable | null | undefined, paths: (keyof GuildEntity)[] | keyof GuildEntity | ((entity: GuildEntity) => unknown) | string) {
    if (!guild) throw new TypeError(`Cannot resolve "null" to a Guild instance.`);
    const resolved = container.client.guilds.resolveId(guild);
    if (resolved === null) throw new TypeError(`Cannot resolve "guild" to a Guild instance.`);
    return container.settings.guilds.aquire(resolved, paths);
}

export function writeSettings(guild: GuildResolvable | null | undefined, paths: (keyof GuildEntity)[] | keyof GuildEntity | ((entity: GuildEntity) => unknown) | string) {
    if (!guild) throw new TypeError(`Cannot resolve "null" to a Guild instance.`);
    const resolved = container.client.guilds.resolveId(guild);
    if (resolved === null) throw new TypeError(`Cannot resolve "guild" to a Guild instance.`);
    return container.settings.guilds.write(resolved, paths);
}