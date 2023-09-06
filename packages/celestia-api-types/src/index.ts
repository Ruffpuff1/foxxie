import { GamesEnum } from './game';
import { CelestiaRouteRequestPayload } from './payloads';
import { VillagerKey } from './villager';

export * from './game';
export * from './payloads';
export * from './specialVillager';
export * from './villager';

type VillagerKeyInput = VillagerKey | `${VillagerKey}`;

export const Routes = {
    /**
     * Route for:
     * - GET `/api`
     */
    celestia() {
        return `/api`;
    },
    /**
     * Route for:
     * - GET `/api/games`
     */
    games() {
        return `/api/games`;
    },
    /**
     * Route for:
     * - GET `/api/games/{game.key}`
     */
    game(game: `${GamesEnum}`) {
        return `/api/games/${game}`;
    },
    /**
     * Route for:
     * - GET `/api/villagers`
     */
    villagers() {
        return `/api/villagers`;
    },
    /**
     * Route for:
     * - GET `/api/villagers/{villager.key}`
     */
    villager(key: VillagerKeyInput) {
        return `/api/villagers/${key}`;
    },
    /**
     * Route for:
     * - GET `/api/villagers/{villager.key}/art.png`
     */
    villagerArt(key: VillagerKeyInput) {
        return `/api/vilagers/${key}/art.png`;
    },
    /**
     * Route for:
     * - GET `/api/villagers/{villager.key}/coffee`
     */
    villagerCoffee(key: VillagerKeyInput) {
        return `/api/vilagers/${key}/coffee`;
    }
};

export const RouteBase = `celestia.reese.gay`;

export const ROUTES: CelestiaRouteRequestPayload = {
    list_all_games: `https://${RouteBase}/api/games`,
    get_a_game: `https://${RouteBase}/api/games/{key}`,
    list_all_villagers: `https://${RouteBase}/api/villagers`,
    get_a_villager: `https://${RouteBase}/api/villagers/{key}`,
    get_a_villagers_art: `https://${RouteBase}/api/villagers/{key}/art.png`,
    get_a_villagers_coffee: `https://${RouteBase}/api/villagers/{key}/coffee`
};
