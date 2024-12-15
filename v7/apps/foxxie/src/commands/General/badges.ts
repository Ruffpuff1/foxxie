import { FoxxieCommand } from '#lib/Structures';
import { GuildMessage, PermissionLevels } from '#lib/Types';
import { sendLoadingMessage } from '#utils/Discord';
import { BadgeEmojis } from '#utils/constants';
import { ApplyOptions } from '@sapphire/decorators';
import { GuildMember } from 'discord.js';

@ApplyOptions<FoxxieCommand.Options>({
    aliases: ['bd', 'userflags'],
    description: 'commands/general:badges',
    permissionLevel: PermissionLevels.BotOwner
})
export class UserCommand extends FoxxieCommand {
    public async messageRun(message: GuildMessage): Promise<void> {
        const members = await message.guild.members.fetch().then(m => [...m.values()]);
        const loading = await sendLoadingMessage(message);

        const [flags, bots, nitros, employees] = this.getBadgeCounts(members);
        let boosterCount = 0;

        if (message.guild.roles.premiumSubscriberRole) {
            const roleId = message.guild.roles.premiumSubscriberRole.id;
            const boosters = members.filter(member => member.roles.cache.has(roleId));
            boosterCount = boosters.length;
        }

        const description = [
            flags[0] && `${BadgeEmojis.Staff} ${flags[0]} x Discord Employee (${employees.join(', ')})`,
            flags[1] && `${BadgeEmojis.Partner} ${flags[1]} x Partnered Server Owner`,
            flags[2] && `${BadgeEmojis.HypeSquadEvents} ${flags[2]} x HypeSquad Events`,
            nitros > 0 &&
                `${BadgeEmojis.Nitro} ${nitros} x Nitro ${
                    boosterCount > 0 || flags[9]
                        ? `(${
                              boosterCount > 0
                                  ? `${BadgeEmojis.Boost} ${boosterCount} x Booster${boosterCount > 1 ? 's' : ''}`
                                  : ''
                          }${boosterCount > 0 && flags[9] ? ', ' : boosterCount > 0 && !flags[9] ? ')' : ''}${
                              flags[9] ? `${BadgeEmojis.EarlySupporter} ${flags[9]} x Early Supporter)` : ''
                          }`
                        : ''
                }`,
            flags[18] && `${BadgeEmojis.ModAlumni} ${flags[18]} Moderator Programs Alumni`,
            flags[3] && `${BadgeEmojis.BugHunt1} ${flags[3]} x Bug Hunter Level 1`,
            flags[14] && `${BadgeEmojis.BugHunt2} ${flags[14]} x Bug Hunter Level 2`,
            flags[6] && `${BadgeEmojis.Bravery} ${flags[6]} x House Bravery`,
            flags[7] && `${BadgeEmojis.Brilliance} ${flags[7]} x House Brilliance`,
            flags[8] && `${BadgeEmojis.Balance} ${flags[8]} x House Balance`,
            flags[22] &&
                `${BadgeEmojis.ActiveDeveloper} ${flags[22]} x Active Developer${
                    flags[17] ? `${BadgeEmojis.VerifiedDev} ${flags[17]} x Early Verified Bot Developer` : ''
                }`,
            bots > 0 &&
                `${BadgeEmojis.Bot} ${bots - flags[16]} x Bot${
                    flags[16] || flags[19]
                        ? ` (${
                              flags[16]
                                  ? `${BadgeEmojis.VerifiedBot} ${flags[16]} x Verified Bot${
                                        flags[19] ? `, ${BadgeEmojis.HttpBot} ${flags[19]} x Interaction Bot` : ''
                                    }`
                                  : `${BadgeEmojis.HttpBot} ${flags[19]} x Interaction Bot`
                          })`
                        : ''
                }`
        ];

        await loading.edit({ content: description.filter(i => Boolean(i)).join('\n') });
    }

    private getBadgeCounts(members: GuildMember[]): [number[], number, number, string[]] {
        let bots = 0;
        let nitros = 0;
        const employees = [];
        const flags: number[] = Array(26).fill(0);

        for (const member of members) {
            for (let i = 0; i < 26; i++) if (((member.user.flags?.bitfield ?? 0) & (1 << i)) === 1 << i) flags[i]++;
            if ((Number(member.user.flags?.bitfield) & 1) === 1) employees.push(`**${member.user.tag}**`);

            if (member.user.bot) bots++;
            if (member.user.avatar?.startsWith('a_') || member.user.banner) {
                nitros++;
                continue;
            }
        }

        return [flags, bots, nitros, employees];
    }
}
