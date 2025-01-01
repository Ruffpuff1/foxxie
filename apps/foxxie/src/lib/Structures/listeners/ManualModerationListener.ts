import { resolveToNull } from '@ruffpuff/utilities';
import { Listener, ListenerOptions } from '@sapphire/framework';
import { readSettings } from '#lib/database';
import { LoggerTypeContext } from '#lib/moderation';
import { FoxxieEvents } from '#lib/types';
import { GuildMember } from 'discord.js';

export abstract class ManualModerationListener<
	E extends ManualModerationListener.ManualModerationListenerType = ManualModerationListener.ManualModerationListenerType
> extends Listener<E> {
	protected async fetchDMContext(member: GuildMember, moderatorId: string) {
		const moderator = await resolveToNull(this.container.client.users.fetch(moderatorId));
		const settings = await readSettings(member);

		return { moderator, sendDirectMessage: settings.messagesModerationDm } as const;
	}

	protected getOptions(context: LoggerTypeContext, member: GuildMember) {
		return {
			channelId: null,
			duration: null,
			imageURL: null,
			moderator: context?.userId,
			reason: context?.reason,
			user: member.id
		} as const;
	}
}

export namespace ManualModerationListener {
	export type ManualModerationListenerType = FoxxieEvents.GuildMemberUpdateRolesManualMute | FoxxieEvents.GuildMemberUpdateRolesManualUnmute;
	export type Options = ListenerOptions;
}
