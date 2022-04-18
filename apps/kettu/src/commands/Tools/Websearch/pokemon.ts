import { ChatInputSubcommandArgs, CommandName } from '#types/Interactions';
import {
    cleanFormattedPokemonName,
    fuzzySearchMove,
    fuzzySearchPokemon,
    getMove,
    getPokemon,
    moveDisplayBuilder,
    pokemonDisplayBuilder,
    PokemonEnumToString
} from '#utils/APIs';
import { RegisterChatInputCommand, toLocalizationChoiceMap, toLocalizationMap } from '@foxxie/commands';
import { Command } from '@sapphire/framework';
import type { MovesEnum } from '@favware/graphql-pokemon';
import { MessageActionRow, MessageSelectMenu, MessageSelectOptionData } from 'discord.js';
import { LanguageKeys } from '#lib/i18n';
import { enUS, getGuildIds } from '#utils/util';
import type { APIApplicationCommandOptionChoice } from 'discord-api-types/v10';

@RegisterChatInputCommand(
    builder =>
        builder //
            .setName(CommandName.Pokemon)
            .setDescription(LanguageKeys.Commands.Websearch.PokemonDescription)
            .setDescriptionLocalizations(toLocalizationMap(LanguageKeys.Commands.Websearch.PokemonDescription))
            .subcommand(command =>
                command //
                    .setName('dex')
                    .setDescription(LanguageKeys.Commands.Websearch.PokemonDescriptionDex)
                    .setDescriptionLocalizations(toLocalizationMap(LanguageKeys.Commands.Websearch.PokemonDescriptionDex))
                    .addStringOption(option =>
                        option //
                            .setName('pokemon')
                            .setDescription(enUS(LanguageKeys.Commands.Websearch.PokemonOptionPokemon))
                            .setDescriptionLocalizations(toLocalizationMap(LanguageKeys.Commands.Websearch.PokemonOptionPokemon))
                            .setRequired(true)
                            .setAutocomplete(true)
                    )
                    .addStringOption(option =>
                        option //
                            .setName('sprite')
                            .setDescription(enUS(LanguageKeys.Commands.Websearch.PokemonOptionSprite))
                            .setDescriptionLocalizations(toLocalizationMap(LanguageKeys.Commands.Websearch.PokemonOptionSprite))
                            .setChoices(...UserCommand.Sprites)
                    )
            )
            .subcommand(command =>
                command //
                    .setName('move')
                    .setDescription(LanguageKeys.Commands.Websearch.PokemonDescriptionMove)
                    .setDescriptionLocalizations(toLocalizationMap(LanguageKeys.Commands.Websearch.PokemonDescriptionMove))
                    .addStringOption(option =>
                        option //
                            .setName('move')
                            .setDescription(enUS(LanguageKeys.Commands.Websearch.PokemonOptionMove))
                            .setDescriptionLocalizations(toLocalizationMap(LanguageKeys.Commands.Websearch.PokemonOptionMove))
                            .setRequired(true)
                            .setAutocomplete(true)
                    )
            ),
    {
        idHints: ['946977564449177682', '947398139927756811'],
        guildIds: getGuildIds()
    }
)
export class UserCommand extends Command {
    public async dex(...[interaction, , args]: Required<ChatInputSubcommandArgs<CommandName.Pokemon, 'dex'>>): Promise<any> {
        await interaction.deferReply();

        const { pokemon } = args;
        const spriteToGet = args.sprite ?? 'sprite';

        const data = await getPokemon(cleanFormattedPokemonName(pokemon));

        if (!data) {
            const fuzzyPokemon = await fuzzySearchPokemon(pokemon, 25);
            const opts = fuzzyPokemon.map<MessageSelectOptionData>(entry => ({
                label: PokemonEnumToString(entry.key),
                value: entry.key
            }));

            const actionRow = new MessageActionRow() //
                .setComponents(
                    new MessageSelectMenu() //
                        .setPlaceholder(args.t(LanguageKeys.Commands.Websearch.PokemonDexSelect))
                        .setCustomId(`pokemon|pokemon|${spriteToGet}`)
                        .setOptions(opts)
                );

            await interaction.deleteReply();
            return interaction.followUp({
                content: args.t(LanguageKeys.Commands.Websearch.PokemonDexNone, { pokemon }),
                components: [actionRow],
                ephemeral: true
            });
        }

        const display = pokemonDisplayBuilder(data, spriteToGet, args.t);

        return display.run(interaction);
    }

    public async move(...[interaction, , args]: Required<ChatInputSubcommandArgs<CommandName.Pokemon, 'move'>>): Promise<any> {
        await interaction.deferReply();

        const { move } = args;

        const data = await getMove(move as MovesEnum);

        if (!data) {
            const fuzzyMove = await fuzzySearchMove(move, 25);
            const opts = fuzzyMove.map<MessageSelectOptionData>(entry => ({ label: entry.name, value: entry.key }));

            const actionRow = new MessageActionRow() //
                .setComponents(
                    new MessageSelectMenu() //
                        .setPlaceholder(args.t(LanguageKeys.Commands.Websearch.PokemonMoveSelect))
                        .setCustomId(`pokemon|move`)
                        .setOptions(opts)
                );

            await interaction.deleteReply();
            return interaction.followUp({
                content: args.t(LanguageKeys.Commands.Websearch.PokemonMoveNone, { move }),
                components: [actionRow],
                ephemeral: true
            });
        }

        const display = moveDisplayBuilder(data, args.t, interaction.guild?.me?.displayColor);
        return display.run(interaction);
    }

    private static readonly Sprites: APIApplicationCommandOptionChoice<string>[] = [
        {
            value: 'sprite',
            ...toLocalizationChoiceMap(LanguageKeys.Interactions.ChoiceSpriteSprite)
        },
        {
            value: 'backSprite',
            ...toLocalizationChoiceMap(LanguageKeys.Interactions.ChoiceSpriteBackSprite)
        },
        {
            value: 'shinySprite',
            ...toLocalizationChoiceMap(LanguageKeys.Interactions.ChoiceSpriteShinySprite)
        },
        {
            value: 'shinyBackSprite',
            ...toLocalizationChoiceMap(LanguageKeys.Interactions.ChoiceSpriteShinyBackSprite)
        }
    ];
}
//
