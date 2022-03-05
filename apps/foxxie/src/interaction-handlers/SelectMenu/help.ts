import { InteractionHandler, InteractionHandlerTypes } from '@sapphire/framework';
import { ApplyOptions } from '@sapphire/decorators';
import type { MessageEmbedAuthor, MessageOptions, SelectMenuInteraction } from 'discord.js';
import { PaginatedMessage } from '#external/PaginatedMessage';
import { floatPromise } from '#utils/util';
import { fetchT } from '@sapphire/plugin-i18next';
import { LanguageKeys } from '#lib/i18n';

@ApplyOptions<InteractionHandler.Options>({
    interactionHandlerType: InteractionHandlerTypes.SelectMenu
})
export class UserInteractionHandler extends InteractionHandler {
    public async run(interaction: SelectMenuInteraction, message: PaginatedMessage) {
        const [value] = interaction.values;

        const page = message.pages.findIndex(page => {
            const { name } = (page as MessageOptions).embeds![0].author as MessageEmbedAuthor;
            return value.endsWith(name);
        });

        message.index = page;
        await floatPromise(message.response!.edit(await message.resolvePage(interaction.channel!, page)));
    }

    public async parse(interaction: SelectMenuInteraction) {
        if (interaction.user.bot) return this.none();

        if (!interaction.customId.startsWith(`@foxxie/helpMenu:`)) return this.none();

        if (!interaction.customId.startsWith(`@foxxie/helpMenu:${interaction.user.id}`)) {
            const t = await fetchT(interaction.guild!);
            await interaction.reply({
                content: t(LanguageKeys.System.SelectMenuWrongUser, {
                    user: interaction.user.toString()
                }),
                ephemeral: true
            });
            return this.none();
        }

        await interaction.deferUpdate();

        const { messages } = PaginatedMessage;

        const interactionMessage = messages.get(interaction.message.id);
        if (!interactionMessage) return this.none();

        return this.some(interactionMessage);
    }
}
