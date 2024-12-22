import makeRequest from '@aero/http';
import {
	PokemonEnum,
	Query,
	QueryGetAbilityArgs,
	QueryGetAllPokemonArgs,
	QueryGetFuzzyAbilityArgs,
	QueryGetFuzzyItemArgs,
	QueryGetFuzzyMoveArgs,
	QueryGetFuzzyPokemonArgs,
	QueryGetItemArgs,
	QueryGetLearnsetArgs,
	QueryGetMoveArgs,
	QueryGetPokemonArgs,
	QueryGetTypeMatchupArgs
} from '@favware/graphql-pokemon';
import { UserError } from '@sapphire/framework';
import { Result } from '@sapphire/result';
import { envParseString } from '@skyra/env-utilities';
import { EnvKeys } from '#lib/types';
import os from 'node:os';

import { PokemonBuilderService } from './Builders/PokemonBuilderService.js';
import { getFuzzyPokemon, getPokemon } from './queries.js';
import { FavouredPokemon } from './utils.js';

type PokemonQueryReturnTypes = keyof Pick<
	Query,
	| 'getAbility'
	| 'getAllPokemon'
	| 'getFuzzyAbility'
	| 'getFuzzyItem'
	| 'getFuzzyMove'
	| 'getFuzzyPokemon'
	| 'getItem'
	| 'getLearnset'
	| 'getMove'
	| 'getPokemon'
	| 'getTypeMatchup'
>;

type PokemonQueryVariables<R extends PokemonQueryReturnTypes> = R extends 'getAbility'
	? QueryGetAbilityArgs
	: R extends 'getFuzzyAbility'
		? QueryGetFuzzyAbilityArgs
		: R extends 'getItem'
			? QueryGetItemArgs
			: R extends 'getFuzzyItem'
				? QueryGetFuzzyItemArgs
				: R extends 'getMove'
					? QueryGetMoveArgs
					: R extends 'getFuzzyMove'
						? QueryGetFuzzyMoveArgs
						: R extends 'getPokemon'
							? QueryGetPokemonArgs
							: R extends 'getFuzzyPokemon'
								? QueryGetFuzzyPokemonArgs
								: R extends 'getLearnset'
									? QueryGetLearnsetArgs
									: R extends 'getTypeMatchup'
										? QueryGetTypeMatchupArgs
										: R extends 'getAllPokemon'
											? QueryGetAllPokemonArgs
											: never;

interface PokemonResponse<K extends keyof Omit<Query, '__typename'>> {
	data: Record<K, Omit<Query[K], '__typename'>>;
}

export class PokemonService {
	public builders = new PokemonBuilderService();

	private uri = envParseString(EnvKeys.PokemonUrl);

	private userAgent = `Ruffstuff API Handler ${os.platform()}/${os.release()}`;

	public async fuzzilySearchPokemon(pokemon: string, take = 20, includeSpecialPokemon = true) {
		const result = await Result.fromAsync(async () => {
			const apiResult = await this.fetchGraphQLPokemon<'getFuzzyPokemon'>(getFuzzyPokemon, { pokemon, take });
			return apiResult.data.getFuzzyPokemon;
		});

		if (result.isErr()) {
			return FavouredPokemon;
		}

		if (!includeSpecialPokemon) {
			const filteredPokemon = result.unwrap().filter((pokemon) => !pokemon.forme && pokemon.num >= 0);

			if (!filteredPokemon.length) return FavouredPokemon;
			return filteredPokemon;
		}

		return result.unwrap();
	}

	public async getPokemon(pokemon: PokemonEnum) {
		const result = await Result.fromAsync(async () => {
			const apiResult = await this.fetchGraphQLPokemon<'getPokemon'>(getPokemon, {
				pokemon
			});
			return apiResult.data.getPokemon;
		});

		if (result.isErr()) return;

		return result.unwrap();
	}

	private async fetchGraphQLPokemon<R extends PokemonQueryReturnTypes>(
		query: string,
		variables: PokemonQueryVariables<R>
	): Promise<PokemonResponse<R>> {
		const result = await Result.fromAsync(async () =>
			makeRequest(this.uri)
				.method('POST')
				.header({
					'Content-Type': 'application/json',
					'User-Agent': this.userAgent
				})
				.body(JSON.stringify({ query, variables }))
				.json<PokemonResponse<R>>()
		);

		if (result.isErr()) {
			throw new UserError({
				identifier: 'QueryFail',
				message: 'Err fetching pokemon'
			});
		}

		return result.unwrap();
	}
}
