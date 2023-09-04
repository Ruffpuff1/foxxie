import { GuildSettings, ModerationEntity, acquireSettings } from '#lib/database';
import { LanguageKeys } from '#lib/i18n';
import { GuildMessage, PermissionLevels } from '#lib/types';
import { isGuildOwner, maybeMe, sendTemporaryMessage } from '#utils/Discord';
import type { SendOptions } from '#utils/moderation';
import { bold } from '@discordjs/builders';
import { CustomFunctionGet } from '@foxxie/i18n';
import { cast, minutes, seconds, years } from '@ruffpuff/utilities';
import { CommandOptionsRunTypeEnum, PieceContext } from '@sapphire/framework';
import type { GuildMember, User } from 'discord.js';
import { FoxxieCommand } from '../commands';

export abstract class ModerationCommand<T = unknown> extends FoxxieCommand {
    /**
     * Whether a member is required or not.
     */
    protected memberOnly: boolean;

    /**
     * Whether or not this command can be temporary.
     */
    protected duration: boolean;

    /**
     * The language key for when the command is a success.
     */
    protected successKey: string;

    public constructor(context: PieceContext, options: ModerationCommand.Options) {
        super(context, {
            cooldownDelay: seconds(5),
            flags: ['no-author', 'authored', 'no-dm', 'dm'],
            duration: false,
            memberOnly: false,
            runIn: [CommandOptionsRunTypeEnum.GuildAny],
            permissionLevel: PermissionLevels.Moderator,
            ...options
        });

        this.memberOnly = options.memberOnly!;
        this.duration = options.duration!;
        this.successKey = options.successKey;
    }

    public messageRun(message: GuildMessage, args: ModerationCommand.Args, context: ModerationCommand.Context): Promise<void>;

    public async messageRun(message: GuildMessage, args: ModerationCommand.Args): Promise<void> {
        const resolved = await this.resolveTargets(args);
        const preHandled = await this.prehandle(message, resolved);
        const processed = cast<Array<{ log: ModerationEntity; target: User }>>([]);
        const errors = cast<Array<{ error: Error | string; target: User }>>([]);

        const { targets, ...handledRaw } = resolved;
        const logChannelId = await acquireSettings(message.guild, GuildSettings.Channels.Logs.Moderation);

        for (const target of new Set(targets)) {
            try {
                const handled = { ...handledRaw, args, target, preHandled };
                await this.checkModeratable(message, handled);
                const log = await this.handle(message, handled);
                processed.push({ log, target });
            } catch (error) {
                errors.push({ error: cast<Error | string>(error), target });
            }
        }

        try {
            await this.posthandle(message, { ...resolved, preHandled });
        } catch {
            // noop
        }

        const output: string[] = [];

        if (processed.length) {
            const firstLog = processed[0].log;
            const logReason = firstLog.reason!;
            const sorted = processed.sort((a, b) => a.log.caseId - b.log.caseId);
            const cases = sorted.map(({ log }) => log.caseId);
            const users = sorted.map(({ target }) => bold(target.username));
            const range = cases.length === 1 ? cases[0] : `${cases[0]}..${cases[cases.length - 1]}`;

            const formattedRange = logChannelId
                ? `[${range}](<https://discord.com/channels/${firstLog.guildId}/${logChannelId}>)`
                : range;

            output.push(args.t(this.successKey, { users, range: formattedRange, count: cases.length }));
            if (logReason) output.push(`└── *"${logReason}"*`);
        }

        if (errors.length) {
            output.push(args.t(LanguageKeys.Listeners.Errors.ModerationHasError, { count: [...errors, ...processed].length }));
            for (const e of errors) output.push(`└── ${e.error}`);
        }

        if (output.length) await sendTemporaryMessage(message, output.join('\n'), minutes(5));
    }

    protected async checkModeratable(message: GuildMessage, context: HandledCommandContext<T>): Promise<GuildMember | null> {
        if (context.target.id === message.author.id) {
            throw context.args.t(LanguageKeys.Listeners.Errors.ModerationSelf, { target: `**${context.target.username}**` });
        }

        if (context.target.id === process.env.CLIENT_ID) {
            throw context.args.t(LanguageKeys.Listeners.Errors.ModerationFoxxie, { target: `**${context.target.username}**` });
        }

        const member = await message.guild.members.fetch(context.target.id).catch(() => {
            if (this.memberOnly)
                throw context.args.t(LanguageKeys.Listeners.Errors.ModerationMember, {
                    target: `**${context.target.username}**`
                });
            return null;
        });

        if (member) {
            const targetRolePos = member.roles.highest.position;
            const myRolePos = maybeMe(message.guild)?.roles.highest.position;

            if (!myRolePos || targetRolePos >= myRolePos) {
                throw context.args.t(LanguageKeys.Listeners.Errors.ModerationRoleBot, {
                    target: `**${context.target.username}**`
                });
            }

            const mod = message.guild.members.cache.get(message.author.id);
            const modRolePosition = mod?.roles.highest.position;

            // A member who isn't a server owner is not allowed to moderate somebody with higher role than them:
            if (!mod || !modRolePosition || (!isGuildOwner(mod) && targetRolePos >= modRolePosition)) {
                throw context.args.t(LanguageKeys.Listeners.Errors.ModerationRole, { target: `**${context.target.username}**` });
            }
        }

        return member;
    }

    protected async resolveTargets(args: ModerationCommand.Args): Promise<CommandContext> {
        return {
            targets: await args.repeat('user', { times: 10 }),
            duration: await this.resolveDuration(args),
            reason: args.finished ? null : await args.rest('string')
        };
    }

    protected async getDmData(message: GuildMessage, context: HandledCommandContext): Promise<SendOptions> {
        return {
            send: context.args.getFlags('no-dm')
                ? false
                : context.args.getFlags('dm') ||
                  (await this.container.db.guilds.acquire(message.guild.id, GuildSettings.Moderation.Dm))
        };
    }

    protected prehandle(_message: GuildMessage, _context: CommandContext): Promise<T> | T {
        return cast<T>(null);
    }

    protected posthandle(_message: GuildMessage, _context: PostHandledCommandContext<T>): unknown {
        return null;
    }

    protected abstract handle(
        message: GuildMessage,
        context: HandledCommandContext<T>
    ): Promise<ModerationEntity> | ModerationEntity;

    private async resolveDuration(args: ModerationCommand.Args) {
        if (args.finished) return null;
        if (!this.duration) return null;

        const result = await args.pickResult('timespan', { minimum: 0, maximum: years(5) });
        if (result.isOk()) return result.unwrap();
        if (result.unwrapErr().identifier === LanguageKeys.Arguments.Duration) return null;
        throw result.unwrapErr();
    }
}

// eslint-disable-next-line no-redeclare
export namespace ModerationCommand {
    export interface Options extends FoxxieCommand.Options {
        duration?: boolean;
        memberOnly?: boolean;
        successKey: CustomFunctionGet<
            string,
            {
                users: string[];
                range: string | number;
                count: number;
            },
            string
        >;
    }

    export type Args = FoxxieCommand.Args;
    export type Context = FoxxieCommand.Context;
}

export interface CommandContext {
    targets: User[];
    duration: number | null;
    reason: string | null;
}

export interface HandledCommandContext<T = unknown> extends Pick<CommandContext, 'duration' | 'reason'> {
    args: ModerationCommand.Args;
    target: User;
    preHandled: T;
}

export interface PostHandledCommandContext<T = unknown> extends CommandContext {
    preHandled: T;
}
