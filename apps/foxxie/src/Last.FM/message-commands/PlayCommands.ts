import { RequiresClientPermissions } from '@sapphire/decorators';
import { isNullish } from '@sapphire/utilities';
import { PlayBuilder } from '#apis/last.fm/builders/PlayBuilder';
import { DataSourceFactory } from '#apis/last.fm/factories/DataSourceFactory';
import { ContextModel, playCountBreakPoints } from '#apis/last.fm/index';
import { TimePeriod } from '#apis/last.fm/types/enums/TimePeriod';
import { LanguageKeys } from '#lib/i18n';
import { FoxxieCommand } from '#lib/structures';
import { LastFMCommand } from '#root/commands/websearch/lastfm';
import { RequiresLastFMUsername, RequiresMemberPermissions } from '#utils/decorators';
import { sendLoadingMessage, sendMessage } from '#utils/functions';
import { resolveYouOrFoxxie } from '#utils/resolvers';
import { PermissionFlagsBits } from 'discord.js';

export class PlayCommands {
	@RequiresClientPermissions(PermissionFlagsBits.EmbedLinks)
	@RequiresMemberPermissions(PermissionFlagsBits.EmbedLinks)
	public static async NowPlaying(...[message, args]: FoxxieCommand.MessageRunArgs) {
		await sendLoadingMessage(message);
		const contextUser = await args.pick(LastFMCommand.UserArgument).catch(() => resolveYouOrFoxxie(message));

		const response = await PlayBuilder.NowPlaying(new ContextModel(args, contextUser));
		await sendMessage(message, response);
	}

	@RequiresClientPermissions(PermissionFlagsBits.EmbedLinks)
	@RequiresLastFMUsername(LanguageKeys.Preconditions.LastFMLogin)
	@RequiresMemberPermissions(PermissionFlagsBits.EmbedLinks)
	public static async Pace(...[message, args]: FoxxieCommand.MessageRunArgs) {
		await sendLoadingMessage(message);

		const contextUser = await resolveYouOrFoxxie(message);
		const userInfo = await DataSourceFactory.GetLfmUserInfo(contextUser.usernameLastFM);
		const goalAmount = PlayCommands.GetGoalAmount(await args.pick('string').catch(() => null), userInfo!.playcount);

		const response = await PlayBuilder.Pace(
			new ContextModel(args, contextUser),
			{ timePeriod: TimePeriod.AllTime },
			goalAmount,
			userInfo!.playcount,
			userInfo!.registered.getTime()
		);

		await sendMessage(message, response);
	}

	private static GetGoalAmount(option: null | string, currentPlaycount: number) {
		let goalAmount = 100;
		let ownGoalSet = false;

		if (!isNullish(option)) {
			const lower = option.toLowerCase();

			if (lower.endsWith('k')) {
				let parsed = parseInt(lower.replace('k', ''), 10);
				if (!isNaN(parsed)) {
					parsed *= 1000;
					if (parsed > currentPlaycount) {
						goalAmount = parsed;
						ownGoalSet = true;
					}
				}
			} else {
				const parsed = parseInt(lower, 10);
				if (!isNaN(parsed) && parsed > currentPlaycount) {
					goalAmount = parsed;
					ownGoalSet = true;
				}
			}
		}

		if (!ownGoalSet) {
			for (const breakPoint of playCountBreakPoints) {
				if (currentPlaycount < breakPoint) {
					goalAmount = breakPoint;
					break;
				}
			}
		}

		if (goalAmount > 10000000) goalAmount = 10000000;

		return goalAmount;
	}
}
