import { ModerationAction } from '#lib/moderation/actions/base/ModerationAction';
import { TypeVariation } from '#utils/moderationConstants';

export class ModerationActionLock extends ModerationAction<number, TypeVariation.Lock> {
	public constructor() {
		super({
			isUndoActionAvailable: true,
			logPrefix: 'Moderation => Lock',
			type: TypeVariation.Lock
		});
	}
}
