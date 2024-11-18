import { translate } from '#lib/I18n';
import { EnvKeys, type EventArgs, type FoxxieEvents } from '#lib/Types';
import { EnvParse } from '@foxxie/env';
import { cast } from '@ruffpuff/utilities';
import { Listener } from '@sapphire/framework';
import { send } from '@sapphire/plugin-editable-commands';

export class UserListener extends Listener<FoxxieEvents.MessageCommandDenied> {
    public async run(
        ...[
            error,
            {
                message,
                context: { commandName: name }
            }
        ]: EventArgs<FoxxieEvents.MessageCommandDenied>
    ): Promise<void> {
        console.log(error);
        if (Reflect.get(Object(error.context), 'silent')) return;

        const k = translate(error.identifier);
        const t = await this.container.settings.getT(message.guild);
        const prefix = message.guildId
            ? await this.container.settings.readGuild(message.guildId)
            : { prefix: EnvParse.string(EnvKeys.ClientPrefix) };

        const content = t(k, {
            name,
            prefix,
            ...cast<Record<string, unknown>>(error.context)
        });

        await send(message, {
            content,
            allowedMentions: { users: [message.author.id], roles: [] }
        });
    }
}
