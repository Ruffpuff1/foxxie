import { ArtistBuilders } from '#Api/LastFm/Builders/ArtistBuilders';
import { ContextModel } from '#Api/LastFm/Structures/Models/ContextModel';
import { resolveToNull } from '@ruffpuff/utilities';
import { ApplyOptions } from '@sapphire/decorators';
import { InteractionHandler, InteractionHandlerTypes } from '@sapphire/framework';
import { MessageOptions, send } from '@sapphire/plugin-editable-commands';
import type { SelectMenuInteraction } from 'discord.js';

@ApplyOptions<InteractionHandler.Options>({
    interactionHandlerType: InteractionHandlerTypes.SelectMenu
})
export class UserInteractionHandler extends InteractionHandler {
    public override async run(interaction: SelectMenuInteraction, result: InteractionHandler.ParseResult<this>) {
        let options: MessageOptions;
        const t = await this.container.utilities.guild(interaction.guild!).settings.getT();
        const message = await resolveToNull(interaction.channel!.messages.fetch(result.messageId));

        switch (result.type) {
            case 'artist':
                options = await new ArtistBuilders().artist(
                    new ContextModel(
                        { user: interaction.user, guild: interaction.guild!, channel: interaction.channel!, t },
                        await this.container.db.users.ensure(interaction.user.id)
                    ),
                    result.data
                );
                break;
        }

        await send(message!, options);
    }

    public override parse(interaction: SelectMenuInteraction) {
        if (!interaction.customId.startsWith('lastfm|')) return this.none();

        const value = interaction.values[0];
        const [, type, messageId] = interaction.customId.split('|') as [never, 'artist', string];
        let data;

        switch (type) {
            case 'artist':
                data = value;
                break;
        }

        return this.some({ data, type, messageId });
    }
}
