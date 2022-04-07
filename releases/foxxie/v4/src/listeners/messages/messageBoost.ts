import { Listener, ListenerOptions } from '@sapphire/framework';
import type { Guild, GuildMember, Message, TextChannel } from 'discord.js';
import { BrandingColors, emojis, isOnServer, resolveToNull } from '../../lib/util';
import { aquireSettings, GuildEntity, guildSettings } from '../../lib/database';
import { randomArray } from '@ruffpuff/utilities';
import { languageKeys } from '../../lib/i18n';
import type { TFunction } from '@sapphire/plugin-i18next';
import { FoxxieEmbed } from '../../lib/discord';
import { ApplyOptions } from '@sapphire/decorators';

const tierBoostCount = (guild: Guild) => (guild.premiumTier === 'NONE'
    ? 2
    : guild.premiumTier === 'TIER_1'
        ? 7
        : guild.premiumTier === 'TIER_2'
            ? 14
            : 14);

const nextTier = (guild: Guild) => (guild.premiumTier === 'NONE'
    ? 1
    : guild.premiumTier === 'TIER_1'
        ? 2
        : guild.premiumTier === 'TIER_2'
            ? 3
            : 3);

@ApplyOptions<ListenerOptions>({
    enabled: isOnServer()
})
export default class extends Listener {

    public async run(msg: Message): Promise<void> {
        const channel = await this.getChannel(msg);
        if (!channel) return;

        await this.sendMessage(msg, channel);
    }

    private async getChannel(msg: Message): Promise<TextChannel | null> {
        if (!msg.guild) return null;

        const channelId = await aquireSettings(msg.guild, guildSettings.channels.boost);
        if (!channelId) return null;
        return resolveToNull(msg.guild.channels.fetch(channelId)) as Promise<TextChannel | null>;
    }

    public async sendMessage(msg: Message, channel: TextChannel): Promise<Message> {
        const [message, embed, color, avatar, t] = await aquireSettings(msg.guild, (settings: GuildEntity) => {
            return [
                settings[guildSettings.messages.boost],
                settings[guildSettings.embeds.boost],
                settings[guildSettings.colors.boost],
                settings[guildSettings.avatars.boost],
                settings.getLanguage()
            ];
        });

        const parsedMessage = this.parseMessage(message, msg.member as GuildMember, t);

        const sendObj = embed
            ? { embeds: [new FoxxieEmbed(msg)
                .setAuthor(t(languageKeys.listeners.messageBoostTitle), msg.guild?.iconURL({ dynamic: true }) as string)
                .setDescription(parsedMessage)
                .setColor(color ?? msg.guild?.me?.displayColor ?? BrandingColors.Primary)
                .setThumbnail(avatar
                    ? msg.member?.displayAvatarURL({ dynamic: true }) as string
                    : '')]
            }
            : { content: parsedMessage };

        return resolveToNull(channel.send(sendObj)) as Promise<Message>;
    }

    public parseMessage(msg: string | null, member: GuildMember, t: TFunction): string {
        const emoji = randomArray(emojis.boosts as unknown as ArrayConstructor);

        return (msg || t(languageKeys.listeners.messageBoostDefault, { emoji }))
            .replace(/{(count|boostcount)}/ig, `${member.guild.premiumSubscriptionCount}`)
            .replace(/{member}/ig, member.toString())
            .replace(/{tag}/ig, member.user.tag)
            .replace(/{(user|username)}/ig, member.user.username)
            .replace(/{(tier|boosttier)}/ig, member.guild.premiumTier)
            .replace(/{(needed|boostsneeded)}/ig, `${tierBoostCount(member.guild) - (member.guild.premiumSubscriptionCount as number)}`)
            .replace(/{(next|nexttier)}/ig, `${nextTier(member.guild)}`)
            .replace(/{(nextcount|nexttiercount)}/ig, `${tierBoostCount(member.guild)}`)
            .replace(/{(nick|nickname)}/ig, member.displayName)
            .replace(/{(server|guild)}/ig, member.guild.name);
    }

}