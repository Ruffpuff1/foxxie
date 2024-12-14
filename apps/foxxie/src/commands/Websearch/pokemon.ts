import { PokemonEnum } from '@favware/graphql-pokemon';
import { ApplyOptions, RequiresClientPermissions } from '@sapphire/decorators';
import { ChatInputCommand } from '@sapphire/framework';
import { send } from '@sapphire/plugin-editable-commands';
import { fetchT, TFunction } from '@sapphire/plugin-i18next';
import { isNullish } from '@sapphire/utilities';
import { compressPokemonCustomIdMetadata, fuzzyPokemonToSelectOption, PokemonSpriteTypes } from '#lib/api/Pokemon/index';
import { SubcommandKeys } from '#lib/Container/Stores/Commands/Keys/index';
import { IdHints } from '#lib/discord';
import { LanguageKeys } from '#lib/i18n';
import { FoxxieSubcommand } from '#lib/Structures/commands/FoxxieSubcommand';
import { GuildMessage } from '#lib/types';
import { SelectMenuCustomIds } from '#utils/constants';
import { sendLoadingMessage } from '#utils/functions/messages';
import {
	ActionRowBuilder,
	APIApplicationCommandOptionChoice,
	APISelectMenuOption,
	Awaitable,
	InteractionContextType,
	Locale,
	Message,
	PermissionFlagsBits,
	StringSelectMenuBuilder
} from 'discord.js';

@ApplyOptions<FoxxieSubcommand.Options>({
	aliases: ['pkm', 'pk', 'mon'],
	description: LanguageKeys.Commands.Websearch.PokemonDescription,
	detailedDescription: LanguageKeys.Commands.Websearch.PokemonDetailedDescription,
	flags: ['shiny', 'back'],
	subcommands: [
		{ default: true, messageRun: SubcommandKeys.Websearch.Pokemon, name: SubcommandKeys.Websearch.Pokemon },
		{ chatInputRun: 'chatInputRunPokemon', messageRun: SubcommandKeys.Websearch.Pokemon, name: 'dex' }
	]
})
export class UserCommand extends FoxxieSubcommand {
	private readonly spriteChoices: APIApplicationCommandOptionChoice<PokemonSpriteTypes>[] = [
		{ name: 'Regular Sprite', value: 'sprite' },
		{ name: 'Regular Back Sprite', value: 'backSprite' },
		{ name: 'Shiny Sprite', value: 'shinySprite' },
		{ name: 'Shiny Back Sprite', value: 'shinyBackSprite' }
	];

	public async chatInputRunPokemon(interaction: ChatInputCommand.Interaction): Promise<void> {
		await interaction.deferReply();

		const pokemon = interaction.options.getString('pokemon', true);
		const spriteToGet: PokemonSpriteTypes = (interaction.options.getString('sprite') as null | PokemonSpriteTypes) ?? 'sprite';

		await this.sendInteractionPokemonReply(pokemon, spriteToGet, interaction);
	}

	public override registerApplicationCommands(registry: ChatInputCommand.Registry): Awaitable<void> {
		registry //
			.registerChatInputCommand(
				(builder) =>
					builder //
						.setName(this.name)
						.setContexts(InteractionContextType.Guild)
						.setDescription('desc')
						.setDescriptionLocalizations({
							[Locale.EnglishUS]: this.container.utilities.format.t.englishUS(LanguageKeys.Commands.Websearch.PokemonDescription)
						})
						.addSubcommand((command) =>
							command //
								.setName('dex')
								.setDescription('desc')
								.setDescriptionLocalizations({
									[Locale.EnglishUS]: this.container.utilities.format.t.englishUS(
										LanguageKeys.Commands.Websearch.PokemonDescriptionDex
									)
								})
								.addStringOption((option) =>
									option //
										.setName('pokemon')
										.setDescription('desc')
										.setDescriptionLocalizations({
											[Locale.EnglishUS]: 'pokemon description'
										})
										.setRequired(true)
										.setAutocomplete(true)
								)
								.addStringOption((option) =>
									option //
										.setName('sprite')
										.setDescription('desc')
										.setDescriptionLocalizations({
											[Locale.EnglishUS]: 'sprite'
										})
										.setChoices(...this.spriteChoices)
								)
						),
				{
					idHints: [IdHints.Nightly.Websearch.Pokemon]
				}
			);
	}

	@RequiresClientPermissions([PermissionFlagsBits.AddReactions, PermissionFlagsBits.EmbedLinks])
	public async [SubcommandKeys.Websearch.Pokemon](msg: GuildMessage, args: FoxxieSubcommand.Args): Promise<Message | unknown> {
		const { t } = args;
		const loadingMessage = await sendLoadingMessage(msg);

		const pokemon = (await args.rest('string')).toLowerCase();
		const backSprite = args.getFlags('back');
		const shinySprite = args.getFlags('shiny');
		const spriteToGet: PokemonSpriteTypes = this.getSpriteTypePokemonMessage(backSprite, shinySprite);

		return this.sendMessagePokemonReply(pokemon, spriteToGet, t, msg, loadingMessage as GuildMessage);
	}

	private getSpriteTypePokemonMessage(backSprite: boolean, shinySprite: boolean): PokemonSpriteTypes {
		if (backSprite) {
			if (shinySprite) return 'shinyBackSprite';
			return 'backSprite';
		}

		if (shinySprite) return 'shinySprite';
		return 'sprite';
	}

	private async sendInteractionPokemonReply(pokemon: string, spriteToGet: PokemonSpriteTypes, interaction: ChatInputCommand.Interaction) {
		const pokemonDetails = await this.container.apis.pokemon.getPokemon(pokemon as PokemonEnum);
		const t = await fetchT(interaction.guild!);

		if (isNullish(pokemonDetails)) {
			const fuzzyPokemon = await this.container.apis.pokemon.fuzzilySearchPokemon(pokemon, 25);
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
						.setPlaceholder(t(LanguageKeys.Commands.Websearch.PokemonDexSelect))
						.setOptions(options)
				);

			await interaction.deleteReply();
			return interaction.followUp({
				components: [messageActionRow],
				content: t(LanguageKeys.Commands.Websearch.PokemonDexNone, { pokemon }),
				ephemeral: true
			});
		}

		const paginatedMessage = new this.container.apis.pokemon.builders.pokemon(pokemonDetails, spriteToGet, t).build();
		return paginatedMessage.run(interaction);
	}

	private async sendMessagePokemonReply(
		pokemon: string,
		spriteToGet: PokemonSpriteTypes,
		t: TFunction,
		userMessage: GuildMessage,
		loadingMessage: GuildMessage
	) {
		const pokemonDetails = await this.container.apis.pokemon.getPokemon(pokemon as PokemonEnum);

		if (isNullish(pokemonDetails)) {
			const fuzzyPokemon = await this.container.apis.pokemon.fuzzilySearchPokemon(pokemon, 25);
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
						.setPlaceholder(t(LanguageKeys.Commands.Websearch.PokemonDexSelect))
						.setOptions(options)
				);

			return send(userMessage, {
				components: [messageActionRow],
				content: t(LanguageKeys.Commands.Websearch.PokemonDexNone, { pokemon }),
				embeds: []
			});
		}

		const paginatedMessage = new this.container.apis.pokemon.builders.pokemon(pokemonDetails!, spriteToGet, t).build();
		return paginatedMessage.run(loadingMessage, userMessage.author);
	}
}
