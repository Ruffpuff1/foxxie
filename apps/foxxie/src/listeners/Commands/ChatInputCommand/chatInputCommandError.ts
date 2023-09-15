import { acquireSettings } from '#lib/Database';
import { LanguageKeys, translate } from '#lib/I18n';
import type { FoxxieCommand } from '#lib/Structures';
import { EventArgs, FoxxieEvents } from '#lib/Types';
import { EnvKeys } from '#lib/Types/Env';
import { clientOwners } from '#root/config';
import { Colors, rootFolder } from '#utils/constants';
import { EnvParse } from '@foxxie/env';
import { getT, type TFunction } from '@foxxie/i18n';
import { cast } from '@ruffpuff/utilities';
import { ArgumentError, ChatInputCommand, Command, Identifiers, Listener, UserError } from '@sapphire/framework';
import { codeBlock, cutText } from '@sapphire/utilities';
import { captureException } from '@sentry/node';
import { RESTJSONErrorCodes } from 'discord-api-types/v10';
import { ChatInputCommandInteraction, DiscordAPIError, EmbedBuilder, HTTPError } from 'discord.js';

interface FoxxieError extends DiscordAPIError {
    path?: string;
}

const ignoredErrorCodes: (number | string)[] = [RESTJSONErrorCodes.UnknownChannel, RESTJSONErrorCodes.UnknownMessage];

export class UserListener extends Listener<FoxxieEvents.ChatInputCommandError> {
    public async run(...[error, { interaction, command }]: EventArgs<FoxxieEvents.ChatInputCommandError>) {
        const t = interaction.guildId ? await acquireSettings(interaction.guildId, s => s.getLanguage()) : getT('en-US');
        // if the error is something that the user should be aware of, send them a message.
        if (typeof error === 'string') return this.stringError(interaction, t, error);
        if (error instanceof ArgumentError) return this.argumentError(interaction, t, error);
        if (error instanceof UserError) return this.userError(interaction, t, error);

        const { client, logger } = this.container;

        if (cast<Error>(error).name === 'AbortError' || cast<Error>(error).name === 'Internal Server Error') {
            logger.warn(`${this.getWarning(interaction)} (${interaction.user.id}) | ${cast<Error>(error).constructor.name}`);
            return this.send(interaction, t(LanguageKeys.Listeners.Errors.Abort));
        }

        if (error instanceof DiscordAPIError || error instanceof HTTPError) {
            if (this.isSilencedError(interaction, cast<FoxxieError>(error))) return null;
            client.emit(FoxxieEvents.Error, error);
        } else {
            logger.warn(`${this.getWarning(interaction)} (${interaction.user.id}) | ${cast<Error>(error).constructor.name}`);
        }

        await this.sendErrorChannel(interaction, command, cast<Error>(error));

        logger.fatal(`[COMMAND] ${command.location.full}\n${cast<Error>(error).stack || cast<Error>(error).message}`);
        try {
            await this.send(interaction, this.generateErrorMessage(interaction, t, cast<Error>(error)));
        } catch (err) {
            client.emit(FoxxieEvents.Error, err);
        }

        return null;
    }

    private generateErrorMessage(interaction: ChatInputCommandInteraction, t: TFunction, error: Error) {
        if (clientOwners.includes(interaction.user.id) && error.stack) return codeBlock('js', error.stack);
        if (!EnvParse.boolean(EnvKeys.SentryEnabled)) return t(LanguageKeys.Listeners.Errors.Unexpected);

        try {
            const report = captureException(error, {
                tags: { command: interaction.command?.name }
            });
            return t(LanguageKeys.Listeners.Errors.UnexpectedWithCode, {
                report
            });
        } catch (err) {
            this.container.client.emit(FoxxieEvents.Error, err);
            return t(LanguageKeys.Listeners.Errors.Unexpected);
        }
    }

    private isSilencedError(interaction: ChatInputCommandInteraction, error: FoxxieError) {
        return error.code ? ignoredErrorCodes.includes(error.code) : this.isDMReply(interaction, error);
    }

    private isDMReply(interaction: ChatInputCommandInteraction, error: FoxxieError) {
        if (error.code !== RESTJSONErrorCodes.CannotSendMessagesToThisUser) return false;

        if (interaction.guild !== null) return false;

        return error.path === `/channels/${interaction.channelId}/messages`;
    }

    private stringError(interaction: ChatInputCommandInteraction, t: TFunction, error: string) {
        return interaction.reply(
            t(LanguageKeys.Listeners.Errors.String, {
                mention: interaction.user.toString(),
                message: error
            })
        );
    }

    private argumentError(interaction: ChatInputCommandInteraction, t: TFunction, error: ArgumentError<unknown>) {
        const argument = error.argument.name;
        const identifier = translate(error.identifier);
        const parameter = error.parameter.replaceAll('`', '῾');

        return interaction.reply(
            t(identifier, {
                ...error,
                ...cast<Record<string, unknown>>(error.context),
                argument,
                parameter: cutText(parameter, 50),
                prefix: process.env.CLIENT_PREFIX
            })
        );
    }

    private userError(interaction: ChatInputCommandInteraction, t: TFunction, error: UserError) {
        if (Reflect.get(Object(error.context), 'silent')) return null;

        if (error.identifier === Identifiers.ArgsMissing)
            (error.context as any) = {
                ...cast<any>(error.context),
                context: cast<{ command: FoxxieCommand }>(error.context).command.name
            };

        const identifier = translate(error.identifier);
        return this.send(
            interaction,
            t(identifier, {
                ...cast<any>(error.context),
                prefix: '/'
            })
        );
    }

    private async sendErrorChannel(interaction: ChatInputCommandInteraction, command: ChatInputCommand, error: Error) {
        const hook = this.container.client.webhookError;
        if (hook === null) return null;

        const lines = [this.getCommand(command), this.getError(error)];

        if (error instanceof DiscordAPIError) {
            lines.splice(2, 0, this.getPath(error), this.getCode(error));
        }

        const embed = new EmbedBuilder()
            .setAuthor({ name: `Error Encountered (${interaction.guildId})` })
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

    private send(interaction: ChatInputCommandInteraction, content: string) {
        return interaction.reply({
            content,
            allowedMentions: { users: [interaction.user.id], roles: [] }
        });
    }

    private getWarning(interaction: ChatInputCommandInteraction) {
        return `ERROR: /${
            interaction.guild ? `${interaction.guild.id}/${interaction.channelId}` : `DM/${interaction.user.id}/${interaction.id}`
        }`;
    }
}
