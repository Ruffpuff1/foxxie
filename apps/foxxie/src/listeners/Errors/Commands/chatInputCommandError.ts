import { ArgumentError, Listener, UserError, Command, Identifiers } from '@sapphire/framework';
import { CommandInteraction, DiscordAPIError, HTTPError, MessageEmbed } from 'discord.js';
import type { TFunction } from 'i18next';
import { LanguageKeys, translate } from '#lib/i18n';
import type { FoxxieCommand } from '#lib/structures';
import { Colors, rootFolder } from '#utils/constants';
import { cast, ZeroWidthSpace } from '@ruffpuff/utilities';
import { EventArgs, Events } from '#lib/types';
import { codeBlock, cutText } from '@sapphire/utilities';
import { RESTJSONErrorCodes } from 'discord-api-types/v9';
import { CLIENT_OWNERS } from '#root/config';
import { captureException } from '@sentry/node';
import { envParseBoolean } from '#lib/env';
import { getLocale } from '#utils/decorators';

const ignoredErrorCodes = [RESTJSONErrorCodes.UnknownInteraction, RESTJSONErrorCodes.InteractionHasAlreadyBeenAcknowledged];

export class UserListener extends Listener<Events.ChatInputCommandError> {
    public async run(...[e, { interaction, command }]: EventArgs<Events.ChatInputCommandError>) {
        const t = getLocale(interaction);
        const error = cast<Error>(e);
        // if the error is something that the user should be aware of, send them a message.
        if (typeof error === 'string') return this.stringError(interaction, error);
        if (error instanceof ArgumentError) return this.argumentError(interaction, t, error);
        if (error instanceof UserError) return this.userError(interaction, t, error);

        const { client, logger } = this.container;

        if (error.name === 'AbortError' || error.name === 'Internal Server Error') {
            logger.warn(`${this.getWarning(interaction)} (${interaction.user.id}) | ${error.constructor.name}`);
            return this.send(interaction, t(LanguageKeys.Listeners.Errors.Abort));
        }

        if (error instanceof DiscordAPIError || error instanceof HTTPError) {
            if (this.isSilencedError(interaction, error)) return null;
            client.emit(Events.Error, error);
        } else {
            logger.warn(`${this.getWarning(interaction)} (${interaction.user.id}) | ${error.constructor.name}`);
        }

        await this.sendErrorChannel(interaction, command, interaction.options.data.map(d => d.value).join(' '), error);

        logger.fatal(`[COMMAND] ${command.location.full}\n${error.stack || error.message}`);
        try {
            await this.send(interaction, this.generateErrorMessage(interaction, t, error));
        } catch (err) {
            client.emit(Events.Error, err);
        }

        return null;
    }

    private generateErrorMessage(interaction: CommandInteraction, t: TFunction, error: Error) {
        if (CLIENT_OWNERS.includes(interaction.user.id)) return codeBlock('js', error.stack);
        if (!envParseBoolean('SENTRY_ENABLED', false)) return t(LanguageKeys.Listeners.Errors.Unexpected);

        try {
            const report = captureException(error, {
                tags: { command: interaction.commandName }
            });
            return t(LanguageKeys.Listeners.Errors.UnexpectedWithCode, {
                report
            });
        } catch (err) {
            this.container.client.emit(Events.Error, err);
            return t(LanguageKeys.Listeners.Errors.Unexpected);
        }
    }

    private isSilencedError(interaction: CommandInteraction, error: DiscordAPIError | HTTPError) {
        return ignoredErrorCodes.includes(error.code) || this.isDMReply(interaction, error);
    }

    private isDMReply(interaction: CommandInteraction, error: DiscordAPIError | HTTPError) {
        if (error.code !== RESTJSONErrorCodes.CannotSendMessagesToThisUser) return false;

        if (interaction.guild !== null) return false;

        return error.path === `/channels/${interaction.channel!.id}/messages`;
    }

    private stringError(interaction: CommandInteraction, error: string) {
        return this.send(interaction, error);
    }

    private async argumentError(interaction: CommandInteraction, t: TFunction, error: ArgumentError<unknown>) {
        const argument = error.argument.name;
        const identifier = translate(error.identifier);
        const parameter = error.parameter.replaceAll('`', '῾');
        return this.send(
            interaction,
            t(identifier, {
                ...error,
                ...(error.context as Record<string, unknown>),
                argument,
                parameter: cutText(parameter, 50),
                prefix: process.env.CLIENT_PREFIX
            })
        );
    }

    private userError(interaction: CommandInteraction, t: TFunction, error: UserError) {
        if (Reflect.get(Object(error.context), 'silent')) return null;

        if (error.identifier === Identifiers.ArgsMissing)
            (error.context as any) = {
                ...(error.context as any),
                context: (error.context as { command: FoxxieCommand }).command.name
            };

        const identifier = translate(error.identifier);
        return this.send(
            interaction,
            t(identifier, {
                ...(error.context as any),
                prefix: '/'
            })
        );
    }

    private async sendErrorChannel(interaction: CommandInteraction, command: Command, parameters: string, error: Error) {
        const hook = this.container.client.webhookError;
        if (hook === null) return null;

        const lines = [this.getCommand(command), this.getArgs(parameters), this.getError(error)];

        if (error instanceof DiscordAPIError || error instanceof HTTPError) {
            lines.splice(2, 0, this.getPath(error), this.getCode(error));
        }

        const embed = new MessageEmbed()
            .setAuthor({ name: `Error Encountered (${interaction.guild?.id})` })
            .setDescription(lines.join('\n'))
            .setColor(Colors.Red)
            .setTimestamp();

        try {
            await hook.send({ embeds: [embed] });
        } catch (err) {
            this.container.client.emit(Events.Error, err);
        }

        return null;
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

    private send(interaction: CommandInteraction, content: string) {
        return interaction.replied || interaction.deferred ? interaction.editReply({ content }) : interaction.reply({ content, ephemeral: true });
    }

    private getWarning(interaction: CommandInteraction) {
        return `ERROR: /${interaction.guild ? `${interaction.guild.id}/${interaction.channel!.id}` : `DM/${interaction.user.id}/${interaction.id}`}`;
    }
}
