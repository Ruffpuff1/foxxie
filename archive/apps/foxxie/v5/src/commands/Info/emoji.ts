import { ApplyOptions } from '@sapphire/decorators';
import { FoxxieCommand } from '#lib/structures';
import { Emoji, Message, MessageEmbed, MessageOptions } from 'discord.js';
import type { GuildMessage, EmojiObject } from '#lib/types';
import { send } from '@sapphire/plugin-editable-commands';
import { PermissionFlagsBits } from 'discord-api-types/v9';
import type { TFunction } from '@sapphire/plugin-i18next';
import { fetch } from '@foxxie/fetch';
import { LanguageKeys } from '#lib/i18n';
import { toTitleCase, twemoji } from '@ruffpuff/utilities';

@ApplyOptions<FoxxieCommand.Options>({
    aliases: ['emote'],
    description: LanguageKeys.Commands.Info.EmojiDescription,
    detailedDescription: LanguageKeys.Commands.Info.EmojiDetailedDescription,
    requiredClientPermissions: PermissionFlagsBits.EmbedLinks
})
export class UserCommand extends FoxxieCommand {
    public async messageRun(msg: GuildMessage, args: FoxxieCommand.Args): Promise<Message> {
        const emoji = await args.pick('emoji');
        const options = await this.buildOptions(emoji, args.t, args.color);

        return send(msg, options);
    }

    private async buildOptions(emoji: EmojiObject, t: TFunction, color: number) {
        if (!emoji.id) return this.makeTweEmojiOptions(emoji, t);

        // @ts-expect-error emoji is a private class.
        const emji: Emoji = new Emoji(this.client, {
            animated: emoji.animated,
            name: emoji.name,
            id: emoji.id
        });
        const titles = t(LanguageKeys.Commands.Info.EmojiTitles);

        const linkArray = [`[PNG](${emji.url!.substring(0, emji.url!.length - 4)}.png)`, `[JPEG](${emji.url!.substring(0, emji.url!.length - 4)}.jpeg)`];
        if (emji.animated) linkArray.push(`[GIF](${emji.url})`);

        const embed = new MessageEmbed()
            .setThumbnail(emji.url!)
            .setColor(color)
            .setDescription(
                t(LanguageKeys.Commands.Info.EmojiCreated, {
                    name: emji.name,
                    date: emji.createdAt
                })
            )
            .setAuthor({
                name: `${emji.name} [${emji.id}]`,
                iconURL: emji.url!
            })
            .addField(titles.name, emji.name!, true)
            .addField(titles.animated, emoji.animated ? toTitleCase(t(LanguageKeys.Globals.Yes)) : toTitleCase(t(LanguageKeys.Globals.No)), true)
            .addField(titles.links, linkArray.join(' | '), true);

        return { embeds: [embed] };
    }

    private async makeTweEmojiOptions(emoji: EmojiObject, t: TFunction): Promise<MessageOptions> {
        const emojiCode = twemoji(emoji.name!);
        const name = `${emojiCode}.png`;

        const attachment = await fetch(`https://twemoji.maxcdn.com/v/latest/72x72/${name}`).raw();
        const content = t(LanguageKeys.Commands.Info.EmojiTwemoji, {
            name: emoji.name!,
            code: emojiCode
        });

        return { content, files: [{ attachment, name: 'emoji.png' }] };
    }
}
