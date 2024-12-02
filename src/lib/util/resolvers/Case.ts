import { LanguageKeys, translate } from '#lib/I18n/index';
import { GuildModerationService } from '#lib/moderation/managers/GuildModerationService';
import { Resolvers, Result, UserError, container, err, ok } from '@sapphire/framework';
import type { TFunction } from '@sapphire/plugin-i18next';
import type { Guild } from 'discord.js';

export async function resolveCaseId(parameter: string, t: TFunction, guild: Guild): Promise<Result<number, UserError>> {
    const maximum = await container.utilities.guild(guild).moderation.getCurrentId();
    if (maximum === 0) return err(new UserError({ identifier: LanguageKeys.Arguments.CaseNoEntries }));

    if (t(LanguageKeys.Arguments.CaseLatestOptions).includes(parameter)) return ok(maximum);
    return Resolvers.resolveInteger(parameter, { minimum: 1, maximum }) //
        .mapErr(error => new UserError({ identifier: translate(error), context: { parameter, minimum: 1, maximum } }));
}

export async function resolveCase(
    parameter: string,
    t: TFunction,
    guild: Guild
): Promise<Result<GuildModerationService.Entry, UserError>> {
    const result = await resolveCaseId(parameter, t, guild);
    return result.match({
        ok: async value => {
            const entry = await container.utilities.guild(guild).moderation.fetch(value);
            return entry
                ? ok(entry)
                : err(new UserError({ identifier: LanguageKeys.Arguments.CaseUnknownEntry, context: { parameter } }));
        },
        err: error => err(error)
    });
}
