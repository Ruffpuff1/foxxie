import { LastFmArtistEntity } from '#lib/Database/entities/LastFmArtistEntity';
import { fetch } from '@foxxie/fetch';
import { cast, hours } from '@ruffpuff/utilities';
import { container } from '@sapphire/framework';
import { ArtistRepository } from '../Repositories/ArtistRepository';
import { ArtistInfo } from '../Structures/ArtistInfo';
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
