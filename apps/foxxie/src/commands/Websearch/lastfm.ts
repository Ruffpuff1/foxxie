import { ApplyOptions } from '@sapphire/decorators';
import { send } from '@sapphire/plugin-editable-commands';
import { IndexService } from '#apis/last.fm/services/IndexService';
import { UpdateService } from '#apis/last.fm/services/UpdateService';
import { UpdateType, UpdateTypeBitfield } from '#apis/last.fm/types/enums/UpdateType';
import { ResponseStatus } from '#apis/last.fm/types/ResponseStatus';
import { LanguageKeys } from '#lib/i18n';
import { FoxxieSubcommand } from '#lib/Structures/commands/FoxxieSubcommand';
import { PermissionLevels } from '#lib/types';
import { minutes } from '#utils/common';
import { Emojis } from '#utils/constants';
import { RequiresLastFMUsername } from '#utils/decorators';
import { sendLoadingMessage, sendMessage } from '#utils/functions';
import { lastFmUserUrl } from '#utils/transformers';
import { mapSubcommandAliases, resolveClientColor } from '#utils/util';
import { blue } from 'colorette';
import { EmbedBuilder, inlineCode, User } from 'discord.js';
import _ from 'lodash';

@ApplyOptions<FoxxieSubcommand.Options>({
	aliases: ['fm'],
	description: LanguageKeys.Commands.Websearch.LastFm.Description,
	detailedDescription: LanguageKeys.Commands.Websearch.LastFm.DetailedDescription,
	permissionLevel: PermissionLevels.BotOwner,
	subcommands: [...mapSubcommandAliases('update', 'update', false, 'u')]
})
export class UserCommand extends FoxxieSubcommand {
	#indexService = new IndexService();

	#updateService = new UpdateService();

	@RequiresLastFMUsername(LanguageKeys.Preconditions.LastFMLogin)
	public async update(...[message, args]: FoxxieSubcommand.RunArgs) {
		const option = await args.repeat('string').catch(() => []);
		const resolved = this.#updateResolveOption(option, args.t);

		const contextUser = (await this.container.prisma.userLastFM.findFirst({ where: { userid: message.author.id } }))!;

		if (!resolved || !resolved.toArray().length) {
			await sendLoadingMessage(message, LanguageKeys.Commands.Websearch.LastFm.UpdateLoading);

			const update = await this.#updateService.updateUserAndGetRecentTracks(contextUser);

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

				if (update.content.recentTracks && update.content.recentTracks.length) {
					if (!update.content.recentTracks.some((a) => a.nowPlaying)) {
						const latestScrobble = _.maxBy(update.content.recentTracks, (o) => o.timePlayed?.getTime());
						if (latestScrobble && latestScrobble.timePlayed) {
							updatedDescription.push(
								args.t(LanguageKeys.Commands.Websearch.LastFm.UpdateLastScrobble, { time: latestScrobble.timePlayed })
							);
						}
					}
				}

				return sendMessage(message, updatedDescription.join('\n'));
			}
			if (update.content.removedRecentTracksAmount) {
				updatedDescription.push(
					`${args.t(LanguageKeys.Commands.Websearch.LastFm.UpdateSuccessNew, { count: update.content.newRecentTracksAmount }).replace('.', '')} and ${update.content.removedRecentTracksAmount} removed scrobbles.`
				);
			} else {
				updatedDescription.push(
					args.t(LanguageKeys.Commands.Websearch.LastFm.UpdateSuccessNew, { count: update.content.newRecentTracksAmount })
				);
			}

			if (update.content.newRecentTracksAmount! < 25) {
				const random = Math.floor(Math.random() * 5) + 1;
				if (random === 1) {
				}

				if (random === 2) {
				}
			}

			return sendMessage(message, updatedDescription);
		}

		const indexStarted = this.#indexService.indexStarted(contextUser.userid);

		if (!indexStarted) {
			return sendMessage(message, args.t(LanguageKeys.Commands.Websearch.LastFm.UpdateIndexStarted));
		}

		if (contextUser.lastIndexed.getTime() > Date.now() - minutes(30)) {
			return sendMessage(message, args.t(LanguageKeys.Commands.Websearch.LastFm.UpdateIndexFrequent));
		}

		await sendMessage(
			message,
			args.t(LanguageKeys.Commands.Websearch.LastFm.UpdateIndexDescription, { description: this.#formatIndexDescription(resolved, args.t) })
		);

		const result = await this.#indexService.modularUpdate(contextUser, resolved);
		console.log(result);

		await sendMessage(message, 'done');

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

	#formatIndexDescription(resolved: UpdateTypeBitfield, t: FoxxieSubcommand.T) {
		const description: string[] = [];
		const types = t(LanguageKeys.Commands.Websearch.LastFm.UpdateTypes);

		if (resolved.has(UpdateType.Full)) {
			description.push(inlineCode(types.everything));
			return description.join('\n');
		}

		if (resolved.has(UpdateType.AllPlays)) {
			description.push(inlineCode(types.plays));
		}

		if (resolved.has(UpdateType.Artist)) {
			description.push(inlineCode(types.artists));
		}

		return t(LanguageKeys.Globals.And, { value: description });
	}

	#updateResolveOption(options: (never | string)[], t: FoxxieSubcommand.T) {
		if (!options.length) return null;
		const bits = new UpdateTypeBitfield();
		const flags = t(LanguageKeys.Commands.Websearch.LastFm.UpdateOptions);

		if (options.some((o) => flags.full.includes(o.toLowerCase()))) {
			bits.add(UpdateType.Full);
			return bits;
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
