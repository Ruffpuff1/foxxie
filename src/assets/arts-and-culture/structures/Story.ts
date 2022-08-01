export class Story implements Story {
    public constructor(data: Story) {
        Object.assign(this, data);
    }

    public get page(): string {
        return `/arts-and-culture/story/${this.id}`;
    }

    public get bannerUrl(): string {
        return `https://reese.cafe/images/assets/arts-and-culture/stories/banners/${this.id}.jpg`;
    }
}

export interface Story {
    name: string;
    id: string;
    assets?: string[];
    creatorDisplayName: string;
}
