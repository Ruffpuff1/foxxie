import { LanguageKeys } from '#lib/I18n/index';
import { getSupportedUserLanguageT } from '#lib/I18n/translate';
import { FuzzySearch } from '#lib/util/External/FuzzySearch';
import { ApplyOptions } from '@sapphire/decorators';
import { InteractionHandler, InteractionHandlerTypes } from '@sapphire/framework';
import { Collection, type AutocompleteInteraction } from 'discord.js';

@ApplyOptions<InteractionHandler.Options>({
    interactionHandlerType: InteractionHandlerTypes.Autocomplete
})
export class AutocompleteHandler extends InteractionHandler {
    public override async run(interaction: AutocompleteInteraction, result: InteractionHandler.ParseResult<this>) {
        return interaction.respond(result);
    }

    public override async parse(interaction: AutocompleteInteraction) {
        if (interaction.commandName !== 'case') {
            return this.none();
        }

        const focusedOption = interaction.options.getFocused(true);
        const t = getSupportedUserLanguageT(interaction);

        switch (focusedOption.name) {
            case 'case': {
                const cases = await this.container.utilities.guild(interaction.guildId!).moderation.fetch();
                const fuzzyCollection = new Collection(cases.map(c => [`${c.id}`, c]));
                const fuzzy = new FuzzySearch(fuzzyCollection, ['id']).runFuzzy(focusedOption.value.toString());
                return this.some(fuzzy.map(c => ({ name: `${t(LanguageKeys.Globals.CaseT)} #${c.id}`, value: c.id })));
            }
            default:
                return this.none();
        }
    }
}
