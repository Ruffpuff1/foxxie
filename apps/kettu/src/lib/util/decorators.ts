import { container } from '@sapphire/framework';
import { getLocaleString } from '@foxxie/commands';
import type { AutocompleteInteraction, CommandInteraction, SelectMenuInteraction } from 'discord.js';

export function getLocale(interaction: CommandInteraction | SelectMenuInteraction | AutocompleteInteraction) {
    const string = getLocaleString(interaction);

    return container.i18n?.getT(string) ?? { lng: string };
}
