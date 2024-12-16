import { DetailedDescription, DetailedDescriptionArgs, FT, T } from '#lib/types';

export const PokemonDescription = T('commands/websearch:pokemonDescription');
export const PokemonDescriptionDex = T('commands/websearch:pokemonDescriptionDex');
export const PokemonDescriptionMove = T('commands/websearch:pokemonDescriptionMove');
export const PokemonDetailedDescription = FT<DetailedDescriptionArgs, DetailedDescription>('commands/websearch:pokemonDetailedDescription');
export const PokemonDexNone = FT<{ pokemon: string }>('commands/websearch:pokemonDexNone');
export const PokemonDexSelect = T('commands/websearch:pokemonDexSelect');
export const PokemonDexSelectPages = T<string[]>('commands/websearch:pokemonDexSelectPages');
export const PokemonDexSmogonUnknown = T('commands/websearch:pokemonDexSmogonUnknown');
export const PokemonMoveNone = FT<{ move: string }>('commands/websearch:pokemonMoveNone');
export const PokemonMoveSelect = T('commands/websearch:pokemonMoveSelect');
export const PokemonMoveSelectPages = T<string[]>('commands/websearch:pokemonMoveSelectPages');
export const PokemonOptionMove = T('commands/websearch:pokemonOptionMove');
export const PokemonOptionPokemon = T('commands/websearch:pokemonOptionPokemon');
export const PokemonOptionSprite = T('commands/websearch:pokemonOptionSprite');
export const PokemonTitles = T<{
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
	types: string;
	weight: string;
}>('commands/websearch:pokemonTitles');

export * from './websearch/index.js';
