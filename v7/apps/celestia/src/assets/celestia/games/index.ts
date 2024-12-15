import { Game, GamesEnum } from '@foxxie/celestia-api-types';
import { DoubutsuNoMori } from './data/dnm';
import { AnimalCrossing } from './data/ac';

export const Games = new Map<`${GamesEnum}`, Game>([[GamesEnum.DoubutsuNoMori, DoubutsuNoMori], [GamesEnum.AnimalCrossing, AnimalCrossing]]);
