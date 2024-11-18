import { acquireSettings } from '#lib/Database';
import { translate } from '#lib/I18n';
import type { EventArgs, FoxxieEvents } from '#lib/Types';
import { cast } from '@ruffpuff/utilities';
import { Listener } from '@sapphire/framework';
import { send } from '@sapphire/plugin-editable-commands';
import { getFixedT } from 'i18next';

export class UserListener extends Listener<FoxxieEvents.MessageCommandDenied> {
    public async run(...[error, { message, context }]: EventArgs<FoxxieEvents.MessageCommandDenied>): Promise<void> {
        console.log(error);
        if (Reflect.get(Object(error.context), 'silent')) return;

        const k = translate(error.identifier);
        const t = message.guild ? await acquireSettings(message.guild!, s => s.getLanguage()) : getFixedT('en-US');

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
