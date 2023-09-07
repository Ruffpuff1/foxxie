import { fetch } from '@foxxie/fetch';

export class MusicBrainzService {
    public async fetchMusicBrainzData(artist: string) {
        const musicBrainzQueryResult = await fetch(`https://musicbrainz.org/ws/2/artist`)
            .query({
                query: artist,
                fmt: 'json'
            })
            .json<{ artists: { id: string; score: number }[] }>();

        const musicBrainzFoundArtist = musicBrainzQueryResult.artists.sort((a, b) => b.score - a.score)[0]?.id;
        if (!musicBrainzFoundArtist) return null;

        const musicBrainzResults = await fetch(`https://musicbrainz.org/ws/2/artist`)
            .path(musicBrainzFoundArtist)
            .query({ inc: 'aliases', fmt: 'json' })
            .json<MusicBrainzArtistResult>();

        return musicBrainzResults;
    }
}

export interface MusicBrainzArtistResult {
    area: {
        'iso-3166-1-codes': string[];
        name: string;
        type: null;
        'type-id': null;
        disambiguation: '';
        id: string;
        'sort-name': string;
    };
    begin_area: {
        'iso-3166-1-codes': string[];
        name: string;
        type: null;
        'type-id': null;
        disambiguation: '';
        id: string;
        'sort-name': string;
    } | null;
    end_area: {
        'iso-3166-1-codes': string[];
        name: string;
        type: null;
        'type-id': null;
        disambiguation: '';
        id: string;
        'sort-name': string;
    } | null;
    isnis: string[];
    'end-area': null;
    'life-span': { ended: boolean; begin: string | null; end: string | null };
    type: string;
    'type-id': string;
    'sort-name': string;
    id: string;
    aliases: {
        primary: boolean;
        locale: string;
        name: string;
        'sort-name': string;
        begin: string | null;
        ended: boolean;
        end: string | null;
        type: string;
        'type-id': string;
    }[];
    name: string;
    country: string;
    ipis: string;
    'gender-id': string | null;
    disambiguation: string;
    gender: string | null;
}
