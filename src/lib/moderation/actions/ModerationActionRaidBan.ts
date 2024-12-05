import { ModerationAction } from '#lib/moderation/actions/base/ModerationAction';
import { TypeVariation } from '#utils/moderation';

export class ModerationActionRaidBan extends ModerationAction<number, TypeVariation.RaidBan> {
	public constructor() {
		super({
			type: TypeVariation.RaidBan,
			isUndoActionAvailable: false,
			logPrefix: 'Moderation => RaidBan'
		});
	}
}
