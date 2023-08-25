import { FoxxieCommand } from '#lib/structures';
import { LanguageKeys } from '#lib/i18n';
import { ApplyOptions } from '@sapphire/decorators';
import { Message, MessageEmbed } from 'discord.js';
import { commit } from '#utils/constants';
import { send } from '@sapphire/plugin-editable-commands';
import { isDev } from '@ruffpuff/utilities';
import { version as discordVersion } from 'discord.js/package.json';
import { PermissionFlagsBits } from 'discord-api-types/v9';
import { getServerDetails } from '#utils/util';

@ApplyOptions<FoxxieCommand.Options>({
    aliases: ['up', 'uptime'],
    description: LanguageKeys.Commands.General.StatsDescription,
    requiredClientPermissions: PermissionFlagsBits.EmbedLinks,
    // detailedDescription: LanguageKeys.Commands.General.StatsDetailedDescription
})
export class UserCommand extends FoxxieCommand {
    public async messageRun(msg: Message, args: FoxxieCommand.Args): Promise<void> {
        const hash = await commit();
        const head = hash ? ` [${hash[0].trim()}]` : '';

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

        const embed = new MessageEmbed()
            .setAuthor({
                name: `${this.client.user?.username} v${process.env.VERSION_NUM}${isDev() ? '-dev' : ''}${head}`,
                iconURL: this.client.user?.displayAvatarURL({ format: 'png', size: 2048 }),
                url: `https://gitlab.com/Ruffpuff1/foxxie/-/tree/${hash[0]}`
            })
            .setDescription(stats)
            .setColor(args.color)
            .setFooter({ text: `© ${process.env.COPYRIGHT_YEAR} ${this.container.client.user!.username}` });

        await send(msg, { embeds: [embed] });
    }

    private get deps(): string[] {
        return [`Node.js ${process.version}`, `Discord.js ${discordVersion}`, `Sapphire next`];
    }
}
