import { FoxxieGuild } from '#lib/database';
import { resolveToNull } from '@ruffpuff/utilities';
import { container } from '@sapphire/framework';
import { cast, PickByValue } from '@sapphire/utilities';
import { GuildResolvable, GuildTextBasedChannel, Snowflake } from 'discord.js';

export async function fetchChannel<T = GuildTextBasedChannel>(resolvable: GuildResolvable, key: PickByValue<FoxxieGuild, Snowflake | null>) {
	const guild = container.client.guilds.resolve(resolvable)!;
	if (!guild) return null;

	const settings = await container.settings.guilds.acquire(guild.id);
	const channelId = settings[key];
	if (!channelId) return null;

	const channel = await resolveToNull(guild.channels.fetch(channelId));
	if (!channel) {
		await container.settings.guilds.writeGuild(guild.id, { [key]: null });
		return null;
	}

	return cast<T>(channel);
}
