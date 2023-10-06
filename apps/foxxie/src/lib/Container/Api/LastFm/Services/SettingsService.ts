import { UpdateTypeBitField, UpdateTypeBits } from '../Enums/UpdateType';

export class SettingsService {
    public static GetUpdateType(parameter: string | string[] | null) {
        if (!parameter) return new UpdateTypeBitField();
        const toParse = Array.isArray(parameter) ? parameter : [parameter.toLowerCase()];

        const full = ['full', 'force', 'f'];
        const bits = new UpdateTypeBitField();

        if (full.some(f => toParse.includes(f))) {
            bits.add(UpdateTypeBits.Full);
        } else {
            const allPlays = ['plays', 'allplays'];
            if (allPlays.some(f => toParse.includes(f))) {
                bits.add(UpdateTypeBits.AllPlays);
            }

            const artists = ['artists', 'artist', 'a'];
            if (artists.some(f => toParse.includes(f))) {
                bits.add(UpdateTypeBits.Artist);
            }

            const albums = ['albums', 'album', 'ab'];
            if (albums.some(f => toParse.includes(f))) {
                bits.add(UpdateTypeBits.Albums);
            }

            const tracks = ['tracks', 'track', 'tr'];
            if (tracks.some(f => toParse.includes(f))) {
                bits.add(UpdateTypeBits.Tracks);
            }
        }

        const discogs = ['discogs', 'discog', 'vinyl', 'collection'];
        if (discogs.some(f => toParse.includes(f))) {
            bits.add(UpdateTypeBits.Discogs);
        }

        return bits;
    }
}
