import { LastFmArtistEntity } from '#lib/database/entities/LastFmArtistEntity';
import { fetch } from '@foxxie/fetch';
import { cast, hours } from '@ruffpuff/utilities';
import { container } from '@sapphire/framework';
import { LastFmArtistGetInfoResult } from '../lastfm';
import { MusicBrainzService } from './MusicBrainzService';

export class SpotifyService {
    public musicBrainz = new MusicBrainzService();

    private clientId: string;

    private clientSecret: string;

    private token: string | null = null;

    public constructor(clientId: string, clientSecret: string) {
        this.clientId = clientId;
        this.clientSecret = clientSecret;
    }

    public async initSpotify() {
        await this.replaceToken();
        setInterval(() => (this.token = null), hours(1));
    }

    public async getOrStoreArtist(artistData: LastFmArtistGetInfoResult) {
        const previousArtist = await container.db.lastFmArtists.getArtist(artistData.artist.name);

        if (previousArtist === null) {
            const artist = new LastFmArtistEntity();

            artist.artistName = artistData.artist.name;
            artist.artistUrl = artistData.artist.url;
            artist.description = artistData.artist.bio.summary;

            const spotifyData = await this.getArtistFromSpotify(artistData.artist.name);

            if (spotifyData) {
                const iconURL = spotifyData.images[0]?.url || null;
                if (iconURL) artist.imageUrl = iconURL;
            }

            const mbData = await this.musicBrainz.fetchMusicBrainzData(artistData.artist.name);

            if (mbData) {
                artist.mbid = mbData.id;
                if (mbData.country) artist.country = mbData.country;
                if (mbData.gender) artist.gender = mbData.gender;
                if (mbData['life-span']?.begin) artist.startDate = mbData['life-span'].begin;
                if (mbData['life-span']?.end) artist.endDate = mbData['life-span'].end;
                if (mbData.begin_area?.name) artist.startArea = mbData.begin_area.name;
                if (mbData.end_area?.name) artist.endArea = mbData.end_area.name;
                if (mbData.disambiguation) artist.disambiguation = mbData.disambiguation;
                if (mbData.type) artist.type = mbData.type;
            }

            artist.lastUpdated = Date.now(); //

            await artist.save();
            container.db.lastFmArtists.cache.set(artist.artistName, artist);
            return artist;
        }

        if (previousArtist.shouldBeUpdated) {
            previousArtist.artistName = artistData.artist.name;
            previousArtist.artistUrl = artistData.artist.url;
            previousArtist.description = artistData.artist.bio.summary;

            const spotifyData = await this.getArtistFromSpotify(artistData.artist.name);

            if (spotifyData) {
                const iconURL = spotifyData.images[0]?.url || null;
                if (iconURL) previousArtist.imageUrl = iconURL;
            }

            const mbData = await this.musicBrainz.fetchMusicBrainzData(artistData.artist.name);

            if (mbData) {
                previousArtist.mbid = mbData.id;
                if (mbData.country) previousArtist.country = mbData.country;
                if (mbData.gender) previousArtist.gender = mbData.gender;
                if (mbData['life-span']?.begin) previousArtist.startDate = mbData['life-span'].begin;
                if (mbData['life-span']?.end) previousArtist.endDate = mbData['life-span'].end;
                if (mbData.begin_area?.name) previousArtist.startArea = mbData.begin_area.name;
                if (mbData.end_area?.name) previousArtist.endArea = mbData.end_area.name;
                if (mbData.disambiguation) previousArtist.disambiguation = mbData.disambiguation;
                if (mbData.type) previousArtist.type = mbData.type;
            }

            previousArtist.lastUpdated = Date.now(); //

            await previousArtist.save();
            container.db.lastFmArtists.cache.set(previousArtist.artistName, previousArtist);
            return previousArtist;
        }

        container.db.lastFmArtists.cache.set(previousArtist.artistName, previousArtist);

        return previousArtist;
    }

    public async getArtistFromSpotify(artistName: string) {
        if (!this.token) await this.replaceToken();

        const results = await fetch(`https://api.spotify.com/v1/search`)
            .query({
                q: artistName,
                type: 'artist'
            })
            .auth(this.token!)
            .json<SpotifyApi.ArtistSearchResponse | SpotifyApi.ErrorObject>();

        if (Reflect.has(results, 'code')) return null;

        const spotifyArtist = cast<SpotifyApi.ArtistSearchResponse>(results)
            .artists.items.sort((a, b) => b.popularity - a.popularity)
            .find(a => a.name.toLowerCase() === artistName.toLowerCase());

        if (spotifyArtist) return spotifyArtist;

        return null;
    }

    private async replaceToken() {
        const data = await fetch('https://accounts.spotify.com/api/token')
            .header('Content-Type', 'application/x-www-form-urlencoded')
            .query({
                grant_type: 'client_credentials',
                client_id: this.clientId,
                client_secret: this.clientSecret
            })
            .post()
            .json<SpotifyTokenResponse>();

        if (data?.access_token) this.token = data.access_token;
    }
}

interface SpotifyTokenResponse {
    access_token: string;
    token_type: 'Bearer';
    expires_in: number;
}
