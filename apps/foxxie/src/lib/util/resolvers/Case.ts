import { err, ok, Resolvers, Result, UserError } from '@sapphire/framework';
import { LanguageKeys, translate } from '#lib/i18n';
import { ModerationManager } from '#lib/moderation';
import { FTFunction } from '#lib/types';
import { getModeration } from '#utils/functions';
import { Guild } from 'discord.js';

export async function resolveCase(parameter: string, t: FTFunction, guild: Guild): Promise<Result<ModerationManager.Entry, UserError>> {
	const result = await resolveCaseId(parameter, t, guild);
	return result.match({
		err: (error) => err(error),
		ok: async (value) => {
			const entry = await getModeration(guild).fetch(value);
			return entry ? ok(entry) : err(new UserError({ context: { parameter }, identifier: LanguageKeys.Arguments.CaseUnknownEntry }));
		}
	});
}

export async function resolveCaseId(parameter: string, t: FTFunction, guild: Guild): Promise<Result<number, UserError>> {
	const maximum = await getModeration(guild).getCurrentId();
	if (maximum === 0) return err(new UserError({ identifier: LanguageKeys.Arguments.CaseNoEntries }));

	if (t(LanguageKeys.Arguments.CaseLatestOptions).includes(parameter)) return ok(maximum);
	return Resolvers.resolveInteger(parameter, { maximum, minimum: 1 }) //
		.mapErr((error) => new UserError({ context: { maximum, minimum: 1, parameter }, identifier: translate(error) }));
}
