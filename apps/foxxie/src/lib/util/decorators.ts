import { createFunctionPrecondition } from '@sapphire/decorators';
import { acquireSettings } from '#database/functions';
import * as GuildSettings from '#database/Keys';
import { LanguageKeys } from '#lib/i18n';
import type { GuildMessage } from '#lib/types';
import { getLocaleString } from '@foxxie/commands';
import { sendLocalizedMessage } from '#utils/Discord';
import { getT } from '@foxxie/i18n';
import i18next from 'i18next';
import type { AutocompleteInteraction, CommandInteraction, SelectMenuInteraction } from 'discord.js';
import { Iso6391Enum } from '@foxxie/i18n-codes';

export function RequireLevelingEnabled(): MethodDecorator {
    return createFunctionPrecondition(
        (message: GuildMessage) => (message.guild ? acquireSettings(message.guild, GuildSettings.Leveling.Enabled) : true),
        (message: GuildMessage) => sendLocalizedMessage(message, LanguageKeys.Preconditions.Leveling)
    );
}

export function RequireStarboardEnabled(): MethodDecorator {
    return createFunctionPrecondition(
        async (message: GuildMessage) => Boolean(await acquireSettings(message.guild, GuildSettings.Starboard.Channel)),
        (message: GuildMessage) => sendLocalizedMessage(message, LanguageKeys.Preconditions.Starboard)
    );
}

export function getLocale(interaction: CommandInteraction | SelectMenuInteraction | AutocompleteInteraction) {
    const loc = getLocaleString(interaction);

    return i18next.languages.includes(loc) ? getT(loc) : getT(Iso6391Enum.EnglishUnitedStates);
}
