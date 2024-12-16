import { resolveToNull } from '@ruffpuff/utilities';
import { ApplyOptions } from '@sapphire/decorators';
import { Listener } from '@sapphire/framework';
import { isNullish } from '@sapphire/utilities';
import { ensureMember } from '#lib/Database/Models/member';
import { readSettings } from '#lib/Database/settings/functions';
import { getT, LanguageKeys } from '#lib/i18n';
import { FoxxieEvents } from '#lib/types';
import { GuildMemberRemoveBuilder } from '#utils/Discord/builders/GuildMemberRemoveBuilder';
import { getLogger, getModeration } from '#utils/functions';
import { TypeVariation } from '#utils/moderationConstants';
import { type GatewayGuildMemberRemoveDispatchData, type Guild, GuildMember } from 'discord.js';

const Root = LanguageKeys.Listeners.Guilds.Members;

@ApplyOptions<Listener.Options>(({ container }) => ({ enabled: container.client.enabledProdOnlyEvent(), event: FoxxieEvents.RawMemberRemove }))
export class UserListener extends Listener {
	public async run(guild: Guild, member: GuildMember | null, { user }: GatewayGuildMemberRemoveDispatchData) {
		if (member instanceof GuildMember) this.container.client.emit(FoxxieEvents.GuildMemberCountChannelUpdate, member);

		const settings = await readSettings(guild);
		const targetChannelId = settings.channelsLogsMemberRemove;
		if (isNullish(targetChannelId)) return;

		const isModerationAction = await this.isModerationAction(guild, user);
		const { messageCount } = await ensureMember(user.id, guild.id);
		const fetchedUser = await resolveToNull(this.container.client.users.fetch(user.id));

		if (!fetchedUser) return;

		const t = getT(settings.language);
		const footer = isModerationAction.kicked
			? Root.RemoveKicked
			: isModerationAction.banned
				? Root.RemoveBanned
				: isModerationAction.softbanned
					? Root.RemoveSoftBanned
					: Root.Remove;

		await getLogger(guild).send({
			channelId: targetChannelId,
			key: 'channelsLogsMemberRemove',
			makeMessage: () =>
				new GuildMemberRemoveBuilder(t) //
					.setMember(member)
					.setUser(fetchedUser)
					.setFooterKey(footer)
					.setMessageCount(messageCount)
					.build()
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
}

interface IsModerationAction {
	readonly banned: boolean;
	readonly kicked: boolean;
	readonly softbanned: boolean;
}
