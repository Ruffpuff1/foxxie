import { ModerationAction } from '#lib/moderation/actions/base/ModerationAction';
import { TypeVariation } from '#utils/moderationConstants';

export class ModerationActionPrune extends ModerationAction<number, TypeVariation.Prune> {
	public constructor() {
		super({
			isUndoActionAvailable: false,
			logPrefix: 'Moderation => Prune',
			type: TypeVariation.Prune
		});
	}
}
