import { isNullish } from '@sapphire/utilities';
import { MessageService } from '#Services';
import { FoxxieCommand } from '#Structures';

import { DataSourceFactory } from '../Factories/index.js';
import { Constants, ContextModel, PlayBuilder, TimePeriod } from '../Resources/index.js';
import { UserService } from '../Services/UserService.js';

export class PlayCommands {
	public static async Pace(...[message, args]: FoxxieCommand.MessageRunArgs) {
		await MessageService.SendLoadingMessage(message);

		const contextUser = await UserService.ResolveYouOrFoxxie(message);
		const userInfo = await DataSourceFactory.GetLfmUserInfo(contextUser.usernameLastFM);
		const goalAmount = await PlayCommands.GetGoalAmount(args, userInfo!.playcount);

		const response = await PlayBuilder.Pace(
			new ContextModel(args, contextUser),
			{ timePeriod: TimePeriod.AllTime },
			goalAmount,
			userInfo!.playcount,
			userInfo!.registered.getTime()
		);

		await MessageService.SendMessage(message, response);
	}

	private static async GetGoalAmount(args: FoxxieCommand.Args, currentPlaycount: number) {
		let goalAmount = 100;
		let ownGoalSet = false;

		const option = await args.pick('string').catch(() => null);

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
			for (const breakPoint of Constants.PlayCountBreakPoints) {
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
