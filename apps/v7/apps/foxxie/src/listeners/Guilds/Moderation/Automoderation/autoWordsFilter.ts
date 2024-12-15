import { IncomingType, OutgoingWordFilterPayload, OutputType } from '#lib/Container/Workers';
import type { Word } from '#lib/Database';
import { GuildSettings } from '#lib/Database';
import { LanguageKeys } from '#lib/I18n';
import { ModerationBitField, ModerationFlagBits, ModerationHardActionFlags } from '#lib/Structures';
import { EventArgs, FoxxieEvents, GuildMessage } from '#lib/Types';
import { deleteMessage, isModerator, sendTemporaryMessage } from '#utils/Discord';
import { Colors } from '#utils/constants';
import type { SendOptions } from '#utils/moderation';
import { floatPromise } from '#utils/util';
import { isDev, seconds } from '@ruffpuff/utilities';
import { ApplyOptions } from '@sapphire/decorators';
import { Listener, ListenerOptions } from '@sapphire/framework';
import { EmbedBuilder, Message } from 'discord.js';
import { TFunction } from 'i18next';

@ApplyOptions<ListenerOptions>({
    event: FoxxieEvents.UserMessage,
    enabled: !isDev()
})
export class UserListener extends Listener<FoxxieEvents.UserMessage> {
    public async run(...[msg]: EventArgs<FoxxieEvents.UserMessage>): Promise<void> {
        const shouldRun = this.shouldRun(msg);
        if (!shouldRun) return;

        const [regex, words, t] = await this.container.db.guilds.acquire(msg.guild.id, settings => [
            settings.wordFilterRegExp,
            settings[GuildSettings.Moderation.Words],
            settings.getLanguage()
        ]);

        if (regex === null) return;

        const processed = await this.container.workers.send(
            { content: msg.content, regex, type: IncomingType.RunWordFilter },
            500
        );
        if (processed.type !== OutputType.FilterMatch) return;

        const sanitized = this.sanitize(processed.match!);
        const found = words.find(word => word.word.toLowerCase() === sanitized);
        if (!found) return;

        const bitfield = new ModerationBitField(found.softPunish);

        await Promise.all([this.processSoftPunishment(msg, t, bitfield, processed), this.processHardPunishment(msg, t, found)]);
    }

    private async processHardPunishment(msg: GuildMessage, t: TFunction, found: Word) {
        const [action, duration] = [found.hardPunish, found.hardPunishDuration];
        switch (action) {
            case ModerationHardActionFlags.Warning:
                await this.onWarning(msg, t);
                break;
            case ModerationHardActionFlags.Kick:
                await this.onKick(msg, t);
                break;
            case ModerationHardActionFlags.Mute:
                await this.onMute(msg, t, duration);
                break;
            case ModerationHardActionFlags.SoftBan:
                await this.onSoftBan(msg, t);
                break;
            case ModerationHardActionFlags.Ban:
                await this.onBan(msg, t, duration);
                break;
        }
    }

    private async onWarning(msg: GuildMessage, t: TFunction) {
        return this.container.utilities.guild(msg.guild).moderation.actions.warn(
            {
                userId: msg.author.id,
                moderatorId: process.env.CLIENT_ID,
                channelId: msg.channel.id,
                guildId: msg.guild.id,
                reason: t(LanguageKeys.Automod.WordReason)
            },
            await this.getDmOptions(msg)
        );
    }

    private async onKick(msg: GuildMessage, t: TFunction) {
        await this.container.redis?.pinsertex(`guild:${msg.guild.id}:kick:${msg.author.id}`, seconds(20), '');
        return this.container.utilities.guild(msg.guild).moderation.actions.kick(
            {
                userId: msg.author.id,
                moderatorId: process.env.CLIENT_ID,
                channelId: msg.channel.id,
                guildId: msg.guild.id,
                reason: t(LanguageKeys.Automod.WordReason)
            },
            await this.getDmOptions(msg)
        );
    }

    private async onSoftBan(msg: GuildMessage, t: TFunction) {
        await this.container.redis?.pinsertex(`guild:${msg.guild.id}:ban:${msg.author.id}`, seconds(20), '');
        await this.container.redis?.pinsertex(`guild:${msg.guild.id}:unban:${msg.author.id}`, seconds(20), '');
        return this.container.utilities.guild(msg.guild).moderation.actions.softban(
            {
                userId: msg.author.id,
                moderatorId: process.env.CLIENT_ID,
                channelId: msg.channel.id,
                guildId: msg.guild.id,
                reason: t(LanguageKeys.Automod.WordReason)
            },
            1,
            await this.getDmOptions(msg)
        );
    }

    private async onBan(msg: GuildMessage, t: TFunction, duration: number | null) {
        await this.container.redis?.pinsertex(`guild:${msg.guild.id}:ban:${msg.author.id}`, seconds(20), '');
        return this.container.utilities.guild(msg.guild).moderation.actions.ban(
            {
                userId: msg.author.id,
                moderatorId: process.env.CLIENT_ID,
                channelId: msg.channel.id,
                guildId: msg.guild.id,
                reason: t(LanguageKeys.Automod.WordReason),
                duration
            },
            1,
            await this.getDmOptions(msg)
        );
    }

    private async onMute(msg: GuildMessage, t: TFunction, duration: number | null) {
        await this.container.redis!.pinsertex(`guild:${msg.guild.id}:mute:${msg.member.id}`, seconds(20), '');
        const roleId = await this.container.db.guilds.acquire(msg.guild.id, s => s.roles[GuildSettings.Roles.Muted]);
        if (!roleId) return;

        return this.container.utilities.guild(msg.guild).moderation.actions.mute(
            {
                userId: msg.author.id,
                moderatorId: process.env.CLIENT_ID,
                channelId: msg.channel.id,
                guildId: msg.guild.id,
                reason: t(LanguageKeys.Automod.WordReason),
                duration
            },
            await this.getDmOptions(msg)
        );
    }

    private async processSoftPunishment(
        msg: GuildMessage,
        t: TFunction,
        bitfield: ModerationBitField,
        processed: OutgoingWordFilterPayload
    ) {
        if (bitfield.has(ModerationFlagBits.Delete)) {
            await floatPromise(this.onDelete(msg));
        }

        if (bitfield.has(ModerationFlagBits.Log)) {
            this.onLog(msg, t, processed);
        }

        if (bitfield.has(ModerationFlagBits.Alert) && this.container.utilities.channel(msg.channel).isSendable) {
            await floatPromise(this.onAlert(msg, t));
        }
    }

    private onDelete(msg: GuildMessage): Promise<Message | void | unknown> {
        return deleteMessage(msg);
    }

    private onAlert(msg: GuildMessage, t: TFunction): Promise<Message> {
        return sendTemporaryMessage(msg, t(LanguageKeys.Automod.WordAlert, { author: msg.author.toString() }));
    }

    private onLog(msg: GuildMessage, t: TFunction, processed: OutgoingWordFilterPayload) {
        this.container.client.emit(FoxxieEvents.GuildMessageLog, msg.guild, GuildSettings.Channels.Logs.FilterWords, () =>
            new EmbedBuilder()
                .setColor(Colors.Red)
                .setAuthor({
                    name: t(LanguageKeys.Guilds.Logs.ActionFilterWords),
                    iconURL: msg.member.displayAvatarURL()
                })
                .setDescription(
                    [
                        t(LanguageKeys.Guilds.Logs.ArgsUser, { user: msg.author }),
                        t(LanguageKeys.Guilds.Logs.ArgsChannel, { channel: msg.channel }),
                        t(LanguageKeys.Guilds.Logs.ArgsMessage, { content: processed.highlighted })
                    ].join('\n')
                )
                .setTimestamp()
        );
    }

    private shouldRun(msg: GuildMessage) {
        return !isModerator(msg.member);
    }

    private async getDmOptions(msg: GuildMessage): Promise<SendOptions> {
        const shouldSend = await this.container.db.guilds.acquire(msg.guild.id, GuildSettings.Moderation.Dm);
        return { send: shouldSend };
    }

    private sanitize(str: string) {
        return str
            .replace(/(@|4)/g, 'a')
            .replace(/8/g, 'b')
            .replace(/3/g, 'e')
            .replace(/6/g, 'g')
            .replace(/1/g, 'i')
            .replace(/7/g, 'l')
            .replace(/0/g, 'o')
            .replace(/5/g, 's')
            .replace(/7/g, 't')
            .replace(/\W/g, '')
            .toLowerCase();
    }
}
