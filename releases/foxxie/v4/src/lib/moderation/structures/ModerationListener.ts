import { Listener, ListenerOptions, PieceContext } from '@sapphire/framework';
import type { Awaitable, PickByValue } from '@sapphire/utilities';
import type { GuildChannel, GuildMember, Message } from 'discord.js';
import type { GuildMessage } from '../../types/Discord';
import { aquireSettings, GuildEntity, guildSettings, ModerationEntity } from '../../database';
import { events, floatPromise, getModeration, isModerator, isOnServer, isSendableChannel } from '../../util';
import { ModerationBitField, ModerationHardActionFlags } from './ModerationBitfield';
import type { TFunction } from '@sapphire/plugin-i18next';
import type { SendOptions } from './ModerationActions';

export abstract class ModerationListener extends Listener {

    private readonly keyEnabled: PickByValue<GuildEntity, boolean>;
    private readonly softPunishmentPath: PickByValue<GuildEntity, number>;
    private readonly hardPunishmentPath: PickByValue<GuildEntity, number>;
    private readonly hardPunishDuration: PickByValue<GuildEntity, number | null>;
    private readonly reasonLanguageKey: string;

    public constructor(context: PieceContext, options: ModerationListener.Options) {
        super(context, { ...options, event: events.USER_MESSAGE, enabled: isOnServer() });

        this.keyEnabled = options.keyEnabled;
        this.softPunishmentPath = options.softPunishmentPath;
        this.hardPunishmentPath = options.hardPunishmentPath;
        this.hardPunishDuration = options.hardPunishDuration;
        this.reasonLanguageKey = options.reasonLanguageKey;
    }

    async run(msg: GuildMessage): Promise<void> {
        const shouldRun = await this.shouldRun(msg);
        if (!shouldRun) return;

        const preProcessed = await this.preProcess(msg);
        if (preProcessed === null) return;

        const [softPunish, language] = await aquireSettings(msg.guild, (settings: GuildEntity) => {
            return [
                settings[this.softPunishmentPath],
                settings.getLanguage()
            ];
        });

        const bitfield = new ModerationBitField(softPunish);
        this.processSoftPunishment(msg, language, bitfield, preProcessed);

        await this.processHardPunishment(msg, language);
    }

    async shouldRun(msg: Message): Promise<boolean> {
        const [enabled, exemptChannels] = await aquireSettings(msg.guild, (settings: GuildEntity) => {
            return [
                settings[this.keyEnabled],
                settings[guildSettings.channels.ignoreAll]
            ];
        });
        return enabled && !exemptChannels.includes(msg.channel.id) && isModerator(msg.member as GuildMember);
    }

    protected abstract preProcess(message: GuildMessage): Promise<unknown>;
    protected abstract onDelete(message: GuildMessage, language: TFunction, value: unknown): Awaitable<unknown>;
    protected abstract onAlert(message: GuildMessage, language: TFunction, value: unknown): Awaitable<unknown>;

    processSoftPunishment(msg: GuildMessage, language: TFunction, bitField: ModerationBitField, checked: unknown): void {
        if (bitField.has(ModerationBitField.FLAGS.DELETE)) {
            floatPromise(this.onDelete(msg, language, checked) as Promise<unknown>);
        }

        if (bitField.has(ModerationBitField.FLAGS.ALERT) && isSendableChannel(msg.channel as GuildChannel)) {
            floatPromise(this.onAlert(msg, language, checked) as Promise<unknown>);
        }
    }

    async processHardPunishment(message: GuildMessage, language: TFunction): Promise<void> {
        const [action, duration] = await aquireSettings(message.guild, (settings: GuildEntity) => [settings[this.hardPunishmentPath], settings[this.hardPunishDuration]]);
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

    async onWarning(msg: GuildMessage, t: TFunction): Promise<ModerationEntity | null> {
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

    async onKick(msg: GuildMessage, t: TFunction): Promise<(string | null)[] | null> {
        return getModeration(msg.guild).actions.kick(
            {
                userId: msg.author.id,
                moderatorId: process.env.CLIENT_ID,
                channelId: msg.channel.id,
                reason: t(this.reasonLanguageKey)
            },
            await this.getDmOptions(msg)
        );
    }

    async onMute(msg: GuildMessage, t: TFunction, duration: number): Promise<ModerationEntity | null> {
        return getModeration(msg.guild).actions.mute(
            {
                userId: msg.author.id,
                moderatorId: process.env.CLIENT_ID,
                channelId: msg.channel.id,
                reason: t(this.reasonLanguageKey),
                duration
            },
            await this.getDmOptions(msg)
        );
    }

    async onSoftBan(msg: GuildMessage, t: TFunction): Promise<ModerationEntity | null> {
        return getModeration(msg.guild).actions.softban(
            {
                userId: msg.author.id,
                moderatorId: process.env.CLIENT_ID,
                channelId: msg.channel.id,
                reason: t(this.reasonLanguageKey)
            },
            1,
            await this.getDmOptions(msg)
        );
    }

    async onBan(msg: GuildMessage, t: TFunction, duration: number): Promise<ModerationEntity | null> {
        return getModeration(msg.guild).actions.ban(
            {
                userId: msg.author.id,
                moderatorId: process.env.CLIENT_ID,
                channelId: msg.channel.id,
                reason: t(this.reasonLanguageKey),
                duration
            },
            1,
            await this.getDmOptions(msg)
        );
    }

    async getDmOptions(msg: GuildMessage): Promise<SendOptions> {
        const dm = await aquireSettings(msg.guild, guildSettings.moderation.dm);
        return {
            send: Boolean(dm)
        };
    }

}

export namespace ModerationListener {
    export interface Options extends ListenerOptions {
        keyEnabled: PickByValue<GuildEntity, boolean>;
        softPunishmentPath: PickByValue<GuildEntity, number>;
        hardPunishmentPath: PickByValue<GuildEntity, number>;
        hardPunishDuration: PickByValue<GuildEntity, number | null>;
        reasonLanguageKey: string;
    }
}