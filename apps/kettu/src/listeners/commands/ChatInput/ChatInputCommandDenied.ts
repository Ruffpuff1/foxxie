import { translate } from '#lib/i18n';
import { Events } from '#types/Events';
import { getLocale } from '#utils/decorators';
import type { EventArgs } from '@foxxie/types';
import { ApplyOptions } from '@sapphire/decorators';
import { Listener, ListenerOptions, UserError } from '@sapphire/framework';
import type { CommandInteraction } from 'discord.js';

@ApplyOptions<ListenerOptions>({
    event: Events.ChatInputCommandDenied
})
export class UserListener extends Listener<Events.ChatInputCommandDenied> {
    public run(...[error, ctx]: EventArgs<Events.ChatInputCommandDenied>): Promise<any> {
        const { interaction } = ctx;
        return this.handleMessage(interaction, error);
    }

    public handleMessage(interaction: CommandInteraction, error: UserError): Promise<any> {
        const t = getLocale(interaction);

        const content = error.identifier //
            ? t(translate(error.identifier), { ...Object(error.context), name: interaction.commandName, prefix: '/' })
            : error.message;

        const allowedMentions = { users: [interaction.user.id], roles: [] };
        return interaction.replied ? interaction.editReply({ content, allowedMentions }) : interaction.reply({ content, allowedMentions });
    }
}
