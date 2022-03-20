import { ArgumentError, Listener, UserError, Args, Command, MessageCommandErrorPayload, Identifiers } from '@sapphire/framework';
import { DiscordAPIError, HTTPError, Message, MessageEmbed } from 'discord.js';
import type { TFunction } from 'i18next';
import { LanguageKeys, translate } from '#lib/i18n';
import type { FoxxieArgs, FoxxieCommand } from '#lib/structures';
import { Colors, emojis, rootFolder } from '#utils/constants';
import { getCommandPrefix } from '#utils/transformers';
import { sendTemporaryMessage } from '#utils/Discord';
import { minutes, ZeroWidthSpace } from '@ruffpuff/utilities';
import { Events } from '#lib/types';
import { codeBlock, cutText } from '@sapphire/utilities';
import { RESTJSONErrorCodes } from 'discord-api-types/v9';
import { CLIENT_OWNERS, envParse } from '#root/config';
import { captureException } from '@sentry/node';

const ignoredErrorCodes = [RESTJSONErrorCodes.UnknownChannel, RESTJSONErrorCodes.UnknownMessage];

export class UserListener extends Listener<Events.MessageCommandError> {
    public async run(error: Error, { message, command, parameters, args }: { args: FoxxieArgs } & MessageCommandErrorPayload) {
        // if the error is something that the user should be aware of, send them a message.
        if (typeof error === 'string') return this.stringError(message, args.t, error);
        if (error instanceof ArgumentError) return this.argumentError(message, args.t, error);
        if (error instanceof UserError) return this.userError(message, args, error);

        if (error.message === `The command ${command.name} does not have a \'messageRun\' method and does not support sub-commands.`) {
            const content = `${emojis.loading} Hey there! You may have heard Discord bots are switching over to **Slash Commands /**. Im currently being reworked to use slash commands and this command has been too! Try using \`/${command.name}\` instead.\n\n***Full support for message based commands will be removed <t:1651345200:f>.***`;
            return this.send(message, content);
        }

        const { client, logger } = this.container;

        if (error.name === 'AbortError' || error.name === 'Internal Server Error') {
            logger.warn(`${this.getWarning(message)} (${message.author.id}) | ${error.constructor.name}`);
            return this.send(message, args.t(LanguageKeys.Listeners.Errors.Abort));
        }

        if (error instanceof DiscordAPIError || error instanceof HTTPError) {
            if (this.isSilencedError(args, error)) return null;
            client.emit(Events.Error, error);
        } else {
            logger.warn(`${this.getWarning(message)} (${message.author.id}) | ${error.constructor.name}`);
        }

        await this.sendErrorChannel(message, command, parameters, error);

        logger.fatal(`[COMMAND] ${command.location.full}\n${error.stack || error.message}`);
        try {
            await this.send(message, this.generateErrorMessage(args, error));
        } catch (err) {
            client.emit(Events.Error, err);
        }

        return null;
    }

    private generateErrorMessage(args: Args, error: Error) {
        if (CLIENT_OWNERS.includes(args.message.author.id)) return codeBlock('js', error.stack);
        if (!envParse.boolean('SENTRY_ENABLED')) return args.t(LanguageKeys.Listeners.Errors.Unexpected);

        try {
            const report = captureException(error, {
                tags: { command: args.command.name }
            });
            return args.t(LanguageKeys.Listeners.Errors.UnexpectedWithCode, {
                report
            });
        } catch (err) {
            this.container.client.emit(Events.Error, err);
            return args.t(LanguageKeys.Listeners.Errors.Unexpected);
        }
    }

    private isSilencedError(args: Args, error: DiscordAPIError | HTTPError) {
        return ignoredErrorCodes.includes(error.code) || this.isDMReply(args, error);
    }

    private isDMReply(args: Args, error: DiscordAPIError | HTTPError) {
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
                prefix: getCommandPrefix(args as unknown as FoxxieCommand.Args)
            })
        );
    }

    private async sendErrorChannel(message: Message, command: Command, parameters: string, error: Error) {
        const hook = this.container.client.webhookError;
        if (hook === null) return null;

        const lines = [this.getLink(message.url), this.getCommand(command), this.getArgs(parameters), this.getError(error)];

        if (error instanceof DiscordAPIError || error instanceof HTTPError) {
            lines.splice(2, 0, this.getPath(error), this.getCode(error));
        }

        const embed = new MessageEmbed().setAuthor(`Error Encountered (${message.guild!.id})`).setDescription(lines.join('\n')).setColor(Colors.Red).setTimestamp();

        try {
            await hook.send({ embeds: [embed] });
        } catch (err) {
            this.container.client.emit(Events.Error, err);
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
        return `**Error**: ${codeBlock('js', error.stack || error)}`;
    }

    private getPath(error: DiscordAPIError | HTTPError) {
        return `**Path**: ${error.method.toUpperCase()} ${error.path}`;
    }

    private getCode(error: DiscordAPIError | HTTPError) {
        return `**Code**: ${error.code}`;
    }

    private send(message: Message, content: string) {
        return sendTemporaryMessage(
            message,
            {
                content,
                allowedMentions: { users: [message.author.id], roles: [] }
            },
            minutes(2)
        );
    }

    private getWarning(message: Message) {
        return `ERROR: /${message.guild ? `${message.guild.id}/${message.channel.id}` : `DM/${message.author.id}/${message.id}`}`;
    }
}
