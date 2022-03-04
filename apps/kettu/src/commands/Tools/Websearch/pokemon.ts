import { ChatInputArgs, CommandName } from '#types/Interactions';
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
import { RegisterChatInputCommand } from '#utils/decorators';
import { Command } from '@sapphire/framework';
import type { MovesEnum } from '@favware/graphql-pokemon';
import { MessageActionRow, MessageSelectMenu, MessageSelectOptionData } from 'discord.js';
import { LanguageKeys } from '#lib/i18n';
import { enUS } from '#utils/util';

@RegisterChatInputCommand(
    CommandName.Pokemon,
    builder =>
        builder //
            .setDescription(enUS(LanguageKeys.Commands.Websearch.PokemonDescription))
            .addSubcommand(command =>
                command //
                    .setName('dex')
                    .setDescription(enUS(LanguageKeys.Commands.Websearch.PokemonDescriptionDex))
                    .addStringOption(option =>
                        option //
                            .setName('pokemon')
                            .setDescription(enUS(LanguageKeys.Commands.Websearch.PokemonOptionPokemon))
                            .setRequired(true)
                            .setAutocomplete(true)
                    )
                    .addStringOption(option =>
                        option //
                            .setName('sprite')
                            .setDescription(enUS(LanguageKeys.Commands.Websearch.PokemonOptionSprite))
                            .setChoices(UserCommand.Sprites)
                    )
            )
            .addSubcommand(command =>
                command //
                    .setName('move')
                    .setDescription(enUS(LanguageKeys.Commands.Websearch.PokemonDescriptionMove))
                    .addStringOption(option =>
                        option //
                            .setName('move')
                            .setDescription(enUS(LanguageKeys.Commands.Websearch.PokemonOptionMove))
                            .setRequired(true)
                            .setAutocomplete(true)
                    )
            ),
    ['946977564449177682', '947398139927756811']
)
export class UserCommand extends Command {
    public async chatInputRun(...[interaction, c, args]: ChatInputArgs<CommandName.Pokemon>) {
        const subcommand = interaction.options.getSubcommand(true);
        args = args!;

        switch (subcommand) {
            case 'dex':
                return this.dex(interaction, c, args);
            case 'move':
                return this.move(interaction, c, args);
            default:
                throw new Error(`Subcommand ${subcommand} not supported.`);
        }
    }

    public async dex(...[interaction, , args]: Required<ChatInputArgs<CommandName.Pokemon>>): Promise<any> {
        await interaction.deferReply();

        const { pokemon } = args.dex;
        const spriteToGet = args.dex.sprite ?? 'sprite';

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

    public async move(...[interaction, , args]: Required<ChatInputArgs<CommandName.Pokemon>>): Promise<any> {
        await interaction.deferReply();

        const { move } = args.move;

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

        const display = moveDisplayBuilder(data, args.t);
        return display.run(interaction);
    }

    private static readonly Sprites: [string, string][] = [
        ['Sprite', 'sprite'],
        ['Back Sprite', 'backSprite'],
        ['Shiny Sprite', 'shinySprite'],
        ['Shiny Back Sprite', 'shinyBackSprite']
    ];
}
