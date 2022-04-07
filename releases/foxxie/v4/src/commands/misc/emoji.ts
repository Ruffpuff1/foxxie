import { toTitleCase } from '@ruffpuff/utilities';
import { ApplyOptions } from '@sapphire/decorators';
import { FoxxieCommand } from 'lib/structures';
import { FoxxieEmbed } from 'lib/discord';
import { languageKeys } from 'lib/i18n';
import { Emoji, Message, Permissions } from 'discord.js';
import type { GuildMessage } from 'lib/types/Discord';
import { Args } from '@sapphire/framework';
import { send } from '@sapphire/plugin-editable-commands';

const EMOJI_REGEX = /^<(a)?:(\w{2,32}):(\d{17,21})>$/;

@ApplyOptions<FoxxieCommand.Options>({
    aliases: ['emote'],
    description: languageKeys.commands.info.emojiDescription,
    detailedDescription: languageKeys.commands.info.emojiExtendedUsage,
    requiredClientPermissions: Permissions.FLAGS.EMBED_LINKS
})
export class UserCommand extends FoxxieCommand {

    async messageRun(msg: GuildMessage, args: FoxxieCommand.Args): Promise<Message> {
        const emoji = await args.pick(UserCommand.emoji);

        const titles = args.t(languageKeys.commands.info.emojiTitles);

        const linkArray = [`[PNG](${emoji.url.substring(0, emoji.url.length - 4)}.png)`, `[JPEG](${emoji.url.substring(0, emoji.url.length - 4)}.jpeg)`];
        if (emoji.animated) linkArray.push(`[GIF](${emoji.url})`);

        const embed = new FoxxieEmbed(msg)
            .setThumbnail(emoji.url)
            .setColor(await this.container.db.fetchColor(msg))
            .setAuthor(this.formatAuthor(emoji), emoji.url)
            .setDescription(args.t(languageKeys.commands.info.channelCreated, { name: emoji.name, date: emoji.createdAt }))
            .addField(titles.name, emoji.name, true)
            .addField(titles.animated, toTitleCase(args.t(languageKeys.globals[emoji.animated ? 'yes' : 'no'])), true)
            .addField(titles.links, linkArray.join(' | '), true);

        return send(msg, { embeds: [embed] });
    }

    private formatAuthor(emoji: Emoji): string {
        return `${emoji.name} [${emoji.id}]`;
    }

    static emoji = Args.make<Emoji>((parameter, { argument, args }) => {
        if (!EMOJI_REGEX.test(parameter)) return Args.error({
            argument,
            parameter,
            identifier: languageKeys.arguments.invalidEmoji
        });

        const [, , , emojiId] = EMOJI_REGEX.exec(parameter)!;
        const emoji = args.command.container.client.emojis.cache.get(emojiId);

        if (!emoji) return Args.error({
            argument,
            parameter,
            identifier: languageKeys.arguments.invalidEmoji
        });

        return Args.ok(emoji);
    });

}