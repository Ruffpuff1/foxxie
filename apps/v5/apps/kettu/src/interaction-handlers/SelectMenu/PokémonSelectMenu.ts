import { getMove, getPokemon, moveDisplayBuilder, pokemonDisplayBuilder, PokemonSpriteTypes } from '#utils/APIs';
import { ApplyOptions } from '@sapphire/decorators';
import { InteractionHandler, InteractionHandlerTypes } from '@sapphire/framework';
import type { SelectMenuInteraction } from 'discord.js';
import type { Move, MovesEnum, Pokemon, PokemonEnum } from '@favware/graphql-pokemon';
import type { PaginatedMessage } from '@sapphire/discord.js-utilities';
import { getLocale } from '#utils/decorators';

@ApplyOptions<InteractionHandler.Options>({
    interactionHandlerType: InteractionHandlerTypes.SelectMenu
})
export class UserInteractionHandler extends InteractionHandler {
    public override async run(interaction: SelectMenuInteraction, result: InteractionHandler.ParseResult<this>) {
        let display: PaginatedMessage;

        switch (result.type) {
            case 'pokemon':
                display = pokemonDisplayBuilder(result.data as Omit<Pokemon, '__typename'>, result.spriteToGet as PokemonSpriteTypes, getLocale(interaction));
                break;
            case 'move':
                display = moveDisplayBuilder(result.data as Omit<Move, '__typename'>, getLocale(interaction), interaction.guild?.me?.displayColor);
                break;
        }

        return display.run(interaction, interaction.user);
    }

    public override async parse(interaction: SelectMenuInteraction) {
        if (!interaction.customId.startsWith('pokemon|')) return this.none();

        const value = interaction.values[0];
        const [, type, spriteToGet] = interaction.customId.split('|');
        let data;

        switch (type) {
            case 'pokemon':
                data = await getPokemon(value as PokemonEnum);
                break;
            case 'move':
                data = await getMove(value as MovesEnum);
                break;
        }

        return this.some({ data, spriteToGet, type: type as 'pokemon' | 'move' });
    }
}
