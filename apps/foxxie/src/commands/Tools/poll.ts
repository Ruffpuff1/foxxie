import { PollEntity } from '#lib/Database/entities/PollEntity';
import { LanguageKeys } from '#lib/I18n';
import { FoxxieCommand } from '#lib/Structures';
import { GuildMessage, PermissionLevels } from '#lib/Types';
import { messagePrompt, sendLoadingMessage, sendLoadingMessageInChannel } from '#utils/Discord';
import { TFunction } from '@foxxie/i18n';
import { ApplyOptions } from '@sapphire/decorators';
import { CommandOptionsRunTypeEnum } from '@sapphire/framework';
import { send } from '@sapphire/plugin-editable-commands';
import { PermissionFlagsBits } from 'discord-api-types/v10';
import { TextChannel, inlineCode } from 'discord.js';

const NUMBER_OPTS = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟'];
const ALPHABET_OPTS = ['🇦', '🇧', '🇨', '🇩', '🇪', '🇫', '🇬', '🇭', '🇮', '🇯', '🇰', '🇱', '🇲', '🇳', '🇴', '🇵', '🇶', '🇷', '🇸', '🇹'];

@ApplyOptions<FoxxieCommand.Options>({
    aliases: ['spoll'],
    detailedDescription: LanguageKeys.Commands.Tools.PollDetailedDescription,
    requiredClientPermissions: [
        PermissionFlagsBits.AddReactions,
        PermissionFlagsBits.ReadMessageHistory,
        PermissionFlagsBits.EmbedLinks
    ],
    permissionLevel: PermissionLevels.Moderator,
    runIn: [CommandOptionsRunTypeEnum.GuildAny],
    subcommands: [{ name: 'create', messageRun: 'create', default: true }]
})
export class UserCommand extends FoxxieCommand {
    public async create(message: GuildMessage, args: FoxxieCommand.Args) {
        const title = await args.pick('string');
        const channel = await args.pick('guildTextChannel').catch(() => null);

        const options = args.nextSplit();
        if (options.length < 2 || options.length > 20)
            this.error(LanguageKeys.Serializers.MinMaxBothInclusive, { name: 'options', min: 2, max: 20 });

        const emojis = (options.length > 10 ? ALPHABET_OPTS : NUMBER_OPTS).slice(0, options.length);
        if (emojis.length > 20) this.error('limit');

        const approved = await messagePrompt(message, this.getKey(args.t, title, options, channel));
        if (!approved) this.error(LanguageKeys.Commands.Tools.PollCancelled);

        const response = channel ? await sendLoadingMessageInChannel(channel) : await sendLoadingMessage(message);

        const { polls } = this.container.utilities.guild(message.guild);
        const count = await polls.fetch().then(c => c.size);

        const entity = new PollEntity({
            pollId: count + 1,
            userId: message.author.id,
            messageId: response.id,
            channelId: response.channel.id,
            title,
            guildId: message.guild.id,
            endsAt: null,
            options: options.map((option, i) => {
                return {
                    emoji: emojis[i],
                    count: 0,
                    name: option,
                    optionNumber: i + 1
                };
            })
        });

        await polls.create(entity).updateMessage();

        if (channel)
            await send(message, { content: args.t(LanguageKeys.Commands.Tools.PollSuccess, { channel: channel.toString() }) });
    }

    private getKey(t: TFunction, title: string, options: string[], channel: TextChannel | null) {
        const codeOptions = options.map(opt => inlineCode(opt));

        if (channel)
            return t(LanguageKeys.Commands.Tools.PollPromptWithChannel, {
                title,
                options: codeOptions,
                channel: channel.toString()
            });
        return t(LanguageKeys.Commands.Tools.PollPrompt, { title, options: codeOptions });
    }
}
