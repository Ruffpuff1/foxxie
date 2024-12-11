import { EmbedBuilder, time, TimestampStyles } from '@discordjs/builders';
import { ApplyOptions } from '@sapphire/decorators';
import { Listener } from '@sapphire/framework';
import { isNullish } from '@sapphire/utilities';
import { readSettings } from '#lib/Database/settings/functions';
import { getT, LanguageKeys } from '#lib/i18n';
import { FoxxieEvents } from '#lib/types';
import { seconds } from '#utils/common';
import { getLogger, getModeration } from '#utils/functions';
import { getUserMentionWithFlagsString } from '#utils/functions/users';
import { TypeVariation } from '#utils/moderationConstants';
import { getFullEmbedAuthor } from '#utils/util';
import { Colors, type GatewayGuildMemberRemoveDispatchData, type Guild, type GuildMember } from 'discord.js';

const Root = LanguageKeys.Listeners.Guilds.Members;

@ApplyOptions<Listener.Options>(({ container }) => ({ enabled: container.client.enabledProdOnlyEvent(), event: FoxxieEvents.RawMemberRemove }))
export class UserListener extends Listener {
	public async run(guild: Guild, member: GuildMember | null, { user }: GatewayGuildMemberRemoveDispatchData) {
		const settings = await readSettings(guild);
		const targetChannelId = settings.channelsLogsMemberRemove;
		if (isNullish(targetChannelId)) return;

		const isModerationAction = await this.isModerationAction(guild, user);

		const t = getT(settings.language);
		const footer = isModerationAction.kicked
			? t(Root.GuildMemberKicked)
			: isModerationAction.banned
				? t(Root.GuildMemberBanned)
				: isModerationAction.softbanned
					? t(Root.GuildMemberSoftBanned)
					: t(Root.GuildMemberRemove);

		const joinedTimestamp = this.processJoinedTimestamp(member);
		await getLogger(guild).send({
			channelId: targetChannelId,
			key: 'channelsLogsMemberRemove',
			makeMessage: () => {
				const key = joinedTimestamp === -1 ? Root.GuildMemberRemoveDescription : Root.GuildMemberRemoveDescriptionWithJoinedAt;
				const description = t(key, {
					relativeTime: time(seconds.fromMilliseconds(joinedTimestamp), TimestampStyles.RelativeTime),
					user: getUserMentionWithFlagsString(user.flags ?? 0, user.id)
				});

				return new EmbedBuilder()
					.setColor(Colors.Red)
					.setAuthor(getFullEmbedAuthor(user))
					.setDescription(description)
					.setFooter({ text: footer })
					.setTimestamp();
			}
		});
	}

	private async isModerationAction(guild: Guild, user: GatewayGuildMemberRemoveDispatchData['user']): Promise<IsModerationAction> {
		const moderation = getModeration(guild);
		await moderation.waitLock();

		const latestLogForUser = moderation.getLatestRecentCachedEntryForUser(user.id);

		if (latestLogForUser === null) {
			return {
				banned: false,
				kicked: false,
				softbanned: false
			};
		}

		return {
			banned: latestLogForUser.type === TypeVariation.Ban,
			kicked: latestLogForUser.type === TypeVariation.Kick,
			softbanned: latestLogForUser.type === TypeVariation.Softban
		};
	}

	private processJoinedTimestamp(member: GuildMember | null) {
		if (member === null) return -1;
		if (member.joinedTimestamp === null) return -1;
		return member.joinedTimestamp;
	}
}

interface IsModerationAction {
	readonly banned: boolean;
	readonly kicked: boolean;
	readonly softbanned: boolean;
}
