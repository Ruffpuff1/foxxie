import { HastebinService } from './Hastebin/HastbinService.js';
import { PokemonService } from './Pokemon/pokemon.js';

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
