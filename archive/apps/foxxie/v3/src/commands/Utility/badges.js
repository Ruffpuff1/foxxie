let { DISCORD_EMPLOYEE, DISCORD_PARTNER, HYPESQUAD_EVENTS, NITRO, BOOSTER, EARLY_SUPPORTER, BUGHUNTER_LEVEL_2, BUGHUNTER_LEVEL_1, HOUSE_BRAVERY, HOUSE_BRILLIANCE, HOUSE_BALANCE, BOT, VERIFIED_BOT, EARLY_VERIFIED_DEVELOPER } = require('~/lib/util/constants').emojis.discordBadges;
const { Command } = require('@foxxie/tails');
const { nitroDiscriminators } = require('foxxie');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            name: 'badges',
            aliases: ['bd', 'userflags'],
            description: language => language.get('COMMAND_BADGES_DESCRIPTION'),
            permissionLevel: 10,
            category: 'utility'
        })
    }

    async run(msg) {
        if (msg.guild.memberCount > 1000) return msg.responder.error('COMMAND_BADGES_GUILDSIZE', msg.guild.memberCount);
        const members = msg.guild.members.fetch().then(m => m.array());
        
        const loading = await msg.responder.loading();
        const [flags, bots, nitros, employees] = await this._getBadgeCounts(await members);
        const boosters = await msg.guild.premiumSubscriptionCount;

        const description = [
            flags[0] > 0 && `${DISCORD_EMPLOYEE} ${flags[0]} x ${msg.language.get('COMMAND_BADGES_DISCORDEMPLOYEE', flags[0])} (${employees.join(',')})`,
            flags[1] > 0 && `${DISCORD_PARTNER} ${flags[1]} x ${msg.language.get('COMMAND_BADGES_PARTNERED', flags[1])}`,
            flags[2] > 0 && `${HYPESQUAD_EVENTS} ${flags[2]} x ${msg.language.get('COMMAND_BADGES_HYPEEVENT')}`,
            nitros > 0 && `${NITRO} ${nitros} x ${msg.language.get('COMMAND_BADGES_NITRO')} ${(boosters > 0) || (flags[9] > 0)
                ? `(${boosters > 0
                        ? `${BOOSTER} ${boosters} x ${msg.language.get('COMMAND_BADGES_BOOSTS', boosters)}`
                        : ''
                }${(boosters > 0) && (flags[9] > 0)
                        ? ', '
                        : ')'
                }${flags[9] > 0
                        ? `${EARLY_SUPPORTER} ${flags[9]} x ${msg.language.get('COMMAND_BADGES_EARLY', flags[9])})` 
                        : ''
                    }`
                    : ''}`,
            flags[3] > 0 && `${BUGHUNTER_LEVEL_1} ${flags[3]} x ${msg.language.get('COMMAND_BADGES_BUG1')}`,
            flags[14] > 0 && `${BUGHUNTER_LEVEL_2} ${flags[14]} x ${msg.language.get('COMMAND_BADGES_BUG2')}`,
            flags[6] > 0 && `${HOUSE_BRAVERY} ${flags[6]} x ${msg.language.get('COMMAND_BADGES_BRAVERY')}`,
            flags[7] > 0 && `${HOUSE_BRILLIANCE} ${flags[7]} x ${msg.language.get('COMMAND_BADGES_BRILLIANCE')}`,
            flags[8] > 0 && `${HOUSE_BALANCE} ${flags[8]} x ${msg.language.get('COMMAND_BADGES_BALANCE')}`,
            flags[17] > 0 && `${EARLY_VERIFIED_DEVELOPER} ${flags[17]} x ${msg.language.get('COMMAND_BADGES_BOTDEV', flags[17])}`,
            bots > 0 && `${BOT} ${bots - flags[16]} x ${msg.language.get('COMMAND_BADGES_BOT', bots, flags[17])}${flags[16] > 0 ? ` (${VERIFIED_BOT} ${flags[16]} x ${msg.language.get('COMMAND_BADGES_BOTVERIFIED', flags[16])})` : ''}`
        ].filter(i => !!i).join('\n');

        await msg.channel.send(description)
        return loading.delete()
    }

    async _getBadgeCounts(members) {

        let bots = 0;
        let nitros = 0;
        const employees = [];
        const flags = Array(18).fill(0);

        for (let member of members) {
            for (let i = 0; i < 18; i++) if (((member.user.flags?.bitfield ?? 0) & (1 << i)) === 1 << i) flags[i]++;
            if (((member.user.flags?.bitfield) & 1) === 1) employees.push(`**${member.user.tag}**`);

            if (member.user.bot) bots++;
            if (member.user.avatar?.startsWith('a_') || nitroDiscriminators.includes(member.user.discriminator)) nitros++;
            member = null;
        }
        return [flags, bots, nitros, employees]
    }
}