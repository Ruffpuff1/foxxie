import { floatPromise } from '#utils/util';
import { ApplyOptions } from '@sapphire/decorators';
import type { ListenerOptions } from '@sapphire/framework';
import { GuildSettings } from '#lib/database';
import type { Guild, GuildMember, GuildTextBasedChannel } from 'discord.js';
import { EventArgs, Events, GuildMessage } from '#lib/types';
import { fetchChannel, isBoostMessage } from '#utils/Discord';
import { LanguageKeys } from '#lib/i18n';
import { AutomationListener } from '#lib/structures';
import type { TFunction } from '@sapphire/plugin-i18next';
import { isDev } from '@ruffpuff/utilities';

@ApplyOptions<ListenerOptions>({
    enabled: !isDev(),
    event: Events.SystemMessage
})
export class UserListener extends AutomationListener<Events.SystemMessage> {
    private boostMatchRegex = /{boost\.(next|count|needed|tier|nextcount)}/g;

    public async run(...[msg]: EventArgs<Events.SystemMessage>): Promise<void> {
        if (!isBoostMessage(msg)) return;

        const channel = await fetchChannel(msg.guild, GuildSettings.Channels.Boost);
        if (!channel) return;

        await this.sendMessage(msg, channel);
    }

    protected nextTier = (guild: Guild) => (guild.premiumTier === 'NONE' ? 1 : guild.premiumTier === 'TIER_1' ? 2 : guild.premiumTier === 'TIER_2' ? 3 : 3);

    protected tierBoostCount = (guild: Guild) => (guild.premiumTier === 'NONE' ? 2 : guild.premiumTier === 'TIER_1' ? 7 : guild.premiumTier === 'TIER_2' ? 14 : 14);

    protected format(message: string, member: GuildMember, t: TFunction) {
        const replaced = message.replace(this.boostMatchRegex, match => {
            switch (match.toLowerCase()) {
                case Matches.BoostNext:
                    return t(LanguageKeys.Globals.NumberFormat, {
                        value: this.nextTier(member.guild)
                    });
                case Matches.BoostCount:
                    return t(LanguageKeys.Globals.NumberFormat, {
                        value: member.guild.premiumSubscriptionCount
                    });
                case Matches.BoostNeeded:
                    return t(LanguageKeys.Globals.NumberFormat, {
                        value: this.tierBoostCount(member.guild) - (member.guild.premiumSubscriptionCount ?? 0)
                    });
                case Matches.BoostTier:
                    return t(LanguageKeys.Globals.NumberFormat, {
                        value: this.nextTier(member.guild) - 1
                    });
                case Matches.BoostNextCount:
                    return t(LanguageKeys.Globals.NumberFormat, {
                        value: this.tierBoostCount(member.guild)
                    });
                default:
                    return '';
            }
        });

        return super.format(replaced, member, t);
    }

    private async sendMessage(msg: GuildMessage, channel: GuildTextBasedChannel): Promise<void> {
        const [message, embed, t] = await this.container.prisma.guilds(msg.guild.id, settings => [
            settings[GuildSettings.Messages.Boost],
            settings[GuildSettings.Embeds.Boost],
            settings.getLanguage()
        ]);

        const [embeds, content] = this.retriveAutomationContent(msg.member, t, message, embed, t(LanguageKeys.Listeners.Events.BoostMessageDefault));
        await floatPromise(
            channel.send({
                embeds,
                content,
                allowedMentions: { users: [msg.member.id], roles: [] }
            })
        );
    }
}

const enum Matches {
    BoostNext = '{boost.next}',
    BoostCount = '{boost.count}',
    BoostNeeded = '{boost.needed}',
    BoostTier = '{boost.tier}',
    BoostNextCount = '{boost.nextcount}'
}
