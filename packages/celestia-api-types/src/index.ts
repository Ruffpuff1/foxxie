import { VillagerKey } from './villager';

export * from './payloads';
export * from './specialVillager';
export * from './villager';

type VillagerKeyInput = VillagerKey | `${VillagerKey}`;

export const Routes = {
    /**
     * Route for:
     * - GET `/celestia`
     */
    celestia() {
        return `/celestia`;
    },
    /**
     * Route for:
     * - GET `/celestia/games`
     */
    games() {
        return `/celestia/games`;
    },
    /**
     * Route for:
     * - GET `/celestia/villagers`
     */
    villagers() {
        return `/celestia/villagers`;
    },
    /**
     * Route for:
     * - GET `/celestia/villagers/{villager.key}`
     */
    villager(key: VillagerKeyInput) {
        return `/celestia/villagers/${key}`;
    },
    /**
     * Route for:
     * - GET `/celestia/villagers/{villager.key}/coffee`
     */
    villagerCoffee(key: VillagerKeyInput) {
        return `/celestia/vilagers/${key}/coffee`;
    }
};

export const RouteBase = `api.reese.gay`;
