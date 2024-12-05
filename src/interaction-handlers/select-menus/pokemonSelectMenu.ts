import { decompressPokemonCustomIdMetadata, PokeDetails } from '#lib/Container/Api/Pokemon/index';
import { SelectMenuCustomIds } from '#utils/constants';
import { Learnset, Pokemon, PokemonEnum } from '@favware/graphql-pokemon';
import { ApplyOptions } from '@sapphire/decorators';
import { PaginatedMessage } from '@sapphire/discord.js-utilities';
import { InteractionHandler, InteractionHandlerTypes, UserError } from '@sapphire/framework';
import { isNullish } from '@sapphire/utilities';
import { StringSelectMenuInteraction } from 'discord.js';

@ApplyOptions<InteractionHandler.Options>({
	interactionHandlerType: InteractionHandlerTypes.SelectMenu
})
export class SelectMenuHandler extends InteractionHandler {
	public override run(interaction: StringSelectMenuInteraction, result: InteractionHandler.ParseResult<this>) {
		if (isNullish(result.pokemonDetails)) {
			throw new UserError({
				identifier: 'PokemonQueryFail',
				message: `I am sorry, but that query failed. Are you sure ${result.pokemon} is actually a Pokémon?`
			});
		}

		let paginatedMessage: PaginatedMessage;

		switch (result.responseToGenerate) {
			case 'pokemon': {
				paginatedMessage = new this.container.apis.pokemon.builders.pokemon(
					result.pokemonDetails as PokeDetails,
					result.spriteToGet,
					result.t
				).build();
				break;
			}
		}

		return paginatedMessage!.run(interaction, interaction.user);
	}

	public override async parse(interaction: StringSelectMenuInteraction) {
		if (!interaction.customId.startsWith(SelectMenuCustomIds.Pokemon)) return this.none();

		await interaction.deferReply();
		const t = await this.container.settings.guilds.acquireT(interaction.guildId);

		const pokemon = interaction.values[0];
		const splitCustomId = interaction.customId.split('|');
		const data = decompressPokemonCustomIdMetadata(splitCustomId.slice(1).join('|'), {
			interaction,
			handler: this
		});

		const responseToGenerate = data.type;
		const spriteToGet = data.spriteToGet ?? 'sprite';
		const generation = data.generation ?? 9;
		const moves = data.moves ?? [];

		let pokemonDetails: Omit<Pokemon, '__typename'> | Omit<Learnset, '__typename'> | undefined;

		switch (responseToGenerate) {
			case 'pokemon': {
				pokemonDetails = await this.container.apis.pokemon.getPokemon(pokemon as PokemonEnum);
				break;
			}
		}

		if (isNullish(pokemonDetails)) {
			return this.none();
		}

		return this.some({ pokemonDetails, pokemon, responseToGenerate, spriteToGet, generation, moves, t });
	}
}
