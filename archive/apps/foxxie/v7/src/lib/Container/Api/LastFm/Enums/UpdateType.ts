import { BitField } from 'discord.js';

export class UpdateTypeBitField extends BitField<UpdateTypeString> {
    public static FLAGS: Record<UpdateTypeString, number> = {
        RECENT_PLAYS: 1 << 1,
        ALL_PLAYS: 1 << 2,
        FULL: 1 << 3,
        ARTIST: 1 << 4,
        ALBUMS: 1 << 5,
        TRACKS: 1 << 6,
        DISCOGS: 1 << 7
    };

    public static ALL =
        UpdateTypeBitField.FLAGS.RECENT_PLAYS |
        UpdateTypeBitField.FLAGS.ALL_PLAYS |
        UpdateTypeBitField.FLAGS.FULL |
        UpdateTypeBitField.FLAGS.ARTIST |
        UpdateTypeBitField.FLAGS.ALBUMS |
        UpdateTypeBitField.FLAGS.TRACKS |
        UpdateTypeBitField.FLAGS.DISCOGS;
}

export type UpdateTypeString = 'RECENT_PLAYS' | 'ALL_PLAYS' | 'FULL' | 'ARTIST' | 'ALBUMS' | 'TRACKS' | 'DISCOGS';

export const UpdateTypeBits = {
    RecentPlays: 1 << 1,
    AllPlays: 1 << 2,
    Full: 1 << 3,
    Artist: 1 << 4,
    Albums: 1 << 5,
    Tracks: 1 << 6,
    Discogs: 1 << 7
};
