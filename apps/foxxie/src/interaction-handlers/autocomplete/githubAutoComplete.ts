import type { AutocompleteInteraction } from 'discord.js';

import { ApplyOptions } from '@sapphire/decorators';
import { InteractionHandler, InteractionHandlerTypes } from '@sapphire/framework';
import { fetchFuzzyRepo, fetchFuzzyUser, fuzzilySearchForIssuesAndPullRequests, GithubOptionType, Label } from '#lib/api/Github/util';

@ApplyOptions<InteractionHandler.Options>({
	interactionHandlerType: InteractionHandlerTypes.Autocomplete
})
export class UserInteractionHandler extends InteractionHandler {
	public override async parse(interaction: AutocompleteInteraction) {
		if (interaction.commandName !== 'github') return this.none();
		const option = interaction.options.getFocused(true);

		switch (option.name) {
			case GithubOptionType.Number: {
				const data = await fuzzilySearchForIssuesAndPullRequests({
					number: option.value.toString(),
					owner: interaction.options.getString(GithubOptionType.Owner, true),
					repository: interaction.options.getString(GithubOptionType.Repo, true)
				});
				return this.some(data);
			}
			case GithubOptionType.Owner:
			case GithubOptionType.User: {
				const fuzzyResult = await fetchFuzzyUser(option.value as string);
				return this.some(
					fuzzyResult.map((entry) => ({ name: (entry as unknown as Label).label ?? (entry.login as string), value: entry.login as string }))
				);
			}
			case GithubOptionType.Repo: {
				const fuzzyResult = await fetchFuzzyRepo(interaction.options.getString(GithubOptionType.Owner, true), option.value as string);
				return this.some(fuzzyResult.map((entry) => ({ name: entry.name, value: entry.name })));
			}
			default:
				return this.none();
		}
	}

	public override async run(interaction: AutocompleteInteraction, result: InteractionHandler.ParseResult<this>) {
		return interaction.respond(result);
	}
}
