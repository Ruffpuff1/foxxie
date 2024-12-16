import { ApplyOptions } from '@sapphire/decorators';
import { send } from '@sapphire/plugin-editable-commands';
import { TFunction } from '@sapphire/plugin-i18next';
import { UpdateService } from '#apis/last.fm/services/UpdateService';
import { UpdateType, UpdateTypeBitfield } from '#apis/last.fm/types/enums/UpdateType';
import { ResponseStatus } from '#apis/last.fm/types/ResponseStatus';
import { LanguageKeys } from '#lib/i18n';
import { FoxxieSubcommand } from '#lib/Structures/commands/FoxxieSubcommand';
import { Emojis } from '#utils/constants';
import { RequiresLastFMUsername } from '#utils/decorators';
import { lastFmUserUrl } from '#utils/transformers';
import { mapSubcommandAliases, resolveClientColor } from '#utils/util';
import { blue } from 'colorette';
import { EmbedBuilder, User } from 'discord.js';

@ApplyOptions<FoxxieSubcommand.Options>({
	aliases: ['fm'],
	description: LanguageKeys.Commands.Websearch.LastFm.Description,
	detailedDescription: LanguageKeys.Commands.Websearch.LastFm.DetailedDescription,
	subcommands: [...mapSubcommandAliases('update', 'update', false, 'u')]
})
export class UserCommand extends FoxxieSubcommand {
	#updateService = new UpdateService();

	@RequiresLastFMUsername(LanguageKeys.Preconditions.LastFMLogin)
	public async update(...[message, args]: FoxxieSubcommand.RunArgs) {
		const option = await args.repeat('string').catch(() => []);
		const resolved = this.#updateResolveOption(option, args.t);

		const contextUser = (await this.container.prisma.userLastFM.findFirst({ where: { userid: message.author.id } }))!;

		if (!resolved || !resolved.toArray().length) {
			await send(message, args.t(LanguageKeys.Commands.Websearch.LastFm.UpdateLoading));

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
						args
							.t(LanguageKeys.Commands.Websearch.LastFm.UpdateNoListeningHistory, {
								url: lastFmUserUrl(contextUser.usernameLastFM),
								username: contextUser.usernameLastFM
							})
							.join('\n')
					);

					return send(message, { content: null!, embeds: [embed] });
				}
			}

			const updatedDescription: string[] = [];

			if (update.content.newRecentTracksAmount === 0 && update.content.removedRecentTracksAmount === 0) {
				const previousUpdate = contextUser.lastUpdated;

				updatedDescription.push(
					args.t(LanguageKeys.Commands.Websearch.LastFm.UpdateNothingNew, {
						previous: previousUpdate,
						url: lastFmUserUrl(contextUser.usernameLastFM)
					})
				);

				return send(message, updatedDescription.join('\n'));
			}
			if (!update.content.removedRecentTracksAmount) {
				updatedDescription.push(
					args.t(LanguageKeys.Commands.Websearch.LastFm.UpdateSuccessNew, { count: update.content.newRecentTracksAmount })
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

		this.container.logger.debug(`[${blue('Last.fm')}]: Returned error: ${message} | ${responseStatus} | ${user.username} | ${user.id}`);
		return embed;
	}

	#updateResolveOption(options: (never | string)[], t: TFunction) {
		if (!options.length) return null;
		const bits = new UpdateTypeBitfield();
		const flags = t(LanguageKeys.Commands.Websearch.LastFm.UpdateOptions);

		if (options.some((o) => flags.full.includes(o.toLowerCase()))) {
			bits.add(UpdateType.Full);
		}

		if (options.some((o) => flags.plays.includes(o.toLowerCase()))) {
			bits.add(UpdateType.AllPlays);
		}

		if (options.some((o) => flags.artists.includes(o.toLowerCase()))) {
			bits.add(UpdateType.Artist);
		}

		return bits;
	}
}
