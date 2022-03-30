import { SlashCommandBuilder, SlashCommandSubcommandsOnlyBuilder } from '@foxxie/builders';
import { createClassDecorator, createProxy } from '@sapphire/decorators';
import { Command, container, RegisterBehavior } from '@sapphire/framework';
import type { TFunction } from '@sapphire/plugin-i18next';
import type { Ctor } from '@sapphire/utilities';
import { Locale, RESTPostAPIChatInputApplicationCommandsJSONBody } from 'discord-api-types/v10';
import type { AutocompleteInteraction, CommandInteraction, CommandInteractionOption, SelectMenuInteraction } from 'discord.js';
import { getGuildIds } from './util';

export function RegisterChatInputCommand(
    cb: (builder: SlashCommandBuilder) => SlashCommandBuilder | SlashCommandSubcommandsOnlyBuilder | Omit<SlashCommandBuilder, 'addSubcommand' | 'addSubcommandGroup'>,
    options: Command.Options & { idHints?: string[] } = {}
) {
    return createClassDecorator((command: Ctor) => {
        const builder = cb(new SlashCommandBuilder());
        const buildData = builder.toJSON();
        const registry = command.prototype.container.applicationCommandRegistries.acquire(buildData.name);

        registry.registerChatInputCommand(builder as unknown as SlashCommandBuilder, {
            guildIds: getGuildIds(),
            idHints: options.idHints ?? [],
            behaviorWhenNotIdentical: RegisterBehavior.Overwrite
        });

        const subcommands = buildData.options?.filter(opt => opt.type === 1);

        if (subcommands?.length) {
            // eslint-disable-next-line @typescript-eslint/require-await
            command.prototype.chatInputRun = async function descriptorValue(this: (...args: any[]) => any, ...args: any[]) {
                const interaction = args[0] as CommandInteraction;
                const raw: Record<string, any> = parseArgs(interaction.options.data as any, {});

                const subcommand = interaction.options.getSubcommand(true);

                return command.prototype[subcommand].call(
                    this,
                    ...[...args, { t: command.prototype.container.i18n.getT(getLocaleString(interaction)) as TFunction, ...raw[subcommand] }].filter(a => Boolean(a))
                );
            } as unknown as undefined;
        } else {
            applyWrapperToMethod(command, 'chatInputRun');
        }

        return createProxy(command, {
            construct: (ctor, [context, base = {}]) =>
                new ctor(context, {
                    ...base,
                    ...{
                        description: (buildData as RESTPostAPIChatInputApplicationCommandsJSONBody).description,
                        name: buildData.name,
                        ...options
                    }
                })
        });
    });
}

function applyWrapperToMethod(command: Ctor, name: string) {
    const func = command.prototype[name];

    // eslint-disable-next-line @typescript-eslint/require-await
    command.prototype[name] = async function descriptorValue(this: (...args: any[]) => any, ...args: any[]) {
        const interaction = args[0] as CommandInteraction;
        const raw: Record<string, any> = parseArgs(interaction.options.data as any, {});

        return func!.call(this, ...[...args, { t: command.prototype.container.i18n.getT(getLocaleString(interaction)) as TFunction, ...raw }].filter(a => Boolean(a)));
    } as unknown as undefined;
}

function parseArgs(options: CommandInteractionOption[], raw: Record<string, any>) {
    for (const arg of options) {
        // eslint-disable-next-line @typescript-eslint/switch-exhaustiveness-check
        switch (arg.type) {
            case 'SUB_COMMAND':
            case 'SUB_COMMAND_GROUP':
                raw[arg.name] = parseArgs(arg.options ? [...arg.options] : [], {});
                break;
            case 'USER':
                raw[arg.name] = { user: arg.user, member: arg.member };
                break;
            case 'CHANNEL':
                raw[arg.name] = arg.channel;
                break;
            case 'ROLE':
                raw[arg.name] = arg.role;
                break;
            default:
                raw[arg.name] = arg.value;
        }
    }

    return raw;
}

export function getLocaleString(interaction: CommandInteraction | SelectMenuInteraction | AutocompleteInteraction) {
    const string = (interaction.locale ?? interaction.guildLocale) as Locale;
    let loc: string;

    switch (string) {
        case Locale.SpanishES:
            loc = 'es-MX';
            break;
        case Locale.Japanese:
            loc = 'ja-JP';
            break;
        case Locale.French:
            loc = 'fr-FR';
            break;
        default:
            loc = 'en-US';
            break;
    }

    return loc;
}

export function getLocale(interaction: CommandInteraction | SelectMenuInteraction | AutocompleteInteraction) {
    const string = getLocaleString(interaction);

    return container.i18n.getT(string);
}
