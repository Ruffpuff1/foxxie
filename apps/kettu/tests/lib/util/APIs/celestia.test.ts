import { gamesEnumToString } from '#utils/APIs';
import { GamesEnum } from '@ruffpuff/celestia';

describe('celestia', () => {
    test('WHEN given gamesEnum member, return string', () => {
        expect(gamesEnumToString(GamesEnum.AmiiboFestival)).toEqual('Amiibo Festival');
        expect(gamesEnumToString(GamesEnum.AnimalCrossing)).toEqual('Animal Crossing');
        expect(gamesEnumToString(GamesEnum.CityFolk)).toEqual('City Folk');
        expect(gamesEnumToString(GamesEnum.DoubutsuNoMori)).toEqual('Dōbutsu no Mori');
        expect(gamesEnumToString(GamesEnum.HappyHomeDesigner)).toEqual('Happy Home Designer');
    });
});
