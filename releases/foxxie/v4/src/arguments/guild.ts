import { languageKeys } from '../lib/i18n';
import { Argument, ArgumentContext, UserError } from '@sapphire/framework';
import type { Result } from 'lexure';
import { SnowflakeRegex } from '@ruffpuff/utilities';
import type { Guild } from 'discord.js';

export default class extends Argument<Guild> {

    public async run(parameter: string, context: ArgumentContext): Promise<Result<Guild, UserError>> {
        const guild = SnowflakeRegex.test(parameter)
            ? this.container.client.guilds.cache.get(parameter)
            : this.container.client.guilds.cache.find(guild => guild.name.toLowerCase() === parameter.toLowerCase());

        if (guild) return this.ok(guild);
        return this.error({ parameter, identifier: languageKeys.arguments.invalidGuild, context });
    }

}