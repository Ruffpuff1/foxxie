import { GuildEntity, GuildSettings } from '#lib/database';
import { Events, GuildMessage } from '#lib/types';
import type { CustomGet, TFunction } from '@foxxie/i18n';
import { getModeration, isModerator, isSendableChannel } from '#utils/Discord';
import type { SendOptions } from '#utils/moderation';
import { floatPromise } from '#utils/util';
import { isDev, seconds } from '@ruffpuff/utilities';
import { Listener, ListenerOptions, PieceContext } from '@sapphire/framework';
import type { Awaitable, PickByValue } from '@sapphire/utilities';
import { ModerationBitField, ModerationHardActionFlags, ModerationFlagBits } from './ModerationBitfield';

export abstract class ModerationListener extends Listener {
    private readonly keyEnabled: PickByValue<GuildEntity, boolean>;

    private readonly softPunishmentPath: PickByValue<GuildEntity, number>;

    private readonly hardPunishmentPath: PickByValue<GuildEntity, number>;

    private readonly hardPunishDuration: PickByValue<GuildEntity, number | null>;

    private readonly reasonLanguageKey: CustomGet<string, string>;

    public constructor(context: PieceContext, options: ModerationListener.Options) {
        super(context, { ...options, event: Events.UserMessage, enabled: !isDev() });

        this.keyEnabled = options.keyEnabled;
        this.softPunishmentPath = options.softPunishmentPath;
        this.hardPunishmentPath = options.hardPunishmentPath;
        this.hardPunishDuration = options.hardPunishDuration;
        this.reasonLanguageKey = options.reasonLanguageKey;
    }

    public async run(msg: GuildMessage): Promise<void> {
        const shouldRun = await this.shouldRun(msg);
        if (!shouldRun) return;

        const preProcessed = await this.preProcess(msg);
        if (preProcessed === null) return;

        const [softPunish, language] = await this.container.db.guilds.acquire(msg.guild.id, settings => {
            return [settings[this.softPunishmentPath], settings.getLanguage()];
        });

        const bitfield = new ModerationBitField(softPunish);
        await this.processSoftPunishment(msg, language, bitfield, preProcessed);

        await this.processHardPunishment(msg, language);
    }

    protected abstract preProcess(message: GuildMessage): Promise<unknown>;
    protected abstract onDelete(message: GuildMessage, language: TFunction, value: unknown): Awaitable<unknown>;
    protected abstract onAlert(message: GuildMessage, language: TFunction, value: unknown): Awaitable<unknown>;
    protected abstract onLog(message: GuildMessage, language: TFunction, value: unknown): Awaitable<unknown>;

    private async processSoftPunishment(msg: GuildMessage, language: TFunction, bitField: ModerationBitField, checked: unknown): Promise<void> {
        if (bitField.has(ModerationFlagBits.Delete)) {
            await floatPromise(this.onDelete(msg, language, checked) as Promise<unknown>);
        }

        if (bitField.has(ModerationFlagBits.Alert) && isSendableChannel(msg.channel)) {
            await floatPromise(this.onAlert(msg, language, checked) as Promise<unknown>);
        }

        if (bitField.has(ModerationFlagBits.Log)) {
            await floatPromise(this.onLog(msg, language, checked) as Promise<unknown>);
        }
    }

    private async processHardPunishment(message: GuildMessage, language: TFunction): Promise<void> {
        const [action, duration] = await this.container.db.guilds.acquire(message.guild.id, settings => [
            settings[this.hardPunishmentPath],
            settings[this.hardPunishDuration]
        ]);
        switch (action) {
            case ModerationHardActionFlags.Warning:
                await this.onWarning(message, language);
                break;
            case ModerationHardActionFlags.Kick:
                await this.onKick(message, language);
                break;
            case ModerationHardActionFlags.Mute:
                await this.onMute(message, language, duration);
                break;
            case ModerationHardActionFlags.SoftBan:
                await this.onSoftBan(message, language);
                break;
            case ModerationHardActionFlags.Ban:
                await this.onBan(message, language, duration);
                break;
        }
    }

    private async onWarning(msg: GuildMessage, t: TFunction) {
        return getModeration(msg.guild).actions.warn(
            {
                userId: msg.author.id,
                moderatorId: process.env.CLIENT_ID,
                channelId: msg.channel.id,
                reason: t(this.reasonLanguageKey)
            },
            await this.getDmOptions(msg)
        );
    }

    private async onKick(msg: GuildMessage, t: TFunction) {
        await this.container.redis!.pinsertex(`guild:${msg.guild.id}:kick:${msg.member.id}`, seconds(20), '');
        return getModeration(msg.guild).actions.kick(
            {
                userId: msg.member.id,
                moderatorId: process.env.CLIENT_ID,
                channelId: msg.channel.id,
                reason: t(this.reasonLanguageKey)
            },
            await this.getDmOptions(msg)
        );
    }

    private async onSoftBan(msg: GuildMessage, t: TFunction) {
        await this.container.redis!.pinsertex(`guild:${msg.guild.id}:ban:${msg.member.id}`, seconds(20), '');
        await this.container.redis!.pinsertex(`guild:${msg.guild.id}:unban:${msg.member.id}`, seconds(20), '');
        return getModeration(msg.guild).actions.softban(
            {
                userId: msg.member.id,
                moderatorId: process.env.CLIENT_ID,
                channelId: msg.channel.id,
                reason: t(this.reasonLanguageKey)
            },
            1,
            await this.getDmOptions(msg)
        );
    }

    private async onBan(msg: GuildMessage, t: TFunction, duration: number | null) {
        await this.container.redis!.pinsertex(`guild:${msg.guild.id}:ban:${msg.member.id}`, seconds(20), '');
        return getModeration(msg.guild).actions.ban(
            {
                userId: msg.member.id,
                moderatorId: process.env.CLIENT_ID,
                channelId: msg.channel.id,
                reason: t(this.reasonLanguageKey),
                duration
            },
            1,
            await this.getDmOptions(msg)
        );
    }

    private async onMute(msg: GuildMessage, t: TFunction, duration: number | null) {
        const roleId = await this.container.db.guilds.acquire(msg.guild.id, GuildSettings.Roles.Muted);
        if (!roleId) return;

        return getModeration(msg.guild).actions.mute(
            {
                userId: msg.member.id,
                moderatorId: process.env.CLIENT_ID,
                channelId: msg.channel.id,
                reason: t(this.reasonLanguageKey),
                duration,
                extraData: { roleId }
            },
            await this.getDmOptions(msg)
        );
    }

    private async shouldRun(msg: GuildMessage): Promise<boolean> {
        const [enabled, exemptChannels] = await this.container.db.guilds.acquire(msg.guild.id, settings => {
            return [settings[this.keyEnabled], settings.moderationChannelsIgnoreAll];
        });
        return enabled && !exemptChannels.includes(msg.channel.id) && !isModerator(msg.member);
    }

    private async getDmOptions(msg: GuildMessage): Promise<SendOptions> {
        const send = await this.container.db.guilds.acquire(msg.guild.id, GuildSettings.Moderation.Dm);
        return { send };
    }
}

// eslint-disable-next-line no-redeclare
export namespace ModerationListener {
    export interface Options extends ListenerOptions {
        keyEnabled: PickByValue<GuildEntity, boolean>;
        softPunishmentPath: PickByValue<GuildEntity, number>;
        hardPunishmentPath: PickByValue<GuildEntity, number>;
        hardPunishDuration: PickByValue<GuildEntity, number | null>;
        reasonLanguageKey: CustomGet<string, string>;
    }
}
