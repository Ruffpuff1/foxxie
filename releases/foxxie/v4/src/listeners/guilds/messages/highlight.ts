import { Listener, ListenerOptions } from '@sapphire/framework';
import { events, floatPromise, isOnServer, resolveToNull } from '../../../lib/util';
import { ApplyOptions } from '@sapphire/decorators';
import type { GuildMessage } from '../../../lib/types/Discord';
import { aquireSettings, GuildEntity, guildSettings, Highlight } from '../../../lib/database';
import { regExpEsc } from '@ruffpuff/utilities';
import { GuildMember, Message, Permissions, Util } from 'discord.js';
import { Timestamp } from '@sapphire/time-utilities';
import { languageKeys } from '../../../lib/i18n';
import type { TFunction } from '@sapphire/plugin-i18next';
import { FoxxieEmbed } from '../../../lib/discord';

function filterByMatch({ content }: GuildMessage, highlights: Highlight[]) {
    const matched: Highlight[] = [];

    for (const highlight of highlights) {
        if (highlight.isRegex && (highlight.word as RegExp).test(content)) {
            matched.push(highlight);
        } else if (!highlight.isRegex) {
            const testReg = new RegExp(`\\b${regExpEsc(highlight.word as string)}\\b`);

            if (testReg.test(content)) matched.push(highlight);
        }
    }


    return matched;
}

@ApplyOptions<ListenerOptions>({
    event: events.USER_MESSAGE,
    enabled: isOnServer()
})
export default class extends Listener {

    public timestamp: Timestamp = new Timestamp('HH:mm');

    public async run(msg: GuildMessage): Promise<void> {
        if (msg.content.length === 0) return;
        const [highlights, t] = await aquireSettings(msg.guild, (settings: GuildEntity) => [settings[guildSettings.highlights], settings.getLanguage()]);
        if (!highlights.length) return;

        const sent = new Set();
        const actions = [];

        const matches = filterByMatch(msg, highlights);
        if (!matches.length) return;

        const previousChannelMessages = [];
        if (msg.channel.permissionsFor(msg.guild.me as GuildMember).has(Permissions.FLAGS.READ_MESSAGE_HISTORY)) {
            previousChannelMessages.push(...(await this.fetchMessages(msg, t)));
        }

        for (const word of matches) {
            if (sent.has(word.userId)) continue;
            if (msg.author.id === word.userId) continue;

            sent.add(word.userId);
            actions.push(this.handle(msg, previousChannelMessages.slice(), word, t));
        }

        await Promise.allSettled(actions);
    }

    async handle(msg: GuildMessage, previous: string[][], { userId, word }: Highlight, t: TFunction): Promise<void> {
        if (!msg.guild) throw new Error('no guild');

        const member = await resolveToNull(msg.guild.members.fetch(userId)) as GuildMember | null;
        if (!member) return;

        if (!msg.channel.permissionsFor(member).has(Permissions.FLAGS.VIEW_CHANNEL)) return;

        if (msg.mentions.users.has(userId)) return;

        const embed = await this.makeEmbed(previous, msg, word, t);
        const content = this.makeContent(msg, word, t);

        await floatPromise(member.send({ embeds: [embed], content }));
    }

    private makeContent(msg: GuildMessage, word: string | RegExp, t: TFunction): string {
        if (word instanceof RegExp) return t(languageKeys.listeners.highlightContentRegex, { regex: word.toString(), author: msg.author.tag, channel: msg.channel.toString() });
        else return t(languageKeys.listeners.highlightContentWord, { word, author: msg.author.tag, channel: msg.channel.toString() });
    }

    private async makeEmbed(previous: string[][], msg: Message, word: string | RegExp, t: TFunction): Promise<FoxxieEmbed> {
        const embed = new FoxxieEmbed(msg)
            .setColor(await this.container.db.fetchColor(msg))
            .setAuthor(`${msg.author.tag} [${msg.author.id}]`, msg.member?.displayAvatarURL({ dynamic: true }))
            .setDescription(`**[${t(languageKeys.listeners.highlightClickToJump)}](${msg.url})**`)
            .setTimestamp();

        if (previous.length) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            for (const [_id, time, text] of previous) {
                embed.addField(time, text);
            }
        }

        return embed.addField(this.formatMessageTimestamp(msg), this.formatMessage(msg, t, word));
    }

    async fetchMessages(msg: GuildMessage, t: TFunction): Promise<string[][]> {
        const data: string[][] = [];
        const messages = await msg.channel.messages.fetch({ limit: 5, before: msg.id });

        for (const message of messages.sort((a, b) => a.createdTimestamp - b.createdTimestamp).values()) {
            data.push([
                message.author.id,
                this.formatMessageTimestamp(message),
                this.formatMessage(message, t)
            ]);
        }

        return data;
    }

    formatMessageTimestamp(msg: Message): string {
        return `**[${this.timestamp.displayUTC(msg.createdTimestamp)} UTC] ${Util.escapeMarkdown(msg.author.tag)}**:`;
    }

    formatMessage(message: Message, t: TFunction, text?: string | RegExp): string {
        const { url } = message;
        return message.content.length === 0
            ? message.attachments.size === 0
                ? t(languageKeys.listeners.highlightEmbed, { url })
                : t(languageKeys.listeners.highlightAttachment, { url })
            : message.content.length >= 600
                ? t(languageKeys.listeners.highlightAttachment, { url })
                : this.parseBold(message.content, text as string | RegExp);
    }

    parseBold(content: string, word: string | RegExp): string {
        const boldRegex = /\*\*/g;
        if (!word) return content.replace(boldRegex, '');

        if (word instanceof RegExp) {
            return content.replace(boldRegex, '').replace(word, `**${word.exec(content)?.[0]}**`);
        } else {
            const reg = new RegExp(`\\b${regExpEsc(word)}\\b`, 'ig');
            return content.replace(boldRegex, '').replace(reg, `**${reg.exec(content)?.[0]}**`);
        }
    }

}