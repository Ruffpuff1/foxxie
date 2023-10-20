import { acquireSettings } from '#lib/Database';
import { translate } from '#lib/I18n';
import type { EventArgs, FoxxieEvents } from '#lib/Types';
import { cast } from '@ruffpuff/utilities';
import { Listener } from '@sapphire/framework';
import { getFixedT } from 'i18next';

export class UserListener extends Listener<FoxxieEvents.ChatInputCommandDenied> {
    public async run(...[error, { interaction, command }]: EventArgs<FoxxieEvents.ChatInputCommandDenied>): Promise<void> {
        if (Reflect.get(Object(error.context), 'silent')) return;

        const k = translate(error.identifier);
        const t = interaction.guildId
            ? await acquireSettings(interaction.guildId!, s => s.getLanguage())
            : getFixedT(interaction.locale);

        const content = t(k, {
            name: command.name,
            ...cast<Record<string, unknown>>(error.context),
            prefix: process.env.CLIENT_PREFIX
        });

        await interaction.reply({ content, allowedMentions: { users: [interaction.user.id], roles: [] }, ephemeral: true });
    }
}
