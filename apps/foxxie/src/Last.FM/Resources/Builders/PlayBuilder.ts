import { MessageBuilder } from '@sapphire/discord.js-utilities';
import { isNullishOrZero } from '@sapphire/utilities';
import { TimeService } from '#Services';
import { bold, time, TimestampStyles, userMention } from 'discord.js';

import { TimePeriod, TimeSettingsModel } from '../Types/index.js';
import { ContextModel } from '../Util/index.js';

export class PlayBuilder {
	public static async Pace(
		context: ContextModel,
		timeSettings: TimeSettingsModel,
		goalAmount: number,
		userTotalPlaycount: number,
		registeredTimestamp: null | number = null
	) {
		const response = new MessageBuilder();
		const user = context.contextUser!;
		const { discordUser } = context;

		let count: null | number;

		if (timeSettings.timePeriod === TimePeriod.AllTime) {
			timeSettings.timeFrom = registeredTimestamp!;
			count = userTotalPlaycount;
		} else {
			count = null; // await PlayBuilder.DataSourceFactory.GetScrobbleCountFromDate(user.usernameLastFM, timeSettings.timeFrom);
		}

		if (isNullishOrZero(count)) {
			return response.setContent(`${userMention(user.userid)} No plays found in the ${timeSettings.description} time period.`);
		}

		const age = Date.now() - timeSettings.timeFrom!;
		const totalDays = age / TimeService.Days(1);

		const playsLeft = goalAmount - userTotalPlaycount;

		const avgPerDay = count / totalDays;

		const goalDate = Date.now() + TimeService.Days(playsLeft / avgPerDay);

		const reply: string[] = [];
		const differentUser = discordUser.id !== user.userid;

		if (differentUser) {
			reply.push(`${userMention(discordUser.id)} My estimate is that the user ${bold(user.usernameLastFM)}`);
		} else {
			reply.push(`${userMention(discordUser.id)} My estimate is that you`);
		}

		reply.push(` will reach ${bold(goalAmount.toLocaleString())} scrobbles on ${bold(time(new Date(goalDate), TimestampStyles.LongDate))}.`);

		return response.setContent(reply.join(''));
	}
}
