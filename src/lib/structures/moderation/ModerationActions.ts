import { api } from '#external/Api';
import { GuildSettings, ModerationEntity, acquireSettings } from '#lib/database';
import { LanguageKeys } from '#lib/i18n';
import type { GuildMessage } from '#lib/types';
import { getModeration, getPersistRoles, messagePrompt } from '#utils/Discord';
import { BrandingColors, Colors } from '#utils/constants';
import { SendOptions, TypeCodes, TypeVariationAppealNames } from '#utils/moderation';
import { handleDiscordAPIError } from '#utils/transformers';
import { floatPromise } from '#utils/util';
import { chunk } from '@ruffpuff/utilities';
import { isCategoryChannel, isNewsChannel, isStageChannel, isTextChannel, isVoiceChannel } from '@sapphire/discord.js-utilities';
import { UserError, container } from '@sapphire/framework';
import { isNullishOrEmpty, isNullishOrZero } from '@sapphire/utilities';
import type { APIGuildChannel, APIOverwrite, ChannelType } from 'discord-api-types/v9';
import { Guild, GuildChannel, MessageEmbed, PermissionOverwriteOptions, PermissionOverwrites, Role } from 'discord.js';
import { Warn } from '../../database/entities/Warn';
import {
    RoleKey,
    RolePermissionOverwriteOptionField,
    permissionOverwrites,
    roleData,
    roleLanguageKeys
} from './ModerationRoleKeys';

export class ModerationActions {
    public constructor(public guild: Guild) {}

    public async ban(rawOptions: RawOptions, days: number, sendOptions: SendOptions): Promise<ModerationEntity> {
        const options = ModerationActions.fillOptions(rawOptions, TypeCodes.Ban);
        const moderationLog = this.create(options);

        await this.sendDM(moderationLog, sendOptions);
        await this.cancelTask(moderationLog.userId!, TypeVariationAppealNames.Ban);

        const reason = await this.fetchReason(moderationLog);

        await api().guilds(this.guild.id).bans(moderationLog.userId!).put({
            delete_message_days: days,
            reason
        });

        return (await moderationLog.create())!;
    }

    public async unban(rawOptions: RawOptions, sendOptions: SendOptions): Promise<ModerationEntity> {
        const options = ModerationActions.fillOptions(rawOptions, TypeCodes.UnBan);
        const moderationLog = this.create(options);

        await this.cancelTask(moderationLog.userId!, TypeVariationAppealNames.Ban);
        const reason = await this.fetchReason(moderationLog);

        await api().guilds(this.guild.id).bans(moderationLog.userId!).delete({
            reason
        });

        await this.sendDM(moderationLog, sendOptions);

        return (await moderationLog.create())!;
    }

    public async kick(rawOptions: RawOptions, sendOptions: SendOptions): Promise<ModerationEntity> {
        const options = ModerationActions.fillOptions(rawOptions, TypeCodes.Kick);
        const moderationLog = this.create(options);

        const reason = await this.fetchReason(moderationLog);
        await this.sendDM(moderationLog, sendOptions);

        await api().guilds(this.guild.id).members(moderationLog.userId!).delete({
            reason
        });

        return (await moderationLog.create())!;
    }

    public async softban(rawOptions: RawOptions, days: number, sendOptions: SendOptions): Promise<ModerationEntity> {
        const options = ModerationActions.fillOptions(rawOptions, TypeCodes.SoftBan);
        const moderationLog = this.create(options);

        const reason = await this.fetchReason(moderationLog);
        await this.sendDM(moderationLog, sendOptions);

        await api().guilds(this.guild.id).bans(moderationLog.userId!).put({
            reason,
            delete_message_days: days
        });

        await api().guilds(this.guild.id).bans(moderationLog.userId!).delete({
            reason
        });

        return (await moderationLog.create())!;
    }

    public async mute(rawOptions: RawOptions, sendOptions: SendOptions): Promise<ModerationEntity> {
        const options = ModerationActions.fillOptions(rawOptions, TypeCodes.Mute);
        const moderationLog = this.create(options);
        const roleId = await acquireSettings(this.guild.id, GuildSettings.Roles.Muted);

        const reason = await this.fetchReason(moderationLog);
        await this.cancelTask(moderationLog.userId!, TypeVariationAppealNames.Mute);

        try {
            await api().guilds(this.guild.id).members(moderationLog.userId!).roles(roleId!).put({ reason });
        } catch (error) {
            const handled = handleDiscordAPIError(error);
            throw new UserError({
                identifier: handled.identifier,
                message: handled.message
            });
        }

        await this.sendDM(moderationLog, sendOptions);
        return (await moderationLog.create())!;
    }

    public async unmute(rawOptions: RawOptions, sendOptions: SendOptions): Promise<ModerationEntity> {
        const options = ModerationActions.fillOptions(rawOptions, TypeCodes.UnMute);
        const moderationLog = this.create(options);

        const reason = await this.fetchReason(moderationLog);
        await this.cancelTask(moderationLog.userId!, TypeVariationAppealNames.Mute);
        const roleId = await acquireSettings(this.guild.id, GuildSettings.Roles.Muted);

        try {
            await api().guilds(this.guild.id).members(moderationLog.userId!).roles(roleId!).delete({ reason });

            await this.removePersistPunish(roleId!, moderationLog.userId!);
        } catch (error) {
            const handled = handleDiscordAPIError(error);
            throw new UserError({
                identifier: handled.identifier,
                message: handled.message
            });
        }

        await this.sendDM(moderationLog, sendOptions);
        return (await moderationLog.create())!;
    }

    public async restrictEmbed(rawOptions: RawOptions, sendOptions: SendOptions): Promise<ModerationEntity> {
        const options = ModerationActions.fillOptions(rawOptions, TypeCodes.RestrictEmbed);
        const moderationLog = this.create(options);

        const roleId = await acquireSettings(this.guild.id, GuildSettings.Roles.EmbedRestrict);

        const reason = await this.fetchReason(moderationLog);
        await this.cancelTask(moderationLog.userId!, TypeVariationAppealNames.RestrictEmbed);

        try {
            await api().guilds(this.guild.id).members(moderationLog.userId!).roles(roleId!).put({ reason });
        } catch (error) {
            const handled = handleDiscordAPIError(error);
            throw new UserError({
                identifier: handled.identifier,
                message: handled.message
            });
        }

        await this.sendDM(moderationLog, sendOptions);
        return (await moderationLog.create())!;
    }

    public async unRestrictEmbed(rawOptions: RawOptions, sendOptions: SendOptions): Promise<ModerationEntity> {
        const options = ModerationActions.fillOptions(rawOptions, TypeCodes.UnRestrictEmbed);
        const moderationLog = this.create(options);

        const reason = await this.fetchReason(moderationLog);
        await this.cancelTask(moderationLog.userId!, TypeVariationAppealNames.RestrictEmbed);
        const roleId = await acquireSettings(this.guild.id, GuildSettings.Roles.EmbedRestrict);

        try {
            await api().guilds(this.guild.id).members(moderationLog.userId!).roles(roleId!).delete({ reason });

            await this.removePersistPunish(roleId!, moderationLog.userId!);
        } catch (error) {
            const handled = handleDiscordAPIError(error);
            throw new UserError({
                identifier: handled.identifier,
                message: handled.message
            });
        }

        await this.sendDM(moderationLog, sendOptions);
        return (await moderationLog.create())!;
    }

    public async prune(rawOptions: RawOptions, messages: string[]): Promise<ModerationEntity> {
        const options = ModerationActions.fillOptions(rawOptions, TypeCodes.Prune);
        const moderationLog = this.create(options);

        const reason = await this.fetchReason(moderationLog);

        for (const bulks of chunk(messages, 100)) {
            try {
                await api()
                    .channels(moderationLog.channelId!)
                    .messages['bulk-delete'].post({
                        data: {
                            messages: bulks
                        },
                        reason
                    });
            } catch (error) {
                const handled = handleDiscordAPIError(error);
                if (handled.identifier)
                    throw new UserError({
                        identifier: handled.identifier,
                        message: handled.message
                    });
            }
        }

        return (await moderationLog.create())!;
    }

    public async lock(rawOptions: RawOptions): Promise<ModerationEntity> {
        const options = ModerationActions.fillOptions(rawOptions, TypeCodes.Lock);
        const moderationLog = this.create(options);

        const reason = await this.fetchReason(moderationLog);

        const { allow, deny } = await this.resolvePermissions(moderationLog.channelId!, { SEND_MESSAGES: false });

        try {
            await api()
                .channels(moderationLog.channelId!)
                .permissions(this.guild.id)
                .put({
                    data: { allow: allow!, deny: deny!, type: 0 },
                    reason
                });
        } catch (error) {
            const handled = handleDiscordAPIError(error);
            if (handled.identifier)
                throw new UserError({
                    identifier: handled.identifier,
                    message: handled.message
                });
        }

        return (await moderationLog.create())!;
    }

    public async unlock(rawOptions: RawOptions): Promise<ModerationEntity> {
        const options = ModerationActions.fillOptions(rawOptions, TypeCodes.UnLock);
        const moderationLog = this.create(options);

        const reason = await this.fetchReason(moderationLog);

        const { allow, deny } = await this.resolvePermissions(moderationLog.channelId!, { SEND_MESSAGES: true });

        try {
            await api()
                .channels(moderationLog.channelId!)
                .permissions(this.guild.id)
                .put({
                    data: { allow: allow!, deny: deny!, type: 0 },
                    reason
                });
        } catch (error) {
            const handled = handleDiscordAPIError(error);
            if (handled.identifier)
                throw new UserError({
                    identifier: handled.identifier,
                    message: handled.message
                });
        }

        return (await moderationLog.create())!;
    }

    public async warn(rawOptions: RawOptions, sendOptions: SendOptions): Promise<ModerationEntity> {
        const options = ModerationActions.fillOptions(rawOptions, TypeCodes.Warning);
        const moderationLog = this.create(options);

        const warning = new Warn({
            authorId: moderationLog.moderatorId,
            reason: moderationLog.reason,
            createdAt: new Date(),
            guildId: this.guild.id
        });

        const member = await container.db.members.ensure(options.userId!, this.guild.id);
        member.warnings.push(warning);
        await member.save();

        await this.sendDM(moderationLog, sendOptions);
        return (await moderationLog.create())!;
    }

    public async unwarn(rawOptions: RawOptions, sendOptions: SendOptions): Promise<ModerationEntity | null> {
        const options = ModerationActions.fillOptions(rawOptions, TypeCodes.UnWarn);
        const moderationLog = this.create(options);

        await this.sendDM(moderationLog, sendOptions);
        return moderationLog.create();
    }

    public async setNickname(rawOptions: RawOptions, sendOptions: SendOptions, nickname: string): Promise<ModerationEntity> {
        const options = ModerationActions.fillOptions(rawOptions, TypeCodes.SetNickname);
        const moderationLog = this.create(options);

        const reason = await this.fetchReason(moderationLog);
        await this.cancelTask(moderationLog.userId!, TypeVariationAppealNames.Nickname);

        try {
            await api()
                .guilds(this.guild.id)
                .members(moderationLog.userId!)
                .patch({
                    data: { nick: nickname },
                    reason
                });
        } catch (error) {
            const handled = handleDiscordAPIError(error);
            if (handled.identifier)
                throw new UserError({
                    identifier: handled.identifier,
                    message: handled.message
                });
        }

        await this.sendDM(moderationLog, sendOptions);
        return (await moderationLog.create())!;
    }

    public async unNickname(rawOptions: RawOptions, sendOptions: SendOptions, nickname: string): Promise<ModerationEntity> {
        const options = ModerationActions.fillOptions(rawOptions, TypeCodes.UnNickname);
        const moderationLog = this.create(options);

        const reason = await this.fetchReason(moderationLog);
        await this.cancelTask(moderationLog.userId!, TypeVariationAppealNames.Nickname);

        try {
            await api()
                .guilds(this.guild.id)
                .members(moderationLog.userId!)
                .patch({
                    data: { nick: nickname },
                    reason
                });
        } catch (error) {
            const handled = handleDiscordAPIError(error);
            if (handled.identifier)
                throw new UserError({
                    identifier: handled.identifier,
                    message: handled.message
                });
        }

        await this.sendDM(moderationLog, sendOptions);
        return (await moderationLog.create())!;
    }

    public async cancelTask(userId: string, type: string, extra?: (log: ModerationEntity) => boolean) {
        const log = await this.fetchTask(userId, type, extra);
        if (!log) return null;

        // const task = await log.fetchTask();
        // if (task && !task.finished) await container.tasks.delete(task.id);
        return log;
    }

    public async setUpRole(msg: GuildMessage, settingsKey: ModerationSetupRestriction, key?: RoleKey): Promise<Role> {
        if (this.guild.roles.cache.size >= 250)
            throw new UserError({
                identifier: LanguageKeys.Listeners.Errors.TooManyRoles
            });
        return this.initRole(msg, settingsKey, key);
    }

    private create(options: Partial<ModerationEntity>): ModerationEntity {
        return getModeration(this.guild).create(options);
    }

    private async sendDM(entry: ModerationEntity, sendOptions: SendOptions): Promise<ModerationEntity> {
        if (!sendOptions.send) return entry;

        try {
            const target = await entry.fetchUser();
            const embed = await this.buildDMEmbed(entry);

            await floatPromise(target!.send({ embeds: [embed] }));
        } catch {
            // noop
        }

        return entry;
    }

    private async buildDMEmbed(entry: ModerationEntity): Promise<MessageEmbed> {
        const moderator = await entry.fetchModerator();
        const t = await container.db.guilds.acquire(this.guild.id, settings => settings.getLanguage());
        const [name] = await entry.formatUtils();

        const obj = {
            guild: this.guild.name,
            tag: moderator?.username ?? null,
            duration: entry.duration
        };

        const titles = t(LanguageKeys.Moderation.Dm, obj);

        return new MessageEmbed()
            .setColor(entry.color || this.guild.me?.displayColor || BrandingColors.Primary)
            .setAuthor({
                name,
                iconURL: moderator?.displayAvatarURL({ dynamic: true })
            })
            .setThumbnail(this.guild.iconURL({ dynamic: true })!)
            .setDescription(
                [
                    titles[entry.title as keyof typeof titles],
                    '```',
                    entry.reason ?? t(LanguageKeys.Moderation.NoReason),
                    '```'
                ].join('\n')
            );
    }

    private async fetchTask(userId: string, type: string, extra: (log: ModerationEntity) => boolean = () => true) {
        const logs = await getModeration(this.guild).fetch(userId);
        return logs.filter(log => log.appealTaskName === type && extra(log)).last();
    }

    private removePersistPunish(roleId: string, userId: string): Promise<string[]> {
        return this.persistRoles.remove(userId, roleId);
    }

    private async fetchReason(entry: ModerationEntity): Promise<string> {
        const moderator = await entry.fetchModerator();
        const t = await container.db.guilds.acquire(this.guild.id, s => s.getLanguage());

        return `${entry.duration ? `[Temp] ` : ''}${moderator?.tag} | ${entry.reason ?? t(LanguageKeys.Moderation.NoReason)}`;
    }

    private async resolvePermissions(channelId: string, options: PermissionOverwriteOptions): Promise<Partial<APIOverwrite>> {
        const rawChannel = (await api().channels(channelId).get()) as APIGuildChannel<ChannelType.GuildText>;
        const { allow: prevAllow, deny: prevDeny } = rawChannel.permission_overwrites!.find(perms => perms.id === this.guild.id)!;

        const resolved = PermissionOverwrites.resolveOverwriteOptions(options, {
            allow: BigInt(prevAllow),
            deny: BigInt(prevDeny)
        });

        const { allow, deny } = resolved;

        return {
            allow: allow.bitfield.toString(),
            deny: deny.bitfield.toString()
        };
    }

    private async initRole(msg: GuildMessage, settingsKey: ModerationSetupRestriction, key?: RoleKey): Promise<Role> {
        const t = await container.db.guilds.acquire(this.guild.id, s => s.getLanguage());

        const languageKeys = roleLanguageKeys.get(key ?? RoleKey.Muted)!;
        const data = roleData.get(key ?? RoleKey.Muted)!;

        const lang = t(languageKeys, {
            channels: this.manageableChannelCount,
            permissions: this.displayPermissions(key ?? RoleKey.Muted)
        });

        const role = await this.guild.roles.create({
            ...data,
            name: lang.name,
            position: this.guild.me?.roles.highest.position || 0,
            reason: lang.reason,
            color: Colors.Restricted
        });

        await container.db.guilds.write(this.guild.id, settings => (settings[settingsKey] = role.id));

        if (await messagePrompt(msg, lang.init)) {
            await this.updateCategories(role, key ?? RoleKey.Muted);
            await this.updateTextOrVoice(role, key ?? RoleKey.Muted);
        }

        return role;
    }

    private async updateTextOrVoice(role: Role, key: RoleKey): Promise<void> {
        const options = permissionOverwrites.get(key)!;
        const promises: Promise<unknown>[] = [];
        for (const channel of this.guild.channels.cache.values()) {
            if (!channel.manageable) continue;
            if (isTextChannel(channel) || isNewsChannel(channel)) {
                promises.push(this.updatePermissionsForChannel(role, channel, options.text!));
            } else if (isVoiceChannel(channel) || isStageChannel(channel)) {
                promises.push(this.updatePermissionsForChannel(role, channel, options.voice!));
            }
        }

        await Promise.all(promises);
    }

    private async updateCategories(role: Role, key: RoleKey): Promise<void> {
        const options = permissionOverwrites.get(key)!;
        const promises: Promise<void>[] = [];
        for (const channel of this.guild.channels.cache.values()) {
            if (isCategoryChannel(channel) && channel.manageable) {
                promises.push(this.updatePermissionsForChannel(role, channel, options.category));
            }
        }
        await Promise.all(promises);
    }

    private async updatePermissionsForChannel(
        role: Role,
        channel: GuildChannel,
        rolePermissions: RolePermissionOverwriteOptionField
    ): Promise<void> {
        if (rolePermissions === null) return;

        const current = channel.permissionOverwrites.cache.get(role.id);
        if (typeof current === 'undefined') {
            await channel.permissionOverwrites.edit(role, rolePermissions.options);
        } else if (!current.deny.has(rolePermissions.permissions)) {
            const allowed = current.allow.toArray().map(permission => [permission, true]);
            const denied = current.allow.toArray().map(permission => [permission, false]);
            const mixed = Object.fromEntries(allowed.concat(denied));
            await current.edit({ ...mixed, ...rolePermissions.options });
        }
    }

    private displayPermissions(key: RoleKey): string[] {
        const options = permissionOverwrites.get(key)!;
        const output: string[] = [];
        for (const keyOption of Object.keys(options.category.options)) output.push(keyOption);
        return output;
    }

    private static fillOptions(rawOptions: RawOptions, type: number): Partial<ModerationEntity> {
        const options = { reason: null, ...rawOptions, type };
        if (isNullishOrEmpty(options.reason)) options.reason = null;
        if (isNullishOrEmpty(options.moderatorId)) options.moderatorId = process.env.CLIENT_ID;
        if (isNullishOrZero(options.duration)) options.duration = null;
        return options as ModerationEntity;
    }

    private get manageableChannelCount() {
        return this.guild.channels.cache.reduce((acc, channel) => (channel.manageable ? acc + 1 : acc), 0);
    }

    private get persistRoles() {
        return getPersistRoles(this.guild);
    }
}

export const enum ModerationSetupRestriction {
    All = 'rolesMuted',
    Embed = 'rolesEmbedRestrict'
}

export type RawOptions = Partial<ModerationEntity>;
