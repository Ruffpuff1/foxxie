import { GetRecentTracksUserTrack, GetTrackInfoResultWithUser } from '#Api/LastFm/Services/LastFmService';
import { Column, PrimaryColumn } from 'typeorm';

export class LastFmTrack {
    public constructor(
        data: GetTrackInfoResultWithUser,
        extraData?: { username?: string; userTrack?: GetRecentTracksUserTrack }
    ) {
        const artist = extraData?.userTrack?.artist['#text'] || '';
        const timestamp = extraData?.userTrack?.date?.uts ? new Date(Number(extraData?.userTrack?.date?.uts) * 1000) : null;
        const attributes = extraData?.userTrack?.['@attr'];
        const image = extraData?.userTrack?.image.find(img => img.size === 'large')?.['#text'];

        this.title = data.track?.name || extraData?.userTrack?.name || null;
        this.url = data.track?.url || extraData?.userTrack?.url || null;
        this.listeners = parseInt(data.track?.listeners || 0, 10);
        this.playcount = parseInt(data.track?.playcount || 0, 10);
        this.length = data.track?.duration ? parseInt(data.track.duration, 10) : null;
        this.userPlayCount = data.track?.userplaycount ? parseInt(data.track.userplaycount, 10) : 0;
        if (extraData?.username) this.username = extraData.username;
        if (timestamp) this.timestamp = timestamp;
        this.artistName = artist;
        this.userLoved = data.track?.userloved === '1';
        this.summary = data.track?.wiki?.summary;
        if (attributes) this.attributes = attributes;
        if (image) this.image = image;
    }

    @PrimaryColumn('varchar', { length: 19 })
    public title: string | null = null;

    @Column('varchar')
    public url: string | null = null;

    @Column('bigint')
    public length: number | null = null;

    @Column('bigint')
    public listeners: number = null!;

    @Column('bigint')
    public rank: number = null!;

    @Column('bigint')
    public playcount: number = null!;

    public image: string | null = null;

    public userPlayCount: number = null!;

    public userLoved: boolean = false;

    public username: string = null!;

    public artistName: string = null!;

    public summary: string | undefined;

    public timestamp: Date | null = null;

    public attributes: Record<any, any> = {};

    public get isUserTrack() {
        return this.username;
    }

    public get isPlaying() {
        return this.attributes?.nowplaying === 'true';
    }
}
