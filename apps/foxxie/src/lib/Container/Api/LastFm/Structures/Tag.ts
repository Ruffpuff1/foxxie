export class Tag {
    public name: string;

    public url: string;

    public constructor(data?: Partial<Tag>) {
        Object.assign(this, data);
    }
}
