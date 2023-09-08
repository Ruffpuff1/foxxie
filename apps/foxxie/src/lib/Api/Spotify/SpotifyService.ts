import { LastFmAlbum } from '#lib/database/entities/LastFmAlbum';
import { LastFmArtistEntity } from '#lib/database/entities/LastFmArtistEntity';
import { LastFmTrack } from '#lib/database/entities/LastFmTrack';
import { fetch } from '@foxxie/fetch';
import { cast, hours } from '@ruffpuff/utilities';
import { container } from '@sapphire/framework';
import { LastFmArtistGetInfoResult, LastFmArtistGetTopAlbumsResult, LastFmArtistGetTopTrackResult } from '../LastFmService';
import { IArtist, IRecording, IReleaseGroup, InstrumentCredit, MusicBrainzService } from './MusicBrainzService';

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
        const [foundAlbums, foundTracks] = await container.apis.lastFm.getTopTracksAndAlbumsForArtist(artistData.artist.name);

        if (previousArtist === null) {
            const artist = new LastFmArtistEntity();
            return this.updateArtist(artist, artistData, foundTracks, foundAlbums);
        }

        if (previousArtist.shouldBeUpdated) return this.updateArtist(previousArtist, artistData, foundTracks, foundAlbums);
        this.addArtistToCache(previousArtist);

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

    private mapRecordings(foundTracks: LastFmArtistGetTopTrackResult, recordings: IRecording[]): MappedRecording[] {
        return (
            foundTracks.toptracks.track
                .map(track => {
                    const mbTrack = recordings.find(t => t.title.toLowerCase() === track.name.toLowerCase());

                    return {
                        length: mbTrack?.length || null,
                        title: mbTrack?.title || track.name,
                        url: track?.url || `https://musicbrainz.org/recording/${mbTrack?.id}`,
                        rank: parseInt(track['@attr'].rank, 10),
                        listeners: parseInt(track.listeners, 10),
                        playcount: parseInt(track.playcount, 10)
                    };
                })
                .sort((a, b) => b.playcount - a.playcount)
                .filter(al => al.title !== '(null)') || []
        );
    }

    private mapAlbums(foundTracks: LastFmArtistGetTopAlbumsResult, recordings: IReleaseGroup[]): LastFmAlbum[] {
        return (
            foundTracks.topalbums.album
                .map(album => {
                    const mbTrack = recordings.find(t => t.title.toLowerCase() === album.name.toLowerCase());

                    return {
                        type: mbTrack?.['primary-type'] || null,
                        title: mbTrack?.title || album.name,
                        url: album?.url || `https://musicbrainz.org/release/${mbTrack?.id}`,
                        playcount: album.playcount
                    };
                })
                .sort((a, b) => b.playcount - a.playcount)
                .filter(al => al.title !== '(null)') || []
        );
    }

    private async processMusicBrainzData(
        artist: LastFmArtistEntity,
        musicBrainzData: IArtist,
        foundTracks: LastFmArtistGetTopTrackResult,
        foundAlbums: LastFmArtistGetTopAlbumsResult
    ) {
        const instrumentRelations = this.musicBrainz.getInstrumentCredits(musicBrainzData);
        const { recordings } = await this.musicBrainz.browseRecordingsForAnArtist(musicBrainzData?.id);
        const releases = musicBrainzData['release-groups'] || [];

        const mappedRecordings = this.mapRecordings(foundTracks, recordings);
        const tracks = this.removeDuplicateTracks(mappedRecordings);
        const albums = this.mapAlbums(foundAlbums, releases);

        this.updateArtistEntityWithMusicBrainzData(artist, musicBrainzData, instrumentRelations, tracks, albums);
    }

    private removeDuplicateTracks(mappedRecordings: MappedRecording[]): LastFmTrack[] {
        return [...new Set(mappedRecordings.map(r => r.title.toLowerCase()))].map(
            t => mappedRecordings.find(r => r.title.toLowerCase() === t)!
        );
    }

    private addArtistToCache(artist: LastFmArtistEntity) {
        container.db.lastFmArtists.cache.set(artist.artistName, artist);
    }

    private async updateArtist(
        artist: LastFmArtistEntity,
        data: LastFmArtistGetInfoResult,
        tracks: LastFmArtistGetTopTrackResult,
        albums: LastFmArtistGetTopAlbumsResult
    ) {
        const spotifyData = await this.getArtistFromSpotify(data.artist.name);
        if (spotifyData) this.updateArtistEntityWithSpotifyData(artist, spotifyData);

        const mbData = await this.musicBrainz.fetchMusicBrainzData(data.artist.name);
        if (mbData) await this.processMusicBrainzData(artist, mbData, tracks, albums);

        this.updateArtistWithArtistData(artist, data);

        await artist.save();
        this.addArtistToCache(artist);
        return artist;
    }

    private updateArtistEntityWithMusicBrainzData(
        artist: LastFmArtistEntity,
        musicBrainzArtist: IArtist,
        instrumentRelations: InstrumentCredit[],
        tracks: LastFmTrack[],
        albums: LastFmAlbum[]
    ) {
        artist.mbid = musicBrainzArtist.id;
        if (musicBrainzArtist.country) artist.country = musicBrainzArtist.country;
        if (musicBrainzArtist.gender) artist.gender = musicBrainzArtist.gender;
        if (musicBrainzArtist['life-span']?.begin) artist.startDate = musicBrainzArtist['life-span'].begin;
        if (musicBrainzArtist['life-span']?.end) artist.endDate = musicBrainzArtist['life-span'].end;
        if (musicBrainzArtist.begin_area?.name) artist.startArea = musicBrainzArtist.begin_area.name;
        if (musicBrainzArtist.end_area?.name) artist.endArea = musicBrainzArtist.end_area.name;
        if (musicBrainzArtist.disambiguation) artist.disambiguation = musicBrainzArtist.disambiguation;
        if (musicBrainzArtist.type) artist.type = musicBrainzArtist.type;
        if (instrumentRelations?.length) artist.instrumentCredits = instrumentRelations;
        if (tracks.length) artist.tracks = tracks;
        if (albums.length) artist.albums = albums;
    }

    private updateArtistEntityWithSpotifyData(artist: LastFmArtistEntity, spotifyData: SpotifyApi.ArtistObjectFull) {
        const iconURL = spotifyData.images[0]?.url || null;
        if (iconURL) artist.imageUrl = iconURL;
    }

    private updateArtistWithArtistData(artist: LastFmArtistEntity, artistData: LastFmArtistGetInfoResult) {
        artist.artistName = artistData.artist.name;
        artist.artistUrl = artistData.artist.url;
        artist.description = artistData.artist.bio.summary;
        artist.lastUpdated = Date.now();
    }
}

interface MappedRecording {
    length: number | null;
    title: string;
    url: string;
    rank: number;
    listeners: number;
    playcount: number;
}

interface SpotifyTokenResponse {
    access_token: string;
    token_type: 'access';
    expires_in: number;
}
