import { ContextModel } from '#Api/LastFm/Structures/Models/ContextModel';
import { floatPromise } from '#utils/util';
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
        const t = await this.container.utilities.guild(interaction.guild!).settings.getT();
        const message = await resolveToNull(interaction.channel!.messages.fetch(result.messageId));

        switch (result.type) {
            case 'villager':
                display = this._villagerBuilders.villager(
                    result.data,
                    new ContextModel(
                        { t, user: interaction.user, guild: interaction.guild!, channel: interaction.channel! },
                        null!
                    )
                );
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
                data = await this._celestiaRepository.getVillager(value);
                break;
        }

        return this.some({ data: data.content, type, messageId });
    }

    private get _celestiaRepository() {
        return this.container.apis.celestia.celestiaRepository;
    }

    private get _villagerBuilders() {
        return this.container.apis.celestia.villagerBuilders;
    }
}
