export class DiscogsFormatDescriptions {
    public id: string;

    public releaseId: string;

    public description: string;

    public constructor(data?: Partial<DiscogsFormatDescriptions>) {
        Object.assign(this, data);
    }
}
