import { List } from '#lib/Container/Utility/Extensions/ArrayExtensions';
import { UserEntity } from '#lib/Database/entities/UserEntity';
import { fetch } from '@foxxie/fetch';
import { container } from '@sapphire/pieces';
import { blue } from 'colorette';
import { Attachment } from 'discord.js';
import { PlaySource } from '../Enums/PlaySource';
import { PlayRepository } from '../Repositories/PlayRepository';
import { UserPlay } from '../Structures/Entities/UserPlay';
import { SpotifyEndSongImportModel } from '../Structures/Models/ImportModels';

export class ImportService {
    public async handleSpotifyFiles(
        attachments: List<Attachment>
    ): Promise<[0 | 1, List<SpotifyEndSongImportModel> | null, List<string> | null]> {
        try {
            const spotifyPlays = new List<SpotifyEndSongImportModel>();
            const processedFiles = new List<string>();

            for (const [name, attachment] of Object.entries(
                attachments.filter(w => w.url !== null && w.name.includes('.json')).groupBy(g => g.name, true)
            )) {
                const stream = await fetch(attachment[0].url).json<
                    {
                        ts: string;
                        ms_played: number;
                        master_metadata_track_name: string;
                        master_metadata_album_artist_name: string;
                        master_metadata_album_album_name: string;
                    }[]
                >();

                spotifyPlays.addRange(
                    stream.map(
                        f =>
                            new SpotifyEndSongImportModel({
                                ts: f.ts,
                                msPlayed: f.ms_played,
                                masterMetadataTrackName: f.master_metadata_track_name,
                                masterMetadataAlbumArtistName: f.master_metadata_album_artist_name,
                                masterMetadataAlbumName: f.master_metadata_album_album_name
                            })
                    )
                );

                processedFiles.push(name);
            }

            return [0, spotifyPlays, processedFiles];
        } catch {
            return [1, null, null];
        }
    }

    public async spotifyImportToUserPlays(user: UserEntity, spotifyPlays: List<SpotifyEndSongImportModel>) {
        const userPlays = new List<UserPlay>();

        let invalidPlays = 0;

        for (const spotifyPlay of spotifyPlays
            .filter(w => w.masterMetadataAlbumArtistName !== null && w.masterMetadataTrackName !== null)
            .toArray()) {
            const validScrobble = await this._timeService.isValidScrobble(
                spotifyPlay.masterMetadataAlbumArtistName,
                spotifyPlay.masterMetadataTrackName,
                spotifyPlay.msPlayed
            );

            if (validScrobble) {
                userPlays.push(
                    new UserPlay({
                        userId: user.id,
                        timestamp: new Date(spotifyPlay.ts).getTime(),
                        artist: spotifyPlay.masterMetadataAlbumArtistName,
                        album: spotifyPlay.masterMetadataAlbumArtistName,
                        track: spotifyPlay.masterMetadataTrackName,
                        playSource: PlaySource.SpotifyImport
                    })
                );
            } else {
                invalidPlays++;
            }
        }

        container.logger.debug(
            `[${blue('Last.fm')}] Importing ${user.id} - SpotifyImportToUserPlays found ${
                userPlays.length
            } valid plays and ${invalidPlays} invalid plays.`
        );

        return userPlays;
    }

    public async removeDuplicateSpotifyImports(userId: string, userPlays: List<UserPlay>) {
        const existingPlays = new List(await PlayRepository.getUserPlays(userId, 99999999));

        const timestamps = existingPlays.filter(w => w.playSource === PlaySource.SpotifyImport).groupBy(g => g.timestamp, true);

        const playsToReturn = new List<UserPlay>();

        for (const userPlay of userPlays.toArray()) {
            if (Reflect.has(timestamps, userPlay.timestamp.toString())) {
                const playsWithTimestamp = timestamps[userPlay.timestamp.toString()];
                if (
                    !playsWithTimestamp.some(
                        a => a.track === userPlay.track && a.album === userPlay.album && a.artist === userPlay.artist
                    )
                ) {
                    playsToReturn.push(userPlay);
                    playsWithTimestamp.push(userPlay);
                }
            } else {
                playsToReturn.push(userPlay);
                timestamps[userPlay.timestamp.toString()] = [userPlay];
            }
        }

        return playsToReturn;
    }

    public async insertImportPlays(user: UserEntity, plays: List<UserPlay>) {
        if (plays && plays.length) {
            await PlayRepository.insertPlays(plays.toArray());
            container.logger.debug(`[${blue('Last.fm')}] Importing ${user.id} - Inserted ${plays.length} plays`);
        } else {
            container.logger.error(`[${blue('Last.fm')}] Tried to insert 0 import plays!`);
        }
    }

    public async removeImportPlays(user: UserEntity) {
        await PlayRepository.RemoveAllImportPlays(user.id);
        container.logger.debug(`[${blue('Last.fm')}] Importing ${user.id} - Removed imported plays`);
    }

    public hasImported(userId: string) {
        return PlayRepository.HasImported(userId);
    }

    public static AddImportDescription(builder: List<string>, playSource?: PlaySource) {
        if (playSource === PlaySource.SpotifyImport) {
            builder.push('Contains imported Spotify plays');
        }

        return null;
    }

    private get _timeService() {
        return container.apis.lastFm.timeService;
    }
}
