import { FoxxieCommand } from 'lib/structures';
import { FoxxieEmbed } from 'lib/discord';
import { ApplyOptions } from '@sapphire/decorators';
import { CategoryChannel, Collection, GuildChannel, Message, StageChannel, TextChannel, ThreadChannel, VoiceChannel, Permissions } from 'discord.js';
import type { GuildBasedChannelTypes } from '@sapphire/discord.js-utilities';
import { send } from '@sapphire/plugin-editable-commands';
import type { GuildMessage } from 'lib/types/Discord';
import { languageKeys } from 'lib/i18n';
import { toTitleCase } from '@ruffpuff/utilities';
import { getCache } from '../../languages';

@ApplyOptions<FoxxieCommand.Options>({
    aliases: ['chn'],
    requiredClientPermissions: Permissions.FLAGS.EMBED_LINKS,
    description: languageKeys.commands.info.channelDescription,
    detailedDescription: languageKeys.commands.info.channelExtendedUsage
})
export class UserCommand extends FoxxieCommand {

    public async messageRun(msg: GuildMessage, args: FoxxieCommand.Args): Promise<Message> {
        const channel = await args.pick('guildChannel').catch(() => msg.channel);

        const embed = new FoxxieEmbed(msg)
            .setColor(await this.container.db.fetchColor(msg))
            .setDescription(args.t(languageKeys.commands.info.channelCreated, {
                name: channel.name,
                date: channel.createdAt
            }))
            .setAuthor(this.formatAuthor(channel), channel.guild.iconURL({ dynamic: true }))
            .setThumbnail(channel.guild.iconURL({ dynamic: true }));

        this.decorateEmbed(embed, channel, args);
        return send(msg, { embeds: [embed] });
    }

    private decorateEmbed(embed: FoxxieEmbed, channel: GuildBasedChannelTypes, args: FoxxieCommand.Args): void {
        switch (channel.type) {
        case 'GUILD_TEXT':
        case 'GUILD_STORE':
        case 'GUILD_NEWS':
            this.textChannel(embed, channel as TextChannel, args);
            break;
        case 'GUILD_VOICE':
            this.voiceChannel(embed, channel as VoiceChannel, args);
            break;
        case 'GUILD_STAGE_VOICE':
            this.stageChannel(embed, channel as StageChannel, args);
            this.voiceChannel(embed, channel as VoiceChannel, args);
            break;
        case 'GUILD_CATEGORY':
            this.categoryChannel(embed, channel as CategoryChannel, args);
            break;
        case 'GUILD_PUBLIC_THREAD':
        case 'GUILD_PRIVATE_THREAD':
        case 'GUILD_NEWS_THREAD':
            this.threadChannel(embed, channel as ThreadChannel, args);
        }
    }

    private threadChannel(embed: FoxxieEmbed, channel: ThreadChannel, args: FoxxieCommand.Args): void {
        const titles = args.t(languageKeys.commands.info.channelTitles);
        const none = toTitleCase(args.t(languageKeys.globals.none));

        embed
            .addField(titles.type, channel.type, true)
            .addField(titles.category, channel.parent?.name || none, true)
            .addBlankField(true)
            .addField(titles.members, channel.memberCount.toString(), true)
            .addField(titles.cooldown, channel.rateLimitPerUser ? this.getDuration(channel.rateLimitPerUser, args) : none, true)
            .addField(titles.archived, channel.archived ? args.t(languageKeys.commands.info.channelArchived, { time: channel.archivedAt }) : args.t(languageKeys.globals.no), true);
    }

    private categoryChannel(embed: FoxxieEmbed, channel: CategoryChannel, args: FoxxieCommand.Args): void {
        const titles = args.t(languageKeys.commands.info.channelTitles);
        const none = toTitleCase(args.t(languageKeys.globals.none));

        embed
            .addField(titles.channels, this.formatChildrenChannels(channel.children, none));
    }

    private formatChildrenChannels(channels: Collection<string, GuildChannel>, none: string): string {
        return channels.size
            ? channels
                .sort((a, b) => a.position - b.position)
                .map(channel => `${channel.toString()} [${channel.id}]`)
                .join('\n')
            : none;
    }

    private stageChannel(embed: FoxxieEmbed, channel: StageChannel, args: FoxxieCommand.Args): void {
        const titles = args.t(languageKeys.commands.info.channelTitles);
        const none = toTitleCase(args.t(languageKeys.globals.none));

        embed
            .addField(titles.topic, channel.topic || none);
    }

    private voiceChannel(embed: FoxxieEmbed, channel: VoiceChannel, args: FoxxieCommand.Args): void {
        const none = toTitleCase(args.t(languageKeys.globals.none));
        const infinte = toTitleCase(args.t(languageKeys.globals.infinte));
        const titles = args.t(languageKeys.commands.info.channelTitles);

        embed
            .addField(titles.type, channel.type, true)
            .addField(titles.category, channel.parent?.name || none, true)
            .addBlankField(true)
            .addField(titles.userLimit, channel.userLimit === 0 ? infinte : args.t(languageKeys.globals.numberFormat, { value: channel.userLimit }), true)
            .addField(titles.bitrate, `${channel.bitrate / 1000}KB/s`, true)
            .addBlankField(true);
    }

    private textChannel(embed: FoxxieEmbed, channel: TextChannel, args: FoxxieCommand.Args): void {
        const none = toTitleCase(args.t(languageKeys.globals.none));
        const titles = args.t(languageKeys.commands.info.channelTitles);

        embed
            .addField(titles.topic, channel.topic || none)
            .addField(titles.type, channel.type, true)
            .addField(titles.category, channel.parent?.name || none, true)
            .addBlankField(true)
            .addField(titles.members, channel.members.size.toString(), true)
            .addField(titles.nsfw, toTitleCase(channel.nsfw ? args.t(languageKeys.globals.yes) : args.t(languageKeys.globals.no)), true)
            .addField(titles.cooldown, channel.rateLimitPerUser ? this.getDuration(channel.rateLimitPerUser, args) : none, true);
    }

    private getDuration(seconds: number, args: FoxxieCommand.Args): string {
        return getCache(args.t.lng).duration.format(seconds * 1000, 1);
    }

    private formatAuthor(channel: GuildBasedChannelTypes): string {
        return `${channel.name} [${channel.id}]`;
    }

}