import { resolveToNull } from '@ruffpuff/utilities';
import { send } from '@sapphire/plugin-editable-commands';
import { ensureMember } from '#lib/Database/Models/member';
import { LanguageKeys } from '#lib/i18n';
import { FoxxieCommand } from '#lib/structures';
import { GuildMemberRemoveBuilder } from '#utils/Discord/builders/GuildMemberRemoveBuilder';
import { getModeration } from '#utils/functions';
import { TypeVariation } from '#utils/moderationConstants';
import { Guild, Message, User } from 'discord.js';

interface IsModerationAction {
	readonly banned: boolean;
	readonly kicked: boolean;
	readonly softbanned: boolean;
}

const Root = LanguageKeys.Listeners.Guilds.Members;

export class UserCommand extends FoxxieCommand {
	public async messageRun(msg: Message, args: FoxxieCommand.Args): Promise<void> {
		const member = await args.pick('member').catch(() => msg.member!);

		const isModerationAction = await this.isModerationAction(msg.guild!, member.user);
		const { messageCount } = await ensureMember(member.user.id, msg.guild!.id);
		const fetchedUser = await resolveToNull(this.container.client.users.fetch(member.user.id));

		if (!fetchedUser) return;

		const footer = isModerationAction.kicked
			? Root.RemoveKicked
			: isModerationAction.banned
				? Root.RemoveBanned
				: isModerationAction.softbanned
					? Root.RemoveSoftBanned
					: Root.Remove;

		await send(
			msg,
			new GuildMemberRemoveBuilder(args.t) //
				.setMember(member)
				.setUser(member.user)
				.setFooterKey(footer)
				.setMessageCount(messageCount)
				.build()
		);
	}

	private async isModerationAction(guild: Guild, user: User): Promise<IsModerationAction> {
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
