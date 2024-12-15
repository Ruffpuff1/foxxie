import { Art, Birthday, Gender, PersonalitiesEnum } from '@foxxie/celestia-api-types';
import { VillagerAmiibo } from './VillagerAmiibo';
import { VillagerCoffeeRequest } from './VillagerCoffeeRequest';

export class Villager {
    public name: string;

    public nameJapanese: string;

    public gender: Gender;

    public species: string;

    public personality: `${PersonalitiesEnum}`;

    public favoriteSaying: string | null = null;

    public catchphrase: string | null = null;

    public description: string | null = null;

    public games: string[] = [];

    public art: Art;

    public coffeeRequest: VillagerCoffeeRequest | null;

    public siblings: string | null = null;

    public skill: string | null = null;

    public goal: string | null = null;

    public song: string | null = null;

    public amiibo: VillagerAmiibo | null;

    public birthday: Birthday;

    public constructor(data: Partial<Villager>) {
        Object.assign(this, data);
    }
}
