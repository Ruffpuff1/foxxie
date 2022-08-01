export class Exhibit implements Exhibit {
    public constructor(data: Exhibit) {
        this.id = data.id;

        this.description = data.description;

        this.image = data.image;

        this.museumId = data.museumId;

        this.name = data.name;

        this.startTimestamp = data.startTimestamp;

        this.endTimestamp = data.endTimestamp;
    }

    public get startDate(): Date | null {
        return this.startTimestamp ? new Date(this.startTimestamp) : null;
    }

    public get endDate(): Date | null {
        return this.endTimestamp ? new Date(this.endTimestamp) : null;
    }

    public get page(): string {
        return `/arts-and-culture/exhibit/${this.id}`;
    }
}

export interface Exhibit {
    description: string;
    id: string;
    image: string;
    museumId: string;
    name: string;
    path: string;
    startTimestamp?: string;
    endTimestamp?: string;
}
