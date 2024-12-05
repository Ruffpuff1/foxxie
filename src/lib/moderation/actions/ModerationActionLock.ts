import { ModerationAction } from '#lib/moderation/actions/base/ModerationAction';
import { TypeVariation } from '#utils/moderation';

export class ModerationActionLock extends ModerationAction<number, TypeVariation.Lock> {
	public constructor() {
		super({
			type: TypeVariation.Lock,
			isUndoActionAvailable: true,
			logPrefix: 'Moderation => Lock'
		});
	}
}
