import { BitField } from 'discord.js';

export class ModerationBitField extends BitField<ModerationBitFieldString> {

    public static FLAGS: Record<ModerationBitFieldString, number> = {
        DELETE: 1 << 0,
        ALERT: 1 << 1
    };

    public static ALL = ModerationBitField.FLAGS.ALERT | ModerationBitField.FLAGS.DELETE;

}

export type ModerationBitFieldString = 'DELETE' | 'ALERT';

export enum ModerationHardActionFlags {
    None,
    Warning,
    Kick,
    Mute,
    SoftBan,
    Ban
}