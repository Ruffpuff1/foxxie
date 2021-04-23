let { emojis: { discordBadges: { discordStaff, discordPartner, discordHypesquad, discordNitro, discordBooster, discordEarly, discordBug1, discordBug2, discordBravery, discordBrilliance, discordBalance, discordBot, discordVerified, discordEarlyDev } }, discrims } = require('../../../lib/util/constants')
module.exports = {
    name: 'badges',
    aliases: ['bd'],
    usage: 'fox badges',
    category: 'utility',
    execute: async (lang, message, args) => {

        const users = message.guild.members.cache.array();
        if (message.guild.memberCount > 800) return message.channel.send('COMMAND_BADGES_GUILDSIZE')

        const loading = await message.channel.send(lang.COMMAND_MESSAGE_LOADING);

        const StaffUsers = []
        const PartnerUsers = []
        const HypeUsers = []
        const bugusers1 = []
        const bugusers2 = []
        const BrillianceUsers = []
        const BraveryUsers = []
        const BalanceUsers = []
        const BotDevs = []
        const Bots = []
        const NitroUsers = []
        const Boosters = []
        const Early = []
        const VerifiedBot = []

        let description = []

        for(let user of users){
    
            const flags = user.user.flags || await user.user.fetchFlags();

            const bugs1 = flags.toArray().includes("BUGHUNTER_LEVEL_1");
            if(bugs1) bugusers1.push(user);

            const bugs2 = flags.toArray().includes("BUGHUNTER_LEVEL_2");
            if(bugs2) bugusers2.push(user);

            const Brilliance = flags.toArray().includes("HOUSE_BRILLIANCE");
            if(Brilliance) BrillianceUsers.push(user);

            const Bravery = flags.toArray().includes("HOUSE_BRAVERY");
            if(Bravery) BraveryUsers.push(user);

            const Balance = flags.toArray().includes("HOUSE_BALANCE");
            if(Balance) BalanceUsers.push(user);

            const Dev = flags.toArray().includes("EARLY_VERIFIED_BOT_DEVELOPER");
            if(Dev) BotDevs.push(user);

            const Bot = user.user.bot;
            const verifiedBot = flags.toArray().includes("VERIFIED_BOT")
            if (Bot && verifiedBot) {
                VerifiedBot.push(user)
        
            }

            if(Bot && !verifiedBot) Bots.push(user);

            const Nitro = (user.user?.avatar?.startsWith('a_') || discrims.includes(user.user.discriminator));
            if(Nitro) NitroUsers.push(user);


            description = [
                `${StaffUsers.length ? `${discordStaff} ${StaffUsers.length} x Discord employee` : ''}`,
                `${PartnerUsers.length ? `${discordPartner} ${PartnerUsers.length} x Partnered Server Owner` : ''}`,
                `${HypeUsers.length ? `${discordHypesquad} ${HypeUsers.length} x HypeSquad Events` : ''}`,
                `${NitroUsers.length 
                    ? `${discordNitro} ${NitroUsers.length} x Nitro` : ''} ${Boosters.length 
                        ? `(${discordBooster} ${Boosters.length} x Boosts${Early.length 
                            ? ',' : ')'}` 
                            : ''} ${Early.length  ? `${Boosters.length 
                                ? '' : '('}${discordEarly} ${Early.length} Early Supporters)` 
                                : ''}`,
                `${bugusers1.length ? `${discordBug1} ${bugusers1.length} x Bug Hunter Level 1` : ''}`,
                `${bugusers2.length ? `${discordBug2} ${bugusers2.length} x Bug Hunter Level 2` : ''}`,
                `${BraveryUsers.length ? `${discordBravery} ${BraveryUsers.length} x House Bravery` : ''}`,
                `${BrillianceUsers.length ? `${discordBrilliance} ${BrillianceUsers.length} x House Brilliance` : ''}`,
                `${BalanceUsers.length ? `${discordBalance} ${BalanceUsers.length} x House Balance` : ''}`,
                `${BotDevs.length ? `${discordEarlyDev} ${BotDevs.length} x Early Verified Bot Developer` : ''}`,
                `${Bots.length ? `${discordBot} ${Bots.length} x Bot` : ''} ${VerifiedBot.length 
                    ? `(${discordVerified} ${VerifiedBot.length} x Verified Bots)` : ''}`
            ].filter(i => !!i).join('\n');
        }
        loading.delete()
        message.channel.send(description)
    }
}