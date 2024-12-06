import { readSettings } from '#lib/Database/settings/functions';
import { LanguageKeys } from '#lib/i18n';
import { ModerationCommand } from '#lib/moderation/structures/ModerationCommand';
import { GuildMessage } from '#lib/types';
import { getModeration } from '#utils/functions';
import { TypeVariation, Unlock } from '#utils/moderationConstants';
import { ApplyOptions } from '@sapphire/decorators';
import { PermissionFlagsBits } from 'discord.js';

type Type = TypeVariation.Kick;
type ValueType = Unlock | null;

@ApplyOptions<ModerationCommand.Options<Type>>({
	aliases: ['k'],
	description: LanguageKeys.Commands.Moderation.CaseDescription,
	detailedDescription: LanguageKeys.Commands.Moderation.KickDetailedDescription,
	requiredClientPermissions: [PermissionFlagsBits.KickMembers],
	requiredMember: true,
	type: TypeVariation.Kick
})
export class UserModerationCommand extends ModerationCommand<Type, ValueType> {
	protected override async preHandle(message: GuildMessage) {
		const settings = await readSettings(message.guild);
		return settings.eventsKick ? { unlock: getModeration(message.guild).createLock() } : null;
	}

	protected override postHandle(_message: GuildMessage, { preHandled }: ModerationCommand.PostHandleParameters<ValueType>) {
		preHandled?.unlock();
	}

	protected override async checkTargetCanBeModerated(message: GuildMessage, context: ModerationCommand.HandlerParameters<ValueType>) {
		const member = await super.checkTargetCanBeModerated(message, context);
		if (member && !member.kickable) throw context.args.t('commands/moderation/kick:notKickable');
		return member;
	}
}
