import type { Guild } from 'discord.js';

import { fetchT, type TFunction } from '@sapphire/plugin-i18next';
import { isNullishOrEmpty } from '@sapphire/utilities';
import { api } from '#lib/discord/Api';
import { LanguageKeys } from '#lib/i18n';
import { ModerationAction } from '#lib/moderation/actions/base/ModerationAction';
import { TypeVariation } from '#utils/moderationConstants';

const Root = LanguageKeys.Commands.Moderation;

export class ModerationActionSoftban extends ModerationAction<number, TypeVariation.Softban> {
	public constructor() {
		super({
			isUndoActionAvailable: false,
			logPrefix: 'Moderation => Softban',
			type: TypeVariation.Softban
		});
	}

	protected override async handleApplyPost(guild: Guild, entry: ModerationAction.Entry, data: ModerationAction.Data<number>) {
		const t = await fetchT(guild);

		await api().guilds.banUser(guild.id, entry.userId, { delete_message_seconds: data.context ?? 0 }, this.#getBanReason(t, entry.reason));
		await api().guilds.unbanUser(guild.id, entry.userId, this.#getUnbanReason(t, entry.reason));

		await this.completeLastModerationEntryFromUser({ guild, type: TypeVariation.Ban, userId: entry.userId });
	}

	#getBanReason(t: TFunction, reason: null | string | undefined) {
		return { reason: isNullishOrEmpty(reason) ? t(Root.ActionSoftBanNoReason) : t(Root.ActionSoftBanReason, { reason }) };
	}

	#getUnbanReason(t: TFunction, reason: null | string | undefined) {
		return { reason: isNullishOrEmpty(reason) ? t(Root.ActionUnSoftBanNoReason) : t(Root.ActionUnSoftBanReason, { reason }) };
	}
}
