import { ModerationAction } from '#lib/moderation/actions/base/ModerationAction';
import { TypeVariation } from '#utils/moderationConstants';

export class ModerationActionRaidBan extends ModerationAction<number, TypeVariation.RaidBan> {
	public constructor() {
		super({
			isUndoActionAvailable: false,
			logPrefix: 'Moderation => RaidBan',
			type: TypeVariation.RaidBan
		});
	}
}
