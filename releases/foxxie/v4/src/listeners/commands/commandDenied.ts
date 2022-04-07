import { translate } from '../../lib/i18n';
import { Listener, CommandDeniedPayload, UserError } from '@sapphire/framework';
import { send } from '@sapphire/plugin-editable-commands';
import type { TFunction } from 'i18next';
import { fetchT } from '@sapphire/plugin-i18next';

export default class extends Listener {

    async run(error: UserError, { message, context }: CommandDeniedPayload): Promise<void> {
        if (Reflect.get(Object(error.context), 'silent')) return;

        const k = translate(error.identifier);
        const t: TFunction = await fetchT(message);

        const content = t(k, { name: context.commandName, ...(error.context as Record<string, unknown>) });

        send(message, { content, allowedMentions: { users: [message.author.id], roles: [] } });
    }

}