import { ApplyOptions } from '@sapphire/decorators';
import { readSettings } from '#lib/Database/settings/functions';
import { LanguageKeys } from '#lib/i18n';
import { ModerationCommand } from '#lib/moderation/structures/ModerationCommand';
import { GuildMessage } from '#lib/types';
import { getModeration } from '#utils/functions';
import { getSeconds, TimeOptions } from '#utils/moderation-utilities';
import { TypeVariation, Unlock } from '#utils/moderationConstants';
import { PermissionFlagsBits } from 'discord.js';

type Type = TypeVariation.Ban;
type ValueType = null | Unlock;

@ApplyOptions<ModerationCommand.Options<Type>>({
	aliases: ['b'],
	description: LanguageKeys.Commands.Moderation.Kick.Description,
	detailedDescription: LanguageKeys.Commands.Moderation.Kick.DetailedDescription,
	options: TimeOptions,
	requiredClientPermissions: [PermissionFlagsBits.BanMembers],
	type: TypeVariation.Ban
})
export class UserModerationCommand extends ModerationCommand<Type, ValueType> {
	protected override async checkTargetCanBeModerated(message: GuildMessage, context: ModerationCommand.HandlerParameters<ValueType>) {
		const member = await super.checkTargetCanBeModerated(message, context);
		if (member && !member.bannable) throw context.args.t(LanguageKeys.Commands.Moderation.Kick.NotKickable);
		return member;
	}

	protected override getHandleDataContext(_message: GuildMessage, context: ModerationCommand.HandlerParameters<ValueType>) {
		return getSeconds(context.args);
	}

	protected override postHandle(_message: GuildMessage, { preHandled }: ModerationCommand.PostHandleParameters<ValueType>) {
		preHandled?.unlock();
	}

	protected override async preHandle(message: GuildMessage) {
		const settings = await readSettings(message.guild);
		return settings.eventsBanAdd ? { unlock: getModeration(message.guild).createLock() } : null;
	}
}
