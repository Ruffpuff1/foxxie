import { container } from '@sapphire/pieces';
import { Result } from '@sapphire/result';
import { LanguageKeys } from '#lib/i18n';

export function resolveGuild(parameter: string, guildId: string) {
	if (parameter === guildId) return Result.ok(container.client.guilds.cache.get(parameter));
	return Result.err(LanguageKeys.Arguments.Missing); // TODO add guild key
}
