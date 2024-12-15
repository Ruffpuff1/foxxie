export class WhoKnowsObjectWithUser {
    public name: string;

    public playcount: number;

    public lastFmUsername: string;

    public discordName: string;

    public userId: string;

    public registeredLastFm: Date;

    public roles: string[];

    public lastUsed: Date;

    public lastMessage: Date;

    public sameServer: boolean;

    public constructor(data?: Partial<WhoKnowsObjectWithUser>) {
        Object.assign(this, data);
    }
}
