export class DiscogsGenre {
    public id: string;

    public releaseId: string;

    public description: string;

    public constructor(data?: Partial<DiscogsGenre>) {
        Object.assign(this, data);
    }
}
