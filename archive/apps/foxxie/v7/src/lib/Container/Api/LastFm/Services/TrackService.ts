import { Response } from '#utils/Response';
import { container } from '@sapphire/pieces';
import { User, bold, inlineCode } from 'discord.js';
import { TrackRepository } from '../Repositories/TrackRepository';
import { Track } from '../Structures/Entities/Track';
import { TrackSearch } from '../Structures/Models/TrackModels';
import { RecentTrackList } from '../Structures/RecentTrack';
import { TrackInfo } from '../Structures/TrackInfo';
import { UpdateUserQueueItem } from '../Structures/UpdateUserQueueItem';

export class TrackService {
    public async searchTrack(
        _: User,
        trackValues: string,
        lastFmUserName: string,
        otherUserUsername: string | null = null,
        useCachedTracks = false,
        userId: string | null = null
    ): Promise<TrackSearch> {
        let searchValue: string;
        if (trackValues && trackValues.length) {
            searchValue = trackValues;

            if (searchValue.toLowerCase() === 'featured') {
                searchValue = 'Ricky Montgomery | Last Night';
            }

            if (searchValue.includes(' | ')) {
                if (otherUserUsername !== null) {
                    lastFmUserName = otherUserUsername;
                }

                const [trackArtist, trackName] = searchValue.split(' | ');

                let trackInfo: Response<TrackInfo>;
                if (useCachedTracks) {
                    trackInfo = await this.getCachedTrack(trackArtist, trackName, lastFmUserName, userId);
                } else {
                    trackInfo = await this._dataSourceFactory.getTrackInfo(trackName, trackArtist, lastFmUserName);
                }

                if (!trackInfo.success) {
                    return new TrackSearch(
                        trackInfo.content,
                        `Track ${inlineCode(trackName)} by ${inlineCode(
                            trackArtist
                        )} could not be found, please check your search values and try again.`
                    );
                }

                return new TrackSearch(trackInfo.content);
            }
        } else {
            let recentScrobbles: Response<RecentTrackList> | null;

            if (userId && otherUserUsername === null) {
                recentScrobbles = await this._updateService.updateUser(new UpdateUserQueueItem(userId));
            } else {
                recentScrobbles = await this._dataSourceFactory.getRecentTracks(lastFmUserName, 1, true, null);
            }

            if (otherUserUsername !== null) {
                lastFmUserName = otherUserUsername;
            }

            const lastPlayedTrack = recentScrobbles!.content.recentTracks[0];

            let trackInfo: Response<TrackInfo>;
            if (useCachedTracks && lastPlayedTrack) {
                trackInfo = await this.getCachedTrack(
                    lastPlayedTrack.artistName,
                    lastPlayedTrack.trackName,
                    lastFmUserName,
                    userId
                );
            } else {
                trackInfo = await this._dataSourceFactory.getTrackInfo(
                    lastPlayedTrack.trackName,
                    lastPlayedTrack.artistName,
                    lastFmUserName
                );
            }

            if (!trackInfo.content || !trackInfo.success) {
                return new TrackSearch(null!, `Last.fm did not return a result for ${bold(lastPlayedTrack.trackName)}.`);
            }

            return new TrackSearch(trackInfo.content, null);
        }

        const result = await this._dataSourceFactory.searchTrack(searchValue);
        if (result.success && result.content) {
            if (otherUserUsername !== null) {
                lastFmUserName = otherUserUsername;
            }

            let trackInfo: Response<TrackInfo>;
            if (useCachedTracks) {
                trackInfo = await this.getCachedTrack(
                    result.content.artistName,
                    result.content.trackName,
                    lastFmUserName,
                    userId
                );
            } else {
                trackInfo = await this._dataSourceFactory.getTrackInfo(
                    result.content.trackName,
                    result.content.artistName,
                    lastFmUserName
                );
            }

            if (!trackInfo?.content || !trackInfo.success) {
                return new TrackSearch(null!, 'Last fm did not return a result');
            }

            return new TrackSearch(trackInfo.content, null!);
        }

        if (result.success) {
            return new TrackSearch(null!, 'Track could not be found please try again');
        }

        return new TrackSearch(null!, `Lastfm returned an error.`);
    }

    public async getCachedTrack(artistName: string, trackName: string, lastFmUserName: string, userId: string | null = null) {
        let trackInfo: Response<TrackInfo>;
        const cachedTrack = await this.getTrackFromDatabase(artistName, trackName);

        if (cachedTrack) {
            trackInfo = new Response<TrackInfo>({
                content: this.cachedTrackToTrackInfo(cachedTrack),
                success: true
            });

            if (userId) {
                const userPlaycount = await this._whoKnowsTrackService.getTrackPlayCountForUser(
                    cachedTrack.artistName,
                    cachedTrack.name,
                    userId
                );
                trackInfo.content.userPlaycount = userPlaycount!;
            }

            const cachedAlbum = null;
            if (cachedAlbum !== null) {
            }
        } else {
            trackInfo = await this._dataSourceFactory.getTrackInfo(trackName, artistName, lastFmUserName);
        }

        return trackInfo;
    }

    public async getTrackFromDatabase(artistName: string, trackName: string) {
        if (!artistName || !trackName) {
            return null;
        }

        const track = await TrackRepository.GetTrackForName(artistName, trackName);

        return track;
    }

    public cachedTrackToTrackInfo(track: Track): TrackInfo {
        return new TrackInfo({
            albumName: track.albumName,
            artistName: track.artistName,
            trackUrl: track.lastFmUrl,
            trackName: track.name,
            mbid: track.mbid
        });
    }

    private get _dataSourceFactory() {
        return container.apis.lastFm.dataSourceFactory;
    }

    private get _updateService() {
        return container.apis.lastFm.updateService;
    }

    private get _whoKnowsTrackService() {
        return container.apis.lastFm.whoKnowsTrackService;
    }
}
