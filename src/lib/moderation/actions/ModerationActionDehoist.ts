import { ModerationAction } from '#lib/moderation/actions/base/ModerationAction';
import { TypeVariation } from '#utils/moderation';

export class ModerationActionDehoist extends ModerationAction<number, TypeVariation.Dehoist> {
	public constructor() {
		super({
			type: TypeVariation.Dehoist,
			isUndoActionAvailable: true,
			logPrefix: 'Moderation => Dehoist'
		});
	}
}
