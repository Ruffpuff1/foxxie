import { HastebinService } from './Hastebin/HastbinService';
import { PokemonService } from './Pokemon/pokemon';

/**
 * Api manager
 */
export class ApiService {
    /**
     * The hastebin api service.
     */
    public hastebin = new HastebinService();
    /**
     * The Pokemon Api Service.
     */
    public pokemon = new PokemonService();
}
