import { FoxxieCommand } from 'lib/structures';
import { ApplyOptions } from '@sapphire/decorators';
import type { Message } from 'discord.js';
import { Args, CommandOptionsRunTypeEnum } from '@sapphire/framework';
import { EmojiRegex } from '@ruffpuff/utilities';
import { languageKeys } from 'lib/i18n';
import type { GuildMessage } from 'lib/types/Discord';
import { emojiLink } from 'lib/util';
import { send } from '@sapphire/plugin-editable-commands';
import { PermissionFlagsBits } from 'discord-api-types/v9';

@ApplyOptions<FoxxieCommand.Options>({
    aliases: ['se'],
    description: languageKeys.commands.misc.stealDescription,
    detailedDescription: languageKeys.commands.misc.stealExtendedUsage,
    requiredUserPermissions: [PermissionFlagsBits.ManageEmojisAndStickers],
    requiredClientPermissions: [PermissionFlagsBits.ManageEmojisAndStickers],
    runIn: [CommandOptionsRunTypeEnum.GuildAny]
})
export class UserCommand extends FoxxieCommand {

    public async messageRun(msg: GuildMessage, args: FoxxieCommand.Args): Promise<Message> {
        const { animated, id, name } = await args.pick(UserCommand.emojiData);
        const emojiName = args.finished ? name : await args.pick('cleanString');

        if (msg.guild.emojis.cache.some(emoji => emoji.name === emojiName)) {
            return this.error(languageKeys.commands.misc.stealDuplicate);
        }

        try {
            const emoji = await msg.guild.emojis.create(emojiLink(id, animated), emojiName);
            const content = args.t(languageKeys.commands.misc.stealSuccess, { emoji: emoji.toString(), name: emojiName });
            return send(msg, content);
        } catch (error) {
            return this.error(languageKeys.commands.misc.stealSuccess, { message: error.message });
        }
    }

    static emojiData = Args.make<EmojiData>((parameter, { argument }) => {
        const match = EmojiRegex.exec(parameter);
        return match?.groups
            ? Args.ok({ id: match.groups.id, name: match.groups.name, animated: Boolean(match.groups.animated) })
            : Args.error({ parameter, argument, identifier: languageKeys.arguments.invalidEmoji });
    });

}

interface EmojiData {
    id: string;
    name: string;
    animated: boolean;
}