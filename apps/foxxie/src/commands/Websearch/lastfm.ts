import { ApplyOptions } from '@sapphire/decorators';
import { send } from '@sapphire/plugin-editable-commands';
import { UpdateService } from '#apis/last.fm/services/UpdateService';
import { UpdateType, UpdateTypeBitfield } from '#apis/last.fm/types/enums/UpdateType';
import { ResponseStatus } from '#apis/last.fm/types/ResponseStatus';
import { LanguageKeys } from '#lib/i18n';
import { FoxxieSubcommand } from '#lib/Structures/commands/FoxxieSubcommand';
import { seconds } from '#utils/common';
import { Emojis } from '#utils/constants';
import { RequiresLastFMUsername } from '#utils/decorators';
import { lastFmUserUrl } from '#utils/transformers';
import { mapSubcommandAliases, resolveClientColor } from '#utils/util';
import { blue } from 'colorette';
import { bold, EmbedBuilder, time, TimestampStyles, User } from 'discord.js';

@ApplyOptions<FoxxieSubcommand.Options>({
	aliases: ['fm'],
	description: LanguageKeys.Commands.Websearch.PokemonDescription,
	detailedDescription: LanguageKeys.Commands.Websearch.PokemonDetailedDescription,
	subcommands: [...mapSubcommandAliases('update', 'update', false, 'u')]
})
export class UserCommand extends FoxxieSubcommand {
	#updateService = new UpdateService();

	@RequiresLastFMUsername(LanguageKeys.Preconditions.LastFMLogin)
	public async update(...[message, args]: FoxxieSubcommand.RunArgs) {
		const option = await args.repeat('string').catch(() => []);
		const resolved = this.#updateResolveOption(option);

		const contextUser = (await this.container.prisma.userLastFM.findFirst({ where: { userid: message.author.id } }))!;

		if (!resolved || !resolved.toArray().length) {
			await send(message, `${Emojis.Loading} Just a second, fetching your latest scrobbles...`);

			const update = await this.#updateService.updateUserAndGetRecentTracks(contextUser);
			console.log(update);

			if (!update?.success || !update.content || !update.content.recentTracks.length) {
				const embed = new EmbedBuilder();

				if (!update?.success || !update.content.recentTracks) {
					this.#errorResponse(
						embed.setColor(await resolveClientColor(message, message.member.displayColor)),
						message.author,
						update?.error,
						update?.message
					);

					return send(message, { content: null!, embeds: [embed] });
				}

				if (!update.content.recentTracks.length) {
					embed.setDescription(
						[
							`The Last.fm user **{userName}** has no listening history on [their profile](${lastFmUserUrl(contextUser.usernameLastFM)}) yet.`,
							`• Just created your Last.fm account? Make sure you set it to [track your music app](https://www.last.fm/about/trackmymusic).`,
							`• Using Spotify? You can link that [here](https://www.last.fm/settings/applications). This can take a few minutes to start working.`
						].join('\n')
					);

					return send(message, { content: null!, embeds: [embed] });
				}
			}

			const updatedDescription: string[] = [];

			if (update.content.newRecentTracksAmount === 0 && update.content.removedRecentTracksAmount === 0) {
				const previousUpdate = contextUser.lastUpdated;

				updatedDescription.push(
					`${Emojis.Loading} Nothing new found on [your Last.fm profile](<${lastFmUserUrl(contextUser.usernameLastFM)}>) since last check ${time(seconds.fromMilliseconds(previousUpdate.getTime()), TimestampStyles.RelativeTime)}.`
				);

				return send(message, updatedDescription.join('\n'));
			}
			if (!update.content.removedRecentTracksAmount) {
				updatedDescription.push(
					`${Emojis.Success} Cached playcounts have been updated for ${bold(contextUser.usernameLastFM)} based on ${update.content.newRecentTracksAmount} new scrobbles.`
				);
			}

			return send(message, updatedDescription.join('\n'));
		}

		return null;
	}

	#errorResponse(embed: EmbedBuilder, user: User, responseStatus?: ResponseStatus, message?: string) {
		embed.setTitle('Problem while contacting Last.fm');

		// eslint-disable-next-line @typescript-eslint/switch-exhaustiveness-check
		switch (responseStatus) {
			case ResponseStatus.BadAuth:
				embed.setDescription(
					`${Emojis.Error} Can't retrieve date because your Last.fm session is expired, invalid or Last.fm is having issues.`
				);
				break;
			case ResponseStatus.Failure:
				embed.setDescription(`${Emojis.Error} Can't retrieve data because Last.fm returned an error. Please try again later.`);
				break;
			case ResponseStatus.MissingParameters:
				if (message === 'Not found') {
					embed.setDescription(
						`${Emojis.Error} Last.fm did not return a result. Maybe there are no results or you're looking for a user that recently changed their username.`
					);
					break;
				}

				embed.setDescription(`${Emojis.Error} ${message || 'Unknown error'}`);
				break;
			default:
				embed.setDescription(`${Emojis.Error} ${message || 'Unknown error'}`);
				break;
		}

		if (responseStatus) {
			embed.setFooter({ text: `Last.fm error code: ${responseStatus}` });
		}

		this.container.logger.debug(`[${blue('Last.fm')}]: Returned error: ${message} | ${responseStatus} | ${user.username} | ${user.id}`);
		return embed;
	}

	#updateResolveOption(options: (never | string)[]) {
		if (!options.length) return null;
		const bits = new UpdateTypeBitfield();

		if (options.some((o) => ['all', 'full'].includes(o.toLowerCase()))) {
			bits.add(UpdateType.Full);
		}

		if (options.some((o) => ['play', 'plays', 'scrobbles'].includes(o.toLowerCase()))) {
			bits.add(UpdateType.AllPlays);
		}

		if (options.some((o) => ['artist', 'artists'].includes(o.toLowerCase()))) {
			bits.add(UpdateType.Artist);
		}

		return bits;
	}
}
