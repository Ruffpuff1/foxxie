import { resolveToNull } from '@ruffpuff/utilities';
import { isGuildBasedChannel } from '@sapphire/discord.js-utilities';
import { Identifiers } from '@sapphire/framework';
import { container } from '@sapphire/pieces';
import { Result } from '@sapphire/result';
import { LanguageKeys } from '#lib/i18n';

export async function resolveChannel(parameter: string) {
	const channel = await resolveToNull(container.client.channels.fetch(parameter));
	return channel ? Result.ok(channel) : Result.err(LanguageKeys.Arguments.Missing);
}

export async function resolveGuildChannel(parameter: string) {
	const channel = await resolveChannel(parameter);
	if (channel.isOk() && isGuildBasedChannel(channel.unwrap())) return Result.ok(channel.unwrap());
	return Result.err(Identifiers.ArgumentGuildChannelError);
}
