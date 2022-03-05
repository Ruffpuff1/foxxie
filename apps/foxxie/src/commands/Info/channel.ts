import { FoxxieEmbed } from '#lib/discord';
import { LanguageKeys } from '#lib/i18n';
import { FoxxieCommand } from '#lib/structures';
import type { GuildMessage } from '#lib/types';
import { Time, toTitleCase } from '@ruffpuff/utilities';
import { ApplyOptions } from '@sapphire/decorators';
import type { GuildBasedChannelTypes } from '@sapphire/discord.js-utilities';
import { send } from '@sapphire/plugin-editable-commands';
import type { TFunction } from '@sapphire/plugin-i18next';
import { PermissionFlagsBits } from 'discord-api-types/v9';
import type { CategoryChannel, Collection, EmbedAuthorData, GuildChannel, Message, StageChannel, TextChannel, ThreadChannel, VoiceChannel } from 'discord.js';

@ApplyOptions<FoxxieCommand.Options>({
    aliases: ['chn'],
    requiredClientPermissions: PermissionFlagsBits.EmbedLinks,
    description: LanguageKeys.Commands.Info.ChannelDescription,
    detailedDescription: LanguageKeys.Commands.Info.ChannelDetailedDescription
})
export class UserCommand extends FoxxieCommand {
    public async messageRun(msg: GuildMessage, args: FoxxieCommand.Args): Promise<Message> {
        const channel = await args.pick('guildChannel').catch(() => msg.channel);
        const embed = this.buildEmbed(args.t, channel, args.color);
        return send(msg, { embeds: [embed] });
    }

    private buildEmbed(t: TFunction, channel: GuildBasedChannelTypes, color: number): FoxxieEmbed {
        const embed = new FoxxieEmbed()
            .setDescription(
                t(LanguageKeys.Commands.Info.ChannelCreated, {
                    name: channel.name,
                    date: channel.createdAt
                })
            )
            .setColor(color)
            .setAuthor(this.formatAuthor(channel))
            .setThumbnail(channel.guild.iconURL({ dynamic: true })!);

        this.buildChannelEmbed(embed, channel, t);
        return embed;
    }

    private buildChannelEmbed(embed: FoxxieEmbed, channel: GuildBasedChannelTypes, t: TFunction): void {
        switch (channel.type) {
            case 'GUILD_TEXT':
            case 'GUILD_STORE':
            case 'GUILD_NEWS':
                this.buildTextChannelEmbed(embed, channel as TextChannel, t);
                break;
            case 'GUILD_VOICE':
                this.buildVoiceChannelEmbed(embed, channel as VoiceChannel, t);
                break;
            case 'GUILD_STAGE_VOICE':
                this.buildStageChannelEmbed(embed, channel as StageChannel, t);
                this.buildVoiceChannelEmbed(embed, channel as VoiceChannel, t);
                break;
            case 'GUILD_CATEGORY':
                this.buildCategoryChannelEmbed(embed, channel as CategoryChannel, t);
                break;
            case 'GUILD_PUBLIC_THREAD':
            case 'GUILD_PRIVATE_THREAD':
            case 'GUILD_NEWS_THREAD':
                this.buildThreadChannelEmbed(embed, channel as ThreadChannel, t);
        }
    }

    private buildThreadChannelEmbed(embed: FoxxieEmbed, channel: ThreadChannel, t: TFunction): void {
        const titles = t(LanguageKeys.Commands.Info.ChannelTitles);
        const none = toTitleCase(t(LanguageKeys.Globals.None));

        embed
            .addField(titles.type, channel.type, true)
            .addField(titles.category, channel.parent?.name || none, true)
            .addBlankField(true)
            .addField(
                titles.members,
                t(LanguageKeys.Globals.NumberFormat, {
                    value: channel.memberCount
                }),
                true
            )
            .addField(titles.cooldown, channel.rateLimitPerUser ? this.getDuration(channel.rateLimitPerUser, t) : none, true)
            .addField(
                titles.archived,
                channel.archived
                    ? t(LanguageKeys.Commands.Info.ChannelArchived, {
                          time: channel.archivedAt
                      })
                    : t(LanguageKeys.Globals.No),
                true
            );
    }

    private buildCategoryChannelEmbed(embed: FoxxieEmbed, channel: CategoryChannel, t: TFunction): void {
        const titles = t(LanguageKeys.Commands.Info.ChannelTitles);
        const none = toTitleCase(t(LanguageKeys.Globals.None));

        embed.addField(titles.channels, this.formatChildrenChannels(channel.children, none));
    }

    private formatChildrenChannels(channels: Collection<string, GuildChannel>, none: string): string {
        return channels.size
            ? channels
                  .sort((a, b) => a.position - b.position)
                  .map(channel => `${channel.name} [${channel.id}]`)
                  .join('\n')
            : none;
    }

    private buildStageChannelEmbed(embed: FoxxieEmbed, channel: StageChannel, t: TFunction): void {
        const titles = t(LanguageKeys.Commands.Info.ChannelTitles);
        const none = toTitleCase(t(LanguageKeys.Globals.None));

        embed.addField(titles.topic, channel.topic || none);
    }

    private buildVoiceChannelEmbed(embed: FoxxieEmbed, channel: VoiceChannel, t: TFunction): void {
        const none = toTitleCase(t(LanguageKeys.Globals.None));
        const infinte = toTitleCase(t(LanguageKeys.Globals.Infinte));
        const titles = t(LanguageKeys.Commands.Info.ChannelTitles);

        embed
            .addField(titles.type, t(LanguageKeys.Guilds.Channels[channel.type]), true)
            .addField(titles.category, channel.parent?.name || none, true)
            .addBlankField(true)
            .addField(
                titles.userLimit,
                channel.userLimit === 0
                    ? infinte
                    : t(LanguageKeys.Globals.NumberFormat, {
                          value: channel.userLimit
                      }),
                true
            )
            .addField(titles.bitrate, `${channel.bitrate / 1000}KB/s`, true)
            .addBlankField(true);
    }

    private buildTextChannelEmbed(embed: FoxxieEmbed, channel: TextChannel, t: TFunction): void {
        const none = toTitleCase(t(LanguageKeys.Globals.None));
        const titles = t(LanguageKeys.Commands.Info.ChannelTitles);

        embed
            .addField(titles.topic, channel.topic || none)
            .addField(titles.type, t(LanguageKeys.Guilds.Channels[channel.type]), true)
            .addField(titles.category, channel.parent?.name || none, true)
            .addBlankField(true)
            .addField(titles.members, channel.members.size.toString(), true)
            .addField(titles.nsfw, toTitleCase(channel.nsfw ? t(LanguageKeys.Globals.Yes) : t(LanguageKeys.Globals.No)), true)
            .addField(titles.cooldown, channel.rateLimitPerUser ? this.getDuration(channel.rateLimitPerUser, t) : none, true);
    }

    private getDuration(seconds: number, t: TFunction): string {
        return t(LanguageKeys.Globals.Remaining, {
            value: seconds * Time.Second
        });
    }

    private formatAuthor(channel: GuildBasedChannelTypes): EmbedAuthorData {
        return {
            name: `${channel.name} [${channel.id}]`,
            iconURL: channel.guild.iconURL({ dynamic: true })!
        };
    }
}
