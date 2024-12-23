import { LanguageKeys } from '#lib/I18n';
import { Response } from '#utils/Response';
import { Urls } from '#utils/constants';
import {
    Villager as ApiVillager,
    CoffeeBeansEnum,
    CoffeeMilkEnum,
    CoffeeSugarEnum,
    GamesEnum,
    KKSliderSongs,
    RouteRequestPayloads
} from '@foxxie/celestia-api-types';
import { fetch } from '@foxxie/fetch';
import { cast } from '@ruffpuff/utilities';
import { Villager } from '../Structures/Villager';
import { VillagerAmiibo } from '../Structures/VillagerAmiibo';
import { VillagerCoffeeRequest } from '../Structures/VillagerCoffeeRequest';
import {
    coffeeBeansEnumToString,
    coffeeMilkEnumToString,
    coffeeSugarEnumToString,
    gamesEnumToString,
    kKSliderSongEnumToString
} from '../celestia';

export class CelestiaRepository {
    public async getVillager(param: string): Promise<Response<Villager>> {
        try {
            const data = await fetch(Urls.Celestia)
                .path('api', 'villagers', param)
                .json<RouteRequestPayloads['CelestiaVillagersVillager']>();

            if (Reflect.has(data, 'error')) {
                return new Response({
                    success: false,
                    message: LanguageKeys.Commands.Fun.AnimalcrossingNoVillager
                });
            }

            const villagerData = data as ApiVillager;

            return new Response({
                success: true,
                content: new Villager({
                    name: villagerData.key,
                    nameJapanese: villagerData.keyJp,
                    gender: villagerData.gender,
                    species: villagerData.species,
                    personality: villagerData.personality,
                    favoriteSaying: villagerData.favoriteSaying,
                    catchphrase: villagerData.catchphrase,
                    description: villagerData.description,
                    games: villagerData.games.map(g => gamesEnumToString(g as GamesEnum)),
                    art: villagerData.art,
                    coffeeRequest: villagerData.coffeeRequest
                        ? new VillagerCoffeeRequest({
                              beans: coffeeBeansEnumToString(cast<CoffeeBeansEnum>(villagerData.coffeeRequest?.beans)),
                              sugar: coffeeSugarEnumToString(cast<CoffeeSugarEnum>(villagerData.coffeeRequest?.sugar)),
                              milk: coffeeMilkEnumToString(cast<CoffeeMilkEnum>(villagerData.coffeeRequest?.milk))
                          })
                        : null,
                    siblings: villagerData.siblings || null,
                    skill: villagerData.skill || null,
                    goal: villagerData.goal || null,
                    song: villagerData.song ? kKSliderSongEnumToString(cast<KKSliderSongs>(villagerData.song)) : null,
                    amiibo: villagerData.amiibo ? new VillagerAmiibo(villagerData.amiibo) : null,
                    birthday: villagerData.birthday
                })
            });
        } catch {
            return new Response({
                success: false,
                message: 'Internal Error'
            });
        }
    }
}
