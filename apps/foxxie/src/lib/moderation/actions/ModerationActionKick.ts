import { api } from '#lib/discord';
import { ModerationAction } from '#lib/moderation/actions/base/ModerationAction';
import { TypeVariation } from '#utils/moderationConstants';
import { Guild } from 'discord.js';

export class ModerationActionKick extends ModerationAction<never, TypeVariation.Kick> {
	public constructor() {
		super({
			isUndoActionAvailable: false,
			logPrefix: 'Moderation => Kick',
			type: TypeVariation.Kick
		});
	}

	protected override async handleApplyPost(guild: Guild, entry: ModerationAction.Entry) {
		await api().guilds.removeMember(guild.id, entry.userId, { reason: await this.getReason(guild, entry.reason) });
	}
}
