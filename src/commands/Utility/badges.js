let { emojis: { discordBadges: { discordStaff, discordPartner, discordHypesquad, discordNitro, discordBooster, discordEarly, discordBug1, discordBug2, discordBravery, discordBrilliance, discordBalance, discordBot, discordVerified, discordEarlyDev } }, discrims } = require('../../../lib/util/constants');
module.exports = {
    name: 'badges',
    aliases: ['bd'],
    usage: 'fox badges',
    category: 'utility',
    permissionLevel: 9,
    async execute (props) {

        let { message, language } = props;
        const members = message.guild.members.cache.array();
        if (message.guild.memberCount > 1000) return message.responder.error('COMMAND_BADGES_GUILDSIZE', message.guild.memberCount);

        const loading = await message.responder.loading();
        const [flags, bots, nitros, employees] = await this._getBadgeCounts(members)
        const boosters = await message.guild.premiumSubscriptionCount
        const description = [
            flags[0] > 0 && `${discordStaff} ${flags[0]} x ${language.get('COMMAND_BADGES_DISCORD_EMPLOYEE', flags[0])} (${employees.join(',')})`,
            flags[1] > 0 && `${discordPartner} ${flags[1]} x ${language.get('COMMAND_BADGES_PARTNERED', flags[1])}`,
            flags[2] > 0 && `${discordHypesquad} ${flags[2]} x ${language.get('COMMAND_BADGES_HYPE_EVENT')}`,
            nitros > 0 && `${discordNitro} ${nitros} x ${language.get('COMMAND_BADGES_NITRO')} ${(boosters > 0) || (flags[9] > 0)
                    ? `(${boosters > 0
                            ? `${discordBooster} ${boosters} x ${language.get('COMMAND_BADGES_BOOSTS', boosters)}`
                            : ''
                    }${(boosters > 0) && (flags[9] > 0)
                            ? ', '
                            : ')'
                    }${flags[9] > 0
                            ? `${discordEarly} ${flags[9]} x ${language.get('COMMAND_BADGES_EARLY', flags[9])})` 
                            : ''
                        }`
                        : ''}`,
            flags[3] > 0 && `${discordBug1} ${flags[3]} x ${language.get('COMMAND_BADGES_BUG1')}`,
            flags[14] > 0 && `${discordBug2} ${flags[14]} x ${language.get('COMMAND_BADGES_BUG2')}`,
            flags[6] > 0 && `${discordBravery} ${flags[6]} x ${language.get('COMMAND_BADGES_BRAVERY')}`,
            flags[7] > 0 && `${discordBrilliance} ${flags[7]} x ${language.get('COMMAND_BADGES_BRILLIANCE')}`,
            flags[8] > 0 && `${discordBalance} ${flags[8]} x ${language.get('COMMAND_BADGES_BALANCE')}`,
            flags[17] > 0 && `${discordEarlyDev} ${flags[17]} x ${language.get('COMMAND_BADGES_BOTDEV', flags[17])}`,
            bots > 0 && `${discordBot} ${bots - flags[16]} x ${language.get('COMMAND_BADGES_BOT', bots, flags[17])}${flags[16] > 0 ? ` (${discordVerified} ${flags[16]} x ${language.get('COMMAND_BADGES_BOTVERIFIED', flags[16])})` : ''}`
		].filter(i => !!i).join('\n');

        await message.channel.send(description)
        return loading.delete()
    },

    async _getBadgeCounts(members) {
            
        let bots = 0;
        let nitros = 0;
        const employees = [];
        const flags = Array(18).fill(0);

        for (let member of members) {
            for (let i = 0; i < 18; i++) if (((member.user.flags && member.user.flags.bitfield ? member.user.flags.bitfield : 0) & (1 << i)) === 1 << i) flags[i]++;
            if (((member.user.flags && member.user.flags.bitfield ? member.user.flags.bitfield : 0) & 1) === 1) employees.push(`**${member.user.tag}**`);

            if (member.user.bot) bots++;
            if (member.user.avatar && member.user.avatar.startsWith('a_') || discrims.includes(member.user.discriminator)) nitros++;
            member = null;
        }
        return [flags, bots, nitros, employees]
    }
}