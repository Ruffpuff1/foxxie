import { DiscogsRelease } from '../../Discogs/Structures/DiscogsRelease';

export class UserDiscogsRelease {
    public userDiscogsReleaseId: string;

    public userId: string;

    public instanceId: number;

    public dateAdded: Date;

    public rating: number | null;

    public quantity: string;

    public releaseId: number;

    public release: DiscogsRelease;

    public constructor(data?: Partial<UserDiscogsRelease>) {
        Object.assign(this, data);
    }
}
