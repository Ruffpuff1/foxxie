import { FoxxieEmbed } from '../../lib/discord';
import { languageKeys } from '../../lib/i18n';
import { FoxxieCommand } from '../../lib/structures';
import { resolveToNull, sendLoading } from '../../lib/util';
import { ApplyOptions } from '@sapphire/decorators';
import { send } from '@skyra/editable-commands';
import type { TFunction } from '@sapphire/plugin-i18next';
import { Message, Guild, GuildMember, Collection, Invite, GuildChannel, Permissions } from 'discord.js';
import { aquireSettings, guildSettings } from '../../lib/database';
import { toTitleCase } from '@ruffpuff/utilities';

type FoxxieGuildPayload = {
    messages: number;
    owner: string;
    code: string | null;
    color: number;
    msg: Message;
    t: TFunction;
}


@ApplyOptions<FoxxieCommand.Options>({
    aliases: ['server'],
    description: languageKeys.commands.info.serverDescription,
    detailedDescription: languageKeys.commands.info.serverExtendedUsage,
    requiredClientPermissions: [Permissions.FLAGS.EMBED_LINKS]
})
export default class extends FoxxieCommand {

    public async messageRun(msg: Message, args: FoxxieCommand.Args): Promise<Message> {
        const loading = await sendLoading(msg);
        const guild = await args.pick('guild').catch(() => msg.guild) as Guild;

        const [messages, owner, code, , color] = await Promise.all([this.fetchMessages(guild), this.fetchOwner(guild), this.fetchInvites(guild), this.fetchChannels(guild), this.fetchColor(guild.me!, msg)]);
        const embed = this.formatEmbed(guild, { messages, owner: owner?.user?.tag, code, msg, t: args.t, color } as FoxxieGuildPayload);

        await send(msg, { embeds: [embed] });
        return loading.delete();
    }

    formatEmbed(guild: Guild, { messages, owner, code, msg, t, color }: FoxxieGuildPayload): FoxxieEmbed {
        const titles = t(languageKeys.commands.info.serverTitles);

        const cCache = guild.channels.cache.filter(channel => channel.type !== 'GUILD_CATEGORY');
        const { Estatic, animated, e } = this.getEmojiData(guild);
        const none = toTitleCase(t(languageKeys.globals.none));

        const embed = new FoxxieEmbed(msg)
            .setColor(color)
            .setAuthor(this.formatAuthor(guild), guild.iconURL({ format: 'png', dynamic: true }) as string, code
                ? `https://discord.gg/${code}`
                : ''
            )
            .setThumbnail(guild.iconURL({ format: 'png', dynamic: true }) as string)
            .setDescription(t(languageKeys.commands.info.serverCreated, { owner, created: guild.createdAt }))
            .addField(titles.members, t(languageKeys.commands.info.serverMembers, { size: guild.memberCount, cache: guild.members.cache.size }), true)
            .addField(t(languageKeys.commands.info.serverTitlesChannels, { count: cCache.size }), t(languageKeys.commands.info.serverChannels, { channels: cCache }), true)
            .addField(t(languageKeys.commands.info.serverTitlesEmojis, {
                count: Estatic + animated
            }), e ? t(languageKeys.commands.info.serverEmojis, { static: Estatic, animated, joinArrays: '\n' }) : none, true)
            .addField(titles.roles, t(languageKeys.commands.info.serverRoles, { count: guild.roles.cache.size - 1 }), true)
            .addField(titles.stats, t(languageKeys.commands.info.serverMessages, { messages }), true)
            .addBlankField(true)
            .addField(titles.security, t(languageKeys.commands.info.serverSecurity, { joinArrays: '\n', filter: guild.verificationLevel, content: guild.explicitContentFilter }));

        return embed;
    }

    getEmojiData(guild: Guild): { Estatic: number, animated: number, e: boolean } {
        return {
            Estatic: guild.emojis.cache.filter(emoji => !emoji.animated).size,
            animated: guild.emojis.cache.filter(emoji => !!emoji.animated).size,
            e: guild.emojis.cache.size > 0
        };
    }

    formatAuthor(entry: Guild): string {
        return `${entry.name} [${entry.id}]`;
    }

    async fetchColor(entry: GuildMember, msg: Message): Promise<number> {
        return entry?.displayColor || this.container.db.fetchColor(msg);
    }

    async fetchInvites(guild: Guild): Promise<string | null> {
        const invites = resolveToNull(guild.invites.fetch()) as unknown as Collection<string, Invite> | null;
        const code = invites?.size ? invites.first()?.code || null : null;
        return code;
    }

    async fetchChannels(guild: Guild): Promise<Collection<string, GuildChannel> | null> {
        return resolveToNull(guild.channels.fetch());
    }

    async fetchOwner(guild: Guild): Promise<GuildMember | null> {
        return resolveToNull(guild.members.fetch(guild.ownerId)) as unknown as GuildMember | null;
    }

    async fetchMessages(guild: Guild): Promise<number> {
        return aquireSettings(guild, guildSettings.messageCount) as unknown as number;
    }

}