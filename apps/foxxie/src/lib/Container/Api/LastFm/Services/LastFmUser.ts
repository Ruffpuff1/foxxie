import { hours, isDev } from '@ruffpuff/utilities';

export class LastFmUser {
    public username: string | null = null;

    public imageUrl: string | null = null;

    public registered: Date | null = null;

    public lastIndexed: number | null = null;

    public lastScrobbleUpdate: number | null = null;

    public lastUpdated: number = Date.now();

    public playcount: number = 0;

    public type: UserTypeEnum = UserTypeEnum.User;

    public constructor(data?: Partial<LastFmUser>) {
        Object.assign(this, data);
    }

    public get lastFmPro() {
        return this.type === UserTypeEnum.Supporter;
    }

    public get url() {
        return `https://last.fm/user/${this.username}`;
    }

    public get shouldBeUpdated() {
        if (isDev()) return true;
        return this.lastUpdated + hours(1) > Date.now();
    }
}

export enum UserTypeEnum {
    User = 0,

    Supporter = 1
}
