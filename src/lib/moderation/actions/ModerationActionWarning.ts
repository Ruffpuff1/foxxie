import { ModerationAction } from '#lib/moderation/actions/base/ModerationAction';
import { TypeVariation } from '#utils/moderation';

export class ModerationActionWarning extends ModerationAction<number, TypeVariation.Warning> {
	public constructor() {
		super({
			type: TypeVariation.Warning,
			isUndoActionAvailable: false,
			logPrefix: 'Moderation => Warning'
		});
	}
}
