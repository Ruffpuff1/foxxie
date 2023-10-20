import { List } from '#lib/Container/Utility/Extensions/ArrayExtensions';
import { Timespan } from '#utils/Timespan';
import { container } from '@sapphire/framework';
import { UserPlay } from '../Structures/Entities/UserPlay';
import { TopTimeListened } from '../Structures/TopTimeListened';

export class TimeService {
    public async getPlayTimeForPlays(plays: List<UserPlay>) {
        await this.cacheAllTrackLengths();

        const totalMs = plays.sumBy(userPlay => this.getTrackLengthForTrack(userPlay.artist, userPlay.track));

        return Timespan.FromMilliseconds(totalMs).format();
    }

    public async isValidScrobble(artistName: string, trackName: string, msPlayed: number) {
        if (msPlayed < 30000) {
            return false;
        }

        if (msPlayed > 240000) {
            return true;
        }

        await this.cacheAllTrackLengths();

        const trackLength = this.getTrackLengthForTrack(artistName, trackName);

        if (msPlayed > trackLength / 2) {
            return true;
        }

        return false;
    }

    public async getPlayTimeForTrackWithPlaycount(
        artistName: string,
        trackName: string,
        playcount: number,
        topTimeListened: TopTimeListened | null = null
    ) {
        await this.cacheAllTrackLengths();

        let timeListened = 0;

        if (topTimeListened !== null) {
            timeListened += topTimeListened.msPlayed;
            playcount -= topTimeListened.playsWithPlayTime;
        }

        const length = this.getTrackLengthForTrack(artistName, trackName);

        timeListened += length * playcount;

        return Timespan.FromMilliseconds(timeListened).format();
    }

    private async cacheAllTrackLengths() {
        const cacheKey = 'track-lengths-cached';
        const cacheTime = Timespan.Minutes(60);

        if (this._cache.has(cacheKey)) {
            return;
        }

        const trackLengths = await container.db.lastFm.tracks
            .find({
                where: {
                    durationMs: {
                        $not: {
                            $eq: null
                        }
                    }
                }
            })
            .then(ts => new List(ts.map(t => ({ artistName: t.artistName, trackName: t.name, durationMs: t.durationMs }))));

        for (const length of trackLengths.toArray()) {
            const key = TimeService.CacheKeyForTrack(length.trackName, length.artistName);
            this._cache.set(key, length);
            setTimeout(() => this._cache.delete(key), cacheTime);
        }

        for (const [artistName, length] of Object.entries(trackLengths.groupBy(g => g.artistName, true))) {
            const key = TimeService.CacheKeyForArtist(artistName);
            this._cache.set(
                key,
                new List(length).average(a => a.durationMs)
            );
            setTimeout(() => this._cache.delete(key), cacheTime);
        }

        this._cache.set(cacheKey, true);
        setTimeout(() => this._cache.delete(cacheKey), cacheTime);
    }

    private getTrackLengthForTrack(artistName: string, trackName: string): number {
        const trackLength = this._cache.get(TimeService.CacheKeyForTrack(trackName, artistName)) as Length;

        if (trackLength) {
            return trackLength.durationMs;
        }

        const avgArtistTrackLength = this._cache.get(TimeService.CacheKeyForArtist(artistName)) as number;

        return avgArtistTrackLength || 210000;
    }

    private static CacheKeyForTrack(trackName: string, artistName: string) {
        return `tr-l-${trackName}-${artistName}`;
    }

    private static CacheKeyForArtist(artistName: string) {
        return `at-l-avg-${artistName}`;
    }

    private get _cache() {
        return container.apis.lastFm.cache;
    }
}

interface Length {
    artistName: string;
    trackName: string;
    durationMs: number;
}
