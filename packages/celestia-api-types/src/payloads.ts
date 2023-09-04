import { Game, GamesEnum } from './game';
import { Coffee, Villager, VillagerKey } from './villager';

export interface RouteRequestPayloads {
    Celestia: CelestiaRouteRequestPayload;
    CelestiaGames: CelestiaGamesRequestPayload;
    CelestiaGamesGame: Game | GameNotFoundPayload;
    CelestiaVillagers: CelestiaVillagersRequestPayload;
    CelestiaVillagersVillager: Villager | VillagerNotFoundPayload;
    CelestiaVillagersVillagerArt: Buffer | VillagerNotFoundPayload;
    CelestiaVillagersVillagerCoffee: VillagerCoffeeReturnPayload;
}

export interface CelestiaRouteRequestPayload {
    list_all_games: string;
    get_a_game: string;
    list_all_villagers: string;
    get_a_villager: string;
    get_a_villagers_art: string;
    get_a_villagers_coffee: string;
}

export interface CelestiaGamesRequestPayload {
    games: `${GamesEnum}`[];
}

export interface CelestiaVillagersRequestPayload {
    villagers: `${VillagerKey}`[];
}

export interface VillagerNotFoundPayload extends NotFoundPayload<'Villager not found'> {}

export interface GameNotFoundPayload extends NotFoundPayload<'Game not found'> {}

export interface CoffeeNotFoundPayload extends NotFoundPayload<'No coffee available'> {}

export type AnyNotFoundPayload = VillagerNotFoundPayload | CoffeeNotFoundPayload | GameNotFoundPayload;

export interface NotFoundPayload<E extends string> {
    error: E;
    code: ErrorCodes.NotFound;
}

type VillagerCoffeeReturnPayload = Coffee | VillagerNotFoundPayload | CoffeeNotFoundPayload;

export enum ErrorCodes {
    NotFound = 404
}
