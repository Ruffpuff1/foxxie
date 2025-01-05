import { PokemonEnum } from '@favware/graphql-pokemon';
import { RequiresClientPermissions } from '@sapphire/decorators';
import { container } from '@sapphire/pieces';
import { send } from '@sapphire/plugin-editable-commands';
import { isNullish } from '@sapphire/utilities';
import { compressPokemonCustomIdMetadata, fuzzyPokemonToSelectOption, getSpriteTypePokemon, PokemonSpriteTypes } from '#lib/api/Pokemon/index';
import { LanguageKeys } from '#lib/i18n';
import { FoxxieSubcommand } from '#lib/Structures/commands/FoxxieSubcommand';
import { GuildMessage } from '#lib/types';
import { SelectMenuCustomIds } from '#utils/constants';
import { MessageSubcommand, RegisterSubcommand, RequiresMemberPermissions } from '#utils/decorators';
import { sendLoadingMessage } from '#utils/functions/messages';
import { ActionRowBuilder, APISelectMenuOption, Message, PermissionFlagsBits, StringSelectMenuBuilder } from 'discord.js';

@RegisterSubcommand((command) =>
	command
		.setAliases('pkm', 'pk', 'mon')
		.setDescription(LanguageKeys.Commands.Websearch.Pokemon.Description)
		.setDetailedDescription(LanguageKeys.Commands.Websearch.Pokemon.DetailedDescription)
		.setFlags(['shiny', 'back'])
)
export class PokemonCommand extends FoxxieSubcommand {
	@MessageSubcommand(PokemonCommand.SubcommandKeys.Pokemon, true, ['dex'])
	@RequiresClientPermissions(PermissionFlagsBits.EmbedLinks)
	@RequiresMemberPermissions(PermissionFlagsBits.EmbedLinks)
	public static async MessageRunPokemon(message: GuildMessage, args: FoxxieSubcommand.Args): Promise<Message | unknown> {
		const { t } = args;
		const loadingMessage = await sendLoadingMessage(message);

		const pokemon = (await args.rest('string')).toLowerCase();
		const backSprite = args.getFlags('back');
		const shinySprite = args.getFlags('shiny');
		const spriteToGet: PokemonSpriteTypes = getSpriteTypePokemon(backSprite, shinySprite);

		const pokemonDetails = await container.apis.pokemon.getPokemon(pokemon as PokemonEnum);

		if (isNullish(pokemonDetails)) {
			const fuzzyPokemon = await container.apis.pokemon.fuzzilySearchPokemon(pokemon, 25);
			const options = fuzzyPokemon.map<APISelectMenuOption>((fuzzyEntry) => fuzzyPokemonToSelectOption(fuzzyEntry, 'label'));

			const metadata = compressPokemonCustomIdMetadata({
				spriteToGet,
				type: 'pokemon'
			});

			const customIdStringified = `${SelectMenuCustomIds.Pokemon}|${metadata}`;

			const messageActionRow = new ActionRowBuilder<StringSelectMenuBuilder>() //
				.setComponents(
					new StringSelectMenuBuilder() //
						.setCustomId(customIdStringified)
						.setPlaceholder(t(LanguageKeys.Commands.Websearch.Pokemon.DexSelect))
						.setOptions(options)
				);

			return send(message, {
				components: [messageActionRow],
				content: t(LanguageKeys.Commands.Websearch.Pokemon.DexNone, { pokemon }),
				embeds: []
			});
		}

		const paginatedMessage = new container.apis.pokemon.builders.pokemon(pokemonDetails!, spriteToGet, t).build();
		return paginatedMessage.run(loadingMessage, message.author);
	}

	public static SubcommandKeys = {
		Pokemon: 'pokemon'
	};
}
