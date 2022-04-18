import { Command } from '@sapphire/framework';
import { RegisterChatInputCommand, toLocalizationMap } from '@foxxie/commands';
import { ChatInputArgs, CommandName } from '#types/Interactions';
import { enUS, getGuildIds } from '#utils/util';
import { GuildMember, Message, MessageEmbed } from 'discord.js';
import { LanguageKeys } from '#lib/i18n';
import { Colors } from '#utils/constants';

const NUMBER_OPTS = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟'];
const ALPHABET_OPTS = ['🇦', '🇧', '🇨', '🇩', '🇪', '🇫', '🇬', '🇭', '🇮', '🇯', '🇰', '🇱', '🇲', '🇳', '🇴', '🇵', '🇶', '🇷', '🇸', '🇹'];

@RegisterChatInputCommand(
    builder =>
        builder //
            .setName(CommandName.Poll)
            .setDescription(LanguageKeys.Commands.Tools.PollDescription)
            .setDescriptionLocalizations(toLocalizationMap(LanguageKeys.Commands.Tools.PollDescription))
            .addStringOption(option =>
                option //
                    .setName('options')
                    .setDescription(enUS(LanguageKeys.Commands.Tools.PollOptionOptions))
                    .setDescriptionLocalizations(toLocalizationMap(LanguageKeys.Commands.Tools.PollOptionOptions))
                    .setRequired(true)
            )
            .addStringOption(option =>
                option //
                    .setName('title')
                    .setDescription(enUS(LanguageKeys.Commands.Tools.PollOptionTitle))
                    .setDescriptionLocalizations(toLocalizationMap(LanguageKeys.Commands.Tools.PollOptionTitle))
                    .setRequired(false)
            ),
    {
        guildIds: getGuildIds()
    }
)
export class UserCommand extends Command {
    public async chatInputRun(...[interaction, , args]: ChatInputArgs<CommandName.Poll>) {
        const options = args!.options.split(',');
        const { t, title } = args!;

        if (options.length < 2 || options.length > 20) throw t(LanguageKeys.Serializers.MinMaxBothInclusive, { name: 'options', min: 2, max: 20 });

        const emojis = (options.length > 10 ? ALPHABET_OPTS : NUMBER_OPTS).slice(0, options.length);
        const message = (await interaction.reply({ fetchReply: true, content: t(LanguageKeys.System.Loading) })) as Message;

        for (const emoji of emojis) {
            if (message.reactions.cache.size === 20) throw t(LanguageKeys.Commands.Tools.PollReactionLimit);
            await message.react(emoji);
        }

        const content = options.map((option, i) => `${emojis[i]} → *${option}*`).join('\n');

        const embed = new MessageEmbed()
            .setAuthor({
                name: title ?? t(LanguageKeys.Commands.Tools.PollTitle, { author: interaction.user.tag }),
                iconURL: (interaction.member as GuildMember).displayAvatarURL({ dynamic: true })
            })
            .setDescription(content)
            .setColor(interaction.guild?.me?.displayColor || Colors.Default);

        await interaction.editReply({ embeds: [embed], content: null });
    }
}
