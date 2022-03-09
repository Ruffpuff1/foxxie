import { Command } from '@sapphire/framework';
import { time, TimestampStyles } from '@discordjs/builders';
import { type ChatInputArgs, CommandName } from '#types/Interactions';
import { RegisterChatInputCommand } from '#utils/decorators';
import { LanguageKeys } from '#lib/i18n';
import { enUS } from '#utils/util';
import { roundNumber, seconds } from '@ruffpuff/utilities';
import { CpuInfo, cpus, uptime } from 'node:os';
import { Colors } from '#utils/constants';
import { MessageEmbed, version } from 'discord.js';

@RegisterChatInputCommand(
    CommandName.Stats,
    builder =>
        builder //
            .setDescription(enUS(LanguageKeys.Commands.General.StatsDescription)) //
            .addBooleanOption(option =>
                option //
                    .setName('ephemeral')
                    .setDescription(enUS(LanguageKeys.System.OptionEphemeralDefaultFalse))
            ),
    []
)
export class UserCommand extends Command {
    public chatInputRun(...[interaction, , args]: ChatInputArgs<CommandName.Stats>) {
        const { t } = args!;
        const uptime = t(LanguageKeys.Commands.General.StatsUptime, this.uptime);
        const general = t(LanguageKeys.Commands.General.StatsGeneral, this.generalStatistics);
        const usage = t(LanguageKeys.Commands.General.StatsUsage, this.usageStatistics);
        const titles = t(LanguageKeys.Commands.General.StatsTitles);

        const embed = new MessageEmbed() //
            .setColor(interaction.guild?.me?.displayColor || Colors.Default)
            .addField(titles.stats, general)
            .addField(titles.uptime, uptime)
            .addField(titles.usage, usage);

        return interaction.reply({
            embeds: [embed],
            ephemeral: args!.ephemeral ?? false
        });
    }

    private get generalStatistics() {
        const { client } = this.container;
        return {
            channels: client.channels.cache.size,
            guilds: client.guilds.cache.size,
            nodeJs: process.version,
            users: client.guilds.cache.reduce((acc, val) => acc + (val.memberCount ?? 0), 0),
            version: `v${version}`
        };
    }

    private get uptime() {
        const now = Date.now();
        const nowSeconds = roundNumber(now / 1000);

        return {
            client: time(seconds.fromMilliseconds(now - this.container.client.uptime!), TimestampStyles.RelativeTime),
            host: time(roundNumber(nowSeconds - uptime()), TimestampStyles.RelativeTime),
            process: time(roundNumber(nowSeconds - process.uptime()), TimestampStyles.RelativeTime)
        };
    }

    private get usageStatistics() {
        const usage = process.memoryUsage();
        return {
            cpuLoad: cpus().map(UserCommand.formatCpuInfo.bind(null)).join(' | '),
            ramTotal: usage.heapTotal / 1048576,
            ramUsed: usage.heapUsed / 1048576
        };
    }

    // eslint-disable-next-line @typescript-eslint/member-ordering
    private static formatCpuInfo({ times }: CpuInfo) {
        return `${roundNumber((times.user + times.nice + times.sys + times.irq) / times.idle * 10000) / 100}%`;
    }
}
