export class Asset implements Asset {
    public image?: string;

    public type?: string;

    public constructor(data: Asset) {
        Object.assign(this, data);
    }

    public get page(): string {
        return `/arts-and-culture/asset/${this.id}`;
    }
}

export interface Asset {
    name: string;
    id: string;
    creatorDisplayName: string;
    description?: string;
    locationCreated: string;
    bgColor: string;
    big?: boolean;
    date: string;
    museumId: string;
    externalLink: string;
    entities?: string[];
    termsOfUse: string;
    creditLine: string;
}
