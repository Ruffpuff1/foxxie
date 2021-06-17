const { tcsWelcome } = require('../../lib/util/theCornerStore');
const moment = require('moment');
const { FLAGS } = require('discord.js').Permissions;
const { Event } = require('foxxie');

module.exports = class extends Event {

    constructor(...args) {
        super(...args, {
            event: 'guildMemberAdd'
        })
    }

    async run(member) {

        // Returns if self
        if (member.user.id === this.client.user.id) return;

        // Persisteny & botroles
        const autoroles = await member.guild.settings.get('mod.roles.auto');
		const botrole = await member.guild.settings.get('mod.roles.bots');

        const botsHighestRole = member.guild.me.roles.highest;
        const persistroles = await member.user.settings.get(`servers.${member.guild.id}.persistRoles`);
        const persistnick = await member.user.settings.get(`servers.${member.guild.id}.persistNickname`);
        if (persistnick) await member.setNickname(persistnick).catch(() => null);

        if (member.guild.me.permissions.has(FLAGS.MANAGE_ROLES)) {
            let roles = persistroles?.filter(id => !autoroles.includes(id)).filter(id => botsHighestRole.comparePositionTo(id) > 0);
            
            if (autoroles && !member.user.bot && !member.pending) {
                roles = roles ? roles.concat(autoroles) : autoroles;
            } else if (member.user.bot && botrole) {
                roles = roles ? roles.concat(botrole) : botrole;
            }

            member.roles.add(roles).catch(() => null);
        }

        // Welcoming
        this.welcome(member);
        
        // Username cleaning
        await this.lowercase(member);

        await member.guild.log.send({ member, type: 'member', action: 'memberJoined' });

        return member;
    }

    async lowercase(member) {
        if (!await member.guild.settings.get('mod.anti.uppercase')) return member;
        member.setNickname(member.user.username.toLowerCase()).catch(e => e);
        return member;
    }

    async welcome(member) {

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
            channel.send(guild.language.get('EVENT_GUILDMEMBERADD_DEFAULT', member.toString())).catch(e => e);
            return member;
        };

        const parsed = this._fillTemplate(message, member);

        channel.send(parsed).catch(e => e);
        return member;
    }

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