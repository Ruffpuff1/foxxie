import type { SelectMenuInteraction } from 'discord.js';

import { hideLinkEmbed, hyperlink } from '@discordjs/builders';
import { ApplyOptions } from '@sapphire/decorators';
import { InteractionHandler, InteractionHandlerTypes } from '@sapphire/framework';
import { fetchIssuesAndPrs, GithubOptionType, IssueOrPrDetails } from '#lib/api/Github/util';

@ApplyOptions<InteractionHandler.Options>({
	interactionHandlerType: InteractionHandlerTypes.SelectMenu
})
export class UserInteractionHandler extends InteractionHandler {
	public override async parse(interaction: SelectMenuInteraction) {
		if (!interaction.customId.startsWith('github|')) return this.none();

		const value = interaction.values[0];
		const [, type, repository, owner] = interaction.customId.split('|');
		let data;

		switch (type) {
			case GithubOptionType.Repo:
				data = await fetchIssuesAndPrs({ number: parseInt(value, 10), owner, repository });
				break;
		}

		return this.some({ data, type: type as GithubOptionType.Repo });
	}

	public override async run(interaction: SelectMenuInteraction, result: InteractionHandler.ParseResult<this>) {
		const data = result.data as IssueOrPrDetails;

		switch (result.type) {
			case GithubOptionType.Repo: {
				const parts = [
					`${data.emoji} ${hyperlink(`#${data.number} in ${data.owner}/${data.repository}`, hideLinkEmbed(data.url))} by ${hyperlink(
						data.author.login!,
						hideLinkEmbed(data.author.url!)
					)} ${data.dateString}`,
					data.title
				];

				return interaction.reply(parts.join('\n'));
			}
		}
	}
}
