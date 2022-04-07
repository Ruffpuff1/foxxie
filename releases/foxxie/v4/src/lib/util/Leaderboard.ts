import { container } from '@sapphire/framework';
import type { TFunction } from '@sapphire/plugin-i18next';
import type { Guild, GuildMember } from 'discord.js';
import { languageKeys } from '../i18n';
import type { GuildMessage } from '../types/Discord';
import { aquireSettings, GuildEntity } from '../database';
import { FoxxieEmbed } from '../discord';

export class Leaderboard {

    public guild: Guild;
    public key: LbKeyMatch;
    public mapped?: LbData[];
    public t?: TFunction;
    public time: number;

    constructor(guild: Guild, key: LbKeyMatch) {
        this.guild = guild;
        this.key = key;
        this.time = Date.now();
    }

    private async getMembers(limit: number): Promise<LbData[]> {
        if (this.guild.memberCount !== this.guild.members.cache.size) await this.guild.members.fetch();
        const { key } = this;

        const map = await Promise.all(
            this.guild.members.cache
                .filter(member => !member.user.bot)
                .map(async member => container.db.members.ensure(member.id, this.guild.id))
        ).then(entities => entities.filter(entity => entity[key] > 0));

        return map
            .sort((a, b) => b[key] - a[key])
            .map((ent, idx) => {
                return { member: ent.member, idx, points: ent[key] };
            })
            .slice(0, limit);
    }

    async buildEmbed(msg: GuildMessage, key: string): Promise<FoxxieEmbed> {
        const { mapped, time } = this;

        const description = (mapped as LbData[])
            .map(({ member, idx, points }) => {
                const emoji = this.parseEmoji(idx);
                const number = (this.t as TFunction)(languageKeys.globals.numberFormat, { value: points });

                return [
                    `${emoji} ${number}${key === 'star' ? ` :star:` : ''}`,
                    `- **${member?.user.tag}**`
                ].join(' ');
            });

        const embed = new FoxxieEmbed(msg)
            .setColor(await container.db.fetchColor(msg))
            .setAuthor(msg.guild.name, msg.guild.iconURL({ dynamic: true }) as string)
            .setThumbnail(msg.guild.iconURL({ dynamic: true }) as string)
            .setDescription([this.makeDescription(msg, key), '', description.join('\n')])
            .setTimestamp(time)
            .setFooter((this.t as TFunction)(languageKeys.commands.leveling.leaderboardFooter));

        return embed;
    }

    makeDescription(msg: GuildMessage, key: string): string {
        const langKey = languageKeys.commands.leveling.leaderboardExplainer;
        return (this.t as TFunction)(langKey, { context: key, guild: msg.guild.name });
    }

    parseEmoji(idx: number): string {
        return idx === 0
            ? ':first_place: - '
            : idx === 1
                ? ':second_place: - '
                : idx === 2
                    ? ':third_place: - '
                    : `**#${idx + 1}** - `;
    }

    async setup(limit: number): Promise<Leaderboard> {
        const members = await this.getMembers(limit);
        this.mapped = members;

        this.t = await aquireSettings(this.guild, (settings: GuildEntity) => settings.getLanguage());

        return this;
    }

}

export interface LbData {
    member: GuildMember | undefined;
    idx: number;
    points: number;
}

export type LbKeyMatch = 'messageCount' | 'points';