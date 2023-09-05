import { acquireSettings } from '#lib/database';
import { LanguageKeys, translate } from '#lib/i18n';
import type { FoxxieCommand } from '#lib/structures';
import { EventArgs, FoxxieEvents } from '#lib/types';
import { EnvKeys } from '#lib/types/Env';
import { clientOwners } from '#root/config';
import { Colors, rootFolder } from '#utils/constants';
import { EnvParse } from '@foxxie/env';
import type { TFunction } from '@foxxie/i18n';
import { cast } from '@ruffpuff/utilities';
import { ArgumentError, Command, Identifiers, Listener, UserError } from '@sapphire/framework';
import { send } from '@sapphire/plugin-editable-commands';
import { codeBlock, cutText } from '@sapphire/utilities';
import { captureException } from '@sentry/node';
import { RESTJSONErrorCodes } from 'discord-api-types/v10';
import { DiscordAPIError, EmbedBuilder, HTTPError, Message } from 'discord.js';

interface FoxxieError extends DiscordAPIError {
    path?: string;
}

const ignoredErrorCodes: (number | string)[] = [RESTJSONErrorCodes.UnknownChannel, RESTJSONErrorCodes.UnknownMessage];

export class UserListener extends Listener<FoxxieEvents.MessageSubcommandError> {
    public async run(...[err, { message, command, context }]: EventArgs<FoxxieEvents.MessageSubcommandError>) {
        const error = cast<Error>(err);
        const t = await acquireSettings(message.guildId!, s => s.getLanguage());
        // if the error is something that the user should be aware of, send them a message.
        if (typeof error === 'string') return this.stringError(message, t, error);
        if (error instanceof ArgumentError) return this.argumentError(message, t, error);
        if (error instanceof UserError) return this.userError(message, t, context, error);

        const { client, logger } = this.container;

        if (error.name === 'AbortError' || error.name === 'Internal Server Error') {
            logger.warn(`${this.getWarning(message)} (${message.author.id}) | ${error.constructor.name}`);
            return this.send(message, t(LanguageKeys.Listeners.Errors.Abort));
        }

        if (error instanceof DiscordAPIError || error instanceof HTTPError) {
            if (this.isSilencedError(message, cast<FoxxieError>(error))) return null;
            client.emit(FoxxieEvents.Error, error);
        } else {
            logger.warn(`${this.getWarning(message)} (${message.author.id}) | ${error.constructor.name}`);
        }

        await this.sendErrorChannel(message, command, error);

        logger.fatal(`[COMMAND] ${command.location.full}\n${error.stack || error.message}`);
        try {
            await this.send(message, this.generateErrorMessage(message, t, cast<FoxxieCommand>(command), error));
        } catch (e) {
            client.emit(FoxxieEvents.Error, e);
        }

        return null;
    }

    private generateErrorMessage(message: Message, t: TFunction, command: FoxxieCommand, error: Error) {
        if (clientOwners.includes(message.author.id) && error.stack) return codeBlock('js', error.stack);
        if (!EnvParse.boolean(EnvKeys.SentryEnabled)) return t(LanguageKeys.Listeners.Errors.Unexpected);

        try {
            const report = captureException(error, {
                tags: { command: command.name }
            });
            return t(LanguageKeys.Listeners.Errors.UnexpectedWithCode, {
                report
            });
        } catch (err) {
            this.container.client.emit(FoxxieEvents.Error, err);
            return t(LanguageKeys.Listeners.Errors.Unexpected);
        }
    }

    private isSilencedError(message: Message, error: FoxxieError) {
        return error.code ? ignoredErrorCodes.includes(error.code) : this.isDMReply(message, error);
    }

    private isDMReply(message: Message, error: FoxxieError) {
        if (error.code !== RESTJSONErrorCodes.CannotSendMessagesToThisUser) return false;

        if (message.guild !== null) return false;

        return error.path === `/channels/${message.channel.id}/messages`;
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
                ...cast<Record<string, unknown>>(error.context),
                argument,
                parameter: cutText(parameter, 50),
                prefix: process.env.CLIENT_PREFIX
            })
        );
    }

    private userError(message: Message, t: TFunction, commandContext: FoxxieCommand.Context, error: UserError) {
        if (Reflect.get(Object(error.context), 'silent')) return null;

        if (error.identifier === Identifiers.ArgsMissing)
            (error.context as any) = {
                ...cast<any>(error.context),
                context: cast<{ command: FoxxieCommand }>(error.context).command.name
            };

        const identifier = translate(error.identifier);
        return this.send(
            message,
            t(identifier, {
                ...cast<any>(error.context),
                prefix: commandContext.commandPrefix
            })
        );
    }

    private async sendErrorChannel(message: Message, command: Command, error: Error) {
        const hook = this.container.client.webhookError;
        if (hook === null) return null;

        const lines = [this.getLink(message.url), this.getCommand(command), this.getError(error)];

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
