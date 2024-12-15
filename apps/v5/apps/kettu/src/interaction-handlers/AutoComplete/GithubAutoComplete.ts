import { CommandName } from '#types/Interactions';
import { fetchFuzzyRepo, fetchFuzzyUser, fuzzilySearchForIssuesAndPullRequests, GithubOptionType, Label } from '#utils/APIs';
import { ApplyOptions } from '@sapphire/decorators';
import { InteractionHandler, InteractionHandlerTypes } from '@sapphire/framework';
import type { AutocompleteInteraction } from 'discord.js';

@ApplyOptions<InteractionHandler.Options>({
    interactionHandlerType: InteractionHandlerTypes.Autocomplete
})
export class UserInteractionHandler extends InteractionHandler {
    public override async run(interaction: AutocompleteInteraction, result: InteractionHandler.ParseResult<this>) {
        return interaction.respond(result);
    }

    public override async parse(interaction: AutocompleteInteraction) {
        if (interaction.commandName !== CommandName.Github) return this.none();
        const option = interaction.options.getFocused(true);

        switch (option.name) {
            case GithubOptionType.User:
            case GithubOptionType.Owner: {
                const fuzzyResult = await fetchFuzzyUser(option.value as string);
                return this.some(fuzzyResult.map(entry => ({ value: entry.login as string, name: (entry as unknown as Label).label ?? (entry.login as string) })));
            }
            case GithubOptionType.Repo: {
                const fuzzyResult = await fetchFuzzyRepo(interaction.options.getString(GithubOptionType.Owner, true), option.value as string);
                return this.some(fuzzyResult.map(entry => ({ value: entry.name, name: entry.name })));
            }
            case 'number': {
                const data = await fuzzilySearchForIssuesAndPullRequests({
                    repository: interaction.options.getString(GithubOptionType.Repo, true),
                    owner: interaction.options.getString(GithubOptionType.Owner, true),
                    number: option.value.toString()
                });
                return this.some(data);
            }
            default:
                return this.none();
        }
    }
}
