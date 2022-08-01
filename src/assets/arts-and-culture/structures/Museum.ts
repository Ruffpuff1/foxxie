import { Exhibit } from './Exhibit';

export class Museum implements Museum {
    public constructor(data: Museum) {
        this.id = data.id;

        this.address = data.address;

        this.description = data.description;

        this.closedOn = data.closedOn || null;

        this.director = data.director;

        this.founded = data.founded;

        this.hours = data.hours;

        this.location = data.location;

        this.map = data.map;

        this.name = data.name;

        this.price = data.price;

        this.phone = data.phone;

        this.regions = data.regions;

        this.socials = data.socials;

        this.tag = data.tag;

        this.website = data.website;
    }

    public formatHour(hr: Hour): string {
        if (!hr) return 'Closed';
        const { open, close } = hr;
        return `${open} - ${close}`;
    }

    public getPhoneNumber(): string | null {
        return (
            this.phone
                ?.toString()
                .split('')
                .map((str, idx) => {
                    switch (idx) {
                        case 0:
                            return `(${str}`;
                        case 2:
                            return `${str}) `;
                        case 5:
                            return `${str}-`;
                        default:
                            return str;
                    }
                })
                .join('') || null
        );
    }

    public getRegions(): string[] {
        return [...new Set(this.regions)] as string[];
    }

    public get mapUrl(): string {
        return `https://www.google.com/maps/embed?pb=${this.map}`;
    }

    public get page() {
        return `/arts-and-culture/museum/${this.id}`;
    }

    public get bannerUrl(): string {
        return `https://reese.cafe/images/assets/arts-and-culture/museums/banners/${this.id}.jpg`;
    }
}

export interface Museum {
    id: string;
    address: string;
    description: string;
    closedOn?: string[] | null;
    director: string;
    exhibits: Exhibit[];
    founded: `${number}`;
    hours: Partial<Record<WeekDay, Hour>>;
    location: string;
    map: string;
    name: string;
    path: string;
    phone?: number;
    price: string | Record<string, string>;
    regions: string[];
    socials?: Partial<Socials>;
    tag: string;
    website?: string;
}

interface Socials {
    twitter: string;
    instagram: string;
    youtube: string;
    facebook: string;
}

type WeekDay = 'mon' | 'tues' | 'wed' | 'thur' | 'fri' | 'sat' | 'sun';

type Time = `${number}:${number} ${'am' | 'pm'}`;

export interface Hour {
    open: Time;
    close: Time;
}
