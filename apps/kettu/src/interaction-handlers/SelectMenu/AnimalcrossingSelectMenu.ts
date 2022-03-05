import { buildVillagerDisplay, fetchVillager } from '#utils/APIs';
import { ApplyOptions } from '@sapphire/decorators';
import { InteractionHandler, InteractionHandlerTypes } from '@sapphire/framework';
import type { SelectMenuInteraction } from 'discord.js';
import type { PaginatedMessage } from '@sapphire/discord.js-utilities';
import { getLocale } from '#utils/decorators';
import type { Villager, VillagersEnum } from '@ruffpuff/celestia';

@ApplyOptions<InteractionHandler.Options>({
    interactionHandlerType: InteractionHandlerTypes.SelectMenu
})
export class UserInteractionHandler extends InteractionHandler {
    public override async run(interaction: SelectMenuInteraction, result: InteractionHandler.ParseResult<this>) {
        let display: PaginatedMessage;

        switch (result.type) {
            case 'villager':
                display = buildVillagerDisplay(result.data as Omit<Villager, '__typename'>, getLocale(interaction));
                break;
        }

        return display.run(interaction, interaction.user);
    }

    public override async parse(interaction: SelectMenuInteraction) {
        if (!interaction.customId.startsWith('animalcrossing|')) return this.none();

        const value = interaction.values[0];
        const [, type] = interaction.customId.split('|');
        let data;

        switch (type) {
            case 'villager':
                data = await fetchVillager(value as VillagersEnum);
                break;
        }

        return this.some({ data, type: type as 'villager' });
    }
}
