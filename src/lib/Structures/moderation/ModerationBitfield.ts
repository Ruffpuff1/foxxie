import { BitField } from 'discord.js';

export class ModerationBitField extends BitField<ModerationBitFieldString> {
	public static FLAGS: Record<ModerationBitFieldString, number> = {
		DELETE: 1 << 0,
		ALERT: 1 << 1,
		LOG: 1 << 2
	};

	public static ALL = ModerationBitField.FLAGS.ALERT | ModerationBitField.FLAGS.DELETE | ModerationBitField.FLAGS.LOG;
}

export type ModerationBitFieldString = 'DELETE' | 'ALERT' | 'LOG';

export enum ModerationHardActionFlags {
	None,
	Warning,
	Kick,
	Mute,
	SoftBan,
	Ban
}

export const ModerationFlagBits = {
	Delete: 1 << 0,
	Alert: 1 << 1,
	Log: 1 << 2
};
