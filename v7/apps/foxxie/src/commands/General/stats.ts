import { LanguageKeys } from '#lib/I18n';
import { FoxxieCommand } from '#lib/Structures';
import { getServerDetails } from '#utils/util';
import { isDev } from '@ruffpuff/utilities';
import { ApplyOptions } from '@sapphire/decorators';
import { send } from '@sapphire/plugin-editable-commands';
import { PermissionFlagsBits } from 'discord-api-types/v10';
import { EmbedBuilder, Message } from 'discord.js';
import { version as discordVersion } from 'discord.js/package.json';

@ApplyOptions<FoxxieCommand.Options>({
    aliases: ['up', 'uptime'],
    description: LanguageKeys.Commands.General.StatsDescription,
    requiredClientPermissions: PermissionFlagsBits.EmbedLinks
    // detailedDescription: LanguageKeys.Commands.General.StatsDetailedDescription
})
export class UserCommand extends FoxxieCommand {
    public async messageRun(msg: Message, args: FoxxieCommand.Args): Promise<void> {
        const {
            uptime,
            process: pross,
            totalShards,
            totalmemory,
            memoryUsed,
            memoryPercent,
            cpuCount,
            cpuUsage,
            cpuSpeed
        } = getServerDetails();

        const { deps } = this;
        const shard = (msg.guild ? msg.guild.shardId : 0) + 1;

        const stats = args.t(LanguageKeys.Commands.General.StatsMenu, {
            uptime,
            process: pross,
            shard,
            shardTotal: totalShards,
            deps,
            totalmemory,
            memoryUsed,
            memoryPercent,
            cpuCount,
            cpuUsage,
            cpuSpeed
        });

        const embed = new EmbedBuilder()
            .setAuthor({
                name: `${this.client.user?.username} v${process.env.VERSION_NUM}${isDev() ? '-dev' : ''}`,
                iconURL: this.client.user?.displayAvatarURL({ extension: 'png', size: 2048 })
            })
            .setDescription(stats)
            .setColor(args.color)
            .setFooter({ text: `© ${process.env.COPYRIGHT_YEAR} ${this.container.client.user!.username}` });

        await send(msg, { embeds: [embed], content: null });
    }

    private get deps(): string[] {
        return [`Node.js ${process.version}`, `Discord.js ${discordVersion}`, `Sapphire next`];
    }
}
