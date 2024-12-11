import type { Guild } from 'discord.js';

import { api } from '#lib/discord/Api';
import { ModerationAction } from '#lib/moderation/actions/base/ModerationAction';
import { TypeVariation } from '#utils/moderationConstants';

export class ModerationActionVoiceKick extends ModerationAction<never, TypeVariation.VoiceDisconnect> {
	public constructor() {
		super({
			isUndoActionAvailable: false,
			logPrefix: 'Moderation => VoiceDisconnect',
			type: TypeVariation.VoiceDisconnect
		});
	}

	protected override async handleApplyPost(guild: Guild, entry: ModerationAction.Entry) {
		const reason = await this.getReason(guild, entry.reason);
		await api().guilds.editMember(guild.id, entry.userId, { channel_id: null }, { reason });
	}
}
