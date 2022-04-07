import { PieceContext, CommandOptionsRunTypeEnum } from '@sapphire/framework';
import { GuildMember, Permissions, User } from 'discord.js';
import { floatPromise, isGuildOwner, reactYes, seconds, sendTemporaryMessage, years } from '../../util';
import { FoxxieCommand } from '../../structures';
import { languageKeys } from '../../i18n';
import { aquireSettings, guildSettings, ModerationEntity } from '../../database';
import type { GuildMessage } from '../../types/Discord';
import type { TFunction } from '@sapphire/plugin-i18next';

export abstract class ModerationCommand extends FoxxieCommand {

    public memberOnly: boolean;
    public duration: boolean;
    public successKey: string;

    public constructor(context: PieceContext, options: ModerationCommand.Options) {
        super(context, {
            duration: false,
            memberOnly: false,
            runIn: [CommandOptionsRunTypeEnum.GuildAny],
            requiredUserPermissions: [Permissions.FLAGS.MANAGE_MESSAGES],
            ...options
        });

        this.memberOnly = options.memberOnly as boolean;
        this.duration = options.duration as boolean;
        this.successKey = options.successKey;
    }

    public async messageRun(msg: GuildMessage, args: ModerationCommand.Args): Promise<void> {
        const resolveArgs = await this.resolveArgs(args);
        const errors = [] as Array<ModerationErrors>;
        const successes: User[] = [];
        const TIMEOUT = seconds(30);

        const autoDelete = await aquireSettings(msg.guildId, guildSettings.messages.moderationAutoDelete);
        if (autoDelete) {
            await floatPromise(msg.delete());
        }

        const { targets, duration, reason } = resolveArgs;
        for (const target of new Set(targets)) {
            try {
                await this.checkModerable(msg, target, args.t);
                successes.push(target);
            } catch (err) {
                errors.push({ err: err as string | Error, target });
            }
        }

        const message: string[] = [];

        if (successes.length) {
            const { caseId } = await this.log(msg, successes, duration, reason, args, resolveArgs);
            message.push(args.t(this.successKey, { ...resolveArgs, targets: successes.map(user => `**${user.tag}**`), count: targets.length, caseId, reason: reason || args.t(languageKeys.moderation.noReason) }));
        }

        if (errors.length) {
            message.push(args.t(languageKeys.commands.moderation.errorFailed, { count: errors.length }));
            for (const { err } of errors) {
                message.push(typeof err === 'string' ? err : err.message);
            }
        }

        if (!autoDelete) {
            await sendTemporaryMessage(msg, message.join('\n'), TIMEOUT);
            setTimeout(() => reactYes(msg), TIMEOUT);
        }
    }

    protected async getDmData(msg: GuildMessage): Promise<{ send: boolean }> {
        return {
            send: Boolean(await aquireSettings(msg.guild, guildSettings.moderation.dm))
        };
    }

    protected abstract log(message: GuildMessage, successes: User[], duration: null | number, reason: string | null, args: ModerationCommand.Args, resolveArgs: unknown): Promise<ModerationEntity> | ModerationEntity;

    protected async checkModerable(msg: GuildMessage, target: User, t: TFunction): Promise<GuildMember> {
        if (target.id === msg.author.id) {
            throw t(languageKeys.commands.moderation.errorSelf, { target: `**${target.tag}**` });
        }

        if (target.id === process.env.CLIENT_ID) {
            throw t(languageKeys.commands.moderation.errorFoxxie, { target: `**${target.tag}**` });
        }

        const member = await msg.guild.members.fetch(target.id).catch(() => {
            if (this.memberOnly) throw t(languageKeys.commands.moderation.errorMember, { target: `**${target.tag}**` });
            return null;
        });

        if (member) {
            const targetRolePos = member.roles.highest.position;

            // Skyra cannot moderate members with higher role position than her:
            if (targetRolePos >= (msg.guild?.me?.roles.highest.position as number)) {
                throw t(languageKeys.commands.moderation.errorRoleBot, { target: `**${target.tag}**` });
            }

            // A member who isn't a server owner is not allowed to moderate somebody with higher role than them:
            if (!isGuildOwner(msg.member as GuildMember) && targetRolePos >= (msg.member?.roles.highest.position as number)) {
                throw t(languageKeys.commands.moderation.errorRole, { target: `**${target.tag}**` });
            }
        }

        return member as GuildMember;
    }

    protected async resolveArgs(args: ModerationCommand.Args): Promise<ResolvedArgs> {
        return {
            targets: await args.repeat('user', { times: 10 }),
            duration: await this.resolveDuration(args),
            reason: args.finished ? null : await args.rest('string')
        };
    }

    private async resolveDuration(args: ModerationCommand.Args): Promise<null | number> {
        if (args.finished) return null;
        if (!this.duration) return null;

        const result = await args.pickResult('timespan', { minimum: 0, maximum: years(5) });
        if (result.success) return result.value;
        if (result.error.identifier === languageKeys.arguments.invalidTime) return null;
        throw result.error;
    }

}

export namespace ModerationCommand {

    export interface Options extends FoxxieCommand.Options {
        duration?: boolean;
        memberOnly?: boolean;
        successKey: string;
    }

    export type Args = FoxxieCommand.Args
    export type Context = FoxxieCommand.Context
}

export interface ModerationErrors {
    err: string | Error;
    target: User;
}

export interface ResolvedArgs {
    targets: User[],
    duration: number | null;
    reason: string | null;
}