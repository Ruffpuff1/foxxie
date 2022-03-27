import { createClassDecorator, createFunctionPrecondition, createProxy } from '@sapphire/decorators';
import { acquireSettings } from '#database/functions';
import * as GuildSettings from '#database/Keys';
import { LanguageKeys } from '#lib/i18n';
import type { GuildMessage } from '#lib/types';
import { getAudio, sendLocalizedMessage } from '#utils/Discord';
import { Ctor, isNullish } from '@sapphire/utilities';
import { container, RegisterBehavior } from '@sapphire/framework';
import type { AutocompleteInteraction, CommandInteraction, CommandInteractionOption, SelectMenuInteraction } from 'discord.js';
import { Locale, RESTPostAPIChatInputApplicationCommandsJSONBody } from 'discord-api-types/v9';
import { getGuildIds } from './util';
import type { FoxxieCommand } from '#lib/structures';
import { SlashCommandBuilder, SlashCommandSubcommandsOnlyBuilder } from '@foxxie/builders';

export function RequireLevelingEnabled(): MethodDecorator {
    return createFunctionPrecondition(
        async (message: GuildMessage) => (message.guild ? acquireSettings(message.guild, GuildSettings.Leveling.Enabled) : true),
        (message: GuildMessage) => sendLocalizedMessage(message, LanguageKeys.Preconditions.Leveling)
    );
}

export function RequireStarboardEnabled(): MethodDecorator {
    return createFunctionPrecondition(
        async (message: GuildMessage) => Boolean(await acquireSettings(message.guild, GuildSettings.Starboard.Channel)),
        (message: GuildMessage) => sendLocalizedMessage(message, LanguageKeys.Preconditions.Starboard)
    );
}

export function RequireUserInVoiceChannel(): MethodDecorator {
    return createFunctionPrecondition(
        (message: GuildMessage) => message.member.voice.channelId !== null,
        (message: GuildMessage) => sendLocalizedMessage(message, LanguageKeys.Preconditions.MusicUserVoiceChannel)
    );
}

export function RequireFoxxieInVoiceChannel(): MethodDecorator {
    return createFunctionPrecondition(
        (message: GuildMessage) => message.guild.me!.voice.channelId !== null,
        (message: GuildMessage) => sendLocalizedMessage(message, LanguageKeys.Preconditions.MusicFoxxieVoiceChannel)
    );
}

export function RequireQueueNotEmpty(): MethodDecorator {
    return createFunctionPrecondition(
        (message: GuildMessage) => getAudio(message.guild).canStart(),
        (message: GuildMessage) => sendLocalizedMessage(message, LanguageKeys.Preconditions.MusicQueueNotEmpty)
    );
}

export function RequireSameVoiceChannel(): MethodDecorator {
    return createFunctionPrecondition(
        (message: GuildMessage) => message.member.voice.channelId === getAudio(message.guild).voiceChannelId,
        (message: GuildMessage) => sendLocalizedMessage(message, LanguageKeys.Preconditions.MusicSameVoiceChannel)
    );
}

export function RequireSongPresent(): MethodDecorator {
    return createFunctionPrecondition(
        async (message: GuildMessage) => {
            const track = await getAudio(message.guild).getCurrentSong();
            return !isNullish(track);
        },
        async (message: GuildMessage) => sendLocalizedMessage(message, LanguageKeys.Preconditions.MusicNothingPlaying)
    );
}

export function RequireMusicPlaying(): MethodDecorator {
    return createFunctionPrecondition(
        (message: GuildMessage) => getAudio(message.guild).playing,
        (message: GuildMessage) => sendLocalizedMessage(message, LanguageKeys.Preconditions.MusicNotPlaying)
    );
}

export function RequireMusicPaused(): MethodDecorator {
    return createFunctionPrecondition(
        (message: GuildMessage) => getAudio(message.guild).paused,
        (message: GuildMessage) => sendLocalizedMessage(message, LanguageKeys.Preconditions.MusicNotPaused)
    );
}

export function RegisterChatInputCommand(
    cb: (
        builder: SlashCommandBuilder
    ) => SlashCommandBuilder | SlashCommandSubcommandsOnlyBuilder | Omit<SlashCommandBuilder, 'addSubcommand' | 'addSubcommandGroup'>,
    options: FoxxieCommand.Options & { idHints?: string[] } = {}
) {
    const builder = cb(new SlashCommandBuilder());
    const buildData = builder.toJSON();
    const registry = container.applicationCommandRegistries.acquire(buildData.name);

    registry.registerChatInputCommand(builder as unknown as SlashCommandBuilder, {
        guildIds: getGuildIds(),
        idHints: options.idHints ?? [],
        behaviorWhenNotIdentical: RegisterBehavior.Overwrite
    });

    return createClassDecorator((command: Ctor) => {
        const subcommands = buildData.options?.filter(opt => opt.type === 1);

        if (subcommands?.length) {
            for (const subcommand of subcommands) {
                applyWrapperToMethod(command, subcommand.name);
            }
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

        raw.t = getLocale(interaction);

        return func!.call(this, ...[...args, raw].filter(a => Boolean(a)));
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

export function getLocale(interaction: CommandInteraction | SelectMenuInteraction | AutocompleteInteraction) {
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
            loc = string;
            break;
    }

    return container.i18n.languages.has(loc) ? container.i18n.getT(loc) : container.i18n.getT('en-US');
}
