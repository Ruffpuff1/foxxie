import { resolveToNull } from '@ruffpuff/utilities';
import { isNullish, toTitleCase } from '@sapphire/utilities';
import { getT, LanguageKeys } from '#lib/i18n';
import { UserUtil } from '#utils/functions';
import { Guild, User } from 'discord.js';

export class LastFMUserUtil {
	public static async UserHeader(searchedUserId: string, user: User, lfmUsername: string, guild?: Guild, t = getT('en-SS')) {
		let userTitle: string;

		const searchedDiscordUser = await UserUtil.Fetch(searchedUserId);
		const searchedGuildMember = isNullish(guild) ? null : await resolveToNull(guild.members.fetch(searchedUserId));

		const usernameToUse = searchedGuildMember?.displayName || searchedDiscordUser?.displayName || lfmUsername;

		const differentUser = UserUtil.AreDifferent(searchedUserId, user.id);

		if (differentUser) {
			const contextDiscordMember = isNullish(guild) ? null : await resolveToNull(guild.members.fetch(searchedUserId));

			const contextUsername = contextDiscordMember?.displayName || user?.displayName || toTitleCase(t(LanguageKeys.Globals.Unknown));

			userTitle = `${usernameToUse}, requested by ${contextUsername}`;
		} else {
			userTitle = usernameToUse;
		}

		return [userTitle, differentUser, searchedDiscordUser] as const;
	}
}
