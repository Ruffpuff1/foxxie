const { tcsWelcome } = require('../../lib/util/theCornerStore');
const moment = require('moment');

module.exports = {
    name: 'guildMemberAdd',
    execute: async function(member) {

        // Returns if self
        if (member.user.id === member.guild.me.user.id) return;

        // Language
        let lang = await member.guild.settings.get('language');
        if (!lang) lang = 'en-US';     

        // Autoroles
        const autoroles = await member.guild.settings.get('mod.roles.auto');
        const botrole = await member.guild.settings.get('mod.roles.bots');

        if (autoroles && !member.user.bot && !member.pending) {
            await member.roles.add(autoroles, member.guild.language.get('EVENT_AUTOROLE_REASON', lang)).catch(() => null);
        } else if (member.user.bot && botrole) {
			await member.roles.add(botrole, member.guild.language.get('EVENT_BOTROLE_REASON', lang)).catch(() => null);
		};

        // Persisteny
        const persistroles = await member.user.settings.get(`servers.${member.guild.id}.persistRoles`);
		if (persistroles) await member.roles.add(persistroles.filter(id => !autoroles?.includes(id)), member.guild.language.get('EVENT_GUILDMEMBERADD_PERSISTREASON', lang)).catch(() => null);
		const persistnick = await member.user.settings.get(`servers.${member.guild.id}.persistNickname`);
		if (persistnick) await member.setNickname(persistnick).catch(e => e);


        // Welcoming
        this.welcome(member);
        
        // Username cleaning
        this.lowercase(member);
    },

    async lowercase(member) {
        if (!await member.guild.settings.get('mod.anti.uppercase')) return member;
        member.setNickname(member.user.username.toLowerCase()).catch(e => e);
        return member;
    },

    async welcome(member) {

        let lang = await member.guild.settings.get('language');
        if (!lang) lang = 'en-US';        

        if (member.guild.id === '761512748898844702') {
            tcsWelcome(member);
            return member;
        };

        const { guild } = member;
        const channelId = await guild.settings.get('welcome.channel');
        if (!channelId) return member;
        const channel = guild.channels.cache.get(channelId);
        if (!channel) return member;

        let message = await guild.settings.get('welcome.message');
        if (!message) {
            channel.send(guild.language.get('EVENT_GUILDMEMBERADD_DEFAULT_WELCOMEMESSAGE', lang, member)).catch(e => e);
            return member;
        };

        const parsed = this._fillTemplate(message, member);

        channel.send(parsed).catch(e => e);
        return member;
    },

    _fillTemplate(template, member) {
        return template
            .replace(/{(member|user|mention)}/gi, member.toString())
            .replace(/{(name|username)}/gi, member.user.username)
            .replace(/{tag}/gi, member.user.tag)
            .replace(/{(discrim|discriminator)}/gi, member.user.discriminator)
            .replace(/{(guild|server)}/gi, member.guild.name)
            .replace(/{(membercount|count)}/gi, member.guild.memberCount)
            .replace(/{(created|createdat)}/gi, moment(member.user.createdAt).format('MMMM Do YYYY'));
    }
}