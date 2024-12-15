import { acquireSettings } from '#lib/database';
import { translate } from '#lib/i18n';
import type { EventArgs, Events } from '#lib/types';
import { cast } from '@ruffpuff/utilities';
import { Listener } from '@sapphire/framework';
import { send } from '@sapphire/plugin-editable-commands';

export class UserListener extends Listener<Events.MessageCommandDenied> {
    public async run(...[error, { message, context }]: EventArgs<Events.MessageCommandDenied>): Promise<void> {
        if (Reflect.get(Object(error.context), 'silent')) return;

        const k = translate(error.identifier);
        const t = await acquireSettings(message.guild!, s => s.getLanguage());

        const content = t(k, {
            name: context.commandName,
            ...cast<Record<string, unknown>>(error.context),
            prefix: process.env.CLIENT_PREFIX
        });

        await send(message, {
            content,
            allowedMentions: { users: [message.author.id], roles: [] }
        });
    }
}
