import { send } from '@sapphire/plugin-editable-commands';
import { ArgumentError, Listener, UserError, CommandErrorPayload } from '@sapphire/framework';
import type { Message } from 'discord.js';
import type { TFunction } from 'i18next';
import { languageKeys, translate } from '../../lib/i18n';
import type { FoxxieCommand } from '../../lib/structures/commands';
import { UserOrMemberMentionRegex } from '@ruffpuff/utilities';
import { events, emojis } from '../../lib/util';

export class FoxxieListener extends Listener {

    public async run(error: UserError, { message, args, command }: CommandErrorPayload): Promise<UserError | Message> {
        if (error instanceof ArgumentError) return this.argumentError(message, args.t, error);
        if (error instanceof UserError) return this.userError(message, args as FoxxieCommand.Args, error);

        this.container.logger.fatal(`[COMMAND] ${command.location.full}\n${(error as Error).stack || (error as Error).message}`);
        if ((error as Error).message) await send(message, `${emojis.error} ${(error as Error).message}`);
        const { client } = this.container;

        if (client.sentry) {
            const { sentry } = client;

            const sentryTag = sentry.captureException(error, { tags: {
                command: command.name,
                guild: message.guildId || 'none',
                channel: message.channel.id || 'none',
                user: message.author.id || 'none'
            } });
            client.emit(events.SENTRY_ERROR, sentryTag, 'Command');
        }

        return error;
    }

    private getCommandPrefix(context: FoxxieCommand.Context): string {
        return (context.prefix instanceof RegExp && !context.commandPrefix.endsWith(' ')) || UserOrMemberMentionRegex.test(context.commandPrefix)
            ? `${context.commandPrefix} `
            : context.commandPrefix;
    }

    private userError(msg: Message, args: FoxxieCommand.Args, error: UserError): Promise<Message> {
        const content = args.t(translate(error.identifier), {
            ...(error.context as Record<string, unknown>),
            command: args.commandContext.commandName,
            prefix: this.getCommandPrefix(args.commandContext)
        });
        return send(msg, content);
    }

    private argumentError(msg: Message, t: TFunction, error: ArgumentError) {
        const arg = error.parameter ? `\`${error.parameter}\`` : t(languageKeys.globals.input);
        const content = t(translate(error.identifier), { arg, ...(error.context as Record<string, unknown>) });
        return send(msg, content);
    }

}