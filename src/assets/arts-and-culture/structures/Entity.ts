export class Entity implements Entity {
    public constructor(data: Entity) {
        Object.assign(this, data);
    }

    public get page(): string {
        return `/arts-and-culture/entity/${this.id}`;
    }
}

export interface Entity {
    name: string;
    id: string;
    type: 'person' | 'location' | 'figure';
    description: string;
    location?: string;
}
