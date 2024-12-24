import { resolveToNull } from '@ruffpuff/utilities';
import { container } from '@sapphire/framework';
import { cast } from '@sapphire/utilities';
import { GuildSettingsOfType, readSettings, writeSettings } from '#lib/database';
import { GuildResolvable, GuildTextBasedChannel, Snowflake } from 'discord.js';

export async function fetchChannel<T = GuildTextBasedChannel>(resolvable: GuildResolvable, key: GuildSettingsOfType<null | Snowflake>) {
	const guild = container.client.guilds.resolve(resolvable)!;
	if (!guild) return null;

	const settings = await readSettings(guild.id);
	const channelId = settings[key];
	if (!channelId) return null;

	const channel = await resolveToNull(guild.channels.fetch(channelId));
	if (!channel || !channel.isSendable()) {
		await writeSettings(guild.id, { [key]: null });
		return null;
	}

	return cast<T>(channel);
}
