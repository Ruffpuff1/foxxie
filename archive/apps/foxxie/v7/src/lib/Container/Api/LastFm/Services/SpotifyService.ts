import { List } from '#lib/Container/Utility/Extensions/ArrayExtensions';
import { LastFmArtistEntity } from '#lib/Database/entities/LastFmArtistEntity';
import { fetch } from '@foxxie/fetch';
import { cast, hours, months } from '@ruffpuff/utilities';
import { container } from '@sapphire/pieces';
import { ArtistRepository } from '../Repositories/ArtistRepository';
import { TrackRepository } from '../Repositories/TrackRepository';
import { ArtistInfo } from '../Structures/ArtistInfo';
import { Track } from '../Structures/Entities/Track';
import { TrackInfo } from '../Structures/TrackInfo';
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

    public async getOrStoreArtist(artistInfo: ArtistInfo) {
        try {
            let dbArtist = await ArtistRepository.getArtistForName(artistInfo.artistName);

            if (dbArtist === null) {
                const spotifyArtist = await this.getArtistFromSpotify(artistInfo.artistName);

                let artistToAdd = new LastFmArtistEntity({
                    name: artistInfo.artistName,
                    lastFmUrl: artistInfo.artistUrl,
                    mbid: artistInfo.mbid,
                    lastFmDescription: artistInfo.description,
                    lastFmDate: new Date(),
                    tags: artistInfo.tags
                });

                const musicBrainzUpdated = await this.musicBrainz.addMusicBrainzDataToArtist(artistToAdd);

                if (musicBrainzUpdated.updated) {
                    artistToAdd = musicBrainzUpdated.artist;
                }

                if (spotifyArtist) {
                    artistToAdd.spotifyId = spotifyArtist.id;
                    artistToAdd.popularity = spotifyArtist.popularity;

                    if (spotifyArtist.images.length) {
                        artistToAdd.spotifyImageUrl = spotifyArtist.images.sort((a, b) => b.height! - a.height!)[0].url;
                        artistToAdd.spotifyImageDate = new Date();

                        if (artistInfo.artistUrl !== null) {
                            // console.log('cache artist');
                        }
                    }

                    await artistToAdd.save();
                } else {
                    await artistToAdd.save();
                }

                return artistToAdd;
            }

            if (artistInfo.description !== null && dbArtist.lastFmDescription !== artistInfo.description) {
                dbArtist.lastFmDescription = artistInfo.description;
                dbArtist.lastFmDate = new Date();

                await dbArtist.save();
            }

            const musicBrainzUpdate = await this.musicBrainz.addMusicBrainzDataToArtist(dbArtist);

            if (musicBrainzUpdate.updated) {
                dbArtist = musicBrainzUpdate.artist;

                await dbArtist.save();
            }

            return dbArtist;
        } catch (err) {
            container.logger.error(err);
            return new LastFmArtistEntity({ name: artistInfo.artistName, lastFmUrl: artistInfo.artistUrl });
        }
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

    public async getOrStoreTrack(trackInfo: TrackInfo) {
        try {
            const dbTrack = await TrackRepository.GetTrackForName(trackInfo.artistName, trackInfo.trackName);

            if (dbTrack === null) {
                const trackToAdd = new Track({
                    name: trackInfo.trackName,
                    albumName: trackInfo.albumName,
                    artistName: trackInfo.artistName,
                    durationMs: trackInfo.duration,
                    lastFmUrl: trackInfo.trackUrl,
                    lastFmDescription: trackInfo.description,
                    lastFmDate: Date.now()
                });

                const artist = await ArtistRepository.getArtistForName(trackInfo.artistName);

                if (artist !== null) {
                    trackToAdd.artistId = artist.name;
                }

                const spotifyTrack = await this.getTrackFromSpotify(trackInfo.trackName, trackInfo.artistName);

                if (spotifyTrack !== null) {
                    trackToAdd.spotifyId = spotifyTrack.id;
                    trackToAdd.durationMs = spotifyTrack.duration_ms;
                    trackToAdd.popularity = spotifyTrack.popularity;

                    if (!trackToAdd.albumName) trackToAdd.albumName = spotifyTrack.album.name;
                    if (!trackToAdd.albumId) trackToAdd.albumId = spotifyTrack.album.name;

                    const audioFeatures = await this.getAudioFeaturesFromSpotify(spotifyTrack.id);

                    if (audioFeatures !== null) {
                        trackToAdd.key = audioFeatures.key;
                        trackToAdd.tempo = audioFeatures.tempo;
                        trackToAdd.acousticness = audioFeatures.acousticness;
                        trackToAdd.danceability = audioFeatures.danceability;
                        trackToAdd.energy = audioFeatures.energy;
                        trackToAdd.instrumentalness = audioFeatures.instrumentalness;
                        trackToAdd.liveness = audioFeatures.liveness;
                        trackToAdd.loudness = audioFeatures.loudness;
                        trackToAdd.speechiness = audioFeatures.speechiness;
                        trackToAdd.valence = audioFeatures.valence;
                    }
                }

                trackToAdd.spotifyLastUpdated = Date.now();

                await trackToAdd.save();

                return trackToAdd;
            }

            if (!dbTrack.artistId) {
                const artist = await ArtistRepository.getArtistForName(trackInfo.artistName);

                if (artist !== null) {
                    dbTrack.artistId = artist.name;
                }
            }

            if (!dbTrack.lastFmUrl && trackInfo.trackUrl) {
                dbTrack.lastFmUrl = trackInfo.trackUrl;
                dbTrack.lastFmDate = Date.now();
            }

            if (trackInfo.description && dbTrack.lastFmDescription !== trackInfo.description) {
                dbTrack.lastFmDescription = trackInfo.description;
                dbTrack.lastFmDate = Date.now();
            }

            if (!dbTrack.durationMs && trackInfo.duration) {
                dbTrack.durationMs = trackInfo.duration;
                dbTrack.lastFmDate = Date.now();
            }

            const monthsToGoBack = dbTrack.spotifyId && !dbTrack.energy ? 1 : 3;
            if (dbTrack.spotifyLastUpdated < Date.now() - months(monthsToGoBack)) {
                const spotifyTrack = await this.getTrackFromSpotify(trackInfo.trackName, trackInfo.artistName);

                if (spotifyTrack !== null) {
                    dbTrack.spotifyId = spotifyTrack.id;
                    dbTrack.durationMs = spotifyTrack.duration_ms;
                    dbTrack.popularity = spotifyTrack.popularity;

                    if (!dbTrack.albumName) dbTrack.albumName = spotifyTrack.album.name;
                    if (!dbTrack.albumId) dbTrack.albumId = spotifyTrack.album.name;

                    const audioFeatures = await this.getAudioFeaturesFromSpotify(spotifyTrack.id);

                    if (audioFeatures !== null) {
                        dbTrack.key = audioFeatures.key;
                        dbTrack.tempo = audioFeatures.tempo;
                        dbTrack.acousticness = audioFeatures.acousticness;
                        dbTrack.danceability = audioFeatures.danceability;
                        dbTrack.energy = audioFeatures.energy;
                        dbTrack.instrumentalness = audioFeatures.instrumentalness;
                        dbTrack.liveness = audioFeatures.liveness;
                        dbTrack.loudness = audioFeatures.loudness;
                        dbTrack.speechiness = audioFeatures.speechiness;
                        dbTrack.valence = audioFeatures.valence;
                    }
                }

                dbTrack.spotifyLastUpdated = Date.now();
            }

            await dbTrack.save();

            return dbTrack;
        } catch (e) {
            container.logger.error(e, `Something went wrong while retrieving track info`);
            return null;
        }
    }

    private async getTrackFromSpotify(trackName: string, artistName: string) {
        const results = await fetch(`https://api.spotify.com/v1/search`)
            .query({
                q: `track:${trackName} artist:${artistName}`,
                type: 'track'
            })
            .auth(this.token!)
            .json<SpotifyApi.TrackSearchResponse>();

        if (results.tracks.items?.length) {
            const spotifyTrack = new List(results.tracks.items)
                .orderByDescending(o => o.popularity)
                .find(
                    w =>
                        w.name.toLowerCase() === trackName.toLowerCase() &&
                        w.artists.map(s => s.name.toLowerCase()).includes(artistName.toLowerCase())
                );

            if (spotifyTrack) {
                return spotifyTrack;
            }
        }

        return null;
    }

    private async getAudioFeaturesFromSpotify(spotifyId: string) {
        const result = await fetch(`https://api.spotify.com/v1`) //
            .path('audio-features')
            .path(spotifyId)
            .auth(this.token!)
            .json<SpotifyApi.AudioFeaturesObject>();

        if (Reflect.has(result, 'error')) return null;

        return result;
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
    token_type: 'access';
    expires_in: number;
}
