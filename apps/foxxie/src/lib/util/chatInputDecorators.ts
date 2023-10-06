import { CustomGet } from '#lib/Types';
import { createClassDecorator, createMethodDecorator, createProxy } from '@sapphire/decorators';
import { ApplicationCommandRegistry, container } from '@sapphire/framework';
import {
    ApplicationCommandAutocompleteStringOptionData,
    ApplicationCommandBooleanOption,
    ApplicationCommandOptionChoiceData,
    ApplicationCommandOptionData,
    ApplicationCommandOptionType,
    ApplicationCommandStringOptionData,
    ApplicationCommandSubCommandData,
    ApplicationCommandUserOption,
    ChatInputApplicationCommandData,
    Locale
} from 'discord.js';
import { TFunction, getFixedT } from 'i18next';

const commandsCache = new Map<string | symbol, (ApplicationCommandOptionData & { translate?: boolean })[]>();
// const commandMap = new Map<string | symbol, ChatInputApplicationCommandData>();

export function RegisterChatInputCommand(
    options: Record<string, any>,
    extraOptions?: ApplicationCommandRegistry.RegisterOptions,
    subcommands?: string[]
) {
    return createClassDecorator(target =>
        createProxy(target, {
            construct: (ctor, [context, baseOptions = {}]) => {
                const name: string = Reflect.get(baseOptions, 'name');
                const subcommandKeys: string[] =
                    subcommands ||
                    (options.options as ApplicationCommandSubCommandData[])
                        .filter(opt => opt.type === ApplicationCommandOptionType.Subcommand)
                        .map(opt => opt.name) ||
                    [];

                const englishUS = getFixedT('en-US');
                const spanishMX = getFixedT('es-MX');

                const localize = (
                    opts: ApplicationCommandOptionData & {
                        translate?: boolean;
                    }
                ) => {
                    if (!opts.translate) return opts;

                    opts.nameLocalizations = {
                        [Locale.SpanishES]: spanishMX(opts.name)
                    };

                    opts.descriptionLocalizations = {
                        [Locale.SpanishES]: spanishMX(opts.description)
                    };

                    opts.name = englishUS(opts.name);
                    opts.description = englishUS(opts.description);

                    return opts;
                };

                if (subcommandKeys.length) {
                    for (const subcommand of subcommandKeys) {
                        const foundOptions = commandsCache.get(subcommand);

                        if (foundOptions) {
                            const dataSubcommand = options.options?.find(
                                (opt: ApplicationCommandOptionData) => opt.name === subcommand
                            );

                            const mappedFound = foundOptions.map(opts => localize(opts)).reverse();

                            if (dataSubcommand) {
                                if (dataSubcommand.options) dataSubcommand.options.push(mappedFound);
                                else dataSubcommand.options = [...mappedFound];
                            } else if (options.options) {
                                options.options.push({
                                    name: subcommand,
                                    description: 'unknown description',
                                    type: ApplicationCommandOptionType.Subcommand,
                                    options: [...mappedFound]
                                });
                            } else {
                                options.options = [
                                    {
                                        name: subcommand,
                                        description: 'unknown description',
                                        type: ApplicationCommandOptionType.Subcommand,
                                        options: [...mappedFound]
                                    }
                                ];
                            }
                        }
                    }
                }

                container.applicationCommandRegistries
                    .acquire(name)
                    .registerChatInputCommand(options as ChatInputApplicationCommandData, extraOptions);

                return new ctor(context, {
                    ...baseOptions,
                    ...options
                });
            }
        })
    );
}

export const AddStringOption = (
    name: string,
    description: string,
    optionOptions?: Omit<ApplicationCommandStringOptionData, 'name' | 'description' | 'type'> & { translate?: boolean }
): MethodDecorator => {
    return createMethodDecorator((_, propertyKey) => {
        const options: ApplicationCommandStringOptionData = {
            name,
            description,
            type: ApplicationCommandOptionType.String,
            ...optionOptions
        };

        const key = propertyKey.toString().toLowerCase();
        const previous = commandsCache.get(key);

        if (previous) previous.push(options);
        else commandsCache.set(key, [options]);
    });
};

export const AddStringAutoCompleteOption = (
    name: string,
    description: string,
    optionOptions?: Omit<ApplicationCommandAutocompleteStringOptionData, 'name' | 'description' | 'type' | 'autocomplete'>
): MethodDecorator => {
    return createMethodDecorator((_, propertyKey) => {
        const options: ApplicationCommandAutocompleteStringOptionData = {
            name,
            description,
            type: ApplicationCommandOptionType.String,
            autocomplete: true,
            ...optionOptions
        };

        const key = propertyKey.toString().toLowerCase();
        const previous = commandsCache.get(key);

        if (previous) previous.push(options);
        else commandsCache.set(key, [options]);
    });
};

export const AddBooleanOption = (
    name: string,
    description: string,
    optionOptions: Omit<ApplicationCommandBooleanOption, 'name' | 'description' | 'type'>
): MethodDecorator => {
    return createMethodDecorator((_, propertyKey) => {
        const options: ApplicationCommandBooleanOption = {
            name,
            description,
            type: ApplicationCommandOptionType.Boolean,
            ...optionOptions
        };

        const key = propertyKey.toString().toLowerCase();
        const previous = commandsCache.get(key);

        if (previous) previous.push(options);
        else commandsCache.set(key, [options]);
    });
};

export const AddUserOption = (
    name: string,
    description: string,
    optionOptions: Omit<ApplicationCommandUserOption, 'name' | 'description' | 'type'>
): MethodDecorator => {
    return createMethodDecorator((_, propertyKey) => {
        const options: ApplicationCommandUserOption = {
            name,
            description,
            type: ApplicationCommandOptionType.User,
            ...optionOptions
        };

        const key = propertyKey.toString().toLowerCase();
        const previous = commandsCache.get(key);

        if (previous) previous.push(options);
        else commandsCache.set(key, [options]);
    });
};

export const AddEphemeralOption = () =>
    AddBooleanOption('hidden', "Whether to hide the command's output (defaults to false).", { required: false });

export const MapStringOptionsToChoices: (...choices: string[]) => ApplicationCommandOptionChoiceData<string>[] = (...choices) =>
    choices.map(opt => ({ name: opt, value: opt }));

export const NameAndDescriptionsToSubcommands: (
    ...options: { name: string; description: string }[]
) => { name: string; description: string; type: ApplicationCommandOptionType.Subcommand }[] = (...options) =>
    options.map(opt => ({ name: opt.name, description: opt.description, type: ApplicationCommandOptionType.Subcommand }));

export const NameAndDescriptionToLocalizedSubCommands: (
    ...options: (
        | { name: CustomGet<string, string>; description: CustomGet<string, string>; translate?: true }
        | { name: string; description: string; translate?: false }
    )[]
) => ApplicationCommandSubCommandData[] = (...options) => {
    const englishUS = getFixedT('en-US');
    const spanishMX = getFixedT('es-MX');

    return options.map(opt => {
        if (!opt.translate)
            return { name: opt.name, description: opt.description, type: ApplicationCommandOptionType.Subcommand };

        return {
            name: englishUS(opt.name),
            description: englishUS(opt.description),

            type: ApplicationCommandOptionType.Subcommand,
            nameLocalizations: {
                [Locale.SpanishES]: spanishMX(opt.name)
            },
            descriptionLocalizations: {
                [Locale.SpanishES]: spanishMX(opt.description)
            }
        } as ApplicationCommandSubCommandData;
    });
};

export const AddTranslatedStringOption = (
    nameKey: CustomGet<string, string>,
    descriptionKey: CustomGet<string, string>,
    options: Omit<ApplicationCommandStringOptionData, 'name' | 'description' | 'type'>
) => {
    return AddStringOption(nameKey, descriptionKey, { ...options, translate: true });
};

export interface TranslatedOptionChoice {
    key: CustomGet<string, string>;
    value: string;
}

export class T {
    public englishUS: TFunction;

    public spanishMX: TFunction;

    public constructor(englishUS: TFunction, spanishMX: TFunction) {
        this.englishUS = englishUS;

        this.spanishMX = spanishMX;
    }
}
