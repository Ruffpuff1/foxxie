import { GuildChannelSettingsService } from '#lib/Database/entities/Guild/Services/GuildChannelSettingsService';
import { cast, resolveToNull } from '@ruffpuff/utilities';
import { container } from '@sapphire/framework';
import type { PickByValue } from '@sapphire/utilities';
import { type GuildResolvable, type GuildTextBasedChannel, type Snowflake } from 'discord.js';

export async function fetchChannel<T = GuildTextBasedChannel>(
    resolvable: GuildResolvable,
    key: PickByValue<GuildChannelSettingsService, Snowflake | null>
) {
    const guild = container.client.guilds.resolve(resolvable)!;
    if (!guild) return null;

    const channelId = await container.db.guilds.acquire(guild.id, s => s.channels[key]);
    if (!channelId) return null;

    const channel = await resolveToNull(guild.channels.fetch(channelId));
    if (!channel) {
        await container.db.guilds.write(guild.id, settings => (settings.channels[key] = null));
        return null;
    }

    return cast<T>(channel);
}
