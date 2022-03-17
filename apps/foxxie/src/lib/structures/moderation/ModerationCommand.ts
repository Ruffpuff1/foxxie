import * as GuildSettings from '#database/Keys';
import { acquireSettings } from '#database/functions';
import type { ModerationEntity } from '#database/entities/ModerationEntity';
import { LanguageKeys } from '#lib/i18n';
import { GuildInteraction, PermissionLevels } from '#lib/types';
import { isGuildOwner } from '#utils/Discord';
import type { SendOptions } from '#utils/moderation';
import { channelLink } from '#utils/transformers';
import { minutes, years } from '@ruffpuff/utilities';
import { CommandOptionsRunTypeEnum, PieceContext, Result, UserError } from '@sapphire/framework';
import type { TFunction } from '@sapphire/plugin-i18next';
import type { GuildMember, User } from 'discord.js';
import { FoxxieCommand } from '../commands';

export class ModerationCommand extends FoxxieCommand {
    public memberOnly: boolean;

    public duration: boolean;

    public successKey: string;

    public constructor(context: PieceContext, options: ModerationCommand.Options) {
        super(context, {
            duration: false,
            memberOnly: false,
            runIn: [CommandOptionsRunTypeEnum.GuildAny],
            permissionLevel: PermissionLevels.Moderator,
            ...options
        });
    }

    protected async checkModerable(interaction: GuildInteraction, context: { t: TFunction; target: User }): Promise<GuildMember | null> {
        if (context.target.id === interaction.user.id) {
            throw context.t(LanguageKeys.Listeners.Errors.ModerationSelf, { target: `**${context.target.tag}**` });
        }

        if (context.target.id === process.env.CLIENT_ID) {
            throw context.t(LanguageKeys.Listeners.Errors.ModerationFoxxie, { target: `**${context.target.tag}**` });
        }

        const member = await interaction.guild.members.fetch(context.target.id).catch(() => {
            if (this.memberOnly) throw context.t(LanguageKeys.Listeners.Errors.ModerationMember, { target: `**${context.target.tag}**` });
            return null;
        });

        if (member) {
            const targetRolePos = member.roles.highest.position;
            const myRolePos = interaction.guild?.me?.roles.highest.position;

            // Skyra cannot moderate members with higher role position than her:
            if (!myRolePos || targetRolePos >= myRolePos) {
                throw context.t(LanguageKeys.Listeners.Errors.ModerationRoleBot, { target: `**${context.target.tag}**` });
            }

            const mod = interaction.guild.members.cache.get(interaction.user.id);
            const modRolePosition = mod?.roles.highest.position;

            // A member who isn't a server owner is not allowed to moderate somebody with higher role than them:
            if (!mod || !modRolePosition || (!isGuildOwner(mod) && targetRolePos >= modRolePosition)) {
                throw context.t(LanguageKeys.Listeners.Errors.ModerationRole, { target: `**${context.target.tag}**` });
            }
        }

        return member;
    }

    protected async resolveDuration(duration: string | undefined): Promise<number | null> {
        const string = duration ?? null;

        if (!string) return null;
        if (!this.duration) return null;

        const result = (await this.container.stores
            .get('arguments')
            .get('timespan')!
            .run(string, { minimum: minutes(1), maximum: years(5) } as any)) as Result<number, UserError>;

        if (result.success) return result.value;
        if (result.error.identifier === LanguageKeys.Arguments.Duration) return null;
        throw result.error;
    }

    protected async getDmData(interaction: GuildInteraction): Promise<SendOptions> {
        return {
            send: await acquireSettings(interaction.guild, GuildSettings.Moderation.Dm)
        };
    }

    protected async respond(interaction: GuildInteraction, log: ModerationEntity, target: User): Promise<void> {
        const [modChannelId, t] = await acquireSettings(interaction.guildId!, settings => [settings[GuildSettings.Channels.Logs.Moderation], settings.getLanguage()]);

        const content = modChannelId
            ? t(this.successKey, {
                  context: 'cases',
                  cases: log.caseId.toString(),
                  targets: [`**${target.tag}**`],
                  count: 1,
                  url: channelLink(interaction.guildId!, modChannelId),
                  reason: log.reason || t(LanguageKeys.Moderation.NoReason)
              })
            : t(this.successKey, {
                  targets: [`**${target.tag}**`],
                  count: 1,
                  reason: log.reason || t(LanguageKeys.Moderation.NoReason)
              });

        await interaction.editReply({ content, components: [] });
    }
}

// eslint-disable-next-line no-redeclare
export namespace ModerationCommand {
    export interface Options extends FoxxieCommand.Options {
        duration?: boolean;
        memberOnly?: boolean;
        successKey: string;
    }

    export type Args = FoxxieCommand.Args;
    export type Context = FoxxieCommand.Context;
}
