import type { GuildEntity } from '#lib/database';
import { cast, resolveToNull } from '@ruffpuff/utilities';
import type { GuildTextBasedChannelTypes } from '@sapphire/discord.js-utilities';
import { container } from '@sapphire/framework';
import type { PickByValue } from '@sapphire/utilities';
import { type GuildResolvable, type GuildTextBasedChannel, type Snowflake } from 'discord.js';
import { maybeMe } from './members';
import { sendMessages } from './permissions';

export function isSendableChannel(channel: GuildTextBasedChannelTypes): boolean {
    if (!channel) return false;
    if (!channel.guild) return true;
    const me = maybeMe(channel.guild);
    return me ? channel.permissionsFor(me).has(sendMessages) : false;
}

export async function fetchChannel<T = GuildTextBasedChannel>(
    resolvable: GuildResolvable,
    key: PickByValue<GuildEntity, Snowflake | null>
) {
    const guild = container.client.guilds.resolve(resolvable)!;
    if (!guild) return null;

    const channelId = await container.db.guilds.acquire(guild.id, key);
    if (!channelId) return null;

    const channel = await resolveToNull(guild.channels.fetch(channelId));
    if (!channel) {
        await container.db.guilds.write(guild.id, settings => (settings[key] = null!));
        return null;
    }

    return cast<T>(channel);
}
