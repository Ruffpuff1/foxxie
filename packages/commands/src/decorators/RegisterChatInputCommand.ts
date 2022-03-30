/* eslint-disable func-name-matching */
import { SlashCommandBuilder, SlashCommandSubcommandsOnlyBuilder } from '@foxxie/builders';
import type { CommandOptionsWithIdHintsAndGuildIds } from '../types';
import { container, RegisterBehavior, ChatInputCommand } from '@sapphire/framework';
import { createClassDecorator, createProxy } from '@sapphire/decorators';
import type { Ctor } from '@sapphire/utilities';
import { getLocaleString, parseArgs } from '../utils';
import type { TFunction } from 'i18next';

export function RegisterChatInputCommand(
    cb: (builder: SlashCommandBuilder) => SlashCommandBuilder | SlashCommandSubcommandsOnlyBuilder | Omit<SlashCommandBuilder, 'addSubcommand' | 'addSubcommandGroup'>,
    options: CommandOptionsWithIdHintsAndGuildIds
) {
    const builder = cb(new SlashCommandBuilder());
    const data = builder.toJSON();
    const registry = container.applicationCommandRegistries.acquire(data.name);

    registry.registerChatInputCommand(builder as SlashCommandBuilder, {
        guildIds: options.guildIds ?? [],
        idHints: options.idHints ?? [],
        behaviorWhenNotIdentical: RegisterBehavior.Overwrite
    });

    return createClassDecorator((command: Ctor) => {
        const subcommands = data.options?.filter(opt => opt.type === 1);

        if (subcommands && subcommands.length) {
            // eslint-disable-next-line @typescript-eslint/require-await
            command.prototype.chatInputRun = async function descriptorValue(
                this: (...args: Parameters<ChatInputCommand['chatInputRun']>) => any,
                ...args: Parameters<ChatInputCommand['chatInputRun']>
            ) {
                const interaction = args[0];
                const raw: Record<string, any> = parseArgs(interaction.options.data as any, {});

                const subcommand = interaction.options.getSubcommand(true);

                return command.prototype[subcommand].call(
                    this,
                    ...[...args, { t: command.prototype.container.i18n.getT(getLocaleString(interaction)) as TFunction, ...raw[subcommand] }].filter(a => Boolean(a))
                );
            };
        } else {
            applyWrapperToMethod(command, 'chatInputRun');
        }

        return createProxy(command, {
            construct: (ctor, [context, base = {}]) =>
                new ctor(context, {
                    ...base,
                    ...{
                        description: Reflect.get(data, 'description'),
                        name: data.name,
                        ...options
                    }
                })
        });
    });
}

function applyWrapperToMethod(command: Ctor, name: string) {
    const func = command.prototype[name];

    // eslint-disable-next-line @typescript-eslint/require-await
    command.prototype[name] = async function descriptorValue(
        this: (...args: Parameters<ChatInputCommand['chatInputRun']>) => any,
        ...args: Parameters<ChatInputCommand['chatInputRun']>
    ) {
        const interaction = args[0];
        const raw: Record<string, any> = parseArgs(interaction.options.data as any, {});

        return func!.call(this, ...[...args, { t: command.prototype.container.i18n.getT(getLocaleString(interaction)) as TFunction, ...raw }].filter(a => Boolean(a)));
    };
}
