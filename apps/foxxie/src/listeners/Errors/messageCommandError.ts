import { LanguageKeys, translate } from '#lib/i18n';
import type { FoxxieArgs, FoxxieCommand } from '#lib/structures';
import { FoxxieEvents } from '#lib/types';
import { EnvKeys } from '#lib/types/Env';
import { clientOwners } from '#root/config';
import { Colors, rootFolder } from '#utils/constants';
import { EnvParse } from '@foxxie/env';
import type { TFunction } from '@foxxie/i18n';
import { ZeroWidthSpace } from '@ruffpuff/utilities';
import { Args, ArgumentError, Command, Identifiers, Listener, MessageCommandErrorPayload, UserError } from '@sapphire/framework';
import { send } from '@sapphire/plugin-editable-commands';
import { codeBlock, cutText } from '@sapphire/utilities';
import { captureException } from '@sentry/node';
import { RESTJSONErrorCodes } from 'discord-api-types/v10';
import { DiscordAPIError, EmbedBuilder, HTTPError, Message } from 'discord.js';

interface FoxxieError extends DiscordAPIError {
    path?: string;
}

const ignoredErrorCodes: (number | string)[] = [RESTJSONErrorCodes.UnknownChannel, RESTJSONErrorCodes.UnknownMessage];

export class UserListener extends Listener<FoxxieEvents.MessageCommandError> {
    public async run(error: Error, { message, command, parameters, args }: { args: FoxxieArgs } & MessageCommandErrorPayload) {
        // if the error is something that the user should be aware of, send them a message.
        if (typeof error === 'string') return this.stringError(message, args.t, error);
        if (error instanceof ArgumentError) return this.argumentError(message, args.t, error);
        if (error instanceof UserError) return this.userError(message, args, error);

        const { client, logger } = this.container;

        if (error.name === 'AbortError' || error.name === 'Internal Server Error') {
            logger.warn(`${this.getWarning(message)} (${message.author.id}) | ${error.constructor.name}`);
            return this.send(message, args.t(LanguageKeys.Listeners.Errors.Abort));
        }

        if (error instanceof DiscordAPIError || error instanceof HTTPError) {
            if (this.isSilencedError(args, error as FoxxieError)) return null;
            client.emit(FoxxieEvents.Error, error);
        } else {
            logger.warn(`${this.getWarning(message)} (${message.author.id}) | ${error.constructor.name}`);
        }

        await this.sendErrorChannel(message, command, parameters, error);

        logger.fatal(`[COMMAND] ${command.location.full}\n${error.stack || error.message}`);
        try {
            await this.send(message, this.generateErrorMessage(args, error));
        } catch (err) {
            client.emit(FoxxieEvents.Error, err);
        }

        return null;
    }

    private generateErrorMessage(args: Args, error: Error) {
        if (clientOwners.includes(args.message.author.id) && error.stack) return codeBlock('js', error.stack);
        if (!EnvParse.boolean(EnvKeys.SentryEnabled)) return args.t(LanguageKeys.Listeners.Errors.Unexpected);

        try {
            const report = captureException(error, {
                tags: { command: args.command.name }
            });
            return args.t(LanguageKeys.Listeners.Errors.UnexpectedWithCode, {
                report
            });
        } catch (err) {
            this.container.client.emit(FoxxieEvents.Error, err);
            return args.t(LanguageKeys.Listeners.Errors.Unexpected);
        }
    }

    private isSilencedError(args: Args, error: FoxxieError) {
        return error.code ? ignoredErrorCodes.includes(error.code) : this.isDMReply(args, error);
    }

    private isDMReply(args: Args, error: FoxxieError) {
        if (error.code !== RESTJSONErrorCodes.CannotSendMessagesToThisUser) return false;

        if (args.message.guild !== null) return false;

        return error.path === `/channels/${args.message.channel.id}/messages`;
    }

    private stringError(message: Message, t: TFunction, error: string) {
        return this.send(
            message,
            t(LanguageKeys.Listeners.Errors.String, {
                mention: message.author.toString(),
                message: error
            })
        );
    }

    private argumentError(message: Message, t: TFunction, error: ArgumentError<unknown>) {
        const argument = error.argument.name;
        const identifier = translate(error.identifier);
        const parameter = error.parameter.replaceAll('`', '῾');
        return this.send(
            message,
            t(identifier, {
                ...error,
                ...(error.context as Record<string, unknown>),
                argument,
                parameter: cutText(parameter, 50),
                prefix: process.env.CLIENT_PREFIX
            })
        );
    }

    private userError(message: Message, args: Args, error: UserError) {
        if (Reflect.get(Object(error.context), 'silent')) return null;

        if (error.identifier === Identifiers.ArgsMissing)
            (error.context as any) = {
                ...(error.context as any),
                context: (error.context as { command: FoxxieCommand }).command.name
            };

        const identifier = translate(error.identifier);
        return this.send(
            message,
            args.t(identifier, {
                ...(error.context as any),
                prefix: args.commandContext.commandPrefix
            })
        );
    }

    private async sendErrorChannel(message: Message, command: Command, parameters: string, error: Error) {
        const hook = this.container.client.webhookError;
        if (hook === null) return null;

        const lines = [this.getLink(message.url), this.getCommand(command), this.getArgs(parameters), this.getError(error)];

        if (error instanceof DiscordAPIError) {
            lines.splice(2, 0, this.getPath(error), this.getCode(error));
        }

        const embed = new EmbedBuilder()
            .setAuthor({ name: `Error Encountered (${message.guild!.id})` })
            .setDescription(lines.join('\n'))
            .setColor(Colors.Red)
            .setTimestamp();

        try {
            await hook.send({ embeds: [embed] });
        } catch (err) {
            this.container.client.emit(FoxxieEvents.Error, err);
        }

        return null;
    }

    private getLink(url: string) {
        return `[**Jump to Message**](${url})\n`;
    }

    private getCommand(command: Command) {
        return `**Command**: ${command.location.full.slice(rootFolder.length)}`;
    }

    private getArgs(parameters: string) {
        if (parameters.length === 0) return '**Parameters**: None';
        return `**Parameters**: [\`${parameters.trim().replaceAll('`', '῾') || ZeroWidthSpace}\`]`;
    }

    private getError(error: Error) {
        return `**Error**: ${codeBlock('js', error.stack || error.message)}`;
    }

    private getPath(error: FoxxieError) {
        return `**Path**: ${error.method.toUpperCase()} ${error.path}`;
    }

    private getCode(error: FoxxieError) {
        return `**Code**: ${error.code}`;
    }

    private send(message: Message, content: string) {
        return send(message, {
            content,
            allowedMentions: { users: [message.author.id], roles: [] }
        });
    }

    private getWarning(message: Message) {
        return `ERROR: /${message.guild ? `${message.guild.id}/${message.channel.id}` : `DM/${message.author.id}/${message.id}`}`;
    }
}
