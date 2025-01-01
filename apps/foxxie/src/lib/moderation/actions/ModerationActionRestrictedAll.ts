import { RoleModerationAction } from '#lib/moderation/actions/base/RoleModerationAction';
import { floatPromise } from '#utils/common';
import { getLogger, getModeration } from '#utils/functions';
import { TypeVariation } from '#utils/moderationConstants';
import { Guild, PermissionFlagsBits } from 'discord.js';

import { ModerationManager } from '../managers/ModerationManager.js';
import { ModerationAction } from './base/ModerationAction.js';

export class ModerationActionRestrictedAll extends RoleModerationAction<string[], TypeVariation.Mute> {
	public constructor() {
		super({
			logPrefix: 'Moderation => Mute',
			replace: true,
			roleData: { hoist: false, mentionable: false, name: 'Muted', permissions: [] },
			roleKey: RoleModerationAction.RoleKey.All,
			roleOverridesText:
				PermissionFlagsBits.SendMessages |
				PermissionFlagsBits.SendMessagesInThreads |
				PermissionFlagsBits.AddReactions |
				PermissionFlagsBits.UseExternalEmojis |
				PermissionFlagsBits.UseExternalStickers |
				PermissionFlagsBits.UseApplicationCommands |
				PermissionFlagsBits.CreatePublicThreads |
				PermissionFlagsBits.CreatePrivateThreads,
			roleOverridesVoice: PermissionFlagsBits.Connect,
			type: TypeVariation.Mute
		});
	}

	public async applyManual(guild: Guild, options: ModerationAction.PartialOptions<TypeVariation.Mute>, data: ModerationAction.Data<string[]> = {}) {
		const moderation = getModeration(guild);
		const entry = moderation.create(await this.resolveOptions(guild, options, data));

		await floatPromise(this.handleApplyPre(guild, entry, data));
		await this.sendDirectMessage(guild, entry, data);
		return moderation.insert(entry);
	}

	public async undoManual(guild: Guild, options: ModerationAction.PartialOptions<TypeVariation.Mute>, data: ModerationAction.Data<string[]> = {}) {
		const moderation = getModeration(guild);
		const entry = moderation.create(await this.resolveAppealOptions(guild, options, data));

		await floatPromise(this.handleUndoPre(guild, entry, data));
		await this.sendDirectMessage(guild, entry, data);
		return moderation.insert(entry);
	}

	protected override handleApplyPreOnError(_error: Error, guild: Guild, entry: ModerationManager.Entry<TypeVariation.Mute>) {
		getLogger(guild).mute.unset(entry.userId);
	}

	protected override handleApplyPreOnStart(guild: Guild, entry: ModerationAction.Entry) {
		getLogger(guild).mute.set(entry.userId, { reason: entry.reason, userId: entry.moderatorId });
	}

	protected override handleUndoPreOnError(_error: Error, guild: Guild, entry: ModerationAction.Entry) {
		getLogger(guild).unmute.unset(entry.userId);
	}

	protected override handleUndoPreOnStart(guild: Guild, entry: ModerationAction.Entry) {
		getLogger(guild).unmute.set(entry.userId, { reason: entry.reason, userId: entry.moderatorId });
	}
}
