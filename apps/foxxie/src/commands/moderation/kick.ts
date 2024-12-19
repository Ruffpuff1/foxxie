import { ApplyOptions } from '@sapphire/decorators';
import { readSettings } from '#lib/database/settings/functions';
import { LanguageKeys } from '#lib/i18n';
import { ModerationCommand } from '#lib/moderation/structures/ModerationCommand';
import { GuildMessage } from '#lib/types';
import { getModeration } from '#utils/functions';
import { TypeVariation, Unlock } from '#utils/moderationConstants';
import { PermissionFlagsBits } from 'discord.js';

type Type = TypeVariation.Kick;
type ValueType = null | Unlock;

@ApplyOptions<ModerationCommand.Options<Type>>({
	aliases: ['k'],
	description: LanguageKeys.Commands.Moderation.Kick.Description,
	detailedDescription: LanguageKeys.Commands.Moderation.Kick.DetailedDescription,
	requiredClientPermissions: [PermissionFlagsBits.KickMembers],
	requiredMember: true,
	type: TypeVariation.Kick
})
export class UserModerationCommand extends ModerationCommand<Type, ValueType> {
	protected override async checkTargetCanBeModerated(message: GuildMessage, context: ModerationCommand.HandlerParameters<ValueType>) {
		const member = await super.checkTargetCanBeModerated(message, context);
		if (member && !member.kickable) throw context.args.t(LanguageKeys.Commands.Moderation.Kick.NotKickable);
		return member;
	}

	protected override postHandle(_message: GuildMessage, { preHandled }: ModerationCommand.PostHandleParameters<ValueType>) {
		preHandled?.unlock();
	}

	protected override async preHandle(message: GuildMessage) {
		const settings = await readSettings(message.guild);
		return settings.eventsKick ? { unlock: getModeration(message.guild).createLock() } : null;
	}
}
