import { acquireSettings } from '#lib/database';
import { translate } from '#lib/I18n';
import type { EventArgs, FoxxieEvents } from '#lib/Types';
import { cast } from '@ruffpuff/utilities';
import { Listener } from '@sapphire/framework';

export class UserListener extends Listener<FoxxieEvents.ChatInputCommandDenied> {
    public async run(...[error, { interaction, command }]: EventArgs<FoxxieEvents.ChatInputCommandDenied>): Promise<void> {
        if (Reflect.get(Object(error.context), 'silent')) return;

        const k = translate(error.identifier);
        const t = await acquireSettings(interaction.guildId!, s => s.getLanguage());

        const content = t(k, {
            name: command.name,
            ...cast<Record<string, unknown>>(error.context),
            prefix: process.env.CLIENT_PREFIX
        });

        await interaction.reply({ content, allowedMentions: { users: [interaction.user.id], roles: [] }, ephemeral: true });
    }
}
