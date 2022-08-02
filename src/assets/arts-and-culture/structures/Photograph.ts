import { Asset } from './Asset';

export class Photograph extends Asset implements Photograph {
    public type = `photograph`;

    public image = `https://reese.cafe/images/assets/arts-and-culture/assets/photographs/${this.id}.jpg`;

    public constructor(data: Photograph) {
        super(data);

        this.creatorId = data.creatorId;

        this.physicalDimensions = data.physicalDimensions;

        this.medium = data.medium;

        this.number = data.number;

        this.culture = data.culture;

        this.classification = data.classification;
    }

    public get page(): string {
        return `/arts-and-culture/asset/${this.id}`;
    }
}

export interface Photograph extends Asset {
    creatorId: string;
    physicalDimensions: string;
    medium: string;
    number: string;
    culture: string;
    classification: string;
}
