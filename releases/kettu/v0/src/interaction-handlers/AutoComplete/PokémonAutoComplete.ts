import { fuzzySearchMove, fuzzySearchPokemon, PokemonEnumToString } from '#utils/APIs';
import { ApplyOptions } from '@sapphire/decorators';
import { InteractionHandler, InteractionHandlerTypes } from '@sapphire/framework';
import type { AutocompleteInteraction } from 'discord.js';

@ApplyOptions<InteractionHandler.Options>({
    interactionHandlerType: InteractionHandlerTypes.Autocomplete
})
export class UserInteractionHandler extends InteractionHandler {
    public override async run(interaction: AutocompleteInteraction, result: InteractionHandler.ParseResult<this>) {
        return interaction.respond(result);
    }

    public override async parse(interaction: AutocompleteInteraction) {
        if (interaction.commandName !== 'pokemon') return this.none();
        const option = interaction.options.getFocused(true);

        switch (option.name) {
            case 'pokemon': {
                const fuzzyPokemon = await fuzzySearchPokemon(option.value as string, 20);

                return this.some(
                    fuzzyPokemon.map(fuzzyEntry => ({
                        name: PokemonEnumToString(
                            Reflect.has(fuzzyEntry, 'name') ? Reflect.get(fuzzyEntry, 'name') : fuzzyEntry.key
                        ),
                        value: fuzzyEntry.key
                    }))
                );
            }
            case 'move': {
                const fuzzyMove = await fuzzySearchMove(option.value as string, 20);
                return this.some(fuzzyMove.map(fuzzyEntry => ({ name: fuzzyEntry.name, value: fuzzyEntry.key })));
            }
            default:
                return this.none();
        }
    }
}
