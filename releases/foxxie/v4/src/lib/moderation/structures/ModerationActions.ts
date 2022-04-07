import { isNullishOrZero, isNullishOrEmpty, resolveToNull, floatPromise, TypeCodes, getModeration, BrandingColors, getMuteRole, unmute, mute, dehoist, prompt } from '../../util';
import { languageKeys } from '../../i18n';
import { FoxxieEmbed } from '../../discord';
import { Guild, GuildChannel, GuildMember, Permissions, Message, PermissionOverwriteOptions, PermissionOverwrites, Role, TextChannel, ThreadChannel, User, UserResolvable, PermissionResolvable, NewsChannel } from 'discord.js';
import { aquireSettings, GuildEntity, guildSettings, ModerationEntity, writeSettings } from '../../database';
import { fetchT, TFunction } from '@sapphire/plugin-i18next';
import { container, UserError } from '@sapphire/framework';
import { setTimeout as sleep } from 'timers/promises';
import type { GuildMessage } from '../../types/Discord';
import { isCategoryChannel, isTextChannel, isStageChannel, isNewsChannel, isVoiceChannel } from '@sapphire/discord.js-utilities';

export const enum RoleKey {
    Muted
}

interface RoleLanguageKeyData {
    name: string;
    reason: string;
    init: string;
}

interface RoleData {
    color: number;
    hoist: boolean;
    mentionable: boolean;
    permissions: PermissionResolvable
}

const roleData = new Map<RoleKey, RoleData>([
    [
        RoleKey.Muted,
        {
            color: 0x18191c,
            hoist: false,
            mentionable: false,
            permissions: []
        }
    ]
]);

const roleLanguageKeys = new Map<RoleKey, RoleLanguageKeyData>([
    [
        RoleKey.Muted,
        {
            name: languageKeys.commands.moderation.roleSetupMuteName,
            reason: languageKeys.commands.moderation.roleSetupMuteReason,
            init: languageKeys.commands.moderation.roleSetupMuteInit
        }
    ]
]);

const permissionOverwrites = new Map<RoleKey, RolePermissionOverwriteOption>([
    [
        RoleKey.Muted,
        {
            category: {
                options: {
                    SEND_MESSAGES: false,
                    ADD_REACTIONS: false,
                    CONNECT: false
                },
                permissions: new Permissions(['SEND_MESSAGES', 'ADD_REACTIONS', 'CONNECT'])
            },
            text: {
                options: {
                    SEND_MESSAGES: false,
                    ADD_REACTIONS: false
                },
                permissions: new Permissions(['SEND_MESSAGES', 'ADD_REACTIONS'])
            },
            voice: {
                options: {
                    CONNECT: false
                },
                permissions: new Permissions(['CONNECT'])
            }
        }
    ]
]);

export class ModerationActions {

    public guild: Guild;

    constructor(guild: Guild) {
        this.guild = guild;
    }

    async setNickname(rawOptions: Partial<ModerationEntity>, sendOptions: SendOptions, nickname: string | null): Promise<ModerationEntity | null> {
        const options = ModerationActions.fillOptions(rawOptions, TypeCodes.SetNickname);
        const moderationLog = this.create(options);
        // setnickname
        if (Array.isArray(moderationLog.userId)) {
            await moderationLog.userId
                .forEach(async id => {
                    const member = this.getMember(id);
                    if (member) floatPromise(member.setNickname(nickname || member.user.username, (await this.getReason(moderationLog))));
                });
        } else {
            const member = this.getMember(moderationLog.userId as string);
            if (member) floatPromise(member.setNickname(nickname || member.user.username, (await this.getReason(moderationLog))));
        }

        await this.sendDM(moderationLog, sendOptions);
        return (await moderationLog.create())!;
    }

    async unNickname(rawOptions: Partial<ModerationEntity>, sendOptions: SendOptions): Promise<ModerationEntity | null> {
        const options = ModerationActions.fillOptions(rawOptions, TypeCodes.UnNickname);
        const moderationLog = this.create(options);
        // setnickname
        if (Array.isArray(moderationLog.userId)) {
            await moderationLog.userId
                .forEach(async id => {
                    const member = this.getMember(id);
                    if (member) floatPromise(member.setNickname(member.user.username, (await this.getReason(moderationLog))));
                });
        } else {
            const member = this.getMember(moderationLog.userId as string);
            if (member) floatPromise(member.setNickname(member.user.username, (await this.getReason(moderationLog))));
        }

        await this.sendDM(moderationLog, sendOptions);
        return moderationLog.create();
    }

    async blacklisted(rawOptions: Partial<ModerationEntity>): Promise<ModerationEntity | null> {
        const options = ModerationActions.fillOptions(rawOptions, TypeCodes.Blacklisted);
        const moderationLog = this.create(options);
        const id = moderationLog.userId;
        // we cannot ban the guild owner, so we need to leave and blacklist the guild.
        if (id === this.guild.ownerId) return null;
        // ban the user
        getModeration(this.guild).cache.add(id as string);
        await floatPromise(this.guild.members.ban(id as UserResolvable, { reason: moderationLog.reason as string, days: 1 }));
        return moderationLog.create();
    }

    async unmute(rawOptions: Partial<ModerationEntity>, sendOptions: SendOptions): Promise<ModerationEntity | null> {
        const options = ModerationActions.fillOptions(rawOptions, TypeCodes.UnMute);
        const moderationLog = this.create(options);
        // get muterole
        const muterole = await getMuteRole(this.guild);
        if (!muterole) return null;

        if (Array.isArray(moderationLog.userId)) {
            await moderationLog.userId
                .forEach(async id => {
                    const member = await this.fetchMember(id);
                    if (member) floatPromise(unmute(member, (await this.getReason(moderationLog))));
                });
        } else {
            const member = await this.fetchMember(moderationLog.userId as string);
            if (member) floatPromise(unmute(member, (await this.getReason(moderationLog))));
        }
        await this.sendDM(moderationLog, sendOptions);
        return moderationLog.create();
    }

    async mute(rawOptions: Partial<ModerationEntity>, sendOptions: SendOptions): Promise<ModerationEntity | null> {
        const options = ModerationActions.fillOptions(rawOptions, TypeCodes.Mute);
        const moderationLog = this.create(options);

        if (Array.isArray(moderationLog.userId)) {
            await moderationLog.userId
                .forEach(async id => {
                    const member = this.getMember(id);
                    if (member) floatPromise(mute(member, (await this.getReason(moderationLog))));
                });
        } else {
            const member = this.getMember(moderationLog.userId as string);
            if (member) floatPromise(mute(member, (await this.getReason(moderationLog))));
        }

        await this.sendDM(moderationLog, sendOptions);
        return moderationLog.create();
    }

    async prune(rawOptions: Partial<ModerationEntity>, { msg, messages }: { msg: Message, messages: string[] }): Promise<ModerationEntity | null> {
        const options = ModerationActions.fillOptions(rawOptions, TypeCodes.Prune);
        const moderationLog = this.create(options);
        // remove messages
        await floatPromise((msg.channel as TextChannel).bulkDelete(messages));
        return moderationLog.create();
    }

    async unlock(rawOptions: Partial<ModerationEntity>, channel: TextChannel | NewsChannel | ThreadChannel): Promise<ModerationEntity | null> {
        const options = ModerationActions.fillOptions(rawOptions, TypeCodes.UnLock);
        const moderationLog = this.create(options);
        // get permissions for channel
        const permissions = (channel as TextChannel).permissionOverwrites.cache.get(this.guild.id) as PermissionOverwrites;

        // lock channel based on permissions
        await floatPromise(permissions.edit(
            {
                SEND_MESSAGES: null
            },
            await this.getReason(moderationLog)
        ));
        return moderationLog.create();
    }

    async lock(rawOptions: Partial<ModerationEntity>, channel: TextChannel | NewsChannel | ThreadChannel): Promise<ModerationEntity | null> {
        const options = ModerationActions.fillOptions(rawOptions, TypeCodes.Lock);
        const moderationLog = this.create(options);
        // get permissions for channel
        const permissions = (channel as TextChannel).permissionOverwrites.cache.get(this.guild.id) as PermissionOverwrites;

        // lock channel based on permissions
        await permissions.edit(
            {
                SEND_MESSAGES: false
            },
            await this.getReason(moderationLog)
        );
        return moderationLog.create();
    }

    async unwarn(rawOptions: Partial<ModerationEntity>, sendOptions: SendOptions): Promise<ModerationEntity | null> {
        const options = ModerationActions.fillOptions(rawOptions, TypeCodes.UnWarn);
        const moderationLog = this.create(options);
        await this.sendDM(moderationLog, sendOptions);
        return moderationLog.create();
    }

    async warn(rawOptions: Partial<ModerationEntity>, sendOptions: SendOptions): Promise<ModerationEntity | null> {
        const options = ModerationActions.fillOptions(rawOptions, TypeCodes.Warning);
        const moderationLog = this.create(options);
        // execute warnings here
        if (Array.isArray(moderationLog.userId)) {
            await moderationLog.userId
                .forEach(async id => {
                    const warning = container.db.warnings.create({ guildId: this.guild.id, id });
                    warning.author = moderationLog.moderatorId;
                    warning.reason = moderationLog.reason;
                    warning.createdAt = new Date();
                    await warning.save();
                });
        } else {
            const warning = container.db.warnings.create({ guildId: this.guild.id, id: moderationLog.userId as string });
            warning.author = moderationLog.moderatorId;
            warning.reason = moderationLog.reason;
            warning.createdAt = new Date();
            await warning.save();
        }
        await this.sendDM(moderationLog, sendOptions);
        return moderationLog.create();
    }

    async softban(rawOptions: Partial<ModerationEntity>, days: number, sendOptions: SendOptions): Promise<ModerationEntity | null> {
        const options = ModerationActions.fillOptions(rawOptions, TypeCodes.SoftBan);
        const moderationLog = this.create(options);
        await this.sendDM(moderationLog, sendOptions);
        if (Array.isArray(moderationLog.userId)) {
            for (const id of moderationLog.userId) {
                getModeration(this.guild).cache.add(id);
                await floatPromise(this.guild.members.ban(id, { reason: await this.getReason(moderationLog), days }));
                await sleep(300);
                getModeration(this.guild).cache.add(id);
                floatPromise(this.guild.members.unban(id, await this.getReason(moderationLog)));
            }
        } else {
            getModeration(this.guild).cache.add(moderationLog.userId as string);
            await floatPromise(this.guild.members.ban(moderationLog.userId as string, { reason: await this.getReason(moderationLog), days }));
            await sleep(300);
            getModeration(this.guild).cache.add(moderationLog.userId as string);
            await floatPromise(this.guild.members.unban(moderationLog.userId as string, await this.getReason(moderationLog)));
        }
        return moderationLog.create();
    }

    async raidban(rawOptions: Partial<ModerationEntity>): Promise<ModerationEntity | null> {
        const options = ModerationActions.fillOptions(rawOptions, TypeCodes.RaidBan);
        const moderationLog = this.create(options);
        // handle banning
        const taggedReason = await this.getReason(moderationLog);
        // banning handling
        if (Array.isArray(moderationLog.userId)) {
            for (const id of moderationLog.userId) {
                getModeration(this.guild).cache.add(id);
                floatPromise(this.guild.members.ban(id, { days: 1, reason: taggedReason }));
            }
        } else {
            getModeration(this.guild).cache.add(moderationLog.userId as string);
            floatPromise(this.guild.members.ban(moderationLog.userId as string, { days: 1, reason: taggedReason }));
        }

        return moderationLog.create();
    }

    async ban(rawOptions: Partial<ModerationEntity>, days: number, sendOptions: SendOptions): Promise<ModerationEntity | null> {
        const options = ModerationActions.fillOptions(rawOptions, TypeCodes.Ban);
        const moderationLog = this.create(options);
        await this.sendDM(moderationLog, sendOptions);
        if (Array.isArray(moderationLog.userId)) {
            for (const id of moderationLog.userId) {
                getModeration(this.guild).cache.add(id);
                floatPromise(this.guild.bans.create(id, { reason: await this.getReason(moderationLog), days }));
            }
        } else {
            getModeration(this.guild).cache.add(moderationLog.userId as string);
            floatPromise(this.guild.bans.create(moderationLog.userId as string, { reason: await this.getReason(moderationLog), days }));
        }
        return moderationLog.create();
    }

    async unban(rawOptions: Partial<ModerationEntity>, sendOptions: SendOptions): Promise<ModerationEntity | null> {
        const options = ModerationActions.fillOptions(rawOptions, TypeCodes.UnBan);
        const moderationLog = this.create(options);
        // execute unbans
        if (Array.isArray(moderationLog.userId)) {
            for (const id of moderationLog.userId) {
                getModeration(this.guild).cache.add(id);
                floatPromise(this.guild.bans.remove(id, (await this.getReason(moderationLog))));
            }
        } else {
            getModeration(this.guild).cache.add(moderationLog.userId as string);
            floatPromise(this.guild.bans.remove(moderationLog.userId as string, (await this.getReason(moderationLog))));
        }
        await this.sendDM(moderationLog, sendOptions);
        return moderationLog.create();
    }

    async dehoist(rawOptions: Partial<ModerationEntity>, sendOptions: SendOptions): Promise<ModerationEntity | null> {
        const options = ModerationActions.fillOptions(rawOptions, TypeCodes.Dehoist);
        const moderationLog = this.create(options);
        // do dehoisting here
        if (Array.isArray(moderationLog.userId)) {
            await moderationLog.userId
                .forEach(async id => {
                    const member = this.getMember(id);
                    if (member) dehoist(member);
                });
        } else {
            const member = this.getMember(moderationLog.userId as string);
            if (member) dehoist(member);
        }
        await this.sendDM(moderationLog, sendOptions);
        return moderationLog.create();
    }

    async kick(rawOptions: Partial<ModerationEntity>, sendOptions: SendOptions): Promise<(string | null)[]> {
        const options = ModerationActions.fillOptions(rawOptions, TypeCodes.Kick);
        const moderationLog = this.create(options);
        const kicked = [];
        // execute kicks
        if (Array.isArray(moderationLog.userId)) {
            for (const id of moderationLog.userId) {
                const member = this.getMember(id);
                getModeration(this.guild).cache.add(id);
                const kick = member ? await resolveToNull(member.kick((await this.getReason(moderationLog)))) : null;
                if (kick) kicked.push(id);
            }
        } else {
            const member = this.getMember(moderationLog.userId as string);
            getModeration(this.guild).cache.add(moderationLog.userId as string);

            const kick = member ? await resolveToNull(member.kick((await this.getReason(moderationLog)))) : null;
            if (kick) kicked.push(moderationLog.userId);
        }
        if (kicked.length) {
            this.sendDM(moderationLog, sendOptions);
            await moderationLog.create();
        }
        return kicked;
    }

    getMember(id: string): GuildMember | undefined {
        return this.guild.members.cache.get(id);
    }

    getUser(id: string): User | undefined {
        return this.guild.client.users.cache.get(id);
    }

    getChannel(id: string): GuildChannel | ThreadChannel | undefined {
        return this.guild.channels.cache.get(id);
    }

    async getReason(entry: ModerationEntity): Promise<string> {
        const mod = await entry.fetchModerator();
        const t: TFunction = await aquireSettings(this.guild, (settings: GuildEntity) => settings.getLanguage());

        return `${entry.duration ? `[Temp]` : ''} ${mod?.tag} | ${entry.reason ?? t(languageKeys.moderation.noReason)}`;
    }

    async fetchMember(id: string): Promise<GuildMember | null> {
        return resolveToNull(this.guild.members.fetch(id)) as unknown as GuildMember | null;
    }

    async fetchUser(id: string): Promise<User | null> {
        return resolveToNull(this.guild.client.users.fetch(id)) as unknown as User | null;
    }

    async sendDM(entry: ModerationEntity, sendOptions: SendOptions = {
        send: false
    }): Promise<ModerationEntity | null> {
        if (sendOptions.send) {
            try {
                const target = await entry.fetchUser();

                if (Array.isArray(target)) {
                    for (const user of target) {
                        const embed = await this.buildEmbed(entry);
                        await floatPromise(user.send({ embeds: [embed] }));
                    }
                    return entry;
                }
                if (!target) return null;
                const embed = await this.buildEmbed(entry);
                await floatPromise(target.send({ embeds: [embed] }));
            } catch (error) {
                container.logger.error(error);
                return entry;
            }
        }
        return entry;
    }

    async buildEmbed(entry: ModerationEntity): Promise<FoxxieEmbed> {
        const moderator = await entry.fetchModerator();
        const t: TFunction = await aquireSettings(this.guild, (settings: GuildEntity) => settings.getLanguage());

        const desObj: DmDescription = { guild: this.guild.name, tag: moderator?.tag };
        if (entry.duration) desObj.duration = Date.now() - entry.duration;

        return new FoxxieEmbed(this.guild)
            .setColor(entry.color || this.guild.me?.displayColor || BrandingColors.Primary)
            .setAuthor((await entry.formatTitle()).title, this.guild.iconURL({ dynamic: true }) as string)
            .setThumbnail(entry.guild?.iconURL({ dynamic: true }) as string)
            .setDescription(`${t(languageKeys.moderation.dm[entry.title as EntryTitle], desObj)}\`\`\`${entry.reason ?? t(languageKeys.moderation.noReason)}\`\`\``);
    }

    create(options: Partial<ModerationEntity>): ModerationEntity {
        return getModeration(this.guild).create(options);
    }

    updateSchedule(user: User, taskName: string): void {
        const task = container.schedule.queue.find(t => {
            if (t.taskId !== taskName) return false;
            if (t.data.guildId !== this.guild.id) return false;

            const users = Array.isArray(t.data.userId) ? t.data.userId : [t.data.userId];
            return users.includes(user.id);
        });

        if (!task) return;

        const { time, data } = task;
        container.schedule.remove(task.id);

        data.userId = Array.isArray(data.userId)
            ? data.userId.filter(id => id !== user.id)
            : [data.userId].filter(id => id !== user.id);

        if ((data.userId as string[]).length !== 0) container.schedule.add(taskName, time, { data });
    }

    async setUpMuteRole(msg: GuildMessage): Promise<void> {
        // TODO too many roles identifier.
        if (this.guild.roles.cache.size >= 250) throw new UserError({ identifier: 'too many roles!' });
        return this.initMuteRole(msg);
    }

    async initMuteRole(msg: GuildMessage): Promise<void> {
        const t = await fetchT(msg);

        const langKeys = roleLanguageKeys.get(RoleKey.Muted)!;
        const data = roleData.get(RoleKey.Muted)!;

        const role = await this.guild.roles.create({
            ...data,
            name: t(langKeys.name),
            position: this.guild.me?.roles.highest.position || 0,
            reason: t(langKeys.reason)
        });

        await writeSettings(this.guild, (settings: GuildEntity) => settings[guildSettings.roles.muted] = role.id);

        if (await prompt(msg, t(langKeys.init, {
            role: role.name,
            channels: this.manageableChannelCount,
            permissions: this.displayPermissions(RoleKey.Muted)
        }))) {
            await this.updateCategories(role, RoleKey.Muted);
            await this.updateTextOrVoice(role, RoleKey.Muted);
        }
    }

    private displayPermissions(key: RoleKey): string[] {
        const options = permissionOverwrites.get(key)!;
        const output: string[] = [];
        for (const keyOption of Object.keys(options.category.options)) output.push(keyOption);
        return output;
    }

    async updateTextOrVoice(role: Role, key: RoleKey): Promise<void> {
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

    async updateCategories(role: Role, key: RoleKey): Promise<void> {
        const options = permissionOverwrites.get(key)!;
        const promises: Promise<unknown>[] = [];
        for (const channel of this.guild.channels.cache.values()) {
            if (isCategoryChannel(channel) && channel.manageable) {
                promises.push(this.updatePermissionsForChannel(role, channel, options.category));
            }
        }
        await Promise.all(promises);
    }

    async updatePermissionsForChannel(role: Role, channel: GuildChannel, rolePermissions: RolePermissionOverwriteOptionField): Promise<void> {
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

    private get manageableChannelCount() {
        return this.guild.channels.cache.reduce((acc, channel) => (channel.manageable ? acc + 1 : acc), 0);
    }

    static fillOptions(rawOptions: Partial<ModerationEntity>, type: number): Partial<ModerationEntity> {
        const options = { reason: null, ...rawOptions, type };
        if (isNullishOrEmpty(options.reason)) options.reason = null;
        if (isNullishOrEmpty(options.moderatorId)) options.moderatorId = process.env.CLIENT_ID;
        if (isNullishOrZero(options.duration)) options.duration = null;
        return options;
    }

}

export type SendOptions = {
    send: boolean;
}

export type DmDescription = {
    duration?: number;
    tag?: string;
    guild: string;
}

export type EntryTitle = 'ban' | 'dehoist' | 'globalBan' | 'kick' | 'mute' | 'nickname' | 'softBan' | 'tempBan' | 'tempMute' | 'tempNickname' | 'unban' | 'unmute' | 'unnickname' | 'warn';

interface RolePermissionOverwriteOption {
	category: RolePermissionOverwriteOptionField;
	text: RolePermissionOverwriteOptionField | null;
	voice: RolePermissionOverwriteOptionField | null;
}

interface RolePermissionOverwriteOptionField {
	options: PermissionOverwriteOptions;
	permissions: Permissions;
}