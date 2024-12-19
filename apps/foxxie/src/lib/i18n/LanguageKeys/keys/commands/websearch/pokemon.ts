import { FT, T } from '#lib/types';

export const Titles = T<{
	abilities: string;
	baseStats: string;
	baseStatsTotal: string;
	cosmetic: string;
	dex: string;
	eggGroups: string;
	eggObtainable: string;
	ev: string;
	evolutions: string;
	external: string;
	gender: string;
	height: string;
	levelingRate: string;
	maxHatch: string;
	minHatch: string;
	other: string;
	smogon: string;
	weight: string;
}>('commands/websearch:pokemonTitles');
export const TitlesType = FT<{ count: number }>('commands/websearch:pokemonTitles.type');
