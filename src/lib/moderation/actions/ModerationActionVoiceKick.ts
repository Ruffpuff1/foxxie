import { api } from '#lib/discord/Api';
import { ModerationAction } from '#lib/moderation/actions/base/ModerationAction';
import { TypeVariation } from '#utils/moderation';
import type { Guild } from 'discord.js';

export class ModerationActionVoiceKick extends ModerationAction<never, TypeVariation.VoiceDisconnect> {
	public constructor() {
		super({
			type: TypeVariation.VoiceDisconnect,
			isUndoActionAvailable: false,
			logPrefix: 'Moderation => VoiceDisconnect'
		});
	}

	protected override async handleApplyPost(guild: Guild, entry: ModerationAction.Entry) {
		const reason = await this.getReason(guild, entry.reason);
		await api().guilds.editMember(guild.id, entry.userId, { channel_id: null }, { reason });
	}
}
