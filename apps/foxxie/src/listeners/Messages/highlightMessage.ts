import { GuildSettings, Highlight, acquireSettings } from '#lib/database';
import { LanguageKeys } from '#lib/i18n';
import { HighlightReturnData, HighlightTypeEnum, IncomingType } from '#lib/structures/workers/types';
import { EventArgs, FoxxieEvents, GuildMessage } from '#lib/types';
import { maybeMe } from '#utils/Discord';
import { floatPromise, resolveClientColor, resolveEmbedField } from '#utils/util';
import { TFunction } from '@foxxie/i18n';
import { isDev, resolveToNull } from '@ruffpuff/utilities';
import { ApplyOptions } from '@sapphire/decorators';
import { Listener, ListenerOptions } from '@sapphire/framework';
import { PermissionFlagsBits } from 'discord-api-types/v10';
import { EmbedBuilder, Message, escapeMarkdown } from 'discord.js';

@ApplyOptions<ListenerOptions>({
    event: FoxxieEvents.UserMessage,
    enabled: !isDev()
})
export class UserListener extends Listener<FoxxieEvents.UserMessage> {
    public async run(...[msg]: EventArgs<FoxxieEvents.UserMessage>): Promise<void> {
        if (!msg.content.length) return;
        const [highlights, t] = await acquireSettings(msg.guild, settings => [
            settings[GuildSettings.Highlights],
            settings.getLanguage()
        ]);
        if (!highlights.length) return;

        const [wordResults, regexResults] = await Promise.all([
            this.send(HighlightTypeEnum.Word, msg, highlights),
            this.send(HighlightTypeEnum.Regex, msg, highlights)
        ]);

        if (!wordResults.results.length && !regexResults.results.length) return;

        const sent = new Set();
        const actions: Promise<void>[] = [];

        const previousChannelMessages = [];
        if (msg.channel.permissionsFor(maybeMe(msg.guild)!).has(PermissionFlagsBits.ReadMessageHistory)) {
            previousChannelMessages.push(...(await this.fetchMessages(msg, t)));
        }

        for (const match of wordResults.results) {
            if (sent.has(match.userId)) continue;

            sent.add(match.userId);
            actions.push(this.handle(msg, previousChannelMessages.slice(), match, t));
        }

        for (const match of regexResults.results) {
            if (sent.has(match.userId)) continue;

            sent.add(match.userId);
            actions.push(this.handle(msg, previousChannelMessages.slice(), match, t));
        }

        await Promise.allSettled(actions);
    }

    private async handle(msg: GuildMessage, previous: string[][], match: HighlightReturnData, t: TFunction) {
        if (!msg.guild) throw new Error('missing guild');

        const member = await resolveToNull(msg.guild.members.fetch(match.userId));
        if (!member) return;

        if (!msg.channel.permissionsFor(member).has(PermissionFlagsBits.ViewChannel)) return;
        if (msg.mentions.users.has(match.userId)) return;

        const embed = this.makeEmbed(previous, msg, t, match);
        const content = this.makeContent(msg, match, t);

        await floatPromise(member.send({ embeds: [embed], content }));
    }

    private makeContent(msg: GuildMessage, match: HighlightReturnData, t: TFunction): string {
        return t(LanguageKeys.Listeners.Events.HighlightContentWord, {
            word: match.trigger,
            author: msg.author.username,
            channel: msg.channel.toString()
        });
    }

    private makeEmbed(previous: string[][], msg: GuildMessage, t: TFunction, match: HighlightReturnData) {
        const embed = new EmbedBuilder()
            .setColor(resolveClientColor(msg.guild))
            .setAuthor({
                name: `${msg.author.username} [${msg.author.id}]`,
                iconURL: msg.member?.displayAvatarURL()
            })
            .setDescription(`**[${t(LanguageKeys.Listeners.Events.HighlightJumpTo)}](${msg.url})**`)
            .setTimestamp();

        if (previous.length) {
            for (const [, time, text] of previous) {
                embed.addFields(resolveEmbedField(time, text));
            }
        }

        return embed.addFields(resolveEmbedField(this.formatMessageTimestamp(msg, t), this.formatMessage(msg, t, match)));
    }

    private async fetchMessages(msg: GuildMessage, t: TFunction): Promise<string[][]> {
        const data: string[][] = [];
        const messages = await msg.channel.messages.fetch({ limit: 5, before: msg.id });

        for (const message of messages.sort((a, b) => a.createdTimestamp - b.createdTimestamp).values()) {
            data.push([message.author.id, this.formatMessageTimestamp(message, t), this.formatMessage(message, t)]);
        }

        return data;
    }

    private formatMessageTimestamp(msg: Message, t: TFunction): string {
        return `**[${t(LanguageKeys.Globals.Time, { value: msg.createdAt })}] ${escapeMarkdown(msg.author.username)}**:`;
    }

    private formatMessage(message: Message, t: TFunction, match?: HighlightReturnData): string {
        const { url } = message;
        return message.content.length === 0
            ? message.attachments.size === 0
                ? t(LanguageKeys.Listeners.Events.HighlightEmbed, { url })
                : t(LanguageKeys.Listeners.Events.HighlightAttachment, { url })
            : message.content.length >= 600
            ? t(LanguageKeys.Listeners.Events.HighlightTooLong, { url })
            : this.parseBold(match ? match.content : message.content);
    }

    private parseBold(content: string): string {
        const boldRegex = /\*\*/g;
        return content.replace(boldRegex, '');
    }

    private send<T extends HighlightTypeEnum>(type: T, msg: GuildMessage, highlights: Highlight<T>[]) {
        return this.container.workers.send({
            highlightType: type,
            type: IncomingType.RunHighlightPayload,
            content: msg.content,
            authorId: msg.author.id,
            highlights
        });
    }
}
