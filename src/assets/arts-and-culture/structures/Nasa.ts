import { Asset } from './Asset';

export class Nasa extends Asset implements Nasa {
    public image = `https://reese.cafe/images/assets/arts-and-culture/assets/${this.type}s/${this.id}/base.jpg`;

    public type = `nasa`;

    public constructor(data: Nasa) {
        super(data);

        this.album = data.album;
    }

    public get page(): string {
        return `/arts-and-culture/asset/${this.id}`;
    }
}

export interface Nasa extends Asset {
    album: string;
}
