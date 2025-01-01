import { resolveToNull } from '@ruffpuff/utilities';
import { isGuildBasedChannel } from '@sapphire/discord.js-utilities';
import { container } from '@sapphire/framework';
import { cast } from '@sapphire/utilities';
import { GuildSettingsOfType, readSettings, writeSettings } from '#lib/database';
import {
	AnyThreadChannel,
	ChannelResolvable,
	Collection,
	GuildResolvable,
	GuildTextBasedChannel,
	NewsChannel,
	Snowflake,
	TextChannel
} from 'discord.js';

export async function fetchAllChannelThreads(channel: NewsChannel | TextChannel): Promise<[Collection<string, AnyThreadChannel>, any]> {
	const resolved = container.client.channels.resolve(channel);
	if (!isThreadableChannel(resolved)) return [new Collection<string, AnyThreadChannel>(), undefined];

	const publicArchived = await resolveToNull(resolved.threads.fetchArchived({ type: 'public' }));
	const mappedPublicArchived = publicArchived ? publicArchived.threads : new Collection<string, AnyThreadChannel>();

	const privateArchived = await resolveToNull(resolved.threads.fetchArchived({ type: 'private' }));
	const mappedPrivateArchived = privateArchived ? privateArchived.threads : new Collection<string, AnyThreadChannel>();

	return [
		new Collection<string, AnyThreadChannel>([...mappedPublicArchived.entries(), ...mappedPrivateArchived.entries()]),
		{
			privateArchived: mappedPrivateArchived,
			publicArchived: mappedPublicArchived
		}
	];
}

export async function fetchAllGuildThreads(guild: GuildResolvable) {
	const resolved = container.client.guilds.resolve(guild)!;
	const channels = (await resolveToNull(resolved.channels.fetch())) || resolved.channels.cache;

	const threads = new Collection<string, AnyThreadChannel>();

	for (const channel of channels.values()) {
		if (!channel || !isThreadableChannel(channel)) continue;

		const [fetched] = await fetchAllChannelThreads(channel);
		for (const thread of fetched.values()) {
			threads.set(thread.id, thread);
		}
	}

	return threads;
}

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

export function isThreadableChannel(channel: ChannelResolvable): channel is NewsChannel | TextChannel {
	const resolved = container.client.channels.resolve(channel);

	if (
		!resolved ||
		!resolved.isTextBased() ||
		!resolved.isSendable() ||
		!isGuildBasedChannel(resolved) ||
		resolved.isThread() ||
		resolved.isVoiceBased()
	)
		return false;
	return true;
}
