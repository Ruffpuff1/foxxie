import { Coffee, GamesEnum, Villager, VillagerKey } from './villager';

export interface RouteRequestPayloads {
    Celestia: CelestiaRouteRequestPayload;
    CelestiaGames: CelestiaGamesRequestPayload;
    CelestiaVillagers: CelestiaVillagersRequestPayload;
    CelestiaVillagersVillager: Villager | VillagerNotFoundPayload;
    CelestiaVillagersVillagerCoffee: VillagerCoffeeReturnPayload;
}

export interface CelestiaRouteRequestPayload {
    list_all_games: string;
    list_all_villagers: string;
    get_a_villager: string;
    get_a_villagers_coffee: string;
}

export interface CelestiaGamesRequestPayload {
    games: `${GamesEnum}`[];
}

export interface CelestiaVillagersRequestPayload {
    villagers: `${VillagerKey}`[];
}

export interface VillagerNotFoundPayload extends NotFoundPayload<'Villager not found'> {}

export interface CoffeeNotFoundPayload extends NotFoundPayload<'No coffee available'> {}

export interface NotFoundPayload<E extends string> {
    error: E;
    code: ErrorCodes.NotFound;
}

type VillagerCoffeeReturnPayload = Coffee | VillagerNotFoundPayload | CoffeeNotFoundPayload;

export enum ErrorCodes {
    NotFound = 404
}
