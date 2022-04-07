import { LanguageKeys } from '#lib/i18n';
import type { TypeOfEmbed } from '#lib/types';
import { BrandingColors } from '#utils/constants';
import { Listener } from '@sapphire/framework';
import type { TFunction } from '@sapphire/plugin-i18next';
import type { ClientEvents, GuildMember, MessageEmbed } from 'discord.js';

export abstract class AutomationListener<T extends keyof ClientEvents | symbol = ''> extends Listener<T> {
    private matchRegex = /{user\.(mention|name|tag|discrim|position|createdat|joinedat)}|{guild(\.(splash|count))?}/g;

    public abstract run(...args: T extends keyof ClientEvents ? ClientEvents[T] : unknown[]): Promise<unknown>;

    protected retriveAutomationContent(
        member: GuildMember,
        t: TFunction,
        message: string | null,
        embed: MessageEmbed | null,
        defaultMsg: string
    ): [MessageEmbed[], string | null] {
        const embeds: MessageEmbed[] = [];
        const parsedMessage = this.format(message || defaultMsg, member, t);
        const content = message ? parsedMessage : embed ? null : parsedMessage;

        if (embed) embeds.push(this.prepareEmbed(embed, member, t));

        return [embeds, content];
    }

    protected format(message: string, member: GuildMember, t: TFunction) {
        return message.replace(this.matchRegex, match => {
            switch (match.toLowerCase()) {
                case Matches.Mention:
                    return member.toString();
                case Matches.Name:
                    return member.displayName;
                case Matches.Tag:
                    return member.user.tag;
                case Matches.Discrim:
                    return member.user.discriminator;
                case Matches.Guild:
                    return member.guild.name;
                case Matches.Count:
                    return t(LanguageKeys.Globals.NumberFormat, {
                        value: member.guild.memberCount
                    });
                case Matches.Position:
                    return t(LanguageKeys.Globals.NumberOrdinal, {
                        value: member.guild.memberCount
                    });
                case Matches.CreatedAt:
                    return t(LanguageKeys.Globals.FullDateTime, {
                        date: member.user.createdAt
                    });
                case Matches.JoinedAt:
                    return t(LanguageKeys.Globals.FullDateTime, {
                        date: member.joinedAt
                    });
                default:
                    return '';
            }
        });
    }

    private prepareEmbed(embed: TypeOfEmbed, member: GuildMember, t: TFunction) {
        embed.setColor(embed.color || member.guild.me?.displayColor || BrandingColors.Primary).setThumbnail(member.displayAvatarURL({ dynamic: true }));

        if (embed.description) embed.setDescription(this.format(embed.description, member, t));

        if (embed.title) embed.setTitle(this.format(embed.title, member, t));

        if (embed.footer?.text)
            embed.setFooter({
                text: this.format(embed.footer.text, member, t),
                iconURL: embed.footer.iconURL
            });

        let index = 0;
        for (const field of embed.fields) {
            embed.fields[index] = {
                name: this.format(field.name, member, t),
                value: this.format(field.value, member, t),
                inline: field.inline
            };

            index++;
        }

        return embed;
    }
}

const enum Matches {
    Mention = '{user.mention}',
    Name = '{user.name}',
    Tag = '{user.tag}',
    Discrim = '{user.discrim}',
    Guild = '{guild}',
    Count = '{guild.count}',
    Position = '{user.position}',
    CreatedAt = '{user.createdat}',
    JoinedAt = '{user.joinedat}'
}

// eslint-disable-next-line no-redeclare
export namespace AutomationListener {
    export type Options = Listener.Options;
}
