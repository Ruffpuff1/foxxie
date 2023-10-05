export class DataSourceUser {
    public playcount: number;

    public artistCount: number;

    public albumCount: number;

    public trackCount: number;

    public name: string;

    public subscriber: boolean;

    public url: string;

    public country: string;

    public image: string;

    public registered: number;

    public type: string;

    public constructor(data: Partial<DataSourceUser>) {
        Object.assign(this, data);
    }
}
