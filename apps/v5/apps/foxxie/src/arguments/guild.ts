import { LanguageKeys } from '#lib/i18n';
import { Argument, ArgumentContext, UserError } from '@sapphire/framework';
import type { Result } from 'lexure';
import { SnowflakeRegex } from '@ruffpuff/utilities';
import type { Guild } from 'discord.js';
import { fuzzySearch } from '#utils/util';

export class UserArgument extends Argument<Guild> {
    public async run(parameter: string, context: ArgumentContext): Promise<Result<Guild, UserError>> {
        const guild = SnowflakeRegex.test(parameter)
            ? this.container.client.guilds.cache.get(parameter)
            : fuzzySearch(parameter, this.container.client.guilds.cache, (guild: Guild) => guild.name);

        if (guild) return this.ok(Array.isArray(guild) ? guild[0] : guild);

        return this.error({
            identifier: LanguageKeys.Arguments.Guild,
            parameter,
            context
        });
    }
}
