export class DiscogsStyle {
    public id: string;

    public releaseId: string;

    public description: string;

    public constructor(data?: Partial<DiscogsStyle>) {
        Object.assign(this, data);
    }
}
