import { cast } from '@ruffpuff/utilities';

export class DiscogsCollectionEntry {
    public id: number;

    public artists: DiscogsCollectionEntryArtist[] = [];

    public formats: DiscogsCollectionEntryFormat[] = [];

    public imageUrl: string = null!;

    public rating: number = 0;

    public resourceUrl: string = null!;

    public dateAdded: Date;

    public title: string = null!;

    public url: string;

    public year: number = null!;

    public constructor(data?: DiscogsCollectionEntryData | DiscogsCollectionEntry) {
        if (data) {
            if (data instanceof DiscogsCollectionEntry || !Reflect.has(data, 'basic_information')) {
                Object.assign(this, data);

                this.url = `https://www.discogs.com/release/${this.id}`;
            } else {
                this.id = data.id;

                if (data.basic_information?.artists) this.artists = data.basic_information.artists;

                if (data.basic_information?.formats) this.formats = data.basic_information.formats;

                if (data.basic_information?.cover_image) this.imageUrl = data.basic_information.cover_image;

                this.dateAdded = new Date(cast<DiscogsCollectionEntryData & { date_added: string }>(data).date_added);

                this.rating = data.rating;

                if (data.basic_information?.resource_url) this.resourceUrl = data.basic_information.resource_url;

                if (data.basic_information?.title) this.title = data.basic_information.title;

                if (data.basic_information?.year) this.year = data.basic_information.year;

                this.url = `https://www.discogs.com/release/${this.id}`;
            }
        }
    }
}

export interface DiscogsCollectionEntryData {
    id: number;
    instance_id: number;
    folder_id: number;
    rating: number;
    basic_information: DiscogsBasicReleaseInfoData;
    notes: {
        field_id: number;
        value: string;
    }[];
}

export interface DiscogsBasicReleaseInfoData {
    id: number;
    title: string;
    year: number;
    resource_url: string;
    thumb: string;
    cover_image: string;
    formats: DiscogsCollectionEntryFormat[];
    labels: Array<{
        resource_url: string;
        entity_type: string;
        catno: string;
        id: number;
        name: string;
    }>;
    artists: DiscogsCollectionEntryArtist[];
    genres: Array<string>;
    styles: Array<string>;
}

interface DiscogsCollectionEntryArtist {
    id: number;
    name: string;
    join: string;
    resource_url: string;
    anv: string;
    tracks: string;
    role: string;
}

interface DiscogsCollectionEntryFormat {
    qty: string;
    descriptions: string[];
    name: string;
}
