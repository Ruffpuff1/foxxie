/**
 * @license MIT
 * @copyright 2019 Favware
 * Edited for use in this bot.
 */
import { seconds } from '@ruffpuff/utilities';
import { bold, hideLinkEmbed } from '@discordjs/builders';
import { canSendMessages } from '@sapphire/discord.js-utilities';
import { fetch } from '@foxxie/fetch';
import { Command } from '@sapphire/framework';
import { Stopwatch } from '@sapphire/stopwatch';
import { codeBlock, filterNullAndUndefinedAndEmpty, isThenable } from '@sapphire/utilities';
import type { CommandInteraction, Message } from 'discord.js';
import { setTimeout as sleep } from 'node:timers/promises';
import { inspect } from 'node:util';
import { getLocale } from '#utils/decorators';
import { RegisterChatInputCommand, toLocalizationMap } from '@foxxie/commands';
import { Type } from '@sapphire/type';
import { type ChatInputArgs, CommandName } from '#types/Interactions';
import { LanguageKeys } from '#lib/i18n';
import type { APIApplicationCommandOptionChoice } from 'discord-api-types/v10';

@RegisterChatInputCommand(
    builder =>
        builder //
            .setName(CommandName.Eval)
            .setDescription(LanguageKeys.Commands.Admin.EvalDescription)
            .setDescriptionLocalizations(toLocalizationMap(LanguageKeys.Commands.Admin.EvalDescription))
            .setDefaultPermission(false)
            .addStringOption(option =>
                option //
                    .setName('code')
                    .setDescription('The code to evaluate.')
                    .setRequired(true)
            )
            .addIntegerOption(option =>
                option //
                    .setName('depth')
                    .setDescription('The inspection depth to apply.')
            )
            .addStringOption(builder =>
                builder //
                    .setName('language')
                    .setDescription('The language of the output codeblock.')
                    .setChoices(...UserCommand.languageChoices)
            )
            .addStringOption(builder =>
                builder //
                    .setName('output-to')
                    .setDescription('The location to send the output to.')
                    .setChoices(...UserCommand.outputChoices)
            )
            .addBooleanOption(builder =>
                builder //
                    .setName('async')
                    .setDescription('Whether this code should be evaluated asynchronously.')
            )
            .addBooleanOption(builder =>
                builder //
                    .setName('no-timeout')
                    .setDescription('Whether there should be no timeout for evaluating this code.')
            )
            .addBooleanOption(builder =>
                builder //
                    .setName('silent')
                    .setDescription('Whether the bot should not give a reply on the evaluation.')
            )
            .addBooleanOption(builder =>
                builder //
                    .setName('show-hidden')
                    .setDescription('Whether to show hidden JSON properties when stringifying.')
            ),
    {
        idHints: ['946775073539358740', '946775073539358740'],
        guildIds: [/* tcs */ '761512748898844702', /* pp */ '826893949880631376']
    }
)
export class UserCommand extends Command {
    public override async chatInputRun(...[interaction, , args]: ChatInputArgs<CommandName.Eval>): Promise<unknown> {
        const message = await interaction.deferReply({ ephemeral: true, fetchReply: true });
        args = args!;

        const { code } = args;
        const depth = args.depth ?? 0;
        const language = args.language ?? 'ts';
        const outputTo = args['output-to'] ?? 'reply';
        const async = args.async ?? false;
        const noTimeout = args['no-timeout'] ?? false;
        const silent = args.silent ?? false;
        const showHidden = args['show-hidden'] ?? false;

        const timeout = noTimeout ? Infinity : UserCommand.timeout;

        const { success, result, time, type } = await this.timedEval(interaction, {
            message: message as Message,
            async,
            code,
            depth,
            showHidden,
            timeout
        });

        if (silent) {
            if (!success && result && (result as unknown as Error).stack) this.container.logger.fatal((result as unknown as Error).stack);
            return null;
        }

        const footer = codeBlock('ts', type);

        return this.handleReply(interaction, {
            hastebinUnavailable: false,
            replyUnavailable: false,
            fileUnavailable: false,
            consoleUnavailable: true,
            code,
            url: null,
            success,
            result: result as string,
            time,
            footer,
            language,
            outputTo: outputTo as 'reply' | 'file' | 'hastebin' | 'console' | 'none'
        });
    }

    private async timedEval(interaction: CommandInteraction, { timeout, ...evalParameters }: EvalParameters) {
        if (timeout === Infinity || timeout === 0) return this.eval(interaction, { timeout, ...evalParameters });

        return Promise.race([
            sleep(timeout).then(() => ({
                result: `TIMEOUT: Took longer than ${seconds.fromMilliseconds(timeout)} seconds.`,
                success: false,
                time: '⏱ ...',
                type: 'EvalTimeoutError'
            })),
            this.eval(interaction, { timeout, ...evalParameters })
        ]);
    }

    private async eval(_interaction: CommandInteraction, { message, code, async, depth, showHidden }: EvalParameters) {
        const stopwatch = new Stopwatch();
        let success: boolean;
        let syncTime = '';
        let asyncTime = '';
        let result: unknown;
        let thenable = false;
        let type: Type;

        try {
            if (async) code = `(async () => {\n${code}\n})();`;

            // @ts-ignore value is never read, this is so `msg` is possible as an alias when sending the eval.
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const msg = message;

            // @ts-ignore value is never read, this is so `t` is possible as an alias when sending the eval.
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const t = getLocale(_interaction);

            // @ts-ignore value is never read, this is so `interaction` is possible as an alias when sending the eval.
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const interaction = _interaction;

            // eslint-disable-next-line no-eval
            result = eval(code);
            syncTime = stopwatch.toString();
            type = new Type(result);
            if (isThenable(result)) {
                thenable = true;
                stopwatch.restart();
                // eslint-disable-next-line @typescript-eslint/await-thenable
                result = await result;
                asyncTime = stopwatch.toString();
            }
            success = true;
        } catch (error) {
            if (!syncTime.length) syncTime = stopwatch.toString();
            if (thenable && !asyncTime.length) asyncTime = stopwatch.toString();
            if (!type!) type = new Type(error);
            result = error;
            success = false;
        }

        stopwatch.stop();
        if (typeof result !== 'string') {
            result =
                result instanceof Error
                    ? result.stack
                    : inspect(result, {
                          depth,
                          showHidden
                      });
        }
        return {
            success,
            type: type!,
            time: this.formatTime(syncTime, asyncTime ?? ''),
            result
        };
    }

    private async handleReply(interaction: CommandInteraction, options: EvalReplyParameters): Promise<unknown> {
        const typeFooter = `${bold('Type')}:${options.footer}`;
        const timeTaken = options.time;

        switch (options.outputTo) {
            case 'file': {
                if (canSendMessages(interaction.channel)) {
                    const output = 'Sent the result as a file.';
                    const content = [output, typeFooter, timeTaken] //
                        .filter(filterNullAndUndefinedAndEmpty)
                        .join('\n');

                    const attachment = Buffer.from(options.result);
                    const name = `output.${options.language}`;

                    return interaction.editReply({ content, files: [{ attachment, name }] });
                }

                options.fileUnavailable = true;
                this.getOtherTypeOutput(options);

                return this.handleReply(interaction, options);
            }
            case 'hastebin': {
                if (!options.url) {
                    options.url = await this.getHaste(options.result).catch(() => null);
                }

                if (options.url) {
                    const hastebinUrl = `Sent the result to hastebin: ${hideLinkEmbed(options.url)}`;

                    const content = [hastebinUrl, typeFooter, timeTaken] //
                        .filter(filterNullAndUndefinedAndEmpty)
                        .join('\n');

                    return interaction.editReply({ content });
                }

                options.hastebinUnavailable = true;

                this.getOtherTypeOutput(options);

                return this.handleReply(interaction, options);
            }
            case 'console': {
                this.container.logger.info(options.result);
                const output = 'Sent the result to console.';

                const content = [output, typeFooter, timeTaken] //
                    .filter(filterNullAndUndefinedAndEmpty)
                    .join('\n');

                return interaction.editReply({ content });
            }
            case 'none': {
                return interaction.editReply({ content: 'Aborted!' });
            }
            case 'reply':
            default: {
                if (options.result.length > 1950) {
                    options.replyUnavailable = true;
                    this.getOtherTypeOutput(options);

                    return this.handleReply(interaction, options);
                }

                if (options.success) {
                    const parsedInput = `${bold('Input')}:${codeBlock(options.language, options.code)}`;
                    const parsedOutput = `${bold('Output')}:${codeBlock(options.language, options.result)}`;

                    const content = [parsedInput, parsedOutput, typeFooter, timeTaken].filter(Boolean).join('\n');
                    return interaction.editReply({ content });
                }

                const output = codeBlock(options.language ?? 'ts', options.result!);
                const content = `${bold('Error')}:${output}\n${bold('Type')}:${options.footer}\n${options.time}`;
                return interaction.editReply({ content });
            }
        }
    }

    private getOtherTypeOutput(options: EvalReplyParameters) {
        if (!options.replyUnavailable) {
            options.outputTo = 'reply';
            return;
        }

        if (!options.hastebinUnavailable) {
            options.outputTo = 'hastebin';
            return;
        }

        if (!options.fileUnavailable) {
            options.outputTo = 'file';
            return;
        }

        if (!options.consoleUnavailable) {
            options.outputTo = 'console';
            return;
        }

        options.outputTo = 'none';
    }

    private formatTime(syncTime: string, asyncTime?: string) {
        return asyncTime ? `⏱ ${asyncTime}<${syncTime}>` : `⏱ ${syncTime}`;
    }

    private async getHaste(result: string) {
        const { key } = await fetch('https://paste.ruff.cafe') //
            .path('api') //
            .path('documents') //
            .body({ body: result }) //
            .json<HastebinPostData>();
        return `https://paste.ruff.cafe/${key}`;
    }

    public static readonly timeout = 60000;

    public static readonly languageChoices: APIApplicationCommandOptionChoice<string>[] = [
        {
            name: 'JavaScript',
            value: 'js'
        },
        {
            name: 'TypeScript',
            value: 'ts'
        },
        {
            name: 'JSON',
            value: 'json'
        },
        {
            name: 'Raw text',
            value: 'txt'
        }
    ];

    public static readonly outputChoices: APIApplicationCommandOptionChoice<string>[] = [
        {
            name: 'Reply',
            value: 'reply'
        },
        {
            name: 'File',
            value: 'file'
        },
        {
            name: 'Hastebin',
            value: 'hastebin'
        },
        {
            name: 'Console',
            value: 'console'
        },
        {
            name: 'Abort',
            value: 'none'
        }
    ];
}

interface EvalReplyParameters {
    hastebinUnavailable: boolean;
    replyUnavailable: boolean;
    consoleUnavailable: boolean;
    fileUnavailable: boolean;
    url: string | null;
    code: string;
    success: boolean;
    result: string;
    time: string;
    footer: string;
    language: string;
    outputTo: 'reply' | 'file' | 'hastebin' | 'console' | 'none';
}

interface EvalParameters {
    message: Message;
    code: string;
    async: boolean;
    showHidden: boolean;
    depth: number;
    timeout: number;
}

interface HastebinPostData {
    key: string;
    success: boolean;
}
