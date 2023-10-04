import { ArrayExtensions } from '#lib/Container/Utility/Extensions/ArrayExtensions';
import { UserEntity } from '#lib/Database/entities/UserEntity';
import { Response } from '#utils/Response';
import { cast, days, hours, minutes, seconds } from '@ruffpuff/utilities';
import { container } from '@sapphire/pieces';
import { sleep } from '@sapphire/utilities';
import { blue } from 'colorette';
import { User } from 'discord.js';
import { UpdateTypeBitField, UpdateTypeBits } from '../Enums/UpdateType';
import { LastFmRepository } from '../Repositories/LastFmRepository';
import { PlayRepository } from '../Repositories/PlayRepository';
import { RecentTrack, RecentTrackList } from '../Structures/RecentTrack';
import { UpdateUserQueueItem } from '../Structures/UpdateUserQueueItem';
import { UserArtist } from '../Structures/UserArtist';
import { UserPlay } from '../Structures/UserPlay';

export class UpdateService {
    private lastFmRepository = new LastFmRepository();

    public async addUsersToUpdateQueue(users: UserEntity[]) {
        container.logger.debug(`[${blue('Last.fm')}] Adding ${users.length} users to update queue.`);
        await Promise.all(users.map(user => this.onNextAsync(new UpdateUserQueueItem(user.id, true))));
    }

    public async getOutdatedUsers(timeFilter: number) {
        return container.db.users.repository.find({
            where: {
                'lastFm.lastUpdated': {
                    $lt: timeFilter
                }
            },
            order: {
                'lastFm.lastUpdated': 'ASC'
            }
        });
    }

    public async updateUser(queueItem: UpdateUserQueueItem) {
        const userEntity = await container.db.users.ensure(queueItem.userId);

        if (queueItem.updateQueue) await sleep(1200);

        if (queueItem.updateQueue) {
            if (userEntity.lastFm.lastUpdated > Date.now() - hours(11)) {
                container.logger.debug(
                    `[${blue('Last.fm')}] Update: Skipped for ${queueItem.userId} | ${userEntity.lastFm.username}`
                );
                return null;
            }
        }

        container.logger.debug(`[${blue('Last.fm')}] Update: Started on ${queueItem.userId} | ${userEntity.lastFm.username}`);

        const dateFromFilter = userEntity.lastFm.lastScrobbleUpdate
            ? userEntity.lastFm.lastScrobbleUpdate - hours(3)
            : Date.now() - days(14);
        let timeFrom: number | null = dateFromFilter / 1000;

        let count = 900;
        let totalPlaycountCorrect = false;
        const now = Date.now();

        if (dateFromFilter > now - hours(22) && queueItem.getAccurateTotalPlaycount) {
            const playsToGet = (now - dateFromFilter) / 60000 / 3;
            count = 100 + playsToGet;
            timeFrom = null;
            totalPlaycountCorrect = true;
        }

        const recentTracks = await this.lastFmRepository.getRecentTracks(
            userEntity.lastFm.username!,
            count,
            true,
            null,
            timeFrom,
            4
        );

        if (!recentTracks.success) {
            container.logger.debug(
                `[${blue('Last.fm')}] Update: No new tracks for ${queueItem.userId} | ${userEntity.lastFm.username}`
            );

            await this.setUserUpdateTime(userEntity);

            recentTracks.content = new RecentTrackList({
                newRecentTracksAmount: 0
            });

            return recentTracks;
        }

        this.addRecentPlayToMemberCache(queueItem.userId, recentTracks.content.recentTracks);

        if (!recentTracks.content.recentTracks.length) {
            await this.setUserUpdateTime(userEntity);

            recentTracks.content.newRecentTracksAmount = 0;
            return recentTracks;
        }

        try {
            const playUpdate = await PlayRepository.insertLatestPlays(recentTracks.content.recentTracks, userEntity.id);

            recentTracks.content.newRecentTracksAmount = playUpdate.newPlays.length;
            recentTracks.content.removedRecentTracksAmount = playUpdate.removedPlays.length;

            if (!playUpdate.newPlays.length) {
                container.logger.debug(
                    `[${blue('Last.fm')}] Update: After filter no new tracks for ${queueItem.userId} | ${
                        userEntity.lastFm.username
                    }`
                );

                await this.setUserUpdateTime(userEntity);

                if (!userEntity.lastFm.playcount) {
                    recentTracks.content.totalAmount = await this.setOrUpdateUserPlaycount(
                        userEntity,
                        playUpdate.newPlays.length,
                        totalPlaycountCorrect ? recentTracks.content.totalAmount : null
                    );
                } else if (totalPlaycountCorrect) {
                    await this.setOrUpdateUserPlaycount(userEntity, playUpdate.newPlays.length, recentTracks.content.totalAmount);
                } else {
                    recentTracks.content.totalAmount = userEntity.lastFm.playcount;
                }

                return recentTracks;
            }

            const cacheKey = `${userEntity.id}-update-in-progress`;
            if (this._cache.has(cacheKey)) {
                return recentTracks;
            }

            this._cache.set(cacheKey, true);
            setTimeout(() => this._cache.delete(cacheKey), seconds(1));

            recentTracks.content.totalAmount = await this.setOrUpdateUserPlaycount(
                userEntity,
                playUpdate.newPlays.length,
                totalPlaycountCorrect ? recentTracks.content.totalAmount : null
            );

            const userArtists = await this.getUserArtists(userEntity);

            await this.updateArtistsForUser(userEntity, playUpdate.newPlays, userArtists);

            const lastNewScrobble = ArrayExtensions.maxBy(playUpdate.newPlays, o => o.timestamp);
            if (lastNewScrobble) {
                await this.setUserLastScrobbleTime(userEntity, lastNewScrobble);
            }

            await this.setUserUpdateTime(userEntity);

            this._cache.delete(`user-${userEntity.id}-topartists-alltime`);
        } catch (err) {
            console.error(err);
        }

        return recentTracks;
    }

    public async updateUserAndGetRecentTracks(user: User, bypassIndexPending = false): Promise<Response<RecentTrackList> | null> {
        const cached = this._cache.get(`index-started-${user.id}`);
        if (cached && !bypassIndexPending) {
            return new Response<RecentTrackList>({
                success: true,
                message: 'All your data is still being fetched from Last.fm, please wait a little bit for this to complete.'
            });
        }

        return this.updateUser(new UpdateUserQueueItem(user.id));
    }

    public async correctUserArtistPlaycount(userId: string, artistName: string, correctPlaycount: number) {
        if (correctPlaycount < 30) return;

        const userEntity = await container.db.users.ensure(userId);
        if (!userEntity.lastFm.username) return;

        if (userEntity.lastFm.lastUpdated < Date.now() + minutes(2)) {
            const rand = Math.floor(Math.random() * 4);
            if (rand === 1 && userEntity.lastFm.lastUpdated !== null) {
                await this.updateUser(new UpdateUserQueueItem(userEntity.id));
            } else return;
        }

        const userArtist = await container.db.lastFm.artists.findOne({
            where: {
                userId,
                name: artistName.toLowerCase()
            }
        });

        if (
            !userArtist ||
            userArtist.playcount < 20 ||
            (userArtist.playcount > correctPlaycount - 3 && userArtist.playcount < correctPlaycount + 3)
        )
            return;

        container.logger.debug(
            `[${blue('Last.fm')}] Corrected artist playcount for user ${userEntity.id} | ${
                userEntity.lastFm.username
            } for artist ${artistName} from ${userArtist.playcount} to ${correctPlaycount}`
        );

        userArtist.playcount = Number(correctPlaycount);

        await userArtist.save();
        await userEntity.save();
    }

    private async onNextAsync(user: UpdateUserQueueItem) {
        const entity = await container.db.users.ensure(user.userId);
        await container.apis.lastFm.indexService.modularUpdate(entity, new UpdateTypeBitField(UpdateTypeBits.Full));
    }

    private addRecentPlayToMemberCache(userId: string, tracks: RecentTrack[]) {
        const minutesToCache = 30;
        const filter = Date.now() - minutes(minutesToCache);

        const playsToCache = tracks
            .filter(s => s.nowPlaying || (s.timePlayed && s.timePlayed.getTime() > filter))
            .map(
                s =>
                    new UserPlay({
                        artist: s.artistName,
                        album: s.albumName,
                        track: s.trackName,
                        timestamp: s.timePlayed?.getTime() || new Date().getTime(),
                        userId
                    })
            );

        for (const play of playsToCache.sort((a, b) => b.timestamp - a.timestamp)) {
            const timeToCache = minutesToCache * 60000;

            this._cache.set(`${userId}-lastplay-artist-${play.artist}`, play);
            this._cache.set(`${userId}-lastplay-track-${play.artist}-${play.track}`, play);

            if (play.album) this._cache.set(`${userId}-lastplay-album-${play.artist}-${play.album}`, play);

            setTimeout(() => {
                this._cache.delete(`${userId}-lastplay-artist-${play.artist}`);
                this._cache.delete(`${userId}-lastplay-track-${play.artist}-${play.track}`);
                this._cache.delete(`${userId}-lastplay-album-${play.artist}-${play.album}`);
            }, timeToCache);
        }
    }

    private async getUserArtists(userEntity: UserEntity) {
        const artists = await container.db.lastFm.artists.find({ where: { userId: userEntity.id } });

        const map = new Map<string, UserArtist>();
        for (const artist of artists) {
            map.set(artist.name.toLowerCase(), artist);
        }

        return map;
    }

    private async updateArtistsForUser(user: UserEntity, newScrobbles: UserPlay[], artists: Map<string, UserArtist>) {
        for (const [artistName, plays] of Object.entries(ArrayExtensions.groupBy(newScrobbles, s => s.artist.toLowerCase()))) {
            const existingUserArtist = artists.get(artistName);

            if (existingUserArtist) {
                existingUserArtist.playcount += plays.length;
                await existingUserArtist.save();
            } else {
                const artist = new UserArtist({
                    userId: user.id,
                    name: artistName.toLowerCase(),
                    playcount: plays.length
                });
                await artist.save();
            }
        }

        await user.save();
    }

    private setUserLastScrobbleTime(user: UserEntity, lastScrobble: number) {
        user.lastFm.lastScrobbleUpdate = lastScrobble;
        return user.save();
    }

    private setUserUpdateTime(user: UserEntity, time = Date.now()) {
        user.lastFm.lastUpdated = time;
        return user.save();
    }

    private async setOrUpdateUserPlaycount(
        user: UserEntity,
        playcountToAdd: number,
        correctPlaycount: number | null = null
    ): Promise<number> {
        if (correctPlaycount === null) {
            if (!user.lastFm.playcount) {
                const recentTracks = await this.lastFmRepository.getRecentTracks(user.lastFm.username!, 1, false);

                user.lastFm.playcount = recentTracks.content.totalAmount;

                await user.save();

                return recentTracks.content.totalAmount;
            }

            const updatedPlaycount = user.lastFm.playcount + playcountToAdd;
            user.lastFm.playcount = updatedPlaycount;

            await user.save();

            return updatedPlaycount;
        }

        user.lastFm.playcount = correctPlaycount;
        await user.save();

        return correctPlaycount;
    }

    private get _cache() {
        return cast<Map<string, UserPlay | boolean>>(container.apis.lastFm.cache);
    }
}
