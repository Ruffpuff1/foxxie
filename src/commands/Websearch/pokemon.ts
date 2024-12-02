import { ApplyOptions, RequiresClientPermissions } from '@sapphire/decorators';
import { APIApplicationCommandOptionChoice, APISelectMenuOption, Locale, PermissionFlagsBits } from 'discord-api-types/v9';
import { FoxxieSubcommand } from '#lib/Structures/commands/FoxxieSubcommand';
import { LanguageKeys } from '#lib/I18n';
import { GuildMessage } from '#lib/Types';
import { SubcommandKeys } from '#lib/Container/Stores/Commands/Keys/index';
import { sendLoadingMessage } from '#utils/Discord';
import { PokemonEnum } from '@favware/graphql-pokemon';
import { fuzzyPokemonToSelectOption, PokemonSpriteTypes } from '#Api/Pokemon/Builders/pokemonResonseBuilder';
import { Awaitable, isNullish } from '@sapphire/utilities';
import { TFunction } from 'i18next';
import { ActionRowBuilder, Message, StringSelectMenuBuilder, TextChannel } from 'discord.js';
import { floatPromise } from '#lib/util/util';
import { cast } from '@ruffpuff/utilities';
import { SelectMenuCustomIds } from '#lib/util/constants';
import { ChatInputCommand } from '@sapphire/framework';
import { compressPokemonCustomIdMetadata } from '#Api/Pokemon/utils';

@ApplyOptions<FoxxieSubcommand.Options>({
    aliases: ['pkm', 'pk', 'mon'],
    description: LanguageKeys.Commands.Websearch.PokemonDescription,
    detailedDescription: LanguageKeys.Commands.Websearch.PokemonDetailedDescription,
    flags: ['shiny', 'back'],
    subcommands: [{ name: SubcommandKeys.Websearch.Pokemon, messageRun: SubcommandKeys.Websearch.Pokemon, default: true }]
})
export class UserCommand extends FoxxieSubcommand {
    private readonly spriteChoices: APIApplicationCommandOptionChoice<PokemonSpriteTypes>[] = [
        { name: 'Regular Sprite', value: 'sprite' },
        { name: 'Regular Back Sprite', value: 'backSprite' },
        { name: 'Shiny Sprite', value: 'shinySprite' },
        { name: 'Shiny Back Sprite', value: 'shinyBackSprite' }
    ];

    public override registerApplicationCommands(registry: ChatInputCommand.Registry): Awaitable<void> {
        registry //
            .registerChatInputCommand(
                builder =>
                    builder //
                        .setName(this.name)
                        .setDescription('desc')
                        .setDescriptionLocalizations({
                            [Locale.EnglishUS]: this.container.utilities.format.t.englishUS(
                                LanguageKeys.Commands.Websearch.PokemonDescription
                            )
                        })
                        .addSubcommand(command =>
                            command //
                                .setName('dex')
                                .setDescription('desc')
                                .setDescriptionLocalizations({
                                    [Locale.EnglishUS]: this.container.utilities.format.t.englishUS(
                                        LanguageKeys.Commands.Websearch.PokemonDescriptionDex
                                    )
                                })
                                .addStringOption(option =>
                                    option //
                                        .setName('pokemon')
                                        .setDescription('desc')
                                        .setDescriptionLocalizations({
                                            [Locale.EnglishUS]: 'pokemon description'
                                        })
                                        .setRequired(true)
                                        .setAutocomplete(true)
                                )
                                .addStringOption(option =>
                                    option //
                                        .setName('sprite')
                                        .setDescription('desc')
                                        .setDescriptionLocalizations({
                                            [Locale.EnglishUS]: 'sprite'
                                        })
                                        .setChoices(...this.spriteChoices)
                                )
                        ),
                { idHints: ['1311971505709649960'] }
            );
    }

    public override async chatInputRun(interaction: ChatInputCommand.Interaction): Promise<void> {
        await interaction.deferReply();

        const pokemon = interaction.options.getString('pokemon', true);
        const spriteToGet: PokemonSpriteTypes =
            (interaction.options.getString('sprite') as PokemonSpriteTypes | null) ?? 'sprite';

        await this.sendInteractionPokemonReply(pokemon, spriteToGet, interaction);
    }

    @RequiresClientPermissions([PermissionFlagsBits.AddReactions, PermissionFlagsBits.EmbedLinks])
    public async [SubcommandKeys.Websearch.Pokemon](msg: GuildMessage, args: FoxxieSubcommand.Args): Promise<unknown | Message> {
        const { t } = args;
        const response = await sendLoadingMessage(msg);

        const pokemon = (await args.rest('string')).toLowerCase();
        const backSprite = args.getFlags('back');
        const shinySprite = args.getFlags('shiny');
        const spriteToGet: PokemonSpriteTypes = this.getSpriteTypePokemonMessage(backSprite, shinySprite);

        return this.sendMessagePokemonReply(pokemon, spriteToGet, response, t, msg);
    }

    private getSpriteTypePokemonMessage(backSprite: boolean, shinySprite: boolean): PokemonSpriteTypes {
        if (backSprite) {
            if (shinySprite) return 'shinyBackSprite';
            return 'backSprite';
        }

        if (shinySprite) return 'shinySprite';
        return 'sprite';
    }

    private async sendInteractionPokemonReply(
        pokemon: string,
        spriteToGet: PokemonSpriteTypes,
        interaction: ChatInputCommand.Interaction
    ) {
        const pokemonDetails = await this.container.apis.pokemon.getPokemon(pokemon as PokemonEnum);
        const t = await this.container.settings.guilds.acquireT(interaction.guildId);

        if (isNullish(pokemonDetails)) {
            const fuzzyPokemon = await this.container.apis.pokemon.fuzzilySearchPokemon(pokemon, 25);
            const options = fuzzyPokemon.map<APISelectMenuOption>(fuzzyEntry => fuzzyPokemonToSelectOption(fuzzyEntry, 'label'));

            const metadata = compressPokemonCustomIdMetadata({
                type: 'pokemon',
                spriteToGet
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
                content: t(LanguageKeys.Commands.Websearch.PokemonDexNone, { pokemon }),
                components: [messageActionRow],
                ephemeral: true
            });
        }

        const paginatedMessage = new this.container.apis.pokemon.builders.pokemon(pokemonDetails, spriteToGet, t).build();
        return paginatedMessage.run(interaction);
    }

    private async sendMessagePokemonReply(
        pokemon: string,
        spriteToGet: PokemonSpriteTypes,
        message: Message,
        t: TFunction,
        userMessage: GuildMessage
    ) {
        const pokemonDetails = await this.container.apis.pokemon.getPokemon(pokemon as PokemonEnum);

        if (isNullish(pokemonDetails)) {
            const fuzzyPokemon = await this.container.apis.pokemon.fuzzilySearchPokemon(pokemon, 25);
            const options = fuzzyPokemon.map<APISelectMenuOption>(fuzzyEntry => fuzzyPokemonToSelectOption(fuzzyEntry, 'label'));

            const metadata = compressPokemonCustomIdMetadata({
                type: 'pokemon',
                spriteToGet
            });

            const customIdStringified = `${SelectMenuCustomIds.Pokemon}|${metadata}`;

            const messageActionRow = new ActionRowBuilder<StringSelectMenuBuilder>() //
                .setComponents(
                    new StringSelectMenuBuilder() //
                        .setCustomId(customIdStringified)
                        .setPlaceholder(t(LanguageKeys.Commands.Websearch.PokemonDexSelect))
                        .setOptions(options)
                );

            await floatPromise(message.delete());
            return cast<TextChannel>(message.channel).send({
                content: t(LanguageKeys.Commands.Websearch.PokemonDexNone, { pokemon }),
                components: [messageActionRow]
            });
        }

        const paginatedMessage = new this.container.apis.pokemon.builders.pokemon(pokemonDetails!, spriteToGet, t).build();
        await paginatedMessage.run(userMessage);
        return floatPromise(message.delete());
    }
}
