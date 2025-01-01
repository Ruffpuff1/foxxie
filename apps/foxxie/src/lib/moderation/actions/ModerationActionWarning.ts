import { ModerationAction } from '#lib/moderation/actions/base/ModerationAction';
import { TypeVariation } from '#utils/moderationConstants';

export class ModerationActionWarning extends ModerationAction<number, TypeVariation.Warning> {
	public constructor() {
		super({
			isUndoActionAvailable: false,
			logPrefix: 'Moderation => Warning',
			type: TypeVariation.Warning
		});
	}
}
