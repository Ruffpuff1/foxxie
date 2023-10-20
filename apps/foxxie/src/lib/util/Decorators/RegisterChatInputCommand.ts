import { FoxxieCommand } from '#lib/Structures';
import { commandsCache } from '#utils/chatInputDecorators';
import { createClassDecorator, createProxy } from '@sapphire/decorators';
import { ApplicationCommandRegistry, container } from '@sapphire/framework';
import { ApplicationCommandOptionData, ApplicationCommandOptionType, ChatInputApplicationCommandData, Locale } from 'discord.js';
import { getFixedT } from 'i18next';

export function RegisterChatInputCommand(
    options: ExtendedChatInputCommandOptionData,
    extraOptions?: ExtraOptions,
    subCommands?: string[]
) {
    return createClassDecorator(target =>
        createProxy(target, {
            construct: (ctor, [context, baseOptions = {}]: [unknown, FoxxieCommand.Options]) => {
                const commandName = baseOptions.name;

                const subCommandKeys =
                    subCommands ||
                    options.options
                        ?.filter(option => option.type === ApplicationCommandOptionType.Subcommand)
                        .map(option => option.name) ||
                    [];

                const englishUS = getFixedT('en-US');
                const spanishMX = getFixedT('es-MX');

                if (options.translate) {
                    options.name = englishUS(options.name);
                    options.description = englishUS(options.description);
                }

                const localize = (options: CommandOptionDataWithTranslate) => {
                    if (
                        !options.translate ||
                        options.type === ApplicationCommandOptionType.Subcommand ||
                        options.type === ApplicationCommandOptionType.SubcommandGroup
                    )
                        return options;

                    options.nameLocalizations = {
                        [Locale.SpanishES]: spanishMX(options.name)
                    };

                    options.descriptionLocalizations = {
                        [Locale.SpanishES]: spanishMX(options.description)
                    };

                    options.name = englishUS(options.name);
                    options.description = englishUS(options.description);

                    return options;
                };

                if (subCommandKeys.length) {
                    for (const subCommand of subCommandKeys) {
                        const foundOptions = commandsCache.get(subCommand);

                        if (foundOptions) {
                            const dataSubcommand = options.options?.find(option => option.name === subCommand);

                            const mappedFound = foundOptions.map(options => localize(options)).reverse();

                            if (dataSubcommand && dataSubcommand.type === ApplicationCommandOptionType.Subcommand) {
                                if (dataSubcommand.options) {
                                    Reflect.set(dataSubcommand, 'options', [...dataSubcommand.options, ...mappedFound]);
                                } else {
                                    Reflect.set(dataSubcommand, 'options', [...mappedFound]);
                                }
                            } else if (options.options) {
                                Reflect.set(options, 'options', [
                                    ...options.options,
                                    {
                                        name: subCommand,
                                        description: 'unknown description',
                                        type: ApplicationCommandOptionType.Subcommand,
                                        options: [...mappedFound]
                                    }
                                ]);
                            } else {
                                Reflect.set(options, 'options', [
                                    {
                                        name: subCommand,
                                        description: 'unknown description',
                                        type: ApplicationCommandOptionType.Subcommand,
                                        options: [...mappedFound]
                                    }
                                ]);
                            }
                        }
                    }
                } else {
                    const foundOptions = commandsCache.get(`${commandName}.chatinputrun`);
                    console.log(foundOptions);
                }

                container.applicationCommandRegistries.acquire(commandName!).registerChatInputCommand(options, extraOptions);

                return new ctor(context, { ...baseOptions, ...options });
            }
        })
    );
}

export interface ExtendedChatInputCommandOptionData extends ChatInputApplicationCommandData {
    translate?: boolean;
}

export type CommandOptionDataWithTranslate = ApplicationCommandOptionData & {
    translate?: boolean;
};

export type ExtraOptions = ApplicationCommandRegistry.RegisterOptions;
