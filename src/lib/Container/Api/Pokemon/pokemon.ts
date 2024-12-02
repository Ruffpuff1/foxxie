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
import os from 'node:os';
import { Result } from '@sapphire/result';
import { getFuzzyPokemon, getPokemon } from './queries';
import { EnvParse } from '@foxxie/env';
import { EnvKeys } from '#lib/Types';
import { fetch } from '@foxxie/fetch';
import { UserError } from '@sapphire/framework';
import { PokemonBuilderService } from './Builders/PokemonBuilderService';
import { FavouredPokemon } from './utils';

export class PokemonService {
    public builders = new PokemonBuilderService();

    private uri = EnvParse.string(EnvKeys.PokemonUrl);

    private userAgent = `Favware Dragonite/1.0.0 (apollo-client) ${os.platform()}/${os.release()}`;

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

    public async fuzzilySearchPokemon(pokemon: string, take = 20, includeSpecialPokemon = true) {
        const result = await Result.fromAsync(async () => {
            const apiResult = await this.fetchGraphQLPokemon<'getFuzzyPokemon'>(getFuzzyPokemon, { pokemon, take });
            return apiResult.data.getFuzzyPokemon;
        });

        if (result.isErr()) {
            return FavouredPokemon;
        }

        if (!includeSpecialPokemon) {
            const filteredPokemon = result.unwrap().filter(pokemon => !pokemon.forme && pokemon.num >= 0);

            if (!filteredPokemon.length) return FavouredPokemon;
            return filteredPokemon;
        }

        return result.unwrap();
    }

    private async fetchGraphQLPokemon<R extends PokemonQueryReturnTypes>(
        query: string,
        variables: PokemonQueryVariables<R>
    ): Promise<PokemonResponse<R>> {
        const result = await Result.fromAsync(async () =>
            fetch(this.uri)
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

type PokemonQueryReturnTypes = keyof Pick<
    Query,
    | 'getAbility'
    | 'getFuzzyAbility'
    | 'getItem'
    | 'getMove'
    | 'getPokemon'
    | 'getLearnset'
    | 'getTypeMatchup'
    | 'getAllPokemon'
    | 'getFuzzyItem'
    | 'getFuzzyMove'
    | 'getFuzzyPokemon'
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
