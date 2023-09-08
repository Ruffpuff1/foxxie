import { acquireSettings } from '#lib/database';
import { buildVillagerDisplay, fetchVillager } from '#lib/Api/celestia';
import { floatPromise } from '#utils/util';
import { Villager } from '@foxxie/celestia-api-types';
import { resolveToNull } from '@ruffpuff/utilities';
import { ApplyOptions } from '@sapphire/decorators';
import type { PaginatedMessage } from '@sapphire/discord.js-utilities';
import { InteractionHandler, InteractionHandlerTypes } from '@sapphire/framework';
import type { SelectMenuInteraction } from 'discord.js';

@ApplyOptions<InteractionHandler.Options>({
    interactionHandlerType: InteractionHandlerTypes.SelectMenu
})
export class UserInteractionHandler extends InteractionHandler {
    public override async run(interaction: SelectMenuInteraction, result: InteractionHandler.ParseResult<this>) {
        let display: PaginatedMessage;
        const t = await acquireSettings(interaction.guildId!, s => s.getLanguage());
        const message = await resolveToNull(interaction.channel!.messages.fetch(result.messageId));

        switch (result.type) {
            case 'villager':
                display = buildVillagerDisplay(result.data as Villager, t);
                break;
        }

        if (message) await floatPromise(interaction.message.delete());

        return display.run(message ?? interaction, message ? message.author : interaction.user);
    }

    public override async parse(interaction: SelectMenuInteraction) {
        if (!interaction.customId.startsWith('animalcrossing|')) return this.none();

        const value = interaction.values[0];
        const [, type, messageId] = interaction.customId.split('|') as [never, 'villager', string];
        let data;

        switch (type) {
            case 'villager':
                data = await fetchVillager(value);
                break;
        }

        return this.some({ data, type, messageId });
    }
}
