import { UserLastFM } from '@prisma/client';
import { ApplyOptions, RequiresClientPermissions } from '@sapphire/decorators';
import { Args, container } from '@sapphire/framework';
import { send } from '@sapphire/plugin-editable-commands';
import { applyLocalizedBuilder } from '@sapphire/plugin-i18next';
import { IndexService } from '#apis/last.fm/services/IndexService';
import { UpdateService } from '#apis/last.fm/services/UpdateService';
import { UpdateType, UpdateTypeBitfield } from '#apis/last.fm/types/enums/UpdateType';
import { ResponseStatus } from '#apis/last.fm/types/ResponseStatus';
import { ContextModel } from '#apis/last.fm/util/ContextModel';
import { PlayBuilder, UserBuilder } from '#apis/last.fm/util/index';
import { LanguageKeys } from '#lib/i18n';
import { FoxxieSubcommand } from '#lib/Structures/commands/FoxxieSubcommand';
import { GuildMessage, PermissionLevels } from '#lib/types';
import { minutes } from '#utils/common';
import { Emojis } from '#utils/constants';
import {
	RegisterChatInputCommand,
	RegisterChatInputSubcommandMethod,
	RegisterMessageSubcommandMethod,
	RequiresLastFMUsername,
	RequiresMemberPermissions
} from '#utils/decorators';
import { sendLoadingMessage, sendMessage } from '#utils/functions';
import { resolveLastFMUser, resolveYouOrFoxxie } from '#utils/resolvers';
import { lastFmUserUrl } from '#utils/transformers';
import { resolveClientColor } from '#utils/util';
import { blue } from 'colorette';
import { EmbedBuilder, inlineCode, PermissionFlagsBits, SlashCommandBuilder, User } from 'discord.js';
import _ from 'lodash';

@ApplyOptions<FoxxieSubcommand.Options>(LastFMCommand.Options)
@RegisterChatInputCommand(LastFMCommand.ChatInputBuilder, LastFMCommand.IdHints)
@RegisterChatInputSubcommandMethod(LastFMCommand.SubcommandKeys.FM, LastFMCommand.ChatInputFM)
@RegisterMessageSubcommandMethod(LastFMCommand.SubcommandKeys.Update, LastFMCommand.MessageRunUpdate, { aliases: ['u'] })
@RegisterMessageSubcommandMethod(LastFMCommand.SubcommandKeys.Profile, LastFMCommand.MessageRunProfile, { aliases: ['user', 'userinfo', 'stats'] })
@RegisterMessageSubcommandMethod(LastFMCommand.SubcommandKeys.FM, LastFMCommand.MessageRunFM, {
	aliases: ['currenttrack', 'ct', 'np', 'nowplaying'],
	default: true
})
export class LastFMCommand extends FoxxieSubcommand {
	public static ChatInputBuilder(builder: SlashCommandBuilder) {
		return applyLocalizedBuilder(builder, LastFMCommand.Language.Name, LastFMCommand.Language.Description) //
			.addSubcommand((command) =>
				applyLocalizedBuilder(command, LastFMCommand.Language.FM)
					.addStringOption((option) => applyLocalizedBuilder(option, LastFMCommand.Language.OptionsUserFM))
					.addBooleanOption((option) => applyLocalizedBuilder(option, LastFMCommand.Language.OptionsShow))
			);
	}

	@RequiresClientPermissions(PermissionFlagsBits.EmbedLinks)
	@RequiresMemberPermissions(PermissionFlagsBits.EmbedLinks)
	public static async ChatInputFM(interaction: FoxxieSubcommand.Interaction) {
		const hidden = (await interaction.options.getBoolean('show')) ?? true;
		await sendLoadingMessage(interaction, hidden);
		const contextUser = await resolveLastFMUser(interaction, interaction.options.getString('user'));

		const response = await LastFMCommand.PlayBuilder.nowPlaying(new ContextModel(interaction, contextUser));
		await interaction.editReply(response);
	}

	@RequiresClientPermissions(PermissionFlagsBits.EmbedLinks)
	@RequiresMemberPermissions(PermissionFlagsBits.EmbedLinks)
	public static async MessageRunFM(...[message, args]: FoxxieSubcommand.MessageRunArgs) {
		await sendLoadingMessage(message);
		const contextUser = await args.pick(LastFMCommand.UserArgument).catch(() => resolveYouOrFoxxie(message));

		const response = await LastFMCommand.PlayBuilder.nowPlaying(new ContextModel(args, contextUser));
		await sendMessage(message, response);
	}

	@RequiresClientPermissions(PermissionFlagsBits.EmbedLinks)
	@RequiresMemberPermissions(PermissionFlagsBits.EmbedLinks)
	public static async MessageRunProfile(...[message, args]: FoxxieSubcommand.MessageRunArgs) {
		await sendLoadingMessage(message);
		const contextUser = await args.pick(LastFMCommand.UserArgument).catch(() => resolveYouOrFoxxie(message));

		const response = await LastFMCommand.UserBuilder.profile(new ContextModel(args, contextUser));
		await sendMessage(message, response);
	}

	@RequiresClientPermissions(PermissionFlagsBits.EmbedLinks)
	@RequiresLastFMUsername(LanguageKeys.Preconditions.LastFMLogin)
	@RequiresMemberPermissions(PermissionFlagsBits.EmbedLinks)
	public static async MessageRunUpdate(...[message, args]: FoxxieSubcommand.MessageRunArgs) {
		const option = await args.repeat('string').catch(() => []);
		const resolved = LastFMCommand.ResolveUpdateOption(option, args.t);

		const contextUser = (await container.prisma.userLastFM.findFirst({ where: { userid: message.author.id } }))!;

		if (!resolved || !resolved.toArray().length) {
			await sendLoadingMessage(message, LanguageKeys.Commands.Websearch.LastFm.UpdateLoading);

			const update = await LastFMCommand.UpdateService.updateUserAndGetRecentTracks(contextUser);

			if (!update?.success || !update.content || !update.content.recentTracks.length) {
				const embed = new EmbedBuilder();

				if (!update?.success || !update.content.recentTracks) {
					LastFMCommand.ErrorResponse(
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
						previous: previousUpdate || new Date(),
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

		const indexStarted = LastFMCommand.IndexService.indexStarted(contextUser.userid);

		if (!indexStarted) {
			return sendMessage(message, args.t(LanguageKeys.Commands.Websearch.LastFm.UpdateIndexStarted));
		}

		if (contextUser.lastIndexed && contextUser.lastIndexed.getTime() > Date.now() - minutes(30)) {
			return sendMessage(message, args.t(LanguageKeys.Commands.Websearch.LastFm.UpdateIndexFrequent));
		}

		await sendMessage(
			message,
			args.t(LanguageKeys.Commands.Websearch.LastFm.UpdateIndexDescription, {
				description: LastFMCommand.FormatIndexDescription(resolved, args.t)
			})
		);

		const result = await LastFMCommand.IndexService.modularUpdate(contextUser, resolved);
		console.log(result);

		await sendMessage(message, 'done');

		return null;
	}

	private static ErrorResponse(embed: EmbedBuilder, user: User, responseStatus?: ResponseStatus, message?: string) {
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

		container.logger.debug(`[${blue('Last.fm')}]: Returned error: ${message} | ${responseStatus} | ${user.username} | ${user.id}`);
		return embed;
	}

	private static FormatIndexDescription(resolved: UpdateTypeBitfield, t: FoxxieSubcommand.T) {
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

	private static ResolveUpdateOption(options: (never | string)[] | string, t: FoxxieSubcommand.T) {
		const resolvedArray = typeof options === 'string' ? [options] : options;

		if (!resolvedArray.length) return null;
		const bits = new UpdateTypeBitfield();
		const flags = t(LanguageKeys.Commands.Websearch.LastFm.UpdateOptions);

		if (resolvedArray.some((o) => flags.full.includes(o.toLowerCase()))) {
			bits.add(UpdateType.Full);
			return bits;
		}

		if (resolvedArray.some((o) => flags.plays.includes(o.toLowerCase()))) {
			bits.add(UpdateType.AllPlays);
		}

		if (resolvedArray.some((o) => flags.artists.includes(o.toLowerCase()))) {
			bits.add(UpdateType.Artist);
		}

		return bits;
	}

	public static IdHints = [
		'1318918607337558097' // nightly
	];

	public static Language = LanguageKeys.Commands.Websearch.LastFm;

	public static Options: FoxxieSubcommand.Options = {
		aliases: ['fm', 'lfm'],
		description: LastFMCommand.Language.Description,
		detailedDescription: LastFMCommand.Language.DetailedDescription,
		permissionLevel: PermissionLevels.BotOwner
	};

	public static SubcommandKeys = {
		FM: 'fm',
		Profile: 'profile',
		Update: 'update'
	};

	protected static UserArgument = Args.make<UserLastFM>(async (parameter, context) => {
		const resolved = await resolveLastFMUser(context.message as GuildMessage, parameter);
		return Args.ok(resolved);
	});

	private static IndexService = new IndexService();

	private static PlayBuilder = new PlayBuilder();

	private static UpdateService = new UpdateService();

	private static UserBuilder = new UserBuilder();
}
