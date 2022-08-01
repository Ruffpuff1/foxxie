import { Asset } from './Asset';

export class Painting extends Asset implements Painting {
    public image = `https://reese.cafe/images/assets/arts-and-culture/assets/${this.type}s/${this.id}/base.jpg`;

    public type = `painting`;

    public constructor(data: Painting) {
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

export interface Painting extends Asset {
    creatorId: string;
    physicalDimensions: string;
    medium: string;
    number: string;
    culture: string;
    classification: string;
}
