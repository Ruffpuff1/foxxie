import { stringConfigurableKeyGroupChoices } from '#lib/database';
import { FuzzySearch } from '#utils/External/FuzzySearch';
import { ApplyOptions } from '@sapphire/decorators';
import { InteractionHandler, InteractionHandlerTypes } from '@sapphire/framework';
import { APIApplicationCommandOptionChoice, AutocompleteInteraction, Collection } from 'discord.js';

@ApplyOptions<InteractionHandler.Options>({
	interactionHandlerType: InteractionHandlerTypes.Autocomplete
})
export class AutocompleteHandler extends InteractionHandler {
	private choices = stringConfigurableKeyGroupChoices();

	public override async run(interaction: AutocompleteInteraction, result: InteractionHandler.ParseResult<this>) {
		return interaction.respond(result);
	}

	public override async parse(interaction: AutocompleteInteraction) {
		if (interaction.commandName !== 'conf') {
			return this.none();
		}

		const focusedOption = interaction.options.getFocused(true);

		switch (focusedOption.name) {
			case 'key': {
				const fuzzy = new FuzzySearch(
					new Collection([...this.choices.map((choice) => [choice.name, choice] as [string, APIApplicationCommandOptionChoice])]),
					['name']
				);
				const fuzzyResult = await fuzzy.runFuzzy(focusedOption.value);

				const returnValue = !fuzzyResult.length ? this.choices : fuzzyResult;

				return this.some(Array.isArray(returnValue) ? returnValue.slice(0, 19) : [returnValue]);
			}
			default:
				return this.none();
		}
	}
}
