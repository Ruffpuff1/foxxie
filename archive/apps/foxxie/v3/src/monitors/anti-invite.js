const { LINK_REGEX: { discord: { invite } } } = require('foxxie');
const { Monitor } = require('@foxxie/tails');

module.exports = class extends Monitor {

    constructor(...args) {
        super(...args, {
            ignoreOthers: false,
            ignoreEdits: false,
            ignoreOwner: true,
            ignoreAdmin: true
        })

        this.inviteRegex = invite;
    }

    async run(msg) {
        if (!msg.guild || !await msg.guild.settings.get('mod.anti.invite') || await msg.exempt()) return;
        if (!this.inviteRegex.test(msg.content)) return;
        //'https://discord.gg/vyVErU3UFM' - deletes any discord server invite.
        if (msg.guild.id === '761512748898844702') await this.executeWarn(msg);
        return msg.delete();
    }

    async executeWarn(msg) {
        const reason = msg.language.get('LOG_MODERATION_INVITE');
        const warn = { author: msg.guild.me, reason, timestamp: new Date().getTime() };

        msg.author.settings.push(`servers.${msg.guild.id}.warnings`, warn);
        const warns = await msg.author.settings.get(`servers.${msg.guild.id}.warnings`);
        if (warns?.length >= 3 && msg.guild.id === '761512748898844702') await this.tcsWarn(msg, msg.member, warns.length);

        msg.guild.log.send({type: 'mod', action: 'warn', 'moderator': msg.guild.me, reason, channel: msg.channel, dm: true, user: msg.author })
    } 

    tcsWarn(msg, member, count) {
        const channel = msg.guild.channels.cache.get('817006909492166656');
        if (!channel) return member;
        return channel.send(`${member.user.tag} (ID: ${member.user.id}) now has **${count}** warnings.`)
    }
}